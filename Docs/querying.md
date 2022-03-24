# GraphQL Clients for Thin Backend

```toc

```

## Introduction

Thin Backend works with most GraphQL clients out of the box. This Guide covers all the possible GraphQL queries and mutations you can send to your Thin Backend service.

[You can learn how to connect a GraphQL client to Thin Backend in the Clients Section](clients.html)

### Retrieving Records

You can retrieve all records of a table using GraphQL like this:

```graphql
{
    users {
        id
        email
    }
}
```

This will return the following JSON:

```json
{
    "users": [
        { "id": "ec355deb-8c67-4231-b2f0-73b6ebcec549", "email": "hello@example.com" },
        { "id": "119c5717-1531-4d16-81be-0faf92d10969", "email": "someone.else@example.com" }

    ]
}
```

### Fetching a single record

When you have the id of a record, you can fetch the database record like this:

```graphql
{
    user(id: "ec355deb-8c67-4231-b2f0-73b6ebcec549") {
        id
        email
    }
}
```

This will return the following JSON:

```json
{
    "user": {
        "id": "ec355deb-8c67-4231-b2f0-73b6ebcec549",
        "email": "hello@example.com"
    }
}
```

The `user(id: ..)` node knows that a single entity will be returned for the id, so instead of a list of users, a single user will be returned. In case the entity is not found, null will be returned.

### Update

#### Updating a single record

A query to update a single database record by it's ID looks like this:

```graphql
{
    updateUser(
        id: "ec355deb-8c67-4231-b2f0-73b6ebcec549",
        patch: { email: "new-email@example.com" }
    ) {
        id
    }
}
```

This will update the database record with id `ec355deb-8c67-4231-b2f0-73b6ebcec549` in the `users` table and updates the email field of that record to `new-email@example.com`.

This will return the following JSON:

```json
{
    "id": "ec355deb-8c67-4231-b2f0-73b6ebcec549"
}
```

### Delete

#### Deleting a single record

A query to delete a database record by it's ID looks like this:

```graphql
{
    deleteUser(
        id: "ec355deb-8c67-4231-b2f0-73b6ebcec549"
    ) {
        id
    }
}
```

This will delete the database record with id `ec355deb-8c67-4231-b2f0-73b6ebcec549` in the `users` table.

Additionally this will return the following JSON:

```json
{
    "id": "ec355deb-8c67-4231-b2f0-73b6ebcec549"
}
```
