import * as Joi from 'joi';

export const validation: Joi.Schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(8080),
}).options({
  abortEarly: true,
});
