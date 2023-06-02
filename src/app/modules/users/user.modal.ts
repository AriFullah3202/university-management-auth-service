import { Model, Schema, model } from 'mongoose'
import { IUser } from './user.interface'

// Create a new Model type that knows about IUserMethods .
// eita staic method use korle dite hoy
type UserModel = Model<IUser, object>

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export const User = model<IUser, UserModel>('User', userSchema)
