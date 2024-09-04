import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import { FarmerService } from '../services/farmerService'

export async function farmerRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const farmerService = new FarmerService()

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return farmerService.get(request, reply)
  })

  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return farmerService.save(request, reply)
  })

  fastify.patch('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return farmerService.update(request, reply)
  })

  fastify.delete('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return farmerService.delete(request, reply)
  })
}
