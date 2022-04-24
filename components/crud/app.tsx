import React from 'react';
import * as ReactDOM from 'react-dom'

import { query, initThinBackend, DataSubscription, createRecord, updateRecord, deleteRecord, createRecords, ensureIsUser, logout, getCurrentUserId, TableName } from 'thin-backend';
import { useCurrentUser, ThinBackend } from 'thin-backend/react';
import { Crud } from './index';

function App() {
    return <ThinBackend requireLogin>
        <div className="container">
            <AppNavbar/>

            <Crud query={query('tasks')} />
        </div>
    </ThinBackend>
}

function AppNavbar() {
    // Use the `useCurrentUser()` react hook to access the current logged in user
    const user = useCurrentUser();

    // This navbar requires bootstrap js helpers for the dropdown
    // If the dropdown is not working, you like removed the bootstrap JS from your index.html

    return <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {user?.email}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="#" onClick={() => logout()}>Logout</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
}

// This needs to be run before any calls to `query`, `createRecord`, etc.
initThinBackend({ host: process.env.BACKEND_URL });

// Start the React app
ReactDOM.render(<App/>, document.getElementById('app'));
