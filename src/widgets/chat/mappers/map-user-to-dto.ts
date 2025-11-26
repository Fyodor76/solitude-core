import { UserModel } from 'src/users/infrastructure/orm/user.entity';

export const mapUserToDto = (user: UserModel) => {
  return {
    id: user.id,
    login: user.login,
  };
};
