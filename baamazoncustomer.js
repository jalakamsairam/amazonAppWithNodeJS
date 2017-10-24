//importing mysql
var mysql = require("mysql");
//importing ttytable to display json as tables
var Table = require('cli-table');
//establishing connection to the mysql database bamazon
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'bamazon'
});

//establishing table properties
var ProductsTable = new Table({
    head: ['ID', 'Product', 'Department', 'Price', 'Stock']
  , colWidths: [4, 70, 13, 7, 7]
  , style: { 'padding-right': 0}
  , colAligns: []
});

//initiating initial values for table header and rows
//initializing a 
//sqlTableDisplay function  
function sqlTableDisplay() {
    connection.query("select * from product;", function (error, response) {
        if (error) throw error;
       
      

    })

}

function displayInventory(){
    var query = "select * from product;";
    connection.query(query,function(error,response){
        for(var i =0; i < response.length;i++){
            ProductsTable.push([
                response[i].item_id,
                response[i].product_name,
                response[i].department_name,
                response[i].price,
                response[i].stockquantity
            ])
        }
          console.log(ProductsTable.toString());
          connection.end(); 
    })
}

function establishSQLConnection() {
    connection.connect();
    sqlTableDisplay();
}
establishSQLConnection();