import config from '../../../config/index'
import ApiError from '../../../error/ApiError'
import { logger } from '../../../shared/logger'
import { IUser } from './user.interface'
import { User } from './user.modal'
import { generateUserId } from './user.util'

const createUser = async (user: IUser): Promise<IUser | null> => {
  // auto generated incremental id
  const id = await generateUserId()
  user.id = id
  logger.info('hello from service')

  // default password
  if (!user.password) {
    user.password = config.defaultPassword as string
  }

  const createdUser = User.create(user)

  if (!createUser) {
    throw new ApiError(404, `Failed new create user`)
  }
  return createdUser
}
export default { createUser }
