const fastify = require('fastify')
const sse = require('fastify-sse')
const { readFileSync } = require('fs')
const axios = require('axios')

const dataURL = 'http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh'

const server = fastify()

const page = readFileSync('./page.html')

// Register the SSE plugin.
server.register(sse)

// Define SSE route.
server.get('/sse', async (_, reply) => {
  const getData = async () => {
    return (await axios.get(dataURL)).data
  }

  // Send the first data.
  reply.sse(await getData())

  // Send fresh data every 1 second.
  setInterval(async () => {
    reply.sse(await getData())
  }, 1000)
})

server.get('/',(_, reply) => {
  reply.type('text/html')
  reply.send(page)
})

server.listen({ port: 8000 })
  .catch(console.error)
