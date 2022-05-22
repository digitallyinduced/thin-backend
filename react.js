import React, { useState, useEffect, useContext } from 'react';
import { getCurrentUserId, ensureIsUser, initAuth } from 'thin-backend/auth.js';
import { useQuerySingleResult, AuthCompletedContext } from 'ihp-datasync/react';
import { query } from 'ihp-datasync';
import { Login } from 'thin-backend-react/auth-ui';

export function ThinBackend({ children, requireLogin = false }) {
    const [authCompleted, setAuthCompleted] = useState(false);

    useEffect(() => {
        (requireLogin ? ensureIsUser : initAuth)().then(() => setAuthCompleted(true))
    }, [])

    let childrenOrLogin = children;
    if (requireLogin && !authCompleted) {
        childrenOrLogin = React.createElement(Login, {}, null);
    }
    return React.createElement(AuthCompletedContext.Provider, { value: authCompleted }, childrenOrLogin);
}

export function useCurrentUserId() {
    const isAuthCompleted = useContext(AuthCompletedContext);
    if (!isAuthCompleted) {
        return null;
    }
    return getCurrentUserId();
}

export function useIsLoggedIn() {
    const isAuthCompleted = useContext(AuthCompletedContext);
    if (!isAuthCompleted) {
        return null;
    }
    return getCurrentUserId() !== null;
}

export function useCurrentUser() {
    const userId = useCurrentUserId();
    return useQuerySingleResult(query('users').filterWhere('id', userId));
}

export * from 'ihp-datasync/react';