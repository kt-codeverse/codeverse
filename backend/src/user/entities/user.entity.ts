export class UserEntity {
  id: string;
  email: string;
  name?: string;
  password: string;
  avatar?: string;
  role?: string;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt ?? new Date();
    this.updatedAt = this.updatedAt ?? new Date();
  }
}
