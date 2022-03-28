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
				response.redirect('/addingSkill');
			} else {
				response.send('Incorrect Email and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
});

// http://localhost:3000/signup
app.post('/signup', function (request, response) {
	// Save the input fields
	let signupEmail = request.body.signupEmail;
	let signupPassword = request.body.signupPassword;
	let signupName = request.body.signupName;
	let signupSkills = request.body.signupSkills;
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
				// Redirect to skills page
				response.redirect('/addingSkill');
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
			response.sendFile(path.join(__dirname + '/skillsPage.html'));
			// response.redirect('/addingSkill')
		}
		if (request.session.signupEmail) {
			response.send(`Welcome ${request.session.signupEmail}!`);
			// response.redirect('/addingSkill');
		}

	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

// skills page -- add skills
app.get('/addingSkill', function (request, response) {
	response.sendFile(path.join(__dirname + '/skillsPage.html'));
	app.post('/addingSkill', function (request, response) {


		// Save the input fields
		let skillsEmail = request.body.skillsEmail;
		let skillsSkill = request.body.skillsSkill;

		if (skillsEmail && skillsSkill) {
			connection.query(`SELECT skills FROM userSkills WHERE email = '${skillsEmail}';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Email is populated.');
					console.log(results);
					let allSkills = JSON.stringify(results[0]["skills"]) + ", " + skillsSkill;
					connection.query(`UPDATE userSkills SET skills = '${allSkills}' WHERE email = '${skillsEmail}';`);
					// Redirect to home page
					// response.redirect('/home');
				} else {
					connection.query(`INSERT INTO userSkills VALUES ('${skillsEmail}', '${skillsSkill}');`, function (error, results, fields) {
						// If there is an issue with the query, output the error
						if (error) throw error;
						// If the account exists
						if (results) {
							console.log('Skill added.');
						} else {
							response.send('Incorrect Email and/or Skill!');
						}
						response.end();
					});
				}
				response.end();
			});
		} else {
			response.send('Please enter Email and Skill!');
			response.end();
		}
	});

	app.post('/deleteSkill', function (request, response) {
		// Save the input fields
		let dSkillsEmail = request.body.dSkillsEmail;
		let dSkillsSkill = request.body.dSkillsSkill;

		if (dSkillsEmail && dSkillsSkill) {
			connection.query(`SELECT * FROM userSkills WHERE email = '${dSkillsEmail}' AND skills LIKE ` + `'%${dSkillsSkill}%';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Email is populated.');
					let updatedSkills = JSON.stringify(results[0]["skills"]).replace(dSkillsSkill, "");
					console.log(updatedSkills);
					connection.query(`UPDATE userSkills SET skills = '${updatedSkills}' WHERE email = '${dSkillsEmail}';`);
					// Redirect to home page
					// response.redirect('/home');
				} else {
					// If there is an issue with the query, output the error
					if (error) throw error;
					// If the account exists
					if (results) {
						console.log('Skill deleted.');
					} else {
						response.send('Incorrect Email and/or Skill!');
					}
					response.end();
				}
				response.end();
			});
		} else {
			response.send('Please enter Email and Skill!');
			response.end();
		}
	});
});
	app.listen(3000);
