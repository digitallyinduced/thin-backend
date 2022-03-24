# GraphQL Clients for Thin Backend

```toc

```

## Introduction

Thin Backend works with most GraphQL clients out of the box. This Guide covers how you can use common GraphQL libraries to connect to Thin.

**TL;DR:**

1. Clients can send GraphQL queries via HTTP to `localhost:8000/api/graphql`
2. Thin Backend implements [the GraphQL over WebSocket Protocol](https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md). The GraphQL ovver WebSocket endpoint is available at `localhost:8000/graphql-ws`

## graphql-ws

We suggest you use graphql-ws when connecting to Thin. It connects via WebSocket to the Thin server. WebSockets provide lower latency then doing a HTTPS request for every GraphQL query.

Install it like this:

```javascript
npm install graphql-ws
```

Now you can configure it like this:

```javascript
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:8000/api/graphql-ws',
  connectionParams: {
    // Provide a JWT here if there's a logged in user
    jwt: "..."
  }
});
```

## Apollo Client

If you're using Apollo Client, we recommend you use the `GraphQLWsLink` transport. It connects via WebSocket to the Thin server. WebSockets provide lower latency then doing a HTTPS request for every GraphQL query. Additionally this also makes `subscriptions` work out of the box.

First install Apollo Client:

```bash
npm install @apollo/client graphql
```

The `GraphQLWsLink` additionally requires `graphql-ws` to be installed:

```bash
npm install graphql-ws
```

Now we can set up the client:

```javascript
import { ApolloClient } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const webSocketLink = new GraphQLWsLink(
    createClient({
        url: "ws://localhost:8000/api/graphql-ws",
        connectionParams: {
            // Provide a JWT here if there's a logged in user
            jwt: "..."
        }
    })
);

const client = new ApolloClient({
    uri: 'http://localhost:8000/api/graphql',
    link: webSocketLink
});
```

A full example with Apollo Client + React + Thin can look like this:

```javascript
import { ApolloClient, ApolloProvider, useQuery, gql } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import React from 'react';
import { render } from 'react-dom';

const webSocketLink = new GraphQLWsLink(
    createClient({
        url: "ws://localhost:8000/api/graphql-ws"
    })
);

const client = new ApolloClient({
    uri: 'http://localhost:8000/api/graphql',
    link: webSocketLink
});

const TASKS = ```
    query Tasks {
        tasks {
            id
            title
            createdAt
        }
    }
```;

function App() {
    const { loading, error, data } = useQuery(TASKS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return <div>
        <h1>Hello World!</h1>
    </div>
}

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);
```