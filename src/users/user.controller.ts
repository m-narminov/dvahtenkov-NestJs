import {
  Body,
  Get,
  Post,
  Put,
  Param,
  Controller,
  UseGuards,
} from '@nestjs/common'

import { CreateUserDto, LoginDto, UpdateUserDto } from '../dto'
import { UserService } from './user.service'
import { IUser } from '../interfaces'
import { AuthGuard } from 'src/middlewares/auth.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getHello(): Promise<IUser[]> {
    return await this.userService.findAll()
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await this.userService.add(createUserDto)
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(updateUserDto)
  }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto): Promise<string> {
    return await this.userService.login(loginDto)
  }
}
