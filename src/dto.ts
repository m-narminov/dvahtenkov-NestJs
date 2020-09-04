export class CreateUserDto {
  name: string
  email: string
  password: string
  enabled: boolean
}

export class UpdateUserDto {
  id: number
  name: string
  email: string
  password: string
  enabled: boolean
  token: string
}

export class ValidateUserDto {
  name: string
  email: string
  password: string
}

export class LoginDto {
  email: string
  password: string
}
