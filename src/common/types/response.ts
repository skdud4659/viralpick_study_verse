import {Moment} from 'moment'

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

export type contentBaseType = {
  title: string
  description: string
}
export type imageContentType = contentBaseType & {
  image: number
}
export type videoContentType = contentBaseType & {
  video_id: number
  poster?: number
}
export type articleContentType = {
  cover: number
  title: string
  overview: string
  contents: any[]
}
export type postCreateResponseBody = {
  type: string
  thumbnail: number
  title: string
  city: number
  image_content?: imageContentType | null
  video_content?: videoContentType | null
  article_content?: articleContentType | null
  published_at: Moment
  status: string
}
