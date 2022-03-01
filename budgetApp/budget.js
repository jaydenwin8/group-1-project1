"use strict";

// Find current month in JavaScript
const localDate = new Date();
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
let currentMonth = months[localDate.getMonth()];
console.log(currentMonth);

// SELECT ELEMENTS
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// SELECT BTNS
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");
// tabs may be deleted later after implementation of Branna's input code
 
// INPUT BTS
const addExpense = document.querySelector(".add-expense");
//const expenseTitle = document.getElementById("expense-title-input");
//const expenseAmount = document.getElementById("expense-amount-input");
const expenseTitle = document.getElementById("descriptionInput");
const expenseAmount = document.getElementById("costInput");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");
const dashTitle = document.getElementById("dash-title");

// VARIABLES
let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

// LOOK IF THERE IS SAVED DATA IN LOCALSTORAGE
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// EVENT LISTENERS
expenseBtn.addEventListener("click", function(){
    show(expenseEl);
    hide( [incomeEl, allEl] );
    active( expenseBtn );
    inactive( [incomeBtn, allBtn] );
})
incomeBtn.addEventListener("click", function(){
    show(incomeEl);
    hide( [expenseEl, allEl] );
    active( incomeBtn );
    inactive( [expenseBtn, allBtn] );
})
allBtn.addEventListener("click", function(){
    show(allEl);
    hide( [incomeEl, expenseEl] );
    active( allBtn );
    inactive( [incomeBtn, expenseBtn] );
})

addExpense.addEventListener("click", function(){
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    // if(!expenseTitle.value || !expenseAmount.value ) return;

    // SAVE THE ENTRY TO ENTRY_LIST
    let expense = {
        type : "expense",
        title : expenseTitle.value,
        amount : parseInt(expenseAmount.value)
    }
    ENTRY_LIST.push(expense);

    updateUI();
    // clearInput( [expenseTitle, expenseAmount] )
})

function transactionSubmission() { 
    console.log("submittrans");
    console.log("expenseTitle: " + expenseTitle.value);
    console.log("expenseAmount: " + expenseAmount.value);
    // gather input data
    transactionDate = document.getElementById("dateInput").value;
    transactionDescription = document.getElementById("descriptionInput").value;
    transactionCost = document.getElementById("costInput").value;
    transactionCategory = document.getElementById("categoryInput").value;
    transactionSG = document.getElementById("spentGained").value;

    if (transactionSG == "spent") { 
        transactionCost = transactionCost * -1;
    }

    // SAVE THE ENTRY TO ENTRY_LIST
    let expense = {
        type : "expense",
        title : expenseTitle.value,
        amount : parseInt(expenseAmount.value)
    }
    ENTRY_LIST.push(expense);

    updateUI();
}

addIncome.addEventListener("click", function(){
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if(!incomeTitle.value || !incomeAmount.value ) return;

    // SAVE THE ENTRY TO ENTRY_LIST
    let income = {
        type : "income",
        title : incomeTitle.value,
        amount : parseInt(incomeAmount.value)
    }
    ENTRY_LIST.push(income);

    updateUI();
    clearInput( [incomeTitle, incomeAmount] )
})

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// HELPERS

function openResources(){
    // window.location.href = "resources.html";
    window.open("resources.html", "_blank");
}

function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if( targetBtn.id == DELETE ){
        deleteEntry(entry);
    }else if(targetBtn.id == EDIT ){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);

    updateUI();
}

function editEntry(entry){
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type == "income"){
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    }else if(ENTRY.type == "expense"){
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateUI(){
    console.log('updateUI');
    // document.getElementById("inputIframe").style.display = "none"; //shows the frame

    // document.getElementById('dateInput').value = new Date().toDateInputValue();


    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    // DETERMINE SIGN OF BALANCE
    let sign = (income >= outcome) ? "$" : "-$";

    // UPDATE UI
    // dashTitle.innerHTML = `${currentMonth}'s Dashboard`;
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`;
    incomeTotalEl.innerHTML = `<small>$</small>${income}`;

    

    clearElement( [expenseList, incomeList, allList] );

    ENTRY_LIST.forEach( (entry, index) => {
        if( entry.type == "expense" ){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index)
        }else if( entry.type == "income" ){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index)
    });

    updateChart(income, outcome);

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id){

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: $${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let sum = 0;

    list.forEach( entry => {
        if( entry.type == type ){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome){
    return income - outcome;
}

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    })
}
function show(element){
    element.classList.remove("hide");
}

function hide( elements ){
    elements.forEach( element => {
        element.classList.add("hide");
    })
}

function active(element){
    element.classList.add("active");
}

function inactive( elements ){
    elements.forEach( element => {
        element.classList.remove("active");
    })
}

function openInput() {
     console.log('openInput()');
     document.getElementById("inputIframe").style.display = "block"; //shows the frame
 }

 function hideInput() {
     console.log('hideInput()');
     document.getElementById("inputIframe").style.display = "none"; //hides the frame
}


/////////////////// BRIANNA CODE ////////////////////////////////////////////////////////////////



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

/* function transactionSubmission() { 
    console.log("submittrans");

    // hide inputsPage.html
    // hideInput();

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


    // window.location.href = 'index.html';

}
*/