import * as crypto from 'crypto'

const salt = 'verse'
export const passwordHash = (password: string) => {
  return crypto
    .createHash('sha512')
    .update(password + salt)
    .digest('base64')
}
