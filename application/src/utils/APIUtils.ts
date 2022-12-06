import {APIError} from '../routes/api/APIResult'

export const numberOrThrow = (value?: any) => {
  if (typeof value !== 'number' || isNaN((value))) {
    throw new APIError(500, 'argument is not a number')
  } else {
    return value
  }
}
