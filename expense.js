
const transactionForm = document.getElementById("transaction-form");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const transactionList = document.getElementById("transaction-list");
const emptyMessage = document.getElementById("empty-message");

const totalBalanceDisplay = document.getElementById("total-balance");
const totalIncomeDisplay = document.getElementById("total-income");
const totalExpensesDisplay = document.getElementById("total-expenses");

// Store transactions while the page is open.
function loadTransactions() {
  try {
    const savedData = localStorage.getItem("expenseTransactions");

    if (savedData === null) {
      return [];
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData;
  } catch (error) {
    console.error("Could not load saved transactions:", error);
    return [];
  }
}

let transactions = loadTransactions();

function saveTransactions() {
  localStorage.setItem(
    "expenseTransactions",
    JSON.stringify(transactions)
  );
}
// PHASE 1–3: ADD TRANSACTIONS
transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;

  // PHASE 5: VALIDATE INPUTS
  if (description === "") {
    alert("Please enter a description.");
    descriptionInput.focus();
    return;
  }

  if (amountInput.value.trim() === "" ||
      !Number.isFinite(amount) ||
      amount <= 0) {
    alert("Please enter a valid amount greater than zero.");
    amountInput.focus();
    return;
  }

  if (type !== "income" && type !== "expense") {
    alert("Please choose Income or Expense.");
    typeInput.focus();
    return;
  }

  if (category === "") {
    alert("Please choose a category.");
    categoryInput.focus();
    return;
  }

  // Create a transaction object.
  const transaction = {
    id: Date.now(),
    description: description,
    amount: amount,
    type: type,
    category: category
  };

  // Add transaction to the array.
  transactions.push(transaction);

saveTransactions();
displayTransactions();
updateSummary();

  // Clear the form.
  transactionForm.reset();
});

// PHASE 3: DISPLAY TRANSACTIONS
function displayTransactions() {
  transactionList.innerHTML = "";

  if (transactions.length === 0) {
    transactionList.appendChild(emptyMessage);
    return;
  }

  transactions.forEach(function (transaction) {
    const listItem = document.createElement("li");

    const sign = transaction.type === "income" ? "+" : "-";

    const details = document.createElement("span");

    details.textContent =
      transaction.description +
      " | " +
      transaction.category +
      " | " +
      sign +
      "₦" +
      transaction.amount.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    // PHASE 5: DELETE BUTTON
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.style.marginLeft = "10px";
    deleteButton.style.padding = "6px 10px";
    deleteButton.style.backgroundColor = "#dc2626";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.borderRadius = "6px";
    deleteButton.style.cursor = "pointer";

    deleteButton.addEventListener("click", function () {
      deleteTransaction(transaction.id);
    });

    listItem.appendChild(details);
    listItem.appendChild(deleteButton);

    transactionList.appendChild(listItem);
  });
}

// PHASE 4: CALCULATE INCOME, EXPENSES AND BALANCE
function updateSummary() {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach(function (transaction) {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else if (transaction.type === "expense") {
      totalExpenses += transaction.amount;
    }
  });

  const balance = totalIncome - totalExpenses;

  totalIncomeDisplay.textContent =
    "₦" + totalIncome.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  totalExpensesDisplay.textContent =
    "₦" + totalExpenses.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  totalBalanceDisplay.textContent =
    "₦" + balance.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
}

// PHASE 5: DELETE A TRANSACTION
function deleteTransaction(id) {
  transactions = transactions.filter(function (transaction) {
    return transaction.id !== id;
  });

  displayTransactions();
  updateSummary();
  saveTransactions();
}

// Show the initial empty state and zero totals.
displayTransactions();
updateSummary();
