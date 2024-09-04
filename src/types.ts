interface GetFarmsQueryParams {
  cpfCnpj?: string
  state?: string
  is_active?: boolean
  page?: number
  limit?: number
  active_farms?: boolean
}

interface CreateFarmerProps {
  cpfCnpj: string
  name: string
  email: string
  state: string
  city: string
  address: string
  user: string
}

interface Farmer {
  cpf_cnpj: string
  name: string
  email: string
  state: string
  city: string
  address: string
  is_active: boolean
  last_modified_by: string
  created_at: Date
  updated_at: Date
}

interface CultureInput {
  culture_id: number
  planted_area: number
}

interface CreateFarmProps {
  cpf_cnpj: string
  name: string
  state: string
  city: string
  address: string
  total_area: number
  arable_area: number
  vegetation_area: number
  cultures: CultureInput[]
  user: string
}
