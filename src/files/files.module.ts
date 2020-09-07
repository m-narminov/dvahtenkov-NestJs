import { Module } from '@nestjs/common'
import { FileController } from './files.controller'
import { FileService } from './files.service'

@Module({
  imports: [FileService, FileController],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService, FileController],
})
export class FileModule {}
