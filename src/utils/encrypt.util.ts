import bcrypt from 'bcrypt';

export const hashedPasswordUtil = (password: string) => {
  const salt: number = 10;
  return bcrypt.hashSync(password, salt);
};

export const comparePasswordUtil = (
  userPassword: string,
  userPasswordHashed: string,
) => {
  return bcrypt.compareSync(userPassword, userPasswordHashed);
};
