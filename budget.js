"use static";

// defining variables to store the inputs 
var category = "";
var categoryCost = "";
var i = 1;

// const jsonData = require('./budgetTable.json');

function initialize() { 
    // initializing the budget table upon loading the page 
    var budgetTable = document.getElementById('budgetTable');
    // import createRequire from 'module';
    // console.log("Connected")
}

function categorySubmission() {
    // console.log("button clicked")
    category = document.getElementById("category");
    categoryCost = document.getElementById("categoryCost");
    let categoryObj = {
        "category": category,
        "budget": categoryCost
    }

    i += 1;

    row = budgetTable.insertRow(i);

    cellOne = row.insertCell(0);
    cellTwo = row.insertCell(1);
    cellThree = row.insertCell(2);

    cellOne.appendChild(document.createElement("input"));
    cellTwo.appendChild(document.createElement("input")).type = 'number';
    cellThree.appendChild(document.createElement("button")).innerText = 'Delete';
    cellThree.id = 'deleteButton' + i;

}

function deleteCategory() { 

    

}