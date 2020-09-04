import { Module } from '@nestjs/common'
import { FileController } from './files.controller'
import { FileService } from './files.service'

@Module({
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
