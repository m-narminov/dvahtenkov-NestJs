import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response, Request } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    try {
      const startTime: number = new Date().getTime()
      res.on('finish', () => {
        const endTime: number = new Date().getTime()
        const diff: number = (endTime - startTime) / 1000
        console.log('Request duration: ', diff + 's')
      })

      next()
    } catch (e) {
      res.status(500).end()
    }
  }
}
