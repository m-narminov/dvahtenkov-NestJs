import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './users/user.module'
import { FileModule } from './files/files.module'

@Module({
  imports: [UserModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
