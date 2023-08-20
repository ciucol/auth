import jwt from 'jsonwebtoken';
import { UserInfoTokenInterface } from '../interfaces/user-info.token.interface';
import config from '../config';

export const tokenGenerator = (userInfo: UserInfoTokenInterface) => {
  return jwt.sign(userInfo, config.token.secret);
};

export const tokenVerifier = (token: string) => {
  return jwt.verify(token, config.token.secret);
};
