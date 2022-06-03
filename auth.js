import { DataSyncController } from './datasync.js';
import { query, ihpBackendUrl, fetchAuthenticated } from './querybuilder.js';

var currentUserId = null;
var authenticationCompletedCallback = null;

export async function initAuth(onCompletedCallback) {
    if (currentUserId) {
        return currentUserId;
    }

    try {
        const didHandleRedirect = await handleRedirectBack();
        const hasJWT = localStorage.getItem('ihp_jwt') !== null;

        if (hasJWT) {
            currentUserId = localStorage.getItem('ihp_user_id');

            DataSyncController.getInstance().addEventListener('close', () => {
                const connectionClosedRightAfterOpen = !DataSyncController.getInstance().receivedFirstResponse;
                if (connectionClosedRightAfterOpen) {
                    handlePotentialInvalidJWT();
                }
            });

            return currentUserId;
        } else {
            authenticationCompletedCallback = onCompletedCallback;
        }
    } catch (e) {
        // If we don't clear the JWT here, this will cause an infinite loop
        // if there's some JWT from another IHP project. If the user is logged in
        // in the backend, the backend will redirect back here, and we will redirect
        // back to the backend here.
        localStorage.removeItem('ihp_jwt');
        localStorage.removeItem('ihp_user_id');
    }

    return null;
}

export function didCompleteAuthentication(userId, jwt) {
    localStorage.setItem('ihp_jwt', jwt);
    localStorage.setItem('ihp_user_id', userId);
    localStorage.setItem('ihp_login_method', 'inapp');

    currentUserId = window.localStorage.getItem('ihp_user_id');
    if (authenticationCompletedCallback) {
        authenticationCompletedCallback();
    }
}

async function handlePotentialInvalidJWT() {
    const response = await fetchAuthenticated('/api/user', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'GET',
    });
    
    if (!response.ok) {
        // Our JWT seems invalid, so get rid of it
        localStorage.removeItem('ihp_jwt');
        localStorage.removeItem('ihp_user_id');

        await loginWithRedirect();
    }
}

export async function getCurrentUser() {
    if (currentUserId === null) {
        return Promise.resolve(null);
    }

    return query('users')
            .filterWhere('id', currentUserId)
            .fetchOne();
}

export function getCurrentUserId() {
    return currentUserId;
}

export function logout(options = { redirect: null }) {
    const loginMethod = localStorage.getItem('ihp_login_method') || 'redirect';

    localStorage.removeItem('ihp_jwt');
    localStorage.removeItem('ihp_user_id');
    localStorage.removeItem('ihp_login_method');

    if (loginMethod === 'redirect') {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = ihpBackendUrl('/DeleteSession');
    
        const method = document.createElement('input');
        method.type = 'hidden';
        method.name = '_method'
        method.value = 'DELETE';
    
        form.appendChild(method);
    
        if (options.redirect !== null) {
            const method = document.createElement('input');
            method.type = 'hidden';
            method.name = 'redirectBack'
            method.value = options.redirect;
    
            form.appendChild(method);
        }
    
        document.body.appendChild(form);
        form.submit();
    } else {
        window.location.reload();
    }
}

export async function ensureIsUser() {
    const userId = await initAuth();
    if (userId === null) {
        await loginWithRedirect();
    }
}

export async function loginWithRedirect() {
    const redirectBack = window.encodeURIComponent(String(window.location.href));
    window.location = ihpBackendUrl('/NewSession?redirectBack=' + redirectBack);
}

export async function handleRedirectBack() {
    const query = new URLSearchParams(window.location.search);
    if (query.has('userId') && query.has('accessToken')) {
        const userId = query.get('userId');
        const accessToken = query.get('accessToken');

        // Remove the userId and access token query parameters from the URL
        query.delete('userId');
        query.delete('accessToken');
        const newQuery = query.toString();

        window.history.pushState({}, document.title, window.location.pathname + (newQuery.length > 0 ? '?' + newQuery : ''));

        // Fetching the JWT should happen after the query parameters have been removed, as this could take a few seconds
        // in the worst case
        const jwt = await fetchJWT(userId, accessToken);
        localStorage.setItem('ihp_jwt', jwt);
        localStorage.setItem('ihp_user_id', userId);
        localStorage.setItem('ihp_login_method', 'redirect');

        return true;
    }

    return false;
}

export async function fetchJWT(userId, accessToken) {
    const response = await fetch(ihpBackendUrl('/JWT?userId=' + encodeURIComponent(userId) + '&accessToken=' + encodeURIComponent(accessToken)));
    if (!response.ok) {
        throw new Error('Failed to exchange access token for a JWT');
    }

    return response.text();
}