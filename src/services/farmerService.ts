import { FastifyRequest, FastifyReply } from 'fastify'
import { FarmerRepository } from '../repositories/farmerRepository'
import { validateEmail, validateFarmerId, validateState } from '../utils/validators'
import { handleError } from '../utils/errorHandler'
import { FarmRepository } from '../repositories/farmRepository'

class FarmerService {
  farmerRepository = new FarmerRepository()
  farmRepository = new FarmRepository()

  async get(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as GetFarmsQueryParams
    const { page = 1, limit = 100 } = query

    if (page <= 0 || limit <= 0) {
      return reply.status(400).send({ error: 'Page e limit devem ser números positivos.' })
    }

    try {
      const farmers = await this.farmerRepository.getFarmers(query)
      const farmersKeys = farmers.map((farmer) => farmer.cpf_cnpj)
      const farmsByKey = await this.farmRepository.getFarmsByFarmers(farmersKeys, query.active_farms)

      const farmsMap = new Map<string, any[]>()

      farmsByKey.forEach((farm) => {
        if (!farmsMap.has(farm.farmer_cpf_cnpj)) {
          farmsMap.set(farm.farmer_cpf_cnpj, [])
        }
        farmsMap.get(farm.farmer_cpf_cnpj)?.push(farm)
      })

      const result = farmers.map((farmer) => ({
        ...farmer,
        farms: farmsMap.get(farmer.cpf_cnpj) || [],
      }))

      return reply.send(result)
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      return reply.status(500).send({ error: 'Erro ao recuperar dados.' })
    }
  }

  async save(request: FastifyRequest, reply: FastifyReply) {
    const farmer = request.body as CreateFarmerProps

    try {
      const validCpfCnpj = validateFarmerId(farmer.cpfCnpj)

      if (!validateEmail(farmer.email)) return reply.status(400).send({ error: 'Email inválido.' })
      if (!validateState(farmer.state)) return reply.status(400).send({ error: 'Estado deve ter 2 caracteres.' })

      const valitadedFarmer = { ...farmer, cpfCnpj: validCpfCnpj }
      const createdFarmer = await this.farmerRepository.save(valitadedFarmer)

      return reply.status(201).send(createdFarmer)
    } catch (error) {
      handleError(error, reply)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const farmer = request.body as CreateFarmerProps

    try {
      const validCpfCnpj = validateFarmerId(farmer.cpfCnpj)

      if (!validateEmail(farmer.email)) return reply.status(400).send({ error: 'Email inválido.' })
      if (!validateState(farmer.state)) return reply.status(400).send({ error: 'Estado deve ter 2 caracteres.' })

      const valitadedFarmer = { ...farmer, cpfCnpj: validCpfCnpj }
      const createdFarmer = await this.farmerRepository.update(validCpfCnpj, valitadedFarmer)

      return reply.status(201).send(createdFarmer)
    } catch (error) {
      handleError(error, reply)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { cpfCnpj, user } = request.query as { cpfCnpj: string, user: string }
    if (!cpfCnpj) return reply.status(400).send({ error: 'O CPF/CNPJ é obrigatorio' })
    if (!user) return reply.status(400).send({ error: 'A identificação é obrigatoria' })

    const validCpfCnpj = validateFarmerId(cpfCnpj)
    try {
      await this.farmerRepository.deleteFarmer(validCpfCnpj, user)
      return reply.status(201).send('Deleção realizada com sucesso')
    } catch (error) {
      handleError(error, reply)
    }
  }
}

export { FarmerService }
