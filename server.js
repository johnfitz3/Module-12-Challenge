const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'employee_db'
});

const db = util.promisify(connection.query).bind(connection);

connection.connect(err => {
  if (err) throw err;
  startPrompt();
});

function startPrompt() {
  inquirer.prompt({
    type: 'list',
    name: 'mainMenu',
    message: 'What would you like to do?',
    choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add An Employee', 'Update Employee Role', 'Update Employee Manager', 'Delete Department', 'Delete Role', 'Delete Employee'],
  }).then(answer => {
    switch (answer.mainMenu) {
      case 'View Departments':
        viewDepartmentsList();
        break;

      case 'View Roles':
        viewRolesList();
        break;

      case 'View Employees':
        viewEmployees();
        break;

      case 'Add Department':
        addDepartment();
        break;

      case 'Add Role':
        addRole();
        break;

      case 'Add An Employee':
        addEmployee();
        break;

      case 'Update Employee Role':
        updateRole();
        break;

      case 'Update Employee Manager':
        updateManager();
        break;

      case 'Delete Department':
        deleteDepartmentsList();
        break;

      case 'Delete Role':
        deleteRolesList();
        break;

      case 'Delete Employee':
        deleteEmployeesList();
        break;
    }
  });
}
//view department
function viewDepartmentsList() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
        startPrompt();
    });

};



//view Roles
function viewRolesList() {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
        startPrompt();
    });

};



//view Employees
function viewEmployees() {
    const sql = `SELECT * FROM employee.id`;

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
        startPrompt();
    });

};
//add department
function addDepartment() {
    inquirer.prompt([
        {
            name:"department_name",
            type:"input",
            message:"Please enter the name of the department"
        }
    ]).then((answer) => {
        const  sql = `INSERT INTO department (department_name)
        VALUES (?)`;
const params = [answer.department_name];
db.query(sql, params, (err, result) => {
if (err) throw err;
console.log('The new department entered has been added successfully to the database.');

db.query(`SELECT * FROM department`, (err, result) => {
    if (err) {
        res.status(500).json({ error: err.message })
        return;
    }
    console.table(result);
    startPrompt();
});
});
});
};


//add role
    function addRole() {
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Please enter the title of role you want to add to the database."
            },
            {
                name: "salary",
                type: "input",
                message: "Please enter the salary associated with the role you want to add to the database. (no dots, space or commas)"
            },
            {
                name: "department_id",
                type: "number",
                message: "Please enter the department's id associated with the role you want to add to the database."
            }
        ]).then(function (response) {
            db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
                if (err) throw err;
                console.log('The new role entered has been added successfully to the database.');
    
                db.query(`SELECT * FROM role`, (err, result) => {
                    if (err) {
                        res.status(500).json({ error: err.message })
                        startPrompt();
                    }
                    console.table(result);
                    startPrompt();
                });
            })
    });
    };
//add employees
    function addEmployee() {
        inquirer.prompt([
            {
                name:"first_name",
                type:" input",
                message: "Please enter first name"
            },
            {
                name:"last_name",
                type:"input",
                message: "Please enter last name"
            },
            {
                name:"role_id",
                type:" number",
                message: "Please enter role id"
            },
            {
                name: "manager_id",
                type:" number",
                message: "Please enter manager id"
            }
        ]).then(function(response) {
            const sql = "INSERT INTO employee (first_name, last_name, role_id,) VALUES (?, ?, ?)";
        const params = [response.first_name, response.last_name, response.role_id];
        
        db.query(sql, params, function(err,data) {
            if(err) throw err;
            console.log("the new employee has been successfully added");
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    console.error(err);
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        });
    });
    }

    //update role
    function updateRole() {
        inquirer.prompt([
            {
                name: 'employee_role',
                type: 'input',
                message: "Please enter the first name of the employe."
            },
            {
                name: "role_id",
                type: "number",
                message: "Please enter the new role number id associated with the employee you want to update in the database."
            }
        ]).then (function(response) {
                db.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.first_name], function (err, data) {
                    if (err) throw err;
                    console.log('The new role entered has been added successfully to the database.');
                  
                    db.query(`SELECT * FROM employee`, (err, result) => {
                      if (err) {
                        res.status(500).json({ error: err.message });
                      }
                      console.table(result);
                      startPrompt();
                 
                    });       
        });
        });
    }

    //update manager role
    function updateManager() {
        inquirer.prompt([
            {
                 name: "first_name",
                 type: "input",
                 message: "please enter the first name of the employee you want to update in the database",
            },
            {
                name: "manager_id",
                type: "input", 
                message: "please enter the id of the manager you want to update in the database",
            }
        ]).then (function(response) {
            db.query("UPDATE employee SET manager_id = ? WHERE first_name = ?", [response.manager_id, response.first_name], function(err, result) {
                if (err) throw err;
                console.log('The manager has been successfully updated');
                db.query(`SELECT * FROM employee`, (err, result) => {
                    if (err) {
                        res.status(500).send({err: err.message})
                        startPrompt();
                    }
                    console.table(result);
                    startPrompt();
                });               
        });
    });
    
    //delete department
    function deleteDepartmentsList() {
        inquirer
          .prompt([
            {
              name: "department_id",
              type: "number",
              message: "Please enter the ID of the department you want to delete:",
            },
          ])
          .then((answer) => {
            const sql = "DELETE FROM department WHERE id = ?";
            const params = [answer.department_id];
            db.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("The department has been deleted successfully.");
      
              db.query("SELECT * FROM department", (err, result) => {
                if (err) {
                  console.error(err);
                  startPrompt();
                }
                console.table(result);
                startPrompt();
              });
            });
          });
      }
      
      // delete role
      function deleteRolesList() {
        inquirer
          .prompt([
            {
              name: "role_id",
              type: "number",
              message: "Please enter the ID of the role you want to delete:",
            },
          ])
          .then((answer) => {
            const sql = "DELETE FROM role WHERE id = ?";
            const params = [answer.role_id];
            db.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("The role has been deleted successfully.");
      
              db.query("SELECT * FROM role", (err, result) => {
                if (err) {
                  console.error(err);
                  startPrompt();
                }
                console.table(result);
                startPrompt();
              });
            });
          });
      }
      
      // delete employee
      function deleteEmployeesList() {
        inquirer
          .prompt([
            {
              name: "employee_id",
              type: "number",
              message: "Please enter the ID of the employee you want to delete:",
            },
          ])
          .then((answer) => {
            const sql = "DELETE FROM employee WHERE id = ?";
            const params = [answer.employee_id];
            db.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("The employee has been deleted successfully.");
      
              db.query("SELECT * FROM employee", (err, result) => {
                if (err) {
                  console.error(err);
                  startPrompt();
                }
                console.table(result);
                startPrompt();
              });
            });
          });
      }
}
            startPrompt();