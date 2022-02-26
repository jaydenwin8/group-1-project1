"use static";

let http = require("http");
let mysql = require("mysql");

let output;

initializeDB();

let httpServer = http.createServer(processServerRequest);
httpServer.listen(8080);

function initializeDB() { 

    let connectionString = {
        host: "107.180.1.16",
        database: "sprog20221",
        user: "sprog20221",
        password: "sprog20221"
    };
    console.log(connectionString);

    let con = mysql.createConnection(connectionString);
    console.log("Connecting to DB...");

    con.connect(
        function (err) { 
            if (err) throw err;
            console.log("Connected.");
            let sqlquery = "select userName, description, date, ammount from transactions;";
            con.query(sqlquery, processResult);
            con.end();
        }
    )

}

function processServerRequest(request, response) { 

    console.log(request.url);

    response.writeHead(200, {'Content-type': 'text/html'});
    response.write(output);

    response.end();

}

function processResult (err, result) { 

    if (err) throw err;
    console.log(result.length);

    // print query results to console
    for (let i = 0; i < result.length; i++) {
        console.log(result[i].userName + " " + result[i].description + " " + result[i].date + " " + result[i].ammount);

        // add query results to table
        output += "<tr><td>" + result[i].userName + "</td><td>" + result[i].description + "</td><td>" + result[i].date + "</td><td>" + result[i].ammount + "</td></tr>";

    }


    // result.forEach(printActor);

}

// Prints query results to DOM, might need to be moved to seperate js file, cannot write to DOM in node.js
function printResult() {
    output += "<tr><th>User Name</th><th>Description</th><th>Date</th><th>Ammount</th></tr>";
    output += "<table>";

    for (let i = 0; i < result.length; i++) {
        // console.log(result[i].userName + " " + result[i].description + " " + result[i].date + " " + result[i].ammount);

        // add query results to table
        output += "<tr><td>" + result[i].userName + "</td><td>" + result[i].description + "</td><td>" + result[i].date + "</td><td>" + result[i].ammount + "</td></tr>";
    }
    
    output += "</table>";
    // print output HTML to DOM
    document.getElementById("output").innerHTML = output;
}

// function printActor(record) { 

//     output = output + "<p>" + record.first_name + " <strong>" + record.last_name + "</strong>" + "</p>";

// }





// let http = require("http");
// let mysql = require("mysql");
// var con;

// let httpServer = http.createServer(processServerRequest);
// httpServer.listen(3306);

// function processServerRequest(request, response) {
//     // process user input and then connect to the DB

//     let host = "http://" + request.headers["host"];
//     let url = new URL(request.url, host);
//     console.log(request.url);

//     let connectionString = {
//         host: "107.180.1.16",
//         database: "sprog20221",
//         user: "sprog20221",
//         password: "sprog20221"
//     };
//     console.log(connectionString);

//     let con = mysql.createConnection(connectionString);
//     console.log("Connecting to database.");

//     con.connect(
//         function (err) {
//             if (err) throw err;
//             console.log("Connected to database.");
//         }
//     );

//         // query inserts username and password into users table
//         con.query(`INSERT INTO users VALUES ('${signupUsername}', '${signupPassword}');`,
//             function (err, result) {
//                 if (err) throw err;
//                 console.log('Data inserted');
//             });
//         con.end();
//     }

//     response.end();


// function initialize() {
// } 
