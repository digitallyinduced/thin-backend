import esbuild from 'esbuild'
import { createServer, request } from 'http'
import { spawn } from 'child_process'
import 'dotenv/config'

/* Want to hardcode your app url? Just modify this variable here */
const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error('The BACKEND_URL env variable is not set. Open the `.env` file and set the value. You can find the value in your IHP Backend project settings.');
}

const clients = []

esbuild
  .build({
    entryPoints: ['./app.tsx'],
    bundle: true,
    outfile: 'public/app.js',
    banner: { js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();' },
    define: {
      'process.env.NODE_ENV': JSON.stringify("development"),
      'process.env.BACKEND_URL': JSON.stringify(BACKEND_URL)
    },
    watch: {
      onRebuild(error, result) {
        clients.forEach((res) => res.write('data: update\n\n'))
        clients.length = 0
        console.log(error ? error : '...')
      },
    },
  })
  .catch(() => process.exit(1))

esbuild.serve({ servedir: './public', port: 3001 }, {}).then(() => {
  createServer((req, res) => {
    const { url, method, headers } = req
    if (req.url === '/esbuild')
      return clients.push(
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        })
      )
    const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html` //for PWA with router
    req.pipe(
      request({ hostname: '0.0.0.0', port: 3001, path, method, headers }, (prxRes) => {
        res.writeHead(prxRes.statusCode, prxRes.headers)
        prxRes.pipe(res, { end: true })
      }),
      { end: true }
    )
  }).listen(3000)

  console.log('Development server running on http://localhost:3000')

  setTimeout(() => {
    const op = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', '/c', 'start'] }
    const ptf = process.platform
    if (clients.length === 0) spawn(op[ptf][0], [...[op[ptf].slice(1)], `http://localhost:3000`])
  }, 1000) //open the default browser only if it is not opened yet
})