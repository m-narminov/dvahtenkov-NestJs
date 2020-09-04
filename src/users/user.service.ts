import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../dto'

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
  id: number
  name: string
  email: string
  password: string
  enabled: boolean
  token: string

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    enabled = true,
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.password = createPassword(password)
    this.enabled = enabled
    this.token = createToken({ data: id }, this.password, {
      expiresIn: expirationTime,
    })
  }

  static async add(user: CreateUserDto) {
    const { name, email, password, enabled } = user
    validateUser(user)

    const usersContent: UserContent = await getFileContent(usersFile)
    const users = usersContent.users
    const newCurrentId = usersContent.currentId + 1
    const newUser = new UserService(
      newCurrentId,
      name,
      email,
      password,
      enabled,
    )
    const currentUser = users.find(usr => usr.email === newUser.email)

    if (currentUser) throw new Error('User already exist')

    const newContent: UserContent = {
      users: [...usersContent.users, newUser],
      currentId: newCurrentId,
    }
    setFileContent(usersFile, newContent)
    return newUser
  }

  static async findById(id: number) {
    const usersContent: UserContent = await getFileContent(usersFile)
    const foundUser = usersContent.users.find(
      (usr: { id: number }) => usr.id === id,
    )
    return foundUser
  }

  static async findByToken(userToken: string) {
    const usersContent: UserContent = await getFileContent(usersFile)
    const users = usersContent.users
    const foundUser = users.find(
      (user: UserService) => user.token === userToken,
    )
    return foundUser
  }

  static async findAll() {
    const usersContent: UserContent = await getFileContent(usersFile)
    const users = usersContent.users
    return users
  }

  static async update(user: UserService) {
    if (user.id === undefined) throw new Error('User has no id')
    const updatedUser = user
    const usersContent = await getFileContent(usersFile)
    const currentUsers = usersContent.users
    const newUsers = currentUsers.filter(user => user.id !== updatedUser.id)
    const newUsersContent = {
      ...usersContent,
      users: [...newUsers, updatedUser],
    }

    setFileContent(usersFile, newUsersContent)
  }

  static async login(emailPassword: EmailPassword) {
    const { email, password } = emailPassword

    const passwordHash = createPassword(password)
    const usersContent: UserContent = await getFileContent(usersFile)

    const foundUser = usersContent.users.find(
      (usr: { email: string; password: string }) =>
        usr.email === email && usr.password === passwordHash,
    )
    if (!foundUser) throw new Error('User not found')

    const token: string = createToken({ data: foundUser.id }, passwordHash, {
      expiresIn: expirationTime,
    })

    await this.update({ ...foundUser, token })
    return token
  }
}
