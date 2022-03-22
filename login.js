const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
	host: "107.180.1.16",
	database: "sprog20221",
	user: "sprog20221",
	password: "sprog20221"
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/', function (request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function (request, response) {
	// Save the input fields
	let email = request.body.email;
	let password = request.body.password;

	// Ensure the input fields exist and are not empty
	if (email && password) {
		// SQL query that'll select the user from the database based on the specified username and password
		// Can change query to add new users (can read or write to database)
		connection.query('SELECT * FROM mentorUsers WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.email = email;
				console.log('User authenticated.');
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Email and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
	// if (signupUsername && signupPassword) {
	// 	connection.query(`INSERT INTO users VALUES ('${signupUsername}', '${signupPassword}');`, function (error, results, fields) {
	// 		// If there is an issue with the query, output the error
	// 		if (error) throw error;
	// 		// If the account exists
	// 		if (results.length > 0) {
	// 			// Authenticate the user
	// 			request.session.loggedin = true;
	// 			request.session.signupUsername = signupUsername;
	// 			console.log('User authenticated.');
	// 			// Redirect to home page
	// 			response.redirect('/home');
	// 		} else {
	// 			response.send('Incorrect Username and/or Password!');
	// 		}
	// 		response.end();
	// 	});
	// }
});

// http://localhost:3000/signup
app.post('/signup', function (request, response) {
	// Save the input fields
	let signupEmail = request.body.signupEmail;
	let signupPassword = request.body.signupPassword;
	let signupName = request.body.signupName;
	let signupSkills = request.body.signupSkills;
	// Ensure the input fields exist and are not empty
	// if (username && password) {
	// 	// SQL query that'll select the user from the database based on the specified username and password
	// 	// Can change query to add new users (can read or write to database)
	// 	connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
	// 		// If there is an issue with the query, output the error
	// 		if (error) throw error;
	// 		// If the account exists
	// 		if (results.length > 0) {
	// 			// Authenticate the user
	// 			request.session.loggedin = true;
	// 			request.session.username = username;
	// 			console.log('User authenticated.');
	// 			// Redirect to home page
	// 			response.redirect('/home');
	// 		} else {
	// 			response.send('Incorrect Username and/or Password!');
	// 		}
	// 		response.end();
	// 	});
	// } else {
	// 	response.send('Please enter Username and Password!');
	// 	response.end();
	// }
	if (signupEmail && signupPassword) {
		connection.query(`INSERT INTO mentorUsers VALUES ('${signupEmail}', '${signupPassword}', '${signupName}', '${signupSkills}');`, function (error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.signupEmail = signupEmail;
				console.log('User authenticated.');
				console.log(`Results of Query: ${results.value}`);
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Email and/or Password!');
			}
			response.end();
		});
	}
});

// http://localhost:3000/home
app.get('/home', function (request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		if (request.session.email) {
			// Output username
			response.send('Welcome back, ' + request.session.email + '!');
		}
		if (request.session.signupEmail) {
			response.send(`Welcome ${request.session.signupEmail}!`);
		}

	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);
