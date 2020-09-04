import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './users/user.module'
import { FileModule } from './files/files.module'
import { UserController } from './users/user.controller'
import { FileController } from './files/files.controller'

@Module({
  imports: [UserModule, FileModule],
  controllers: [AppController, UserController, FileController],
  providers: [AppService],
})
export class AppModule {}
