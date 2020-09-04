import { Module } from '@nestjs/common'
import { UserModule } from 'src/users/user.module'
import { MiddlewareService } from './service'

@Module({
  imports: [UserModule],
  providers: [MiddlewareService],
})
export class MiddlewaresModule {}
