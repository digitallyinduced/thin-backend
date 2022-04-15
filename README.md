<p align="center">
  <a href="https://thinbackend.app/" target="_blank">
    <img src="header.png" />
  </a>
</p>

<p align="center">
  <img alt="MIT License" src="https://img.shields.io/github/license/digitallyinduced/thin-backend">

  <a href="https://twitter.com/thinbackend" target="_blank">
    <img src="https://img.shields.io/twitter/follow/thinbackend"/>
  </a>
</p>

<p align="center">
  <a href="https://thinbackend.app/" target="_blank">
    Website
  </a>
  |
  <a href="https://thinbackend.app/docs" target="_blank">
    Documentation
  </a>
</p>

# About Thin

Thin Backend is a blazing fast, universal web app backend for making realtime single page apps.

Instead of manually writing REST API endpoints or GraphQL resolvers you can use a Thin Backend server to automatically get a fully feature web application backend. Thin exposes high level functions to create, read, update and delete delete database record.

## Code Examples

This example shows a simple CRUD example for building a Todo app with Thin:

```javascript
import { useQuery, query, createRecord, updateRecord, deleteRecord, Task } from 'ihp-backend';

function Tasks() {
    // `useQuery` automatically triggers a re-render on new data
    const tasks = useQuery(query('tasks').orderBy('createdAt'));

    return <div>
        <h1>Tasks</h1>
        {tasks.map(task => <Task task={task} key={task.id} />)}
    </div>
}

interface TaskProps {
    task: Task; // <- The `Task` type is provided by Thin, auto-generated from the database schema
}
function Task({ task }: TaskProps) {
    const handleEdit = () => {
        const patch = {
            title: window.prompt('New Title:') || task.title
        };

        // `updateRecord` already updates the UI state (e.g. the <Tasks /> component above)
        // even before the server completed the operation.
        updateRecord('tasks', task.id, patch);
    }

    const handleDelete = () => {
        // `deleteRecord` already hides the record from the UI state
        // even before the server completed the operation.
        deleteRecord('tasks', task.id);
    }

    return <div onDoubleClick={handleEdit}>
        {task.title}

        <button onClick={handleDelete}>delete</button>
    </div>
}

function AddTaskButton() {
    const handleClick = () => {
        const task = {
            title: window.prompt('Title:')
        };

        // `createRecord` already shows the new task in the UI
        // even before the server completed the operation.
        createRecord('tasks', task);
    }

    return <button onClick={handleClick}>Add Task</button>
}

function App() {
    // No need for redux or other state management libs
    // `useQuery` automatically triggers a re-render on new data
    return <div>
        <Tasks />
        <AddTaskButton />
    </div>
}
```

## Design Ideas

**We believe that web application development can be fundamentally simplified by working with two principles:**

1. All data is realtime and reflects the latest database state: Local state management is fundamentally hard as it's dealing with distributed system problems. Best to avoid it alltogether.
2. All database operations go through a unified standard interface, IHP DataSync in our case.

![](https://thinbackend.app/startpage/architecture.png)

Thin Backend comes with everything needed to build blazing fast, realtime single page apps.


## Feature Overview

- **Blazing Fast, Low Latency:**
    Delight your end-users with superior speed and lowest latency. With built-in Optimistic Updates your app doesn't need to wait for the server to respond back until the changes are visible on the screen.

- **Realtime:**
    Provide a delightful experience to your end users: With Thin Backend Live Queries your app state is synchronized in real-time across all users.

    ```javascript
    function Tasks() {
        // `useQuery` always returns the latest database state
        // The component automatically re-renders when a record is inserted,
        // updated, or deleted in the `tasks` table
        const tasks = useQuery(query('tasks').orderBy('createdAt'));

        return <div>...</div>
    }

- **Zero-setup Login:**
    To get your started quickly every Thin Backend project comes with zero-setup login, user management and permissions system included.

    Already have an existing login system? No problem, you can disable the built-in login and provide Thin Backend with a JWT.

- **Secure Authorization:**
    Thin Backend uses Postgres Policies to make sure that users can only see what they're allowed to see.

    Based on naming conventions Thin Backend will automatically generate the initial policies for you. You then only need to adjust the default policies based on your needs.

- **Powerful Schema Designer:**
    Thin Backend has a built-in GUI-based schema designer. The schema designer helps to quickly build the DDL statements for your database schema without remembering all the PostgreSQL syntax and data types.

    But keep in mind: The schema designer is just a GUI tool to edit the underlying SQL statements. The schema designer parses the SQL statements, applies changes to the syntax tree, and then writes it back.

    Rather work with your keyboard? You can always skip the GUI and go straight to the code editor. If you need to do something advanced which is not supported by the GUI, just manually do it with your code editor of choice.

- **Git-like Migrations:**
    Whenever you add or change a table in the Schema Designer, the changes will only be applied to the in-memory schema. The actual postgres database will only be touched when you run migrations.

    You can think of this like in a git workflow: In git changes are only applied to the repository history when you do a git commit. In Thin Backend this git commit is running a database migration.

- **Prooven Architecture:**

    Thin Backend is designed by the company that makes <a href="https://ihp.digitallyinduced.com/">IHP</a>, Haskell's most successful web framework. Thin Backend is built on top of the production-prooven IHP architecture & libraries.

    IHP was recognized as a High Performer in G2's Winter 2022 Web Framework Report:

    <a href="https://www.g2.com/products/ihp/reviews">
        <img src="https://ihp.digitallyinduced.com/startpage/g2-badge.svg" alt="G2 Badge" width="96"/>
    </a>

- **Transactions:**

    You can use `withTransaction` to run a set of operations within a database transaction. If an exception is thrown within the transaction callback, the transaction will automatically be rolled back and the exception is re-thrown. If the callback executes successfully, the transaction will automatically be committed:

    ```javascript
    import { withTransaction } from 'ihp-datasync';

    await withTransaction(async transaction => {
        const team = await transaction.createRecord('teams', { title: 'New Team' });
        
        const project = await transaction.createRecord('projects', {
            title: 'Project 1',
            teamId: team.id
        });

        return [ team, project ];
    })
    ```

    [Learn more in the Docs](https://thinbackend.app/docs/database#transactions)

- **Batch Operations:**
    
    You can use `createRecords`, `updateRecords` and `deleteRecords` to effiently run operations on a large
    set of database records:

    ```javascript
    // Example:
    const todoA = { title: 'Finish Guide', userId: '49946f4d-8a2e-4f18-a399-58e3296ecff5' };
    const todoB = { title: 'Learn Haskell', userId: '49946f4d-8a2e-4f18-a399-58e3296ecff5' };

    const todos = await createRecord('todos', [ todoA, todoB ]);
    ```

    [Learn more about Batch Operations in the Docs](https://thinbackend.app/docs/database)

## Documentation

[You can find extensive documentation on the Thin Backend website.](https://thinbackend.app/docs)


## Getting Started

[Learn how to get started in the Getting Started Guide](https://thinbackend.app/docs/your-first-project)

## Commercial Support

Thin Backend is built [on the IHP platform](https://ihp.digitallyinduced.com/), Haskell's leading web framework. IHP is used in production by digitally induced since 2017. You can expect continuous support and development in the future.

Additionally we're happy to provide commercial support for your Thin Backend project, either directly by digitally induced or through the di Partners network

### digitally induced Partners

The digitally induced Partners offer you professional IHP development, consulting and support. All partners have experience in working with IHP projects in production can help you build fast and well-architected projects.

You can find details [on the Partners page](https://ihp.digitallyinduced.com/Partners).

## Example Apps

You can find some example apps inside the `Examples` directory of this repository:

- [Todo App](https://github.com/digitallyinduced/thin-backend/tree/master/Examples/TodoApp)

## Community

Questions, or need help? [Join our Slack Community](https://ihp.digitallyinduced.com/Slack)

[Also check out the Forum!](https://ihp.digitallyinduced.com/community/)

## Contributing

We are happy to merge your pull requests!😄

See [CONTRIBUTING.md](CONTRIBUTING.md) for more info.