import {
  Controller,
  Param,
  Res,
  Req,
  Post,
  Get,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import * as formidable from 'formidable'
import * as fs from 'fs'

import { filesPath, extensionRegex } from '../utils'
import { AuthGuard } from '../middlewares/auth.guard'

@Controller('file')
export class FileController {
  @Post()
  @UseGuards(AuthGuard)
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

      const keyOfFile = Object.keys(files)[0]
      let fileName = files[keyOfFile].name
      const uploadFilePath = files[keyOfFile].path
      const uploadFileName = files[keyOfFile].name
      const uploadFileExtensionIndex = uploadFileName.search(extensionRegex)
      const uploadFileExtension = uploadFileName.slice(uploadFileExtensionIndex)
      const base64FileName = Buffer.from(uploadFileName, 'utf-8').toString(
        'base64',
      )
      if (!fileName || fileName.trim() === '') {
        fileName = `${new Date()}`
      }
      const rawData = fs.readFileSync(uploadFilePath)
      fs.writeFile(
        `${filesPath}${base64FileName}.${uploadFileExtension}`,
        rawData,
        err => {
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
        },
      )
    })
  }

  @Get(':name')
  @UseGuards(AuthGuard)
  async downloadFile(@Param('name') name: string, @Res() res: Response) {
    if (name.trim() === '') {
      return res.status(HttpStatus.NOT_FOUND)
    }

    const fileExtensionIndex = name.search(extensionRegex)
    const fileExtension = name.slice(fileExtensionIndex)

    const base64FileName = Buffer.from(name, 'utf-8').toString('base64')
    res.download(`${filesPath}${base64FileName}.${fileExtension}`, err => {
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
