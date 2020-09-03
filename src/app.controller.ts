import { Controller, Body, Get, Post, Put, Param, Req } from '@nestjs/common'
import formidable from 'formidable'
import * as fs from 'fs'
import { AppService } from './app.service'
import { User } from './user'
import { CreateUserDto, UpdateUserDto, LoginDto } from './dto'
import { UserContent, usersFile, filesPath } from './utils'

let currentId = 0

fs.readFile(usersFile, 'utf8', (err, data) => {
  if (err) {
    console.log(err)
    return
  }
  const usersContent: UserContent = JSON.parse(data.toString())
  if (usersContent.hasOwnProperty('currentId')) {
    currentId = usersContent.currentId
  } else {
    const newUsersContent = JSON.stringify({
      users: usersContent.users,
      currentId: 1,
    })
    fs.writeFile(usersFile, newUsersContent, err => {
      if (err) {
        console.log(err)
        return
      }
    })
  }
})

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('user')
  async getHello(): Promise<User[]> {
    return await User.findAll()
  }

  @Post('user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await User.add(createUserDto)
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await User.update(updateUserDto)
  }

  @Post('user/login')
  async loginUser(@Body() loginDto: LoginDto): Promise<string> {
    return await User.login(loginDto)
  }

  @Post('file')
  async uploadFile(@Req() req: Request) {}

  @Get('file/:name')
  async downloadFile(@Param('name') name: string) {}
}
