import { FastifyReply } from 'fastify'

export function handleError(error: unknown, reply: FastifyReply) {
  if (error instanceof Error) {
    reply.status(400).send({ error: error.message })
  } else {
    reply.status(500).send({ error: 'Internal Server Error' })
  }
}
