export const APIResult = (data: any) => {
  return {
    success: true,
    data
  }
}

export class APIError extends Error {
  public code: number
  public status: number = 200

  constructor(code: number, message: string) {
    super(message)
    Object.setPrototypeOf(this, APIError.prototype)
    this.code = code
  }
}
