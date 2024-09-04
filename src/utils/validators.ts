import { cpf as CPF, cnpj as CNPJ } from 'cpf-cnpj-validator'
import { FastifyReply } from 'fastify'

export function validateCPF(cpf: string): boolean {
  return CPF.isValid(cpf)
}

export function validateCNPJ(cnpj: string): boolean {
  return CNPJ.isValid(cnpj)
}

export function validateFarmerId(cpf_cnpj: string): string {
  const sanitizedValue = cpf_cnpj.replace(/\D/g, '')
  if (sanitizedValue.length <= 11) {
    if (validateCPF(sanitizedValue)) return CPF.format(sanitizedValue)
    throw new Error('CPF inválido')
  }
  if (validateCNPJ(sanitizedValue)) return CNPJ.format(sanitizedValue)
  throw new Error('CPF inválido')
}

export function validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email)
}

export function validateState(state: string): boolean {
  return state.length == 2
}

export async function validateAreas(data: CreateFarmProps, reply: FastifyReply): Promise<boolean> {
  const { total_area, arable_area, vegetation_area, cultures } = data

  if (total_area != arable_area + vegetation_area) {
    reply.status(400).send({
      error: 'A soma das áreas agricultaveis e de vegetação devem ser igual à area total',
    })
    return false
  }

  const totalPlantedArea = cultures.reduce((sum, culture) => sum + culture.planted_area, 0)
  if (totalPlantedArea > arable_area) {
    reply.status(400).send({
      error: 'A soma das áreas plantadas não pode ultrapassar a área agricultável.',
    })
    return false
  }
  return true
}
