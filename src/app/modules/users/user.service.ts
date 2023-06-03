import config from '../../../config/index'
import { IUser } from './user.interface'
import { User } from './user.modal'
import { generateUserId } from './user.util'

const createUser = async (user: IUser): Promise<IUser | null> => {
  // auto generated incremental id
  const id = await generateUserId()
  user.id = id

  // default password
  if (!user.password) {
    user.password = config.defaultPassword as string
  }

  const createdUser = User.create(user)

  if (!createUser) {
    throw new Error(`Failed new create user`)
  }
  return createdUser
}
export default { createUser }
