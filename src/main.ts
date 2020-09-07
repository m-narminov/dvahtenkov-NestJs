import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const PORT = 3000
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  await app.listen(PORT)
}
bootstrap()
