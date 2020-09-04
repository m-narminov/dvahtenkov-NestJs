import { Body, Get, Post, Put, Param, Controller } from '@nestjs/common'

import { CreateUserDto, LoginDto } from '../dto'
import { UserService } from './user.service'

@Controller()
export class UserController {
  @Get('user')
  async getHello(): Promise<UserService[]> {
    return await UserService.findAll()
  }

  @Post('user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserService> {
    return await UserService.add(createUserDto)
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UserService,
  ) {
    return await UserService.update(updateUserDto)
  }

  @Post('user/login')
  async loginUser(@Body() loginDto: LoginDto): Promise<string> {
    return await UserService.login(loginDto)
  }
}
