# Contributing

We are happy to merge your pull requests!

## Nix

Thin Backend uses the nix package manager to manage the whole set of dependencies of the application.

[You can find install instructions in the IHP documentation.](https://ihp.digitallyinduced.com/Guide/installation.html)

## Check out

Start by cloning the repository:

```bash
git clone git@github.com:digitallyinduced/thin-backend.git
```

Additionally you also want to check out the IHP branch related to this:

```bash
git clone git@github.com:digitallyinduced/ihp.git IHP

# Switch to the correct branch
cd IHP
git checkout ihp-graphql-standalone
```

## Starting

You can start the development tooling with ghci:

```bash
# Open a nix shell to load the environment
nix-shell

# Start a haskell shell
ghci

# Inside ghci:
:l DevServerMain.hs
main
```

## Building the Docker Image

You can build the docker image locally with make:

```bash
make build/docker-image.tar.gz
```

Use this to load the image into your local docker:

```bash
docker load < build/docker-image.tar.gz
```

This will output the image name. You can then use the image name to call `docker run` to start the container.