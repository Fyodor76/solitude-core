import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class UserEntity {
  private _password: string;

  constructor(
    public readonly id: string,
    public login: string,
    passwordHash: string,
  ) {
    this._password = passwordHash;
    this.validate();
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this._password);
  }

  getPasswordHash(): string {
    return this._password;
  }

  private validate(): void {
    if (!this.login?.trim()) {
      throw new Error('Login is required');
    }
    if (this.login.length < 3) {
      throw new Error('Login must be at least 3 characters');
    }
  }

  static async create(
    login: string,
    plainPassword: string,
  ): Promise<UserEntity> {
    if (!plainPassword || plainPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    return new UserEntity(uuidv4(), login, passwordHash);
  }
}
