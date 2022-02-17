"use static";

let http = require("http");
let mysql = require("mysql");
let output = '';

initializeDB();

let httpServer = http.createServer(processServerRequest);
httpServer.listen(3306);

function initializeDB() {

    let connectionString = {
        host: "107.180.1.16",
        database: "sprog20221",
        user: "sprog20221",
        password: "sprog20221"
    };

    console.log(connectionString);

    let con = mysql.createConnection(connectionString);
    console.log("Connecting to database.");

    con.connect(
        function (err) {
            if (err) throw err;
            console.log("Connected to database.");
        }
    );

    let sqlquery = "select username, password from users limit 10;";
    con.query(sqlquery, processResult);
    con.end();

}

function processServerRequest(request, response) {

    console.log(request.url);
    let host = "http://" + request.headers["host"];
    let url = new URL(request.url, host);

    let signupUsername = url.searchParams.get("signupUsername");
    let signupPassword = url.searchParams.get("signupPassword");

    let loginUsername = url.searchParams.get("loginUsername");
    let loginPassword = url.searchParams.get("loginPassword");

    if (signupUsername !== "") {
        response.write("<p style='font-size: 14pt;'>Here is the information you sent to the server</p>");
        response.write(createResponseText(signupUsername, signupPassword));
    }

    if (loginUsername !== "") {
        response.write("<p style='font-size: 14pt;'>Here is the information you sent to the server</p>");
        response.write(createResponseText(loginUsername, loginPassword));
    }

    response.writeHead(200, { 'Content-type': 'text/html' });
    response.write(output);
    response.end();

}

function createResponseText(username, password) {

    let text = `<p><em>Username: </em><strong>${username}</strong></p><p><em>ID: </em><strong>${password}</strong></p>`;
    return text;

}

function processResult(err, result) {

    if (err) throw err;

    console.log(`There were ${result.length} rows returned`);

    result.forEach(printUser);

}

function printUser(record) {

    output += `<p>${record.username} ${record.password}</p>`;

}

function initialize() {
    // initialize the login/signup page on load
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');

    // this will create a new list every time it loads (does not save user accounts after session ends)
    // This code will be deleted once I find out how to store users externally
    jsonObj = [];
    user = {}

    // hide the forms until user selects an option
    loginForm.hidden = true;
    signupForm.hidden = true;

}

function showSignup() {
    // runs when user selects sign up button
    if (signupForm.hidden == true) {
        signupForm.hidden = false;
        loginForm.hidden = true;
    }
    else {
        signupForm.hidden = true;
    }

    // set password input type to 'password' (default)
    var pswdInputSignup = document.getElementById('signupPassword');
    pswdInputSignup.type = 'password';

}

function showLogin() {
    // runs when user selects login button
    if (loginForm.hidden == true) {
        loginForm.hidden = false;
        signupForm.hidden = true;
    }
    else {
        loginForm.hidden = true;
    }

    // set password type to 'password'
    var pswdInputLogin = document.getElementById('loginPassword');
    pswdInputLogin.type = 'password';

}

function signup() {
    // sign up a new user
    var signupUsername = document.getElementById('signupUsername').value;
    var signupPassword = document.getElementById('signupPassword').value;

    let newUser = { "username": signupUsername, "password": signupPassword };
    console.log(newUser);


    // need to edit code to store new users in EXTERNAL database (use mySQL???)
    // the code below only stores users temporarily
    // newUser["username"] = signupUsername;
    // newUser["password"] = signupPassword;

    jsonObj.push(newUser);

    console.log(jsonObj);


}

function login() {
    // login a user
    var loginUsername = document.getElementById('loginUsername').value;
    var loginPassword = document.getElementById('loginPassword').value;
    let currentUser = { "username": loginUsername, "password": loginPassword };
    console.log(currentUser);

    // need to add code to check if user exists in the external table or database


}

function togglePassword() {
    // Toggle password visibility, responds to checkbox
    var pswdInputSignup = document.getElementById('signupPassword');
    var pswdInputLogin = document.getElementById('loginPassword');

    // toggles visibility on sign up page
    if (pswdInputSignup.type === 'password') {
        pswdInputSignup.type = 'text';
    }
    else {
        pswdInputSignup.type = 'password';
    }

    // toggles visibility on login page
    if (pswdInputLogin.type === 'password') {
        pswdInputLogin.type = 'text';
    }
    else {
        pswdInputLogin.type = 'password';
    }

}
