* [for generate bycrypt password](#hash-your-password-using-bcrypt)
* [Hash your Password using Pre Hook Middileware](#hash-your-password-using-pre-hook-middileware)
* [login validation for zod schema](#login-validation-for-log-in-zod-schema)
* [create instance method for better coding](#create-instance-method-for-better-coding)
or
* [create static method for better coding](#creating-static-method-for-better-coding)
* [creating Access token and refress token](#creating-access-token-and-refresh-token)
* [set refresh token into cookie](#set-refresh-token-into-cookie)
* [Change Password and Forgot Password](#change-password)

## Hash your Password using bcrypt
## download jwt
first download bcrypt
```bash
yarn add bcrypt
yarn add @types/bcrypt
yarn add jsonwebtoken @types/jsonwebtoken
yarn add cookie-parser @types/cookie-parser
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
## creating Access token and Refresh token
Access token hocche one time token
refresh token hocche parmenent token
Access token short time er jonno 
and refresh token hocche long time er jonno
jokhon login korbo thokon ekta access token and refresh token diya hbe
Access token time kom thakbe , and refresh token er time beshi hbe 
Access token er madhome amra private resourse access korte parbo
Access token er time kichu somoy por chole jabe 
tokon refresh token er madhome new access token create kora hbe for example :  /refresh 
* [download jwt for node](#download-jwt)
in env 
```js
JWT_SECRET = 'very secret'
JWT_EXPIRES = 1d
JWT_REFRESH_SECRET = 'very-refresh-secret'
JWT_rEFRESH_EXPIRES = 365d

```
in cofig import this
```js
  bycrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_rEFRESH_EXPIRES,
  },
``` 
create a jwt helper 
* helper
  * jwtHelper.ts
```js
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });p-
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
```
call the jwt helper 
```js

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;
  const isUserExist = await User.isUserExist(id);
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
  //create access token & refresh token

  const { id: userId, role, needsPasswordChange } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  // return the accestoken , refreshToken ,
  // needspasswordChange into the controller
  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};
// use the interface
// auth.interface.ts
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken: string;
  needsPasswordChange: boolean;
};

```
accesToken ekta short time e expire hoye jabe
er jonne refreshToken er help nite hbe
er jonne jokhon /login click hbe thokon refresh token ekta server e cookie te save korte hbe
refresh token browser er storage e save korte hbe
## set refresh token into cookie
ei porjonto amra amader server k secure korte pari ni
because amra refresh token k client side patacchi
simple vabe bolte gele
accesstoken ta sudhu matro resource access korte lagbe and refresh token
refrshToken ta notun accesstoken anar jonno or create korar jonno kaje lage
refresh token client side er cookie te store korbo
#### in auth.controller.ts
#### ekhane cokie save hbe porthi request e cookies ta pabo . eita test korte je kono controller e 
req.cookies likhte hbe
```js
const logInUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  const cookiesOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refeshToken', refreshToken, cookiesOptions);

  sendRespose<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: others,
  });
});

```
* [now dowload the cookies parser](#download-jwt)
in app.ts
```js
// cookies parser
app.use(cookieParser());
```
now any contorller see the refresh token from any controller 
so , to see use 
amra upre cookies er moddhe refresh token save korlam . 
because refesh token we can not send to client every request . we only send access token
jokhon kono request patabo browser automatic cokes er maddhome refresh token patabe .
```js
  console.log(req.cookies, 'cooookies');
```
## now create a refresh token handler

in auth.route.ts
```js
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);
```
route theke validation e jabe
in auth.validation.ts
```js
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});
```
uporer validation true hole controller e jabe
in auth.controller.ts
```js
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendRespose<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User lohggedin successfully !',
    data: result,
  });
});
```
controller theke service e jabe
in auth.service.ts e jabe
```js
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  // tumi delete hye gso  kintu tumar refresh token ase
  // checking deleted user's refresh token

  const isUserExist = await User.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};
```
ekhan theke jwtHelper.ts e file e jabe
```js
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
```

## authentication and authorization auth middleware
Authentication mane hocche ==> user verify kina check kora
Authorization mane hocche ===> kake kon resouce e access diya hbe for example : 
      kono route ki admin access pabe naki faculty access pabe check kora

Auth middleware ===> ekta auth middleware banabo ... jaita check korbe kon role?
create a enum for role 
* enum
  * user.js
```js
/* eslint-disable no-unused-vars */
export enum ENUM_USER_ROLE {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STUDENT = 'student',
  FACULTY = 'faculty',
}

```
route er moddhe evabe likhte hbe
for example 
```js
const router = express.Router();

router.post(
  '/create-faculty',
  validateRequest(AcademicFacultyValidation.createFacultyZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicFacultyController.createFaculty
);

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.STUDENT
  ),
  AcademicFacultyController.getSingleFaculty
);

router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.updatefacultyZodSchema),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  AcademicFacultyController.updateFaculty
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicFacultyController.deleteFaculty
);

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  AcademicFacultyController.getAllFaculties
);

export const AcademicFacultyRoutes = router;

```
upore auth middleware banate hbe 
auth.ts e call dite hbe
for example :
```js
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../error/ApiError';
import { jwtHelpers } from '../../helper/jwtHelpers';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      //interface folder er moddhe index.d.ts file e
      req.user = verifiedUser; // role , userid

      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
```
ekhane 591 number line error ache 
reqest er moddhe user ta nai .  javascript e requsest e moddhe user thake na 
eijonno ekta file korte hbe request er moddhe user k append korbo

অবশ্যই ফোল্ডার ক্রিয়েট করতে হবে 
* src
  * types 
    * express
      * index.d.ts

```js
import { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user: JwtPayload | null;
    }
  }
}
```

 in tsconfig.json
```js
"typeRoots" : ["./src/types", "./node_modules/@types"],
```
## Change Password

### রাউট , কনট্রোলার ,ভ্যলিডেশন , সার্ভিস , পরিবর্তন করতে হবে 
```js
// auth.route.ts

router.post(
  '/change-password',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.changePassword
);
// auth.validation.ts
const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    NewPassword: z.string({
      required_error: 'New Password is required',
    }),
  }),
});
// auth.controller.ts
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;
  const user = req.user;

  const result = await AuthService.loginUser(passwordData, user);

  sendRespose<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User lohggedin successfully !',
    data: result,
  });
});
//auth.interface.ts
export type IchangePassword = {
  newPassword: string;
  oldPassword: string;
};
// auth.service.ts
const changePassword = async (
  payload: IchangePassword,
  user: JwtPayload | null | undefined
): Promise<void> => {
  const { oldPassword, newPassword } = payload;
  // checking user exits
  const isUserExist = User.isUserExist(user?.userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exit');
  }

  // checking old password
  if (
    (await isUserExist).password &&
    !(await User.isPasswordMatched(oldPassword, (await isUserExist).password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //hash passwod before saving
  // হেশ পাসওয়ার্ড দুইটা আগুমেন্ট নিবে । কাকে হ্যাশ করতে চাই এবং হ্যাশটা কতটা নাম্বারের হবে /
  const newHashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_round)
  );
  const query = { id: user?.userId };
  //updated data
  const updatedData = {
    password: newHashPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  };
  // now update the password to the database
  await User.findOneAndUpdate(query, updatedData);
};

//user.model.ts
const userSchema = new Schema<IUser, Record<string, never>>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);



```

