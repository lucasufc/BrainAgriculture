import { FastifyRequest, FastifyReply } from 'fastify'
import { FarmRepository } from '../repositories/farmRepository'
import { validateAreas, validateFarmerId } from '../utils/validators'
import { handleError } from '../utils/errorHandler'

class FarmService {
  farmRepository = new FarmRepository()

  async get(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as GetFarmsQueryParams
    const { page = 1, limit = 1000 } = query

    if (page <= 0 || limit <= 0) {
      return reply.status(400).send({ error: 'Page e limit devem ser números positivos.' })
    }

    try {
      const result = await this.farmRepository.getFarms(query)
      return reply.send(result)
    } catch (error) {
      console.error('Erro ao recuperar fazendas:', error)
      return reply.status(500).send({ error: 'Erro ao recuperar dados.' })
    }
  }

  async save(request: FastifyRequest, reply: FastifyReply) {
    const isValidArea = await validateAreas(request.body as CreateFarmProps, reply)
    if (!isValidArea) return

    const farm = await this.farmRepository.save(request.body as CreateFarmProps)

    reply.status(201).send(farm)
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { cpf_cnpj } = request.body as CreateFarmProps

    const normalizedKey = validateFarmerId(cpf_cnpj)

    const { farmId: farmIdString } = request.query as { farmId: string }
    const farmId = parseInt(farmIdString, 10)

    if (isNaN(farmId)) return reply.status(400).send({ error: 'Invalid farmId' })

    const isValidArea = await validateAreas(request.body as CreateFarmProps, reply)
    if (!isValidArea) return

    const updateFarmData = {
      ...(request.body as CreateFarmProps),
      cpf_cnpj: normalizedKey,
    }
    const farm = await this.farmRepository.update(farmId, updateFarmData)

    reply.status(200).send(farm)
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { user } = request.query as { user: string }
    const { farmId: farmIdString } = request.query as { farmId: string }
    const farmId = parseInt(farmIdString, 10)

    if (isNaN(farmId)) return reply.status(400).send({ error: 'Invalid farmId' })
    if (!user) return reply.status(400).send({ error: 'A identificação é obrigatoria' })

    try {
      await this.farmRepository.delete(farmId, user)
      return reply.status(201).send('Deleção realizada com sucesso')
    } catch (error) {
      handleError(error, reply)
    }
  }
}

export { FarmService }
