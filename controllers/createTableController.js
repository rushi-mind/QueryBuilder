const db = require('../config/db');
const responses = require('./responses');
const { validateCreateTableInput } = require('../helpers/validations');

module.exports = (async (req, res) => {
    let input = req.body;
    let response = {}; 

    let validationResult = await validateCreateTableInput(input);
    if(! validationResult.isValid) return responses.validationErrorResponseData(res, validationResult.error, 400);

    let query = [];
    let { tableName, tableCode, columns, constraints } = input;
    query.push(`CREATE TABLE`);
    query.push(`${tableName} (\n`);

    let isSuccess = true;
    try {
        let temps = [];
        columns.forEach(current => {
            current.type = current.type.toUpperCase();
            let col = `\t${current.name} ${current.type}`;
            if(current.type === 'ENUM') {
                if(!current.values) throw 'ENUM VALUES NOT FOUND';
                current.values = current.values.map(temp => {
                    return `'${temp}'`;
                });
                col += `(${current.values.join(', ')})`;
            }
            else if(current.type === 'VARCHAR') {
                if(!current.length) throw 'LENGTH NOT FOUND FOR VARCHAR';
                current.length ? col += `(${current.length})` : ``;
            }
            else current.length ? col += `(${current.length})` : ``;
            current.allowNull === false ? col += ` NOT NULL` : ``;
            current.defaultValue ? col += ` DEFAULT '${current.defaultValue}'` : ``;
            temps.push(col);
        });
        if(constraints && constraints.length) {
            constraints.forEach(current => {
                let line = `\t`;
                if(current.type === 'unique') {
                    if(!current.fields || !current.fields.length) throw 'FIELDS NOT FOUND FOR UNIQUE CONSTRAINT';
                    if(current.fields.length === 1) line += `UNIQUE (${current.fields[0]})`;
                    else {
                        if(!current.name) throw "CONSTRAINT'S NAME NOT FOUND";
                        line += `CONSTRAINT ${current.name} UNIQUE (${current.fields.join(', ')})`;
                    }
                }
                else if(current.type === 'primaryKey') {
                    if(!current.fields || !current.fields.length) throw 'FIELDS NOT FOUND FOR PRIMARY KEY';
                    line += `PRIMARY KEY (${current.fields.join(', ')})`;
                }
                else if(current.type === 'foreignKey') {
                    if(!current.references) throw 'REFERENCE NOT FOUND FOR FOREIGN KEY';
                    if(!current.columnName) throw 'COLUMN NAME NOT FOUND FOR FOREIGN KEY';
                    line += `FOREIGN KEY (${current.columnName}) REFERENCES ${current.references.tableName}(${current.references.columnName})`;
                }
                temps.push(line);
            });
        }
        query.push(temps.join(',\n'));
    } catch (error) {
        isSuccess = false;
        response.message = error;
    }
    if(!isSuccess) return responses.errorResponseWithoutData(res, response.message, 0, 200);
    
    query.push('\n);');
    let queryString = query.join(' ');

    isSuccess = true;
    try {
        await db.sequelize.query(queryString);
        response.message = 'Table created successfully.';
        responses.successResponseData(res, response.message, 1, { queryString });
    } catch (error) {
        isSuccess = false;
        response.message = error.parent.sqlMessage;
        responses.errorResponseWithoutData(res, response.message, 0 ,200);
    }
});