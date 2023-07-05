export type ILoginUser = {
  id: string;
  password: string;
};
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  needsPasswordChange: boolean;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
export type IchangePassword = {
  newPassword: string;
  oldPassword: string;
};
