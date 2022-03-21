const { Sequelize, Op, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    'QueryBuilder', 
    process.env.DB_USER, 
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

module.exports = {
    Sequelize,
    sequelize,
    Op,
    Model,
    DataTypes
};

// const mysql = require('mysql');

// let db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: 'QueryBuilder'
// });

// db.connect((err) => {
//     if(err) throw err;
// });

// module.exports = db;