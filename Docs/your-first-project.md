# Creating Your First Project

```toc

```

## 1. Project Setup

This guide will lead you through creating a small todo application.


To set up the project, open a terminal and create a new project directory:

```bash
mkdir TodoApp
```

Switch to the `TodoApp` directory before doing the next steps:

```bash
cd TodoApp
```

### Running

Start the development server by running the following docker command in the `TodoApp` directory:

```bash
docker run -p 8000:8000 \
    -p 8001:8001 \
    --pull=always \
    -v $PWD:/home/app/Application \
    ghcr.io/digitallyinduced/thin-backend:latest
```

[If you don't have docker installed, you can get it on the Docker website.](https://www.docker.com/get-started)

On first start, it will take a few seconds to pull the docker image.

Once the server has started, you can find the local dev tools at `http://localhost:8001`. Additionally at `http://localhost:8000` Thin Backend provides it's GraphQL server.

The docker image contains an integrated postgres server. Therefore there's no need to link a postgres container for now. You'll later learn how to start a Thin Backend container with an external postgres instance.

### Directory Structure

The new `TodoApp` directory now contains a couple of auto-generated files and directories that make up your app.

Here is a short overview of the whole structure:

| File or Directory             | Purpose                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| Schema.sql                    | Database tables are defined here                                                    |
| Fixtures.sql                  | Fills the database with test data for local development                             |
| Migrations/                   | Database migrations are stored here                                                 |

It's recommended to track all these files in git.

## 2. Hello World

Open [`http://localhost:8001`](http://localhost:8001) and you will see this:

![](images/YourFirstProject/schema-designer-2.png)

This is the Schema Designer. The Schema Designer will be used in the following sections of this tutorial. The schema designer helps to quickly build the DDL statements for your database schema without remembering all the PostgreSQL syntax and data types. But keep in mind: The schema designer is just a GUI tool to edit the `Schema.sql` file. This file consists of DDL statements to build your database schema. The schema designer parses the `Schema.sql`, applies changes to the syntax tree, and then writes it back into the `Schema.sql`. If you love your VIM, you can always skip the GUI and go straight to the code in `Schema.sql`. If you need to do something advanced which is not supported by the GUI, just manually do it with your code editor of choice. Thin Backend is built by terminal hackers, so don’t worry, all operations can always be done from the terminal :-)

Theres already a `users` table. This table is by default added to any new project, so that the integrated login server works. It's not required and in the Auth documentation you can learn how to use your own custom login system.

## 3. Creating a Table

For our todo app project, let's first build a way to manage tasks.

For working with tasks, we first need to create a `tasks` table inside our database. A single task has a title, a timestamp when it was created, a user id, and of course an id field for the task itself.

Thin Backend is using UUIDs instead of the typical numerical ids.

This is what your `tasks` table might look like:

| `id` :: `UUID` | `title` :: `Text` | `created_at` :: `Timestamp` | `user_id` :: `UUID` |
|--- |--- |--- |--- |
|8d040c2d-0199-4695-ac13-c301970cff1d|Learn Haskell|2022-01-03 18:14:51|1d89c722-7269-46d3-b71b-ec6742867363|
|ad938116-a2ac-44ce-9201-cc66b8a4bb51|Learn IHP|2022-01-03 18:20:15|1d89c722-7269-46d3-b71b-ec6742867363|


To work with tasks in our application, we now have to define this data schema.

Open the Schema Designer by clicking the `SCHEMA` button in the dev tools:

![](images/YourFirstProject/schema-designer-empty.png)

1. Right click into the `Tables` pane and click `Add Table`
    
    ![](images/YourFirstProject/schema-designer-context-menu-add-table.png)

2. Enter the table name `tasks` and click on `Create Table`:
    ![](images/YourFirstProject/schema-designer-new-table-modal.png)


In the right pane, you can see the columns of the newly created table. The `id` column has been automatically created for us.

1. Right-click into the `Columns` pane and select `Add Column`:
    ![](images/YourFirstProject/schema-designer-context-menu-add-column.png)
2. Use this modal to create the `title`:
    ![](images/YourFirstProject/schema-designer-new-column-modal-title.png)

3. Now let's add the `created_at` timestamp column. You can see that Thin automatically suggest this `created_at` column below the table definition:
    ![](images/YourFirstProject/schema-designer-title-column-added.png)

    Click on the suggested `created_at` column to add it to the `tasks` table:

    ![](images/YourFirstProject/schema-designer-suggested-created-at-column.png)

    Now it will look like this:

    ![](images/YourFirstProject/schema-designer-tasks-created-at.png)

4. The only column left now is the `user_id`.
    
    The schema designer is also suggesting to add this for us. Click it to add the `user_id` column:

    ![](images/YourFirstProject/schema-designer-tasks-user-id-suggested.png)

    After the `user_id` column has been added, you'll also see a new index and a policy appear.
    Thin often uses convention over configuration to provide good defaults for your app:

    - The index on the `user_id` column is added because it's common to run database queries like "Give me all tasks for a specific user".
    - The policy is defined to only grant a user access to their own tasks.
      The policy says that the user cannot access tasks where the `user_id` field is different than the current user id.
      Additionally a task can only be added when the `user_id` field is set to the current user id.

5. After that, your schema should look like this:
    ![](images/YourFirstProject/schema-designer-tasks-table-ready.png)

## 4. Running Migrations

Next, we need to make sure that our database schema with our `tasks` table is imported into the Thin PostgreSQL database.
For that we'll create and run a database migration.

1. Click the `Migrate DB` button at the bottom of the page
        
    ![](images/YourFirstProject/migrate-db-button.png)

2. Thin already prepared a few SQL statements to migrate our DB. Typically we don't need to make any changes here.

    Once your app is running in production, you might want to review and modify the auto generated SQL statements to make sure that everything goes as planned.

    ![](images/YourFirstProject/new-migration.png)

    Click `Create Migration` after you've quickly reviewed the SQL.

3. The migration has been created:
    
    ![](images/YourFirstProject/migration-created.png)

    Click `Run` to apply the migration to the app database:
    ![](images/YourFirstProject/migration-applied.png)

The `tasks` table has been created now. Let’s quickly connect to our database and see that everything is correct:

1. Click on the `DATA` button in the left navigation.
2. In the `DATA` editor, click on the `tasks` table.
3. You should see an empty table:
    ![](images/YourFirstProject/empty-tasks-table.png)
    
    If there was some issue with the migration, the `tasks` would not be in the table list at the left.

Now our database is ready to be consumed by our React app.
