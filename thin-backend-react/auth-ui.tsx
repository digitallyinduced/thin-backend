import React, { useState, useEffect, useCallback } from 'react';

// @ts-expect-error
import { DataSyncController, ihpBackendUrl } from 'thin-backend';
import { didCompleteAuthentication } from 'thin-backend/auth';
import './auth.css';

interface LoginProps {
    description?: string
}
export function Login({ description }: LoginProps) {
    return <div className="thin-login">
        <div className="thin-login-container">
            <div className="thin-login-container-inner">
                <div className="thin-login-box">
                    <div className="thin-login-icon-container">
                        <img src="https://testvercelreview.thinbackend.app/thin-icon-black.png"/>
                    </div>

                    <h1>Welcome</h1>

                    <p className="thin-login-description">
                        {description || 'Please log in to continue with the application.'}
                    </p>
                    <LoginForm />

                    <p>
                        <span className="thin-login-signup">Don't have an account?</span> <a href={ihpBackendUrl('/NewUser')}>Sign up</a>
                    </p>
                </div>

                <div className="thin-login-built-with">
                    <a href="https://thin.dev/?ref=NewSessionFooter" target="_blank">Built with Thin Backend</a>
                </div>
            </div>
        </div>
    </div>
}

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [lastError, setLastError] = useState<'UserLocked' | 'UserUnconfirmed' | 'InvalidCredentials' | null>(null);

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setLoading(true);
        setLastError(null);

        const dataSyncController = DataSyncController.getInstance();
        const response = await dataSyncController.sendMessage<LoginWithEmailAndPasswordRequest, LoginResponse>({ tag: 'LoginWithEmailAndPassword', email, password });

        if (response.tag === 'LoginSuccessful') {
            const { userId, jwt } = response;
            didCompleteAuthentication(userId, jwt);
        } else {
            setLastError(response.tag);
        }

        setLoading(false);
    }

    useEffect(() => {
        // Start the connection if it's not running yet
        // This way we have lower latency for the login
        DataSyncController.getInstance().startConnection();
    }, []);

    return <form method="POST" action="#" onSubmit={onSubmit}>
        {lastError ? <LoginError errorType={lastError}/> : null}
        <input
            name="email"
            value={email}
            type="email"
            placeholder="E-Mail"
            required
            autoFocus
            autoComplete="email"
            onChange={event => {
                setEmail(event.target.value);
            }}
        />
        <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={event => {
                setPassword(event.target.value);
            }}
        />
        <p>
            <a href="#">Forgot your password?</a>
        </p>
        <div>
            <button type="submit" disabled={isLoading}>
                {isLoading
                    ? <span className="thin-login-spinner-border thin-login-spinner-border-sm" role="status" aria-hidden="true"></span>
                    : "Login"
                }
            </button>
        </div>
    </form>
}

interface LoginWithEmailAndPasswordRequest {
    tag: 'LoginWithEmailAndPassword',
    email: string,
    password: string
}

interface LoginSuccessfulResponse {
    tag: 'LoginSuccessful',
    userId: string,
    jwt: string
}
interface UserLockedResponse { tag: 'UserLocked' }
interface UserUnconfirmedResponse { tag: 'UserUnconfirmed' }
interface InvalidCredentialsResponse { tag: 'InvalidCredentials' }
type LoginResponse = LoginSuccessfulResponse | UserLockedResponse | UserUnconfirmedResponse | InvalidCredentialsResponse;

type LoginError = 'UserLocked' | 'UserUnconfirmed' | 'InvalidCredentials';

interface LoginErrorProps {
    errorType: LoginError
}

function LoginError({ errorType }: LoginErrorProps) {
    const humanMessages = {
        'UserLocked': 'User is locked',
        'UserUnconfirmed': 'Please click the confirmation link we sent to your email before you can use this account',
        'InvalidCredentials': 'Invalid Credentials'
    };

    return <div className="thin-login-alert" role="alert">
        {humanMessages[errorType]}
    </div>
}