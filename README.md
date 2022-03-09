<p align="center">
  <a href="https://ihp.digitallyinduced.com/" target="_blank">
    <img src="Guide/images/header.png" />
  </a>
</p>

<p align="center">
  <img alt="MIT License" src="https://img.shields.io/github/license/digitallyinduced/ihp-graphql">

  <a href="https://twitter.com/digitallyinduce" target="_blank">
    <img src="https://img.shields.io/twitter/follow/digitallyinduce"/>
  </a>
</p>

<p align="center">
  <a href="https://ihp.digitallyinduced.com/" target="_blank">
    IHP Website
  </a>
</p>

# About Thin Backend (IHP GraphQL)

Thin Backend is a blazing fast GraphQL Server that provides an instant GraphQL API for any postgres database.

## What makes it different?

**Blazing Fast, Low Latency:**
Delight your end-users with superior speed and lowest latency. Thin Backend is built with Haskell, the most powerful functional programming language, to make your API calls return with lowest latency.

**Live Queries:**
Provide a delightful experience to your end users: With Thin Backend Live Queries your app state can be synchronized in real-time across all users.

**Zero-setup Login:**

Every Thin Backend project comes with zero-setup login, user management and permissions system included.

Already have an existing login system? No problem, you can disable the built-in login and provide Thin Backend with a JWT.

**Secure Authorization:**

Thin Backend uses Postgres Policies to make sure that users can only see what they're allowed to see.

Based on naming conventions Thin Backend will automatically generate the initial policies for you. You then only need to adjust the default policies based on your needs.

E.g. if you add a column called `user_id` to your `tasks` table, it will add a policy that allows users to read their own task records and only add tasks with their own `user_id`:

```sql
CREATE POLICY "Users can manage their tasks"
    ON tasks
    USING
        (user_id = ihp_user_id())
    WITH CHECK
        (user_id = ihp_user_id())
    ;
```

<img src="Guide/images/policy.png" />

**Powerful Schema Designer:**

<img src="Guide/images/schema-designer.gif" />

Thin Backend has a built-in GUI-based schema designer. The schema designer helps to quickly build the DDL statements for your database schema without remembering all the PostgreSQL syntax and data types.

But keep in mind: The schema designer is just a GUI tool to edit the underlying SQL statements. The schema designer parses the SQL statements, applies changes to the syntax tree, and then writes it back.

Rather work with your keyboard? You can always skip the GUI and go straight to the code editor. If you need to do something advanced which is not supported by the GUI, just manually do it with your code editor of choice.

**Create Tables in a Git-like Workflow:**

<img src="Guide/images/migration.png" />

Whenever you add or change a table in the Schema Designer, the changes will only be applied to the in-memory schema. The actual postgres database will only be touched when you run migrations.

You can think of this like in a git workflow: In git changes are only applied to the repository history when you do a git commit. In Thin Backend this git commit is running a database migration.


## Getting Started

1. Download the Docker Image:
    ```bash
    curl "https://ihp-website.s3.eu-west-1.amazonaws.com/ihp-graphql-builds/2022-03-07.tar.gz" | docker load
    ```
2. Start Container:
    ```bash
    docker run -p 8000:8000 -p 8001:8001 app:x8va4ln1wvj3k0kai11i24phwxbb87mj
    ```
3. Open http://localhost:8001/
    
    <img src="Guide/images/screenshot.png" />
    
    In your browser the familiar IHP dev tools provide a GraphQL Server over IHP DataSync (WebSockets for low latency) or alternatively like other GraphQL servers via HTTP at http://localhost:8000/api/graphql (e.g. if you make a request from Postman it will just work).

    It's still missing a lot, but it's enough to be useful already