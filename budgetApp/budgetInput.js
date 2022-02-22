"use static";

// defining variables to store the inputs 
var category = "";
var categoryCost = 0;
var transactionDate = "";
var transactionDescription = "";
var transactionCost = 0;
var transactionCategory = "";
var transactionSG = "";
var transactionCount = 2;
var categoryCount = 1;


// const jsonData = require('./budgetTable.json');

function initialize() { 
    // initializing the budget table upon loading the page 
    var budgetTable = document.getElementById('budgetTable');
    var transactionTable = document.getElementById('transactionTable');
    // import createRequire from 'module';
    // console.log("Connected")
}

function categorySubmission() {
    // console.log("button clicked")
    category = document.getElementById("category");
    categoryCost = document.getElementById("categoryCost");
    let categoryObj = JSON.stringify({
        "category": category,
        "budget": categoryCost
    })

    categoryCount += 1;

    // insert new row for more categories
    row = budgetTable.insertRow(categoryCount);

    cellOne = row.insertCell(0);
    cellTwo = row.insertCell(1);
    cellThree = row.insertCell(2);

    cellOne.appendChild(document.createElement("input")).type = 'checkbox';
    cellTwo.appendChild(document.createElement("input"));
    cellThree.appendChild(document.createElement("input")).type = 'number';

}

function deleteRows(tableVar) { 

    // console.log('connected.');

    var allRows = document.getElementById(tableVar).getElementsByTagName('tr');
    var root = allRows[0].parentNode;
    var allInp = root.getElementsByTagName('input');
    for(var i=allInp.length-1;i>=0;i--){
	    if((allInp[i].getAttribute('type')=='checkbox')&&(allInp[i].checked)){
		    root.removeChild(allInp[i].parentNode.parentNode);
            if (tableVar == "budgetTable") { 
                categoryCount -= 1;
            }
            else if (tableVar == "transactionTable") { 
                transactionCount -= 1;
            }
	    }
    }

}

function transactionSubmission() { 
    
    // gather input data
    transactionDate = document.getElementById("dateInput").value;
    transactionDescription = document.getElementById("descriptionInput").value;
    transactionCost = document.getElementById("costInput").value;
    transactionCategory = document.getElementById("categoryInput").value;
    transactionSG = document.getElementById("spentGained").value;

    // reset input values
    document.getElementById("dateInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("costInput").value = "";
    document.getElementById("categoryInput").value = "";
    document.getElementById("spentGained").value = "";

    if (transactionSG == "spent") { 
        transactionCost = transactionCost * -1;
    }

    // console.log(dateInput);

    // inserting the inputs to the transaction table
    transactionRow = transactionTable.insertRow(transactionCount);
    transactionCount += 1;

    cellOneT = transactionRow.insertCell(0);
    cellTwoT = transactionRow.insertCell(1);
    cellThreeT = transactionRow.insertCell(2);
    cellFourT = transactionRow.insertCell(3);
    cellFiveT = transactionRow.insertCell(4);

    cellOneT.appendChild(document.createElement("input")).type = 'checkbox';
    cellTwoT.appendChild(document.createTextNode(transactionDate));
    cellThreeT.appendChild(document.createTextNode(transactionDescription));
    cellFourT.appendChild(document.createTextNode(transactionCost));
    cellFiveT.appendChild(document.createTextNode(transactionCategory));

    window.location.href = 'index.html';

}
