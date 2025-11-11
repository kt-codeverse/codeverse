import * as Joi from 'joi';

export const validation: Joi.Schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  SERVER_PORT: Joi.number().default(3000),
}).options({
  abortEarly: true,
});
