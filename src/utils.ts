import fs from 'fs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

// import { User } from './users'
import { ValidateUserDto } from './dto'
import { IUser } from './interfaces'

export const usersFile = 'assets/users.json'
export const filesPath = 'uploads/'
export const expirationTime = '4h' // must be 4h

export interface UserContent {
  users: IUser[]
  currentId: number
}
export interface EmailPassword {
  email: string
  password: string
}

export const getFileContent = async (fileName: string) => {
  const usersContent = await fs.promises.readFile(fileName, {
    encoding: 'utf8',
  })
  const result: UserContent = JSON.parse(usersContent)
  return result
}

export const setFileContent = (
  fileName: string,
  content: UserContent,
): void => {
  fs.writeFile(fileName, JSON.stringify(content, null, 2), err => {
    if (err) throw err
  })
}

export const createPassword = (passwordStr: string): string =>
  crypto
    .createHash('md5')
    .update(passwordStr)
    .digest('hex')

export const createToken = (
  payload: Record<string, unknown>,
  secret: jwt.Secret,
  options?: jwt.SignOptions | undefined,
): string => jwt.sign(payload, secret, options)

export const validateUser = (user: ValidateUserDto): boolean | void => {
  if (!user.name) throw new Error('Name is required')
  if (!user.email) throw new Error('Email is required')
  if (!user.password) throw new Error('Password is required')
  return true
}
