import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

import { UserService } from '../users/user.service'
import { IUser } from '../interfaces/index'
import { expirationTime } from '../utils'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest()
      const token = req.headers.authorization
      if (token) {
        const currentUser: IUser = await this.userService.findByToken(
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
              return false
            }
          },
        )
        return true
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
