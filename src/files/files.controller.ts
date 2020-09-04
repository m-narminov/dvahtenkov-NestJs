import {
  Controller,
  Param,
  Res,
  Req,
  Post,
  Get,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import formidable from 'formidable'
import fs from 'fs'

import { filesPath } from '../utils'

@Controller('file')
export class FileController {
  @Post()
  async uploadFile(@Req() req: Request, @Res() res: Response) {
    const form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files): void => {
      if (err) {
        console.error(err)
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send(err)
          .end()
        return
      }

      let fileName = files.file.name
      const uploadFilePath = files.file.path
      const uploadFileName = files.file.name
      const base64FileName = Buffer.from(uploadFileName, 'utf-8').toString(
        'base64',
      )
      if (!fileName || fileName.trim() === '') {
        fileName = `${new Date()}`
      }
      const rawData = fs.readFileSync(uploadFilePath)
      fs.writeFile(`${filesPath}${base64FileName}`, rawData, err => {
        if (err) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send('upload error')
            .end()
          return
        }

        res
          .status(200)
          .send(`File ${fileName} uploaded`)
          .end()
      })
    })
  }

  @Get(':name')
  async downloadFile(@Param('name') name: string, @Res() res: Response) {
    if (name.trim() === '') {
      return res.status(HttpStatus.NOT_FOUND)
    }
    const base64FileName = Buffer.from(name, 'utf-8').toString('base64')
    res.download(`${filesPath}${base64FileName}`, err => {
      if (err) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Err while download file')
          .end()
        return
      }
    })
  }
}
