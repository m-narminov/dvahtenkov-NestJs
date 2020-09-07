import { Injectable } from '@nestjs/common'

import { CreateUserDto, UpdateUserDto } from '../dto'
import { IUser } from '../interfaces'
import {
  getFileContent,
  setFileContent,
  EmailPassword,
  UserContent,
  usersFile,
  createPassword,
  createToken,
  validateUser,
  expirationTime,
} from '../utils'

@Injectable()
export class UserService {
  async add(user: CreateUserDto) {
    const { name, email, password, enabled } = user
    validateUser(user)
    const generatedPassword = createPassword(password)
    const usersContent: UserContent = await getFileContent(usersFile)
    const users: IUser[] = usersContent.users
    const newCurrentId = usersContent.currentId + 1
    const token = createToken({ data: newCurrentId }, generatedPassword, {
      expiresIn: expirationTime,
    })
    const newUser = {
      id: newCurrentId,
      name,
      email,
      password: generatedPassword,
      enabled,
      token,
    }
    const currentUser: IUser = users.find(usr => usr.email === newUser.email)

    if (currentUser) throw new Error('User already exist')

    const newContent: UserContent = {
      users: [...usersContent.users, newUser],
      currentId: newCurrentId,
    }
    setFileContent(usersFile, newContent)
    return newUser
  }

  async findById(id: number) {
    const usersContent: UserContent = await getFileContent(usersFile)
    const foundUser = usersContent.users.find(
      (usr: { id: number }) => usr.id === id,
    )
    return foundUser
  }

  async findByToken(userToken: string) {
    const usersContent: UserContent = await getFileContent(usersFile)
    const users = usersContent.users
    const foundUser = users.find((user: IUser) => user.token === userToken)
    return foundUser
  }

  async findAll() {
    const usersContent: UserContent = await getFileContent(usersFile)
    const users = usersContent.users
    return users
  }

  async update(user: UpdateUserDto, id: number) {
    if (id === undefined) throw new Error('User has no id')
    const password = createPassword(user.password)
    const usersContent = await getFileContent(usersFile)
    const currentUsers: IUser[] = usersContent.users
    const oldUser = currentUsers.find(user => user.id === +id)
    if (!oldUser) throw new Error('User not found')
    const updatedUser = {
      id: +id,
      ...user,
      password,
      token: oldUser.token,
    }
    const newUsers = currentUsers.filter(user => +user.id !== +updatedUser.id)
    const newUsersContent = {
      ...usersContent,
      users: [...newUsers, updatedUser],
    }

    setFileContent(usersFile, newUsersContent)
    return updatedUser
  }

  async login(emailPassword: EmailPassword) {
    const { email, password } = emailPassword
    const passwordHash = createPassword(password)

    const token = await this.updateToken(email, passwordHash)
    return token
  }

  async updateToken(email: string, password: string) {
    const usersContent: UserContent = await getFileContent(usersFile)
    const currentUsers: IUser[] = usersContent.users

    const foundUser = currentUsers.find(
      (usr: { email: string; password: string }) =>
        usr.email === email && usr.password === password,
    )
    if (!foundUser) throw new Error('User not found')

    const token: string = createToken({ data: foundUser.id }, password, {
      expiresIn: expirationTime,
    })
    const userNewToken = {
      ...foundUser,
      token,
    }

    const newUsers = currentUsers.filter(user => +user.id !== +userNewToken.id)
    const newUsersContent = {
      ...usersContent,
      users: [...newUsers, userNewToken],
    }
    setFileContent(usersFile, newUsersContent)
    return token
  }
}
