
import fastify from 'fastify'
import { generateUpdateStatement } from '@sraka1/generate-update-statement'

const server = fastify()

const queryOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        originalDocument: {},
        mutations: {}
      },
      additionalProperties: false
    }
  }
}

server.post('/', queryOptions, function (request, reply) {
  const query = request.body
  const originalDocument = query.originalDocument
  const mutations = query.mutations
  try {
    const generatedStatements = generateUpdateStatement(originalDocument, mutations)
    reply.send(generatedStatements)
  } catch (e) {
    reply.status(400)
  }
})

const start = async () => {
  try {
    await server.listen(3000)
    console.log(`server listening on ${server.server.address().port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  console.log('stopping fastify server')
  await server.close()
  console.log('fastify server stopped')
  process.exit(0)
})

start()

module.exports = fastify
