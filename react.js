import React, { useState, useEffect, useContext } from 'react';
import { getCurrentUserId, ensureIsUser, initAuth } from 'ihp-backend/ihp-auth.js';
import { useQuerySingleResult, AuthCompletedContext } from 'ihp-datasync/react';
import { query } from 'ihp-datasync';

export function IHPBackend({ children, requireLogin = false }) {
    const [authCompleted, setAuthCompleted] = useState(false);

    useEffect(() => {
        (requireLogin ? ensureIsUser : initAuth)().then(() => setAuthCompleted(true));
    }, [])

    return React.createElement(AuthCompletedContext.Provider, { value: authCompleted }, children);
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