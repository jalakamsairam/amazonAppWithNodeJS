//importing mysql
var mysql = require("mysql");
//importing ttytable to display json as tables
var Table = require('cli-table');
// importing enquirer to the page;
var inquirer = require("inquirer");
var beautify = require("json-beautify");
//establishing connection to the mysql database bamazon
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'bamazon'
});

//establishing table properties
var ProductsTable = new Table({
    head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
    colWidths: [4, 70, 13, 7, 7],
    style: {
        'padding-right': 0
    },
    colAligns: []
});

//initiating initial values for table header and rows
//initializing a 
//sqlTableDisplay function  
function displayInventory() {
    var query = "select * from product;";
    connection.query(query, function (error, response) {
        for (var i = 0; i < response.length; i++) {
            ProductsTable.push([
                response[i].item_id,
                response[i].product_name,
                response[i].department_name,
                response[i].price,
                response[i].stockquantity
            ])
        }
        console.log(ProductsTable.toString());
        
        Inquirer(response);
        
    });
}

function establishSQLConnection() {
    connection.connect();
    displayInventory();

}
establishSQLConnection();

function Inquirer() {
    inquirer.prompt([{
            name: "product_id",
            message: "give the ID number of the product that you want to buy[q to quit]"
        },
        {
            name: "item_count",
            message: "enter the count [0-9*]"
        }
    ]).then(function (answer) {
        if(answer.product_id === "q"){
            connection.end()
        }else{
        connection.query('SELECT stockquantity, product_name, price FROM Product WHERE ?', {
            item_id: answer.product_id
        }, function (err, res) {
                console.log(res);
            if (res[0].stockquantity <= answer.item_count) {
                console.log('Insufficient quantity!');
                connection.end();
            } else {
                console.log('You have purchased ' + answer.item_count + ' items called ' + res[0].product_name);
                console.log('Your total for this purchase is $' + res[0].price * answer.item_count);
                console.log(beautify(res[0].stockquantity));
                console.log(beautify(answer.item_count));
                var difference = res[0].stockquantity - answer.item_count;
                console.log(difference);
                connection.query('UPDATE product SET stockquantity = ' + difference.toString() + ' WHERE ?', {
                    item_id: answer.product_id
                }, function (e, r) {if(err) throw err;console.log(response)});
                displayInventory();
                continueShopping();
                
            }
        })
    }
    })
}

function continueShopping() {

    inquirer.prompt([
        {
            name: 'continue',
            type: 'input',
            message: 'Continue shopping? (y/n) '
        }
    
        ]).then(function (answer) {

        if (answer.continue == 'y') {

            establishSQLConnection();
        } else {
            connection.end();
            return;
        }

    });



}