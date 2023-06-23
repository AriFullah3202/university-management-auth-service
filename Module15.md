* [for generate bycrypt password](#hash-your-password-using-bcrypt)
* [Hash your Password using Pre Hook Middileware](#hash-your-password-using-pre-hook-middileware)
* [login validation for zod schema](#login-validation-for-log-in-zod-schema)
* [create instance method for better coding](#create-instance-method-for-better-coding)
or
* [create static method for better coding](#creating-static-method-for-better-coding)


## Hash your Password using bcrypt
first download bcrypt
```bash
yarn add bcrypt
yarn add @types/bcrypt

```
for student , faculty and admin use bycrypt passowrod
* user.service.ts
```js
// in user.service.ts
  //hash password 
  import bcrypt from 'bcrypt';

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_round)
  );
```
## Hash your Password using Pre Hook Middileware
#### uporer hash passwort ti 3 jaygay likhte hocche tai , ekta middleware kore korbo
we use hash password in createStudent , createFaculty , createAdmin method 
now we use in middleware 
##### remove the previos code from the user.service.ts

```js
// in user.model.ts

// User.create() / user.save()
userSchema.pre('save', async function (next) {
  // hashing user password
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_round)
  );
  next();
});
```
## login validation for log in zod schema
##### create zod schema validation , controller , route , 
```js
// auth.route.ts

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.logInUser
);
// ekhan the zodschema the jabe then eita success hole controller e jabe
// auth.validation.ts
import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'ID is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});
export const AuthValidation = { loginZodSchema };
// auth.controller.ts
  const logInUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  sendRespose(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: result,
  });
});
// auth.interface.ts
export type ILoginUser = {
  id: string;
  password: string;
};
// auth.service.ts
import bcrypt from 'bcrypt';

const loginUser = async (payload: ILoginUser) => {
  const { id, password } = payload;
  // check the user exits
  const isUserExist = await User.findOne(
    { id },
    { id: 1, password: 1, needPasswordChange: 1 }
  ).lean(); // eta object akare ashbe
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exit');
  }
  // match password
  const isPasswordMatch = await bcrypt.compare(password, isUserExist?.password);
  // not match the password
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
};
export const AuthService = { loginUser };

// user.interface.ts
needsPasswordChange: true | false;

  
//user.model.ts
// needPasswordChange ta hocche jokhon kew jiboner prothom bar login korbe thokon atkabe

  needsPasswordChange: {
      type: Boolean,
      default: true,
    },

```
## create instance method for better coding
#### jemon upone 3ta common functrion thake 
for example in auth.service.ts
isUserEXits , isPasswordMatch

in auth.service.ts
```js
export type ILoginUser = {
  id: string;
  password: string;
};
```
in user.interface.ts
```js
interface IUserMethods {
  isUserExist(id: string): Promise<Partial<IUser>>;
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
}
export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
```
in user.model.ts
```js
userSchema.methods.isUserExist = async function (
  id: string
): Promise<Partial<IUser> | null> {
  const user = await User.findOne(
    { id },
    { id: 1, password: 1, needsPasswordChange: 1 }
  );
  return user;
};
userSchema.methods.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

```
in auth.service.ts
```js
const loginUser = async (payload: ILoginUser) => {
  const { id, password } = payload;
  //creating instance of user
  const user = new User();
  // access to our instance methods
  const isUserExist = await user.isUserExist(id);

  // check the user exits

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exit');
  }
  // not match the password
  if (
    isUserExist.password &&
    !user.isPasswordMatch(password, isUserExist?.password)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
};
export const AuthService = { loginUser };

```
## creating static method for better coding

in auth.service.ts
```js
 // access to our static methods
  const isUserExist = await User.isUserExist(id);

  // check the user exits

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exit');
  }
  // not match the password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
```
in user.interface.ts
```js
/* second approch */
export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'needsPasswordChange'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
```
in user.model.ts
```js
/* this the second approch */
userSchema.statics.isUserExist = async function (
  id: string
): Promise<Pick<
  IUser,
  'id' | 'password' | 'role' | 'needsPasswordChange'
> | null> {
  return await User.findOne(
    { id },
    { id: 1, password: 1, needsPasswordChange: 1 }
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};
```




