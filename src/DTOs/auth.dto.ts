import { AuthInfo } from '../interfaces/auth-info.interface';

export class AuthDTO implements AuthInfo {
  email: string;
  password: string;
  constructor(authInfo: AuthInfo) {
    this.email = authInfo.email;
    this.password = authInfo.password;
  }
}
