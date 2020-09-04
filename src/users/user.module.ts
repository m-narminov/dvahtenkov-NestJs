import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [UserController, UserService],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserController],
})
export class UserModule {}
