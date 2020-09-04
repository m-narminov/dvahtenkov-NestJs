import { Module } from '@nestjs/common'
import { MiddlewareService } from './service'
import { UserModule } from 'src/users/user.module'

@Module({
  imports: [UserModule],
  providers: [MiddlewareService],
  exports: [MiddlewareService],
})
export class MiddlewaresModule {}
