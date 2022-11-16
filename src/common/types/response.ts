export type userCreateResponseBody = {
  user_id: string
  password: string
  name: string
  nickname?: string
  email?: string
}

export type cityCreateResponseBody = {
  name: string
}

export type requestCreateResponseBody = {
  name: string
  email: string
  phone: string
  message: string
  company?: string
}
