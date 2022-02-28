"use static";

let http = require("http");
let mysql = require("mysql");

let httpServer = http.createServer(processServerRequest);
httpServer.listen(3306);

function processServerRequest(request, response) {
    // process user input and then connect to the DB

    let host = "http://" + request.headers["host"];
    let url = new URL(request.url, host);
    console.log(request.url);

    let signupUsername = url.searchParams.get("signupUsername");
    let signupPassword = url.searchParams.get("signupPassword");

    let loginUsername = url.searchParams.get("loginUsername");
    let loginPassword = url.searchParams.get("loginPassword");

    if (signupUsername !== null) {
        // connects to DB if user is signing up
        console.log(signupUsername, signupPassword);

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

        // query inserts username and password into users table
        con.query(`INSERT INTO users VALUES ('${signupUsername}', '${signupPassword}');`,
            function (err, result) {
                if (err) throw err;
                console.log('Data inserted');
            });
        con.end();
    }

    if (loginUsername !== null) {
        // connects to DB if user is logging in
        console.log(loginUsername, loginPassword);

        let connectionString = {
            host: "107.180.1.16",
            database: "sprog20221",
            user: "sprog20221",
            password: "sprog20221"
        };
        console.log(connectionString);

        let con = mysql.createConnection(connectionString);
        console.log("Connecting to database.");

        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to database.");
            // get user's data from mysql
            con.query(`SELECT * FROM users WHERE username="${loginUsername}";`, function (err, results) {
                if (err) throw err;
                console.log('Data checked');

                if (results.length > 0) {
                    // if username exists
                    console.log(`Username: ${results[0].username} Password: ${results[0].password}`);
                }

                if (results.length == 0) {
                    // if username does not exist
                    console.log('Username does not exist');
                }
            });
            con.end();
        });
    }

    response.end();
}

function initialize() {
    // initialize the login/signup page on load
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');

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

    // hide the password while user types it in
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

    // hide the password while user types it in
    var pswdInputLogin = document.getElementById('loginPassword');
    pswdInputLogin.type = 'password';
}

function login() {
    // login a user
    var loginUsername = document.getElementById('loginUsername').value;
    var loginPassword = document.getElementById('loginPassword').value;
    let currentUser = { "username": loginUsername, "password": loginPassword };
    console.log(currentUser);

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
