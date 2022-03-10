import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom'

import { initIHPBackend } from 'ihp-datasync';
import { IHPBackend, useCurrentUserId } from 'ihp-backend/react';
import { useGraphQLQuery } from 'ihp-datasync/react';
import * as GraphQL from 'ihp-datasync/graphql';
import * as Backend from 'ihp-backend';

function App() {
    // With `useQuery()` you can access your database:
    // 
    //     const todos = useQuery(query('todos').orderBy('createdAt'));
    //

    return <IHPBackend requireLogin={false}>
        <div className="container">
            <AppNavbar/>
            <Tasks />
        </div>
    </IHPBackend>
}

function Tasks() {
    const result = useGraphQLQuery('{ tasks { id title body userId } }');
    if (result === null) {
        return <div>Loading...</div>
    }

    return <div>
        <h1>Tasks</h1>
        <div className="mb-4">
            {result.tasks.map(task => <Task key={task.id} task={task} />)}
        </div>
        <AddTaskButton/>
    </div>
}

function Task({ task }) {
    return <div>
        {task.title}
    </div>
}

function AddTaskButton() {
    function addTask() {
        const task = {
            title: 'Hello World',
            body: 'Hello world 2'
        };
        GraphQL.query('mutation { createTask(task: $task) }', { task })
    }
    return <button className="btn btn-primary" onClick={addTask}>
        Add Task
    </button>
}

function AppNavbar() {
    // Use the `useCurrentUserId()` react hook to access the current logged in user
    const userId = useCurrentUserId();

    // This navbar requires bootstrap js helpers for the dropdown
    // If the dropdown is not working, you like removed the bootstrap JS from your index.html

    return <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {userId}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="#" onClick={() => Backend.logout()}>Logout</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
}

// This needs to be run before any calls to `query`, `createRecord`, etc.
initIHPBackend({ host: 'http://localhost:8000' });
Backend.initIHPBackend({ host: 'http://localhost:8000' });

// Start the React app
ReactDOM.render(<App/>, document.getElementById('app'));