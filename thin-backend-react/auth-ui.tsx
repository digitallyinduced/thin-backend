import React, { useState, useEffect, useCallback } from 'react';

// @ts-expect-error
import { DataSyncController, ihpBackendUrl } from 'thin-backend';
import { didCompleteAuthentication } from 'thin-backend/auth.js';
import * as AuthApi from './auth-api.js';

const DEFAULT_APP_ICON = 'https://thin-backend-prod.s3.amazonaws.com/public-static/thin-icon-black.png';

export function LoginAndSignUp() {
    const [signUp, setSignUp] = useState(false);
    const [confirmationParameters, setEmailConfirmationParameters] = useEmailConfirmationParameters();

    if (confirmationParameters !== null) {
        const { userId, token } = confirmationParameters;
        return <EmailConfirmation
            userId={userId}
            token={token}
            onConfirmedAlready={() => setEmailConfirmationParameters(null)}
            onConfirmFailed={() => {
                alert('Confirmation failed');
                setEmailConfirmationParameters(null)
            }}
        />
    }

    if (signUp) {
        return <SignUpProps onLoginClick={() => setSignUp(false)}/>
    } else {
        return <Login onSignUpClick={() => setSignUp(true)}/>
    }
}

interface LoginProps {
    description?: string,
    onSignUpClick: () => void,
    appIcon?: string
}
export function Login({ description, onSignUpClick, appIcon = DEFAULT_APP_ICON }: LoginProps) {
    return <div className="thin-login">
        <div className="thin-login-container">
            <div className="thin-login-container-inner">
                <div className="thin-login-box">
                    <div className="thin-login-icon-container">
                        <img src={appIcon}/>
                    </div>

                    <h1>Welcome</h1>

                    <p className="thin-login-description">
                        {description || 'Please log in to continue with the application.'}
                    </p>
                    <LoginForm />

                    <p>
                        <span className="thin-login-signup">Don't have an account?</span> <a href={ihpBackendUrl('/NewUser')} onClick={() => { event.preventDefault(); onSignUpClick(); }}>Sign up</a>
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

        const response = await AuthApi.loginWithEmailAndPassword(email, password);

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
            className="thin-auth-form-group"
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
            spellCheck={false}
        />
        <input
            className="thin-auth-form-group"
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
                    ? <LoadingSpinner small/>
                    : "Login"
                }
            </button>
        </div>
    </form>
}

interface LoginErrorProps {
    errorType: AuthApi.LoginError
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

interface SignUpProps {
    description?: string,
    onLoginClick: () => void,
    appIcon?: string
}
export function SignUpProps({ description, onLoginClick, appIcon = DEFAULT_APP_ICON }: SignUpProps) {
    return <div className="thin-login">
        <div className="thin-login-container">
            <div className="thin-login-container-inner">
                <div className="thin-login-box">
                    <div className="thin-login-icon-container">
                        <img src={appIcon}/>
                    </div>

                    <SignUpForm description={description} onLoginClick={onLoginClick}/>
                </div>

                <div className="thin-login-built-with">
                    <a href="https://thin.dev/?ref=NewSessionFooter" target="_blank">Built with Thin Backend</a>
                </div>
            </div>
        </div>
    </div>
}

function SignUpForm({ description, onLoginClick }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [validationFailures, setValidationFailures] = useState([]);
    const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false);

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setLoading(true);
        setValidationFailures([]);

        const response = await AuthApi.createUser(email, password);
        if (response.tag === 'DidCreateUser') {
            const { userId, jwt, emailConfirmationRequired } = response;

            if (emailConfirmationRequired) {
                setRequiresEmailConfirmation(true);
            } else {
                didCompleteAuthentication(userId, jwt);
            }
        } else {
            setValidationFailures(response.validationFailures);
        }

        setLoading(false);
    }

    useEffect(() => {
        // Start the connection if it's not running yet
        // This way we have lower latency for the login
        DataSyncController.getInstance().startConnection();
    }, []);

    const emailValidationFailure = validationFailures.find(failure => failure[0] === 'email');
    const passwordValidationFailure = validationFailures.find(failure => failure[0] === 'passwordHash');

    if (requiresEmailConfirmation) {
        return <div>
                <h1>Confirm your Email!</h1>
                
                <p>Before you can start, please quickly confirm your email address by clicking the link we've sent to {email}.</p>

                <p>
                    <a href="#" onClick={event => {
                        event.preventDefault();
                        onLoginClick();
                    }}>Back to Login</a>
                </p>
            </div>

    }

    return <form method="POST" action="#" onSubmit={onSubmit}>
        <h1>Sign Up</h1>

        <p className="thin-login-description">
            {description || 'Sign up for an account to use this application.'}
        </p>
        <div className="thin-auth-form-group">
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
                spellCheck={false}
                className={emailValidationFailure ? 'thin-auth-invalid' : ''}
            />
            {emailValidationFailure && <div className="thin-auth-invalid-feedback">{emailValidationFailure[1]}</div>}
        </div>

        <div className="thin-auth-form-group">
            <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={event => {
                    setPassword(event.target.value);
                }}
                className={passwordValidationFailure ? 'thin-auth-invalid' : ''}
            />
            {passwordValidationFailure && <div className="thin-auth-invalid-feedback">{passwordValidationFailure[1]}</div>}
        </div>

        <div>
            <button type="submit" disabled={isLoading}>
                {isLoading
                    ? <LoadingSpinner small/>
                    : "Sign Up"
                }
            </button>
        </div>

        <p>
            <span className="thin-login-signup">Already have an account?</span> <a href={ihpBackendUrl('/NewUser')} onClick={() => { event.preventDefault(); onLoginClick(); }}>Login</a>
        </p>
    </form>
}


export function EmailConfirmation({ userId, token, onConfirmedAlready, onConfirmFailed }) {
    useEffect(() => {
        AuthApi.confirmUser(userId, token).then(result => {
            if (result.tag === 'DidConfirmUser') {
                didCompleteAuthentication(userId, result.jwt);
            } else if (result.tag === 'DidConfirmUserAlready') {
                onConfirmedAlready();
            } else if (result.tag === 'ConfirmUserFailed') {
                onConfirmFailed();
            }
        });
    })

    return <div className="thin-login">
        <div className="thin-login-container">
            <div className="thin-login-container-inner">
                <div className="thin-login-box">
                    <div className="thin-login-icon-container">
                        <img src="https://testvercelreview.thinbackend.app/thin-icon-black.png"/>
                    </div>

                    <h1>
                        Confirming your Email...
                    </h1>

                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <LoadingSpinner />
                    </div>
                </div>

                <div className="thin-login-built-with">
                    <a href="https://thin.dev/?ref=NewSessionFooter" target="_blank">Built with Thin Backend</a>
                </div>
            </div>
        </div>
    </div>
}

interface ConfirmationParameters {
    userId: string,
    token: string
}

function extractConfirmationParametersFromUrl(): ConfirmationParameters | null {
    const query = new URLSearchParams(window.location.search);

    if (query.has('email-confirmation') && query.has('userId') && query.has('token')) {
        const userId = query.get('userId');
        const token = query.get('token');

        // Remove parameters from the URL
        query.delete('email-confirmation');
        query.delete('userId');
        query.delete('token');
        const newQuery = query.toString();

        window.history.pushState({}, document.title, window.location.pathname + (newQuery.length > 0 ? '?' + newQuery : ''));

        return { userId, token };
    }

    return null;
}

function useEmailConfirmationParameters() {
    const [emailConfirmationParameters, setEmailConfirmationParameters] = useState(null);
    useEffect(() => {
        setEmailConfirmationParameters(extractConfirmationParametersFromUrl());
    }, []);

    return [emailConfirmationParameters, setEmailConfirmationParameters];
}

interface LoadingSpinnerProps {
    small: boolean;
}
function LoadingSpinner({ small = false }: LoadingSpinnerProps) {
    const className = 'thin-login-spinner-border' + (small ? ' thin-login-spinner-border-sm' : '');
    return <span className={className} role="status" aria-hidden="true"></span>
}