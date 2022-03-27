# Todo App built with Thin Backend

## Running

To start the Backend:

```bash
docker run -p 8000:8000 -p 8001:8001 --pull=always -v $PWD:/home/app/Application downloads.digitallyinduced.com/digitallyinduced/thin-backend
```

To start the frontend:

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```