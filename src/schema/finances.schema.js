import Joi from 'joi';

const financesSchema = (data) => {
  const schema = Joi.object({
    value: Joi.number().positive().required().label('Valor inválido'),
    description: Joi.string().trim().required().label('Descrição inválida'),
  });
  return schema.validate(data);
};

export default financesSchema;
