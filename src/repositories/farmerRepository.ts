import prismaClient from '../prisma'

class FarmerRepository {
  async save(rawFarmer: CreateFarmerProps): Promise<Farmer> {
    const { user, cpfCnpj, ...filteredFarmer } = rawFarmer

    const createdFarmer = await prismaClient.farmer.create({
      data: {
        ...filteredFarmer,
        cpf_cnpj: cpfCnpj,
        last_modified_by: user,
      },
    })
    return createdFarmer
  }

  async update(key: string, rawFarmer: CreateFarmerProps): Promise<Farmer> {
    const { user, cpfCnpj, ...filteredFarmer } = rawFarmer

    const updatedFarmer = await prismaClient.farmer.update({
      where: { cpf_cnpj: key },
      data: {
        ...filteredFarmer,
        last_modified_by: user,
      },
    })
    return updatedFarmer
  }

  async getFarmers(filters: GetFarmsQueryParams): Promise<Farmer[]> {
    const { cpfCnpj, state, is_active, page = 1, limit = 100 } = filters
    const skip = (page - 1) * limit
    const take = limit

    const farmer = await prismaClient.farmer.findMany({
      where: {
        ...(cpfCnpj && { farmer_cpf_cnpj: cpfCnpj }),
        ...(state && { state }),
        ...(is_active !== undefined && { is_active }),
      },
      skip: skip,
      take: take,
    })

    return farmer
  }

  async updateFarmer(cpfCnpj: string, updateData: Partial<Farmer>): Promise<Farmer> {
    const updatedFarmer = await prismaClient.farmer.update({
      where: { cpf_cnpj: cpfCnpj },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
    })

    return updatedFarmer
  }

  async deleteFarmer(cpfCnpj: string, user: string) {
    await prismaClient.farmer.update({
      where: { cpf_cnpj: cpfCnpj },
      data: {
        is_active: false,
        last_modified_by: user,
        updated_at: new Date(),
      },
    })
  }
}

export { FarmerRepository }
