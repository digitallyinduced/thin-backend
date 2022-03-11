# Getting Started With Thin Backend

![](images/Layout/header.png)

**Thin Backend is a blazing fast GraphQL Server that provides an instant GraphQL API for any Postgres Database.**

We believe that web application development can be fundamentally simplified by working with two principles:
1. All data is realtime and reflects the latest database state: Local state management is fundamentally hard as it's dealing with distributed system problems. Best to avoid it alltogether.
2. All database operations go through a unified standard interface, GraphQL in our case.

Thin Backend comes with everything needed to build blazing fast, realtime single page apps.

## Feature Overview

- **Blazing Fast, Low Latency:**
    Delight your end-users with superior speed and lowest latency. GraphQL queries are compiled directly to SQL, avoiding n-1 problems.

- **Realtime:**
    Provide a delightful experience to your end users: With Thin Backend Live Queries your app state is synchronized in real-time across all users.

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
    Thin Backend is designed by the company that makes [IHP](https://ihp.digitallyinduced.com/), Haskell's most successful web framework. Thin Backend is built on top of the production-prooven IHP architecture & libraries.

    IHP was recognized as a High Performer in G2's Winter 2022 Web Framework Report:


    [![G2 Badge](https://ihp.digitallyinduced.com/startpage/g2-badge.svg)](https://www.g2.com/products/ihp/reviews)

## Commercial Support

Thin Backend is built on the [IHP platform](https://ihp.digitallyinduced.com/), Haskell's leading web framework. IHP is used in production by [digitally induced](https://www.digitallyinduced.com/) since 2017. You can expect continuous support and development in the future.

Additionally we're happy to provide commercial support for your Thin Backend project, either directly by digitally induced or through the di Partners network


### digitally induced Partners

The digitally induced Partners offer you professional IHP development, consulting and support. All partners have experience in working with IHP projects in production can help you build fast and well-architected projects.

You can find details on [the Partners page](https://ihp.digitallyinduced.com/Partners).

## Example Project

Take a look [at the example task management application project](https://github.com/digitallyinduced/thin-backend/tree/master/Examples/TodoApp) to get to see some code. Follow the documentation to build this application yourself in the section "Your First Project".

[Next: Your First Project](/your-first-project.html)
