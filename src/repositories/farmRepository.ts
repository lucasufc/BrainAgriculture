import { Farm } from '@prisma/client'
import prismaClient from '../prisma'

class FarmRepository {
  async getFarms(filters: GetFarmsQueryParams): Promise<Farm[]> {
    const { cpfCnpj, state, is_active, page = 1, limit = 1000 } = filters
    const skip = (page - 1) * limit
    const take = limit

    const farms = await prismaClient.farm.findMany({
      where: {
        ...(cpfCnpj && { farmer_cpf_cnpj: cpfCnpj }),
        ...(state && { state }),
        ...(is_active !== undefined && { is_active }),
      },
      skip: skip,
      take: take,
      include: {
        CultureByFarm: {
          include: {
            culture: true,
          },
        },
      },
    })

    return farms
  }

  async getFarmsByFarmers(keys: string[], active?: boolean): Promise<Farm[]> {
    const farms = await prismaClient.farm.findMany({
      where: {
        farmer_cpf_cnpj: {
          in: keys,
        },
        ...(active !== undefined && { is_active: active }),
      },
      include: {
        CultureByFarm: {
          include: {
            culture: true,
          },
        },
      },
    })

    return farms
  }

  async save(farmData: CreateFarmProps): Promise<Farm> {
    const { cpf_cnpj, name, state, city, address, total_area, arable_area, vegetation_area, cultures, user } = farmData
    const farm = await prismaClient.farm.create({
      data: {
        name,
        farmer_cpf_cnpj: cpf_cnpj,
        state,
        city,
        address,
        total_area,
        arable_area,
        vegetation_area,
        last_modified_by: user,
        CultureByFarm: {
          create: cultures.map((culture) => ({
            culture_id: culture.culture_id,
            planted_area: culture.planted_area,
            last_modified_by: user,
          })),
        },
      },
      include: {
        CultureByFarm: true,
      },
    })

    return farm
  }

  async update(farmId: number, farmData: CreateFarmProps): Promise<Farm> {
    const { cultures, user } = farmData

    const updatedFarm = await prismaClient.$transaction(async (prisma) => {
      const farm = await prisma.farm.update({
        where: { id: farmId },
        data: {
          name: farmData.name,
          state: farmData.state,
          city: farmData.city,
          address: farmData.address,
          total_area: farmData.total_area,
          arable_area: farmData.arable_area,
          vegetation_area: farmData.vegetation_area,
          last_modified_by: user,
        },
      })

      const cultureIds = cultures.map((culture) => culture.culture_id)

      const existingCultures = await prisma.cultureByFarm.findMany({
        where: {
          farm_id: farmId,
          culture_id: {
            in: cultureIds,
          },
        },
      })

      const existingCultureMap = new Map(existingCultures.map((culture) => [culture.culture_id, culture]))

      const culturesToUpdate = cultures.filter((culture) => existingCultureMap.has(culture.culture_id))
      const culturesToCreate = cultures.filter((culture) => !existingCultureMap.has(culture.culture_id))

      if (culturesToUpdate.length > 0) {
        await Promise.all(
          culturesToUpdate.map((culture) =>
            prisma.cultureByFarm.update({
              where: {
                id: existingCultureMap.get(culture.culture_id)!.id,
              },
              data: {
                planted_area: culture.planted_area,
                last_modified_by: farmData.user,
              },
            })
          )
        )
      }

      if (culturesToCreate.length > 0) {
        await prisma.cultureByFarm.createMany({
          data: culturesToCreate.map((culture) => ({
            farm_id: farmId,
            culture_id: culture.culture_id,
            planted_area: culture.planted_area,
            last_modified_by: farmData.user,
          })),
        })
      }

      return farm
    })

    return updatedFarm
  }

  async delete(farmID: number, user: string): Promise<Farm> {
    const farm = await prismaClient.farm.update({
      where: { id: farmID },
      data: {
        is_active: false,
        last_modified_by: user,
      },
    })

    return farm
  }

}

export { FarmRepository }
