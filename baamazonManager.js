var inquirer = require('inquirer');

var defaultquantity = 20;
//-----------------------------------------------------------------------------
// mysql module code
//-----------------------------------------------------------------------------

var mysql = require('mysql');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "pass",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	start();
});


//-----------------------------------------------------------------------------
// cli-table module code
//-----------------------------------------------------------------------------

var Table = require('cli-table');

var ProductsTable = new Table({
    head: ['ID', 'Product', 'Department', 'Price', 'Stock', 'Default']
  , colWidths: [4, 70, 13, 7, 7, 9]
  , style: { 'padding-right': 0 }
  , colAligns: []
});


//-----------------------------------------------------------------------------
// start function code
//-----------------------------------------------------------------------------

function start() {

	inquirer.prompt({
		name: 'manager_menu_choice',
		type: 'list',
		message: 'Options: ',
		choices: [
			'View Products for Sale',
			'View Low Inventory',
			new inquirer.Separator(),
			'Add to Inventory',
			'Add New Product',
			'Quit'
		]
	}).then(function(answer) {

		switch(answer.manager_menu_choice) {
			case 'View Products for Sale':
				viewInventory();
				break;
			case 'View Low Inventory':
				viewLowInventory();
				break;
			case 'Add to Inventory':
				addToInventory();
				break;
			case 'Add New Product':
				addNewProduct();
				break;
			case 'Quit':
				process.exit();
				break;
		}

	});

}


//-----------------------------------------------------------------------------
// viewInventory function code
//-----------------------------------------------------------------------------

function viewInventory() {

	var query = 'SELECT item_id, product_name, department_name, price, stockquantity,  FROM product';

	connection.query(query, function(err, res) {

		for (var i = 0; i < res.length; i++) {

			ProductsTable.push([
				res[i].item_id,
				res[i].product_name,
				res[i].department_name,
				res[i].price,
				res[i].StockQuantity
			]);

		}

		console.log(ProductsTable.toString());

		ProductsTable.length = 0;

		start();

	});

}


function addToInventory() {

	inquirer.prompt([

		{
			name: "id",
			type: "input",
			message: "What product(s) would you like to update? Please enter ItemID(s): "
		}

	]).then(function(answer) {

		connection.query('SELECT stockquantity, product_name FROM product WHERE ?', {item_id: answer.id}, function(err, res) {

			if(res[0].stockquantity < defaultquantity) {

				connection.query('UPDATE product SET stockquantity =' +defaultquantity+'WHERE ?', {item_id: answer.id}, function(e, r){});

				console.log('Update successful!');

				connection.query('SELECT * FROM product WHERE ?', {item_id: answer.id}, function(e, r){
					console.log('Quantity of '+res[0].item_id+' = '+r[0].stockquantity);
				});

			} else {
				console.log('This item is fully stocked!');
			}

			start();

		});

	});

}


function viewLowInventory() {

	connection.query('SELECT item_id, stockquantity, product_name, price, department_name FROM product WHERE stockquantity >= 200', function(err, res) {

		for (var i = 0; i < res.length; i++) {

			ProductsTable.push([
				res[i].item_id,
				res[i].product_name,
				res[i].department_name,
				res[i].price,
				res[i].stockquantity
			]);

		}

		console.log(ProductsTable.toString());

		start();

	});

}


function addNewProduct() {
inquirer.prompt([
    {
        name:"productName",
        message:"enter the productname"
    },
    {
        name:"departmentName",
        message:"enter the departmentname"
    },
    {
        name:"prices",
        message:"enter the price"
    },
    {
        name:"stockQuantity",
        message:"what is the stock quantity you want ?"
    }
]).then((answer)=>{
    var prodName = answer.productname;
    var depName = answer.departmentname;
    var pric = answer.prices;
    var stockquan = answer.StockQuantity;
   var insertionquery = "insert into product(product_name,department_name,price,stockquantity)values?",[prodName,depName,pric,stockquan], function(error,response{

   })
})
}