import * as Joi from 'joi';

export const validation: Joi.Schema = Joi.object({
  // NODE_ENV: Joi.string().valid('development', 'production').required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  // PORT: Joi.number().required(),
  PORT: Joi.number().default(8080),
}).options({
  abortEarly: true,
});
