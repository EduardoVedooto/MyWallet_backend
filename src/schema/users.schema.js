import Joi from "joi";

const usersSchema = data => {
  const schema = Joi.object({
    name: Joi.string().trim().max(40).pattern(/^[A-Za-zÀ-úç'\s]+$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6),
    confirmPassword: Joi.string().valid(Joi.ref('password')).label("Passwords don't match")
  });
  return schema.validate(data);
}

export default usersSchema;