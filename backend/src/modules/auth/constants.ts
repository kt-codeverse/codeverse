export const jwtConstants: { secret: string; expiresIn: string | number } = {
  secret: process.env.JWT_SECRET ?? 'changeme-secret',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
};
