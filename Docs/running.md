# Running Thin Backend

```toc

```

Thin Backend is distributed via Docker. [If you don't have docker installed, you can get it on the Docker website.](https://www.docker.com/get-started)

## Development

### Thin Backend with Integrated Postgres

For simple hobby projects or when you're just exploring Thin Backend, we recommend you start here. The "Integrated Postgres" means
that the Docker Container includes it's own install of Postgres. The dev server will automatically start the postgres
server and connect to it. It feels very similiar to working with SQLite.

```bash
docker run -p 8000:8000 \
    -p 8001:8001 \
    --pull=always \
    -v $PWD:/home/app/Application \
    downloads.digitallyinduced.com/digitallyinduced/thin-backend:latest
```

The GraphQL server connects to the Postgres via UNIX socket. The integrated postgres server is not reachable from outside.

If you want to connect to the database server directly, follow the section below on how to run Thin Backend with a Dedicated Database Container.

### Thin Backend with a Dedicated Database Container

For more advanced professional development setups or when you have more services that need to access the database, it's suggested
you use docker compose to wire up a dedicated postgres container.

Create a file `docker-compose.yml`:

```yml
services:
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_PASSWORD: examplepassword
    ports:
      - '5432:5432'
  thin:
    image: downloads.digitallyinduced.com/digitallyinduced/thin-backend:latest
    restart: always
    ports:
      - 8000:8000
      - 8001:8001
    depends_on:
      - db
    environment:
      DATABASE_URL: "postgres://postgres:examplepassword@db/postgres"
```

Now you can start the database and Thin Backend with docker-compose:

```bash
docker compose up
```

## Production

For running in production we provide the `thin-backend-prod` image. The main difference to the development is, that the development tools running on port `8001` are disabled.

You can run it like this:

```yml
docker run -p 8000:8000 \
    -p 8001:8001 \
    --pull=always \
    -v $PWD:/home/app/Application \
    --env "DATABASE_URL=postgres://..." \
    downloads.digitallyinduced.com/digitallyinduced/thin-backend-prod:latest
```

You can also run it with docker compose:

```yml
services:
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_PASSWORD: examplepassword
    ports:
      - '5432:5432'
  thin:
    image: downloads.digitallyinduced.com/digitallyinduced/thin-backend-prod:latest
    restart: always
    ports:
      - 8000:8000
    depends_on:
      - db
    environment:
      DATABASE_URL: "postgres://postgres:examplepassword@db/postgres"
```