// @ts-expect-error
import { DataSyncController, ihpBackendUrl } from 'thin-backend';

interface LoginWithEmailAndPasswordRequest { tag: 'LoginWithEmailAndPassword', email: string, password: string }
interface LoginSuccessfulResponse { tag: 'LoginSuccessful', userId: string, jwt: string }
interface UserLockedResponse { tag: 'UserLocked' }
interface UserUnconfirmedResponse { tag: 'UserUnconfirmed' }
interface InvalidCredentialsResponse { tag: 'InvalidCredentials' }
type LoginResponse = LoginSuccessfulResponse | UserLockedResponse | UserUnconfirmedResponse | InvalidCredentialsResponse;

export type LoginError = 'UserLocked' | 'UserUnconfirmed' | 'InvalidCredentials';

export function loginWithEmailAndPassword(email: string, password: string): Promise<LoginResponse> {
    const dataSyncController = DataSyncController.getInstance();
    return dataSyncController.sendMessage<LoginWithEmailAndPasswordRequest, LoginResponse>({ tag: 'LoginWithEmailAndPassword', email, password });
}

interface CreateUserRequest { tag: 'CreateUser', email: string, password: string }

interface DidCreateUser { tag: 'DidCreateUser', userId: string, emailConfirmationRequired: boolean, jwt: string}
interface CreateUserFailed { tag: 'CreateUserFailed', validationFailures: [[string, string]] }

export function createUser(email: string, password: string): Promise<DidCreateUser | CreateUserFailed> {
    const dataSyncController = DataSyncController.getInstance();
    return dataSyncController.sendMessage<CreateUserRequest, DidCreateUser | CreateUserFailed>({ tag: 'CreateUser', email, password });
}

interface DidConfirmUser { tag: 'DidConfirmUser', jwt: string }
interface DidConfirmUserAlready { tag: 'DidConfirmUserAlready'}
interface ConfirmUserFailed { tag: 'ConfirmUserFailed' }

export function confirmUser(userId: string, token: string): Promise<DidConfirmUser | ConfirmUserFailed | DidConfirmUserAlready> {
    const dataSyncController = DataSyncController.getInstance();
    return dataSyncController.sendMessage<DidConfirmUser | ConfirmUserFailed>({ tag: 'ConfirmUser', userId, token });
}