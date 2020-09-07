import { Module, Global } from '@nestjs/common'
import { LoggerMiddleware } from './logger.middleware'
import { AuthGuard } from './auth.guard'
import { UserModule } from '../users/user.module'

@Global()
@Module({
  imports: [UserModule],
  providers: [LoggerMiddleware, AuthGuard],
  exports: [LoggerMiddleware, AuthGuard],
})
export class MiddlewaresModule {}
