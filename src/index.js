/* INPUTS */
const input_budget = document.querySelector("#budget-input");
const input_expense = document.querySelector("#expense-input");
const input_expense_desc = document.querySelector("#expense-description");

/* BUTTONS */
const btn_calcultate = document.querySelector("#calculate");
const btn_add_expense = document.querySelector("#add-expense");

/* CALCULATE VALUES */
const budget_amount = document.querySelector("#budget-amount");
const expenses_amount = document.querySelector("#expenses-amount");
const balance_amount = document.querySelector("#balance-amount");

/* MESSAGES */
const expense_message = document.querySelector("#expense-message");
const budget_message = document.querySelector("#budget-message");

var budget;
const object_data = {
  budget_amount: 0,
  total_expenses: 0,
  balance: 0,
  expenses: []
};

/* INITIALIZE LOCAL-STORAGE */
if (localStorage.getItem("budget")) {
  budget = JSON.parse(localStorage.getItem("budget"));
  setValues();
} else {
  localStorage.setItem("budget", JSON.stringify(object_data));
  budget = object_data;
}

btn_calcultate.addEventListener("click", addBudget, false);
btn_add_expense.addEventListener("click", addExpense, false);
input_budget.addEventListener("keypress", onlyDecimals, false);
input_expense.addEventListener("keypress", onlyDecimals, false);

/* VALIDATIONS FOR BUTTON TO ADD A BUDGET VALUE */
function addBudget() {
  if (input_budget.value === "") {
    budget_message.style.display = "block";
  } else {
    budget_message.style.display = "none";
    calculate(false);
  }
}

/* VALIDATIONS FOR BUTTON TO ADD AN EXPENSE VALUE */
function addExpense() {
  if (input_expense.value === "" || input_expense_desc.value === "") {
    expense_message.style.display = "block";
  } else {
    expense_message.style.display = "none";
    budget.expenses.push({
      title: input_expense_desc.value,
      value: input_expense.value
    });
    calculate(true);
  }
}

function calculate(val) {
  if (!val) {
    budget.budget_amount = input_budget.value;
  }
  budget.total_expenses = calculateExpenses();
  budget.balance = budget.budget_amount - budget.total_expenses;
  localStorage.setItem("budget", JSON.stringify(budget));
  setValues();
}

/* SETTING THE VALUES FOR LOCAL-STORAGE */
function setValues() {
  budget_amount.innerHTML = `$ ${budget.budget_amount}`;
  expenses_amount.innerHTML = `$ ${budget.total_expenses}`;
  balance_amount.innerHTML = `$ ${budget.balance}`;
  input_budget.value = "";
  input_expense_desc.value = "";
  input_expense.value = "";
  if (budget.balance >= 0) {
    balance_amount.classList.remove("danger-color");
    balance_amount.classList.add("success-color");
  } else {
    balance_amount.classList.remove("success-color");
    balance_amount.classList.add("danger-color");
  }
  showListExpenses();
}

function calculateExpenses() {
  let total = 0;
  if (budget.expenses) {
    for (let item of budget.expenses) {
      total += parseFloat(item.value);
    }
  }
  return total;
}

/* FUNCTION TO CREATE A LIST OF ALL EXPENSES */
function showListExpenses() {
  let content = "";
  for (let [index, item] of budget.expenses.entries()) {
    let divs = `
      <div class="list-item">
        <div class="col">- ${item.title}</div>
        <div class="col">$ ${item.value}</div>
        <div class="col">
          <i id="${index}" class="edit-button fa fa-edit"></i>
          <i id="${index}" class="delete-button fa fa-trash"></i>
        </div>
      </div>
    `;
    content += divs;
  }
  let el = document.querySelector("#expenses-list");
  el.innerHTML = content;

  setEvents();
}

function setEvents() {
  const editButtons = document.querySelectorAll(".edit-button");
  const deleteButtons = document.querySelectorAll(".delete-button");

  editButtons.forEach(item => {
    item.addEventListener("click", editExpense, false);
  });
  deleteButtons.forEach(item => {
    item.addEventListener("click", deleteExpense, false);
  });
}

function editExpense(e) {
  let id = e.target.id;
  let title = budget.expenses[id].title;
  let value = budget.expenses[id].value;
  budget.expenses.splice(id, 1);
  calculate(true);
  input_expense_desc.value = title;
  input_expense.value = value;
}

function deleteExpense(e) {
  let id = e.target.id;
  budget.expenses.splice(id, 1);
  calculate(true);
}

function onlyDecimals(event) {
  if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode === 46) {
    return true;
  } else {
    event.preventDefault();
  }
}
