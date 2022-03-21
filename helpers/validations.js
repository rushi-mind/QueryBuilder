const Joi = require('joi');

const validateCreateTableInput = async (obj) => {
    let result = {};

    const validDataTypes = [
        'CHAR',
        'VARCHAR',
        'BINARY',
        'TEXT',
        'LONGTEXT',
        'ENUM',
        'BLOB',
        'BOOLEAN',
        'INT',
        'BIGINT',
        'FLOAT',
        'DOUBLE',
        'DATE',
        'DATETIME',
        'TIMESTAMP',
        'TIME',
        'YEAR',
        'DECIMAL',
        'TINYINT',
        'LONGBLOB'
    ];

    const schema = Joi.object({
        tableName: Joi.string().required(),
        tableCode: Joi.number().integer().required(),
        columns: Joi.array().min(1).items(Joi.object({
            name: Joi.string().required(),
            type: Joi.string().valid(...validDataTypes).required(),
            defaultValue: Joi.any(),
            allowNull: Joi.boolean(),
            length: Joi.number().integer(),
            values: Joi.array().min(1).items(Joi.string())
        })).required(),
        constraints: Joi.array().items(Joi.object({
            name: Joi.string(),
            type: Joi.string().valid('unique', 'primaryKey', 'foreignKey').required(),
            fields: Joi.array(),
            columnName: Joi.string(),
            references: Joi.object({
                tableName: Joi.string().required(),
                columnName: Joi.string().required()
            })
        }).unknown(true))
    });
    let isValid = true;
    try {
        isValid = await schema.validateAsync(obj);
        result.isValid = true;
    } catch (error) {
        isValid = false;
        result.isValid = false;
        result.error = error.details[0]['message'];
    }
    return result;
};

module.exports = {
    validateCreateTableInput
}