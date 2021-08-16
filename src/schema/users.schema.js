import Joi from 'joi';

const usersSchema = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(40).pattern(/^[A-Za-zÀ-úç'\s]+$/)
      .required()
      .label('Nome inválido'),
    email: Joi.string().email().required().label('E-mail inválido'),
    password: Joi.string().min(6).label('Senha inválida'),
    confirmPassword: Joi.string().valid(Joi.ref('password')).label('As senhas não são iguais'),
  });
  return schema.validate(data);
};

export default usersSchema;
