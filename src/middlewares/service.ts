import { Injectable } from '@nestjs/common'
import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UserService } from '../users/user.service'
import { expirationTime } from '../utils'
import { IUser } from 'src/interfaces'

@Injectable()
export class MiddlewareService {
  checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      if (token) {
        const currentUser: IUser = await UserService.findByToken(
          token.replace('Bearer', '').trim(),
        )
        if (!currentUser) {
          throw new Error('User not found')
        }

        jwt.verify(
          currentUser.token,
          currentUser.password,
          {
            maxAge: expirationTime,
          },
          (err: Error) => {
            if (err) {
              console.error(err)
              res
                .status(403)
                .send('Not authorized')
                .end()
              return
            }
          },
        )
        next()
      } else {
        throw new Error('Token not provided')
      }
    } catch (e) {
      console.error(e)
      res.status(500).send(e)
    }
  }

  differenceInSeconds = (req: Request, res: Response, next: NextFunction) => {
    try {
      const startTime: number = new Date().getTime()
      res.on('finish', () => {
        const endTime: number = new Date().getTime()
        const diff: number = (endTime - startTime) / 1000
        console.log('request duration: ', diff + 's')
      })

      next()
    } catch (e) {
      res.status(500).end()
    }
  }
}
