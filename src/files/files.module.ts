import { Module } from '@nestjs/common'
import { FileController } from './files.controller'
import { FileService } from './files.service'
import { UserModule } from '../users/user.module'

@Module({
  imports: [UserModule],
  controllers: [FileController],
})
export class FileModule {}
