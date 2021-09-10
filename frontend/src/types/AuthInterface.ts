export interface IUserInfo {
  id: string;
  name: string;
  email: string;
  isAdmin: true;
  token: string;
  createdAt: string;
}

export interface ITokenPayload {
  id: string;
  exp: number;
  iat: number;
}
