import { Router } from 'express';
import { AuthDTO } from '../DTOs/auth.dto';
import { Auth } from '../models/auth.model';
import { HTTP_RESPONSES } from '../constants/http-responses.constants';
import { UserInterface } from '../interfaces/user.interface';
import { comparePasswordUtil, hashedPasswordUtil } from '../utils/encrypt.util';

import { UserInfoTokenInterface } from '../interfaces/user-info.token.interface';
import { UserInfoResponseInterface } from '../interfaces/user-info.response.interface';
import { tokenGenerator, tokenVerifier } from '../utils/jwt.util';
import { transport } from '../utils/mailer.util';
import config from '../config';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullname, role } = req.body;
    const authInfo = {
      email,
      password,
      fullname,
      role,
    };

    if (!authInfo.email || !authInfo.password)
      return res.status(HTTP_RESPONSES.BAD_REQUEST.STATUS_CODE).json({
        status: HTTP_RESPONSES.BAD_REQUEST.STATUS,
        error: HTTP_RESPONSES.BAD_REQUEST.TITLE,
        message: HTTP_RESPONSES.BAD_REQUEST.MESSAGE,
      });

    const hashedPassword = hashedPasswordUtil(authInfo.password);

    const newAuthInfo = {
      ...authInfo,
      password: hashedPassword,
    };

    await Auth.create(newAuthInfo);

    await transport.sendMail({
      from: config.mail.user,
      to: authInfo.email,
      subject: `Hola ${authInfo.fullname}! Ahora eres parte de Kostumes Store y eso es genial`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f9f9f9;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: auto;
                  background: #ffffff;
                  padding: 30px;
                  border-radius: 5px;
                  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
              }
              h1 {
                  color: #333333;
              }
              p {
                  color: #555555;
                  line-height: 1.5;
              }
              .button {
                  background-color: #007BFF;
                  color: #ffffff;
                  padding: 15px 25px;
                  text-align: center;
                  text-decoration: none;
                  display: inline-block;
                  font-size: 16px;
                  margin: 20px 0;
                  cursor: pointer;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
        <div class="container">
          <h1>Este es Kostumes Store</h1>
          <p>${
            authInfo.fullname.split(' ')[0]
          } Nos encanta que estés acá y ahora puedes encontrar el disfraz que siempre has soñado. Pasa y mira todo lo que tenemos para ti y disfruta en grande siendo quien siempre soñaste ser.</p>
          <a href="https://www.kostumes.store" class="button">Ir a la tienda</a>
        </div>
      </body>
    </html>
      `,
    });

    res.json({ message: 'Auth created' });
  } catch (error) {
    res.json({ error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const authInfo = new AuthDTO(req.body);
    if (!authInfo.email || !authInfo.password)
      return res.status(HTTP_RESPONSES.BAD_REQUEST.STATUS_CODE).json({
        status: HTTP_RESPONSES.BAD_REQUEST.STATUS,
        error: HTTP_RESPONSES.BAD_REQUEST.TITLE,
        message: HTTP_RESPONSES.BAD_REQUEST.MESSAGE,
      });

    const user: UserInterface | null = await Auth.findOne({
      email: authInfo.email,
    });

    if (!user)
      return res.status(HTTP_RESPONSES.BAD_REQUEST_AUTH.STATUS_CODE).json({
        status: HTTP_RESPONSES.BAD_REQUEST_AUTH.STATUS,
        error: HTTP_RESPONSES.BAD_REQUEST_AUTH.TITLE,
        message: HTTP_RESPONSES.BAD_REQUEST_AUTH.MESSAGE,
      });

    if (!comparePasswordUtil(authInfo.password, user.password))
      return res.status(HTTP_RESPONSES.BAD_REQUEST_AUTH.STATUS_CODE).json({
        status: HTTP_RESPONSES.BAD_REQUEST_AUTH.STATUS,
        error: HTTP_RESPONSES.BAD_REQUEST_AUTH.TITLE,
        message: HTTP_RESPONSES.BAD_REQUEST_AUTH.MESSAGE,
      });

    const userInfoResponse: UserInfoResponseInterface = {
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    };

    const userInfoToken: UserInfoTokenInterface = {
      email: user.email,
      role: user.role,
    };
    const token = tokenGenerator(userInfoToken);

    res.json({ status: 'success', message: userInfoResponse, token });
  } catch (error) {
    res.json({ error });
  }
});

router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    const tokenVerify = tokenVerifier(token);

    res.json({ message: tokenVerify });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
