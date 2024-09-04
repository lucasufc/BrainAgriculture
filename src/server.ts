import Fastify from 'fastify'
import cors from '@fastify/cors'
import { farmerRoutes } from './routes/farmerRoutes'
import { farmRoutes } from './routes/farmRoutes'

const app = Fastify({ logger: true })

const start = async () => {
  await app.register(cors)
  await app.register(farmerRoutes, { prefix: '/farmer' })
  await app.register(farmRoutes, { prefix: '/farm' })

  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
