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
	global.email = request.body.email;

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
	let mentorChkbox = request.body.mentor;
	let menteeChkbox = request.body.mentee;
	let menteeList = '';
	let mentorList = '';
	let status = '';
	if (mentorChkbox) {
		status = 'Mentor';
	}
	if (menteeChkbox) {
		status = 'Mentee';
	}
	if (mentorChkbox && menteeChkbox) {
		status = 'Both';
	}
	if (signupEmail && signupPassword) {
		connection.query(`INSERT INTO mentorUsers VALUES ('${signupEmail}', '${signupPassword}', '${signupName}', '${signupSkills}',
		 '${menteeList}', '${mentorList}', '${status}');`, function (error, results, fields) {
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

// skills, mentor, and mentee page 
app.get('/addingSkill', function (request, response) {
	response.sendFile(path.join(__dirname + '/skillsPage.html'));

	// add skill
	app.post('/addingSkill', function (request, response) {

		// Save the input fields
		let skillsSkill = request.body.skillsSkill;

		if (skillsSkill) {
			connection.query(`SELECT skills FROM userSkills WHERE email = '${email}';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Email is populated.');
					console.log(results);
					let allSkills = JSON.stringify(results[0]["skills"]) + ", " + skillsSkill;
					connection.query(`UPDATE userSkills SET skills = '${allSkills}' WHERE email = '${email}';`);
					// Redirect to home page
					// response.redirect('/home');
				} else {
					connection.query(`INSERT INTO userSkills VALUES ('${email}', '${skillsSkill}');`, function (error, results, fields) {
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

	// delete skill
	app.post('/deleteSkill', function (request, response) {

		// Save the input fields
		let dSkillsSkill = request.body.dSkillsSkill;

		if (dSkillsSkill) {
			connection.query(`SELECT * FROM userSkills WHERE email = '${email}' AND skills LIKE ` + `'%${dSkillsSkill}%';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Email is populated.');
					let updatedSkills = JSON.stringify(results[0]["skills"]).replace(dSkillsSkill, "");
					console.log(updatedSkills);
					connection.query(`UPDATE userSkills SET skills = '${updatedSkills}' WHERE email = '${email}';`);
				} else {
					// If there is an issue with the query, output the error
					if (error) throw error;
					// If the account exists
					if (results) {
						console.log('Skill deleted.');
						console.log(dSkillsSkill);
					} else {
						response.send('Incorrect Skill!');
					}
					response.end();
				}
				response.end();
			});
		} else {
			response.send('Please enter Skill!');
			response.end();
		}
	});

	// insert skill list
	app.get('/gettingSkills', function (request, response) {

		if (true) {
			connection.query(`SELECT skills FROM userSkills WHERE email = '${email}';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Skills list present.');
					document.getElementById("skillsCell") = JSON.stringify(results[0]["skills"]);
				} else {
					// If there is an issue with the query, output the error
					if (error) throw error;
					// If the account exists
					if (results) {
						console.log('Skills populated.');
					} else {
						response.send('Email does not exist!');
					}
					response.end();
				}
				response.end();
			});
		} else {
			response.send('Email does not exist!');
			response.end();
		}
	});

	// add mentor
	app.post('/addingMentor', function (request, response) {

		let aMentor = request.body.aMentor;

		if (aMentor) {
			connection.query(`SELECT mentorList FROM mentorUsers WHERE email = '${email}';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Email is populated.');
					console.log(results);
					let allMentors = JSON.stringify(results[0]["mentorList"]) + ", " + aMentor;
					connection.query(`UPDATE mentorUsers SET mentorList = '${allMentors}' WHERE email = '${email}';`);
					// Redirect to home page
					// response.redirect('/home');
				} else {
					connection.query(`INSERT INTO mentorUsers (email, mentorList) VALUES ('${email}', '${mentorList}');`, function (error, results, fields) {
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

	// delete mentor
	app.post('/deleteMentor', function (request, response) {

		// Save the input fields
		let dMentor = request.body.dMentor;

		if (dMentor) {
			connection.query(`SELECT * FROM mentorUsers WHERE email = '${email}';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Email is populated.');
					let updatedMentors = JSON.stringify(results[0]["mentorList"]).replace(dMentor, "");
					console.log(updatedMentors);
					connection.query(`UPDATE mentorUsers SET mentorList = '${updatedMentors}' WHERE email = '${email}';`);
				} else {
					// If there is an issue with the query, output the error
					if (error) throw error;
					// If the account exists
					if (results) {
						console.log('Mentor deleted.');
						console.log(dMentor);
					} else {
						response.send('Incorrect Mentor!');
					}
					response.end();
				}
				response.end();
			});
		} else {
			response.send('Please enter Mentor!');
			response.end();
		}
	});

	// insert mentor list
	app.get('/pullingMentors', function (request, response) {

		if (true) {
			connection.query(`SELECT mentorList FROM mentorUsers WHERE email = '${email}';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Mentor list present.');
					document.getElementById("mentorsCell") = JSON.stringify(results[0]["mentorList"]);
				} else {
					// If there is an issue with the query, output the error
					if (error) throw error;
					// If the account exists
					if (results) {
						console.log('Mentors populated.');
					} else {
						response.send('Email does not exist!');
					}
					response.end();
				}
				response.end();
			});
		} else {
			response.send('Email does not exist!');
			response.end();
		}
	});

	// add mentee
	app.post('/addingMentee', function (request, response) {

		let aMentee = request.body.aMentee;

		if (aMentee) {
			connection.query(`SELECT menteeList FROM mentorUsers WHERE email = '${email}';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Email is populated.');
					console.log(results);
					let allMentees = JSON.stringify(results[0]["menteeList"]) + ", " + aMentee;
					connection.query(`UPDATE mentorUsers SET menteeList = '${allMentees}' WHERE email = '${email}';`);
					// Redirect to home page
					// response.redirect('/home');
				} else {
					connection.query(`INSERT INTO mentorUsers (email, menteeList) VALUES ('${email}', '${menteeList}');`, function (error, results, fields) {
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

	// delete mentee
	app.post('/deleteMentee', function (request, response) {

		// Save the input fields
		let dMentee = request.body.dMentee;

		if (dMentee) {
			connection.query(`SELECT * FROM mentorUsers WHERE email = '${email}';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Email is populated.');
					let updatedMentees = JSON.stringify(results[0]["menteeList"]).replace(dMentee, "");
					console.log(updatedMentees);
					connection.query(`UPDATE mentorUsers SET menteeList = '${updatedMentees}' WHERE email = '${email}';`);
				} else {
					// If there is an issue with the query, output the error
					if (error) throw error;
					// If the account exists
					if (results) {
						console.log('Mentee deleted.');
						console.log(dMentee);
					} else {
						response.send('Incorrect Mentee!');
					}
					response.end();
				}
				response.end();
			});
		} else {
			response.send('Please enter Mentee!');
			response.end();
		}
	});

	// insert mentee list
	app.get('/pullingMentees', function (request, response) {

		if (true) {
			connection.query(`SELECT menteeList FROM mentorUsers WHERE email = '${email}';`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					console.log('Mentee list present.');
					document.getElementById("menteesCell") = JSON.stringify(results[0]["menteeList"]);
				} else {
					// If there is an issue with the query, output the error
					if (error) throw error;
					// If the account exists
					if (results) {
						console.log('Mentees populated.');
					} else {
						response.send('Email does not exist!');
					}
					response.end();
				}
				response.end();
			});
		} else {
			response.send('Email does not exist!');
			response.end();
		}
	});
});

app.listen(3000);
