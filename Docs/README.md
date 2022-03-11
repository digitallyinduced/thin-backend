# Meta-Docs: The Docs for the Docs

The documentation is mostly written in markdown files right now. The start page is index `index.md`.

The `layout.html` provides the outer layout for all markdown files.

## Running the Documentation

[To run the documentation locally, you need to have the nix package manager installed.](https://ihp.digitallyinduced.com/Guide/installation.html#1-dependency-nix-package-manager)

Then clone this repository and run this:

```bash
# Switch to this directory
cd Docs

# Start a new dev shell
nix-shell

# Run the watcher
make watch
```

Now the docs will be running at `localhost:3000`. If you make changes to the `.md` files, it will automatically rebuild the html file.