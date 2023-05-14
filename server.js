const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const utils = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD ,
    database: 'employee_db'
  });
  
  connection.connect(err => {
    if (err) throw err;
    connection();
  });


const mainMenu = [
    {
        name: 'mainMenu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View departments',
            'View roles',
            'View employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Delete departments',
            'Delete roles',
            'Delete employees',
            'Exit'
        ],
        
    }
];
