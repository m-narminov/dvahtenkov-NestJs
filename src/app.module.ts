import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User } from './user'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, User],
})
export class AppModule {}
