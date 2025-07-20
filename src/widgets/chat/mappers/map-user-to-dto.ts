import { User } from 'src/users/user.entity';

export const mapUserToDto = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
  };
};
