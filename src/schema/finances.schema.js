import Joi from "joi";

const financesSchema = data => {
    const schema = Joi.object({
        value: Joi.number().positive().required(),
        description: Joi.string().trim().required()
    });
    return schema.validate(data);
}

export default financesSchema;