import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './users/user.module'
import { FileModule } from './files/files.module'
import { LoggerMiddleware } from './middlewares/logger.middleware'

@Module({
  imports: [UserModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('')
  }
}
