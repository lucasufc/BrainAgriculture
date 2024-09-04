import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import { FarmService } from '../services/farmService'

export async function farmRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const farmService = new FarmService()

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return farmService.get(request, reply)
  })

  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return farmService.save(request, reply)
  })

  fastify.patch('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return farmService.update(request, reply)
  })
}
