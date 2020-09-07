import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  // imports: [UserController, UserService],
  controllers: [UserController],
  providers: [UserService],
  // exports: [UserController, UserService],
})
export class UserModule {}
