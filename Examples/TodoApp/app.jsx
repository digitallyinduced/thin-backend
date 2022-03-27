import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom'

import { initIHPBackend } from 'ihp-datasync';
import { IHPBackend, useCurrentUserId } from 'ihp-backend/react';
import { useGraphQLQuery } from 'ihp-datasync/react';
import * as Backend from 'ihp-backend';

import { ApolloClient, InMemoryCache, useQuery, gql, ApolloProvider, useSubscription, useMutation } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const webSocketLink = new GraphQLWsLink(
    createClient({
        url: "ws://localhost:8000/api/graphql-ws",
        connectionParams: () => {
            return { jwt: localStorage.getItem('ihp_jwt') } // The <IHPBackend> component below stores the JWT inside localStorage
        }
    })
);

const client = new ApolloClient({
    uri: 'http://localhost:8000/api/graphql',
    cache: new InMemoryCache(),
    link: webSocketLink
});

function App() {
    return <IHPBackend requireLogin={true}>
        <ApolloProvider client={client}>
            <div className="container">
                <AppNavbar/>
                <Tasks />
            </div>
        </ApolloProvider>
    </IHPBackend>
}

function Tasks() {
    const { loading, error, data } = useSubscription(gql`subscription {
            tasks {
                id
                title
                body
            }
        }`);
    
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>error: {error.toString()}</div>
    }

    return <div>
        <h1>Tasks</h1>
        <div className="mb-4">
            {data.tasks.map(task => <Task key={task.id} task={task} />)}
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
    const [createTask, { data, loading, error }] = useMutation(gql`mutation { createTask(task: $task) { id } }`);
    function addTask() {
        const task = {
            title: 'Hello World',
            body: 'Hello world 2'
        };
        createTask({ variables: { task } });
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