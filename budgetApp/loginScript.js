"use static";

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
    newUser["username"] = signupUsername;
    newUser["password"] = signupPassword;

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
    // if user login is valid, open home page
    if (currentUser["username"] == jsonObj[0]["username"] && currentUser["password"] == jsonObj[0]["password"]) {
        console.log(currentUser.username + currentUser.password);
        res.redirect('/homePage.html');
    }
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
