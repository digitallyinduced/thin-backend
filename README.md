<p align="center">
  <a href="https://thin.dev/" target="_blank">
    <img src="header.png" />
  </a>
</p>
<h1 align="center"><b>Thin Backend</b></h1>
<p align="center">
    Instant API for your Postgres DB
    <br />
    <a href="https://thin.dev/"><strong>thin.dev »</strong></a>
</p>

Thin Backend is a blazing fast, universal web app backend for making realtime single page apps.

Instead of manually writing REST API endpoints or GraphQL resolvers, use a Thin Backend server to automatically get a fully featured API backend on top of your Postgres DB. Thin exposes high level functions to create, read, update and delete database record.

<p align="center">
    <img src="https://thin-backend-prod.s3.amazonaws.com/public-static/github/demo4.gif"/>
</p>

![](https://thin.dev/readme-header.png)

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

[Try on Vercel](https://thin-backend-todo-app.vercel.app/)

## Top-notch Autocompletion

The TypeScript definitions not only provide safety, they also provide really nice autocompletion.

![](https://thin.dev/startpage/autocomplete30.webp)


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
    
    ![Git-like Migrations in Thin](https://vercel.com/_next/image?url=https%3A%2F%2Fvercel.com%2Fapi%2Fv1%2Fintegrations%2Fassets%2Foac_1Uwswlv4y8SGwzbOJx5gqpmv%2Fimages%2Fc74dd072e8c46fc642045f7497963f15acf11aab.png&w=3840&q=75)

- **Proven Architecture:**

    Thin Backend is designed by the company that makes <a href="https://ihp.digitallyinduced.com/">IHP</a>, Haskell's most successful web framework. Thin Backend is built on top of the production-proven IHP architecture & libraries.

    IHP was recognized as a High Performer in G2's Winter 2022 Web Framework Report:

    <a href="https://www.g2.com/products/ihp/reviews">
        <img src="https://ihp.digitallyinduced.com/startpage/g2-badge.svg" alt="G2 Badge" width="96"/>
    </a>

- **Transactions:**

    You can use `withTransaction` to run a set of operations within a database transaction. If an exception is thrown within the transaction callback, the transaction will automatically be rolled back and the exception is re-thrown. If the callback executes successfully, the transaction will automatically be committed:

    ```javascript
    import { withTransaction } from 'thin-backend';

    await withTransaction(async transaction => {
        const team = await transaction.createRecord('teams', { title: 'New Team' });
        
        const project = await transaction.createRecord('projects', {
            title: 'Project 1',
            teamId: team.id
        });

        return [ team, project ];
    })
    ```

    [Learn more in the Docs](https://thin.dev/docs/database#transactions)

- **Batch Operations:**
    
    You can use `createRecords`, `updateRecords` and `deleteRecords` to effiently run operations on a large
    set of database records:

    ```javascript
    // Example:
    const todoA = { title: 'Finish Guide', userId: '49946f4d-8a2e-4f18-a399-58e3296ecff5' };
    const todoB = { title: 'Learn Haskell', userId: '49946f4d-8a2e-4f18-a399-58e3296ecff5' };

    const todos = await createRecord('todos', [ todoA, todoB ]);
    ```

    [Learn more about Batch Operations in the Docs](https://thin.dev/docs/database)

## Documentation

[You can find extensive documentation on the Thin Backend website.](https://thin.dev/docs)


## Getting Started

[Learn how to get started in the Getting Started Guide](https://thin.dev/docs/your-first-project)

[You can also self-host Thin Backend.](https://thin.dev/docs/self-hosting)

## Example Apps

You can find some example apps here:

- [Todo App](https://github.com/digitallyinduced/thin-backend-todo-app)
- [Chat App](https://github.com/digitallyinduced/ihp-backend-chat-example-app)
- [Twitter Clone](https://github.com/digitallyinduced/ihp-backend-twitter-clone)

## Community

Questions, or need help? [Join our Thin Community](https://community.thin.dev/)

## Contributing

We are happy to merge your pull requests!😄

See [CONTRIBUTING.md](CONTRIBUTING.md) for more info.
