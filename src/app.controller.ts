import { Controller } from '@nestjs/common'
import * as fs from 'fs'

import { AppService } from './app.service'
import { UserContent, usersFile } from './utils'

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
}
