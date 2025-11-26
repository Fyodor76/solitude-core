import * as bcrypt from 'bcrypt';

export class UserEntity {
  constructor(
    public login: string,
    public password: string,
    public id?: string,
  ) {}

  async setPassword(plainPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(5);
    this.password = await bcrypt.hash(plainPassword, salt);
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  getPasswordHash(): string {
    return this.password;
  }
}
