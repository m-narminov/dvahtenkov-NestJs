import { Module } from '@nestjs/common'
import { FileController } from './files.controller'

@Module({
  providers: [],
  controllers: [FileController],
})
export class FileModule {}
