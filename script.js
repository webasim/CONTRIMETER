const expenseForm = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");
const expenseBody = document.getElementById("expenseBody");
const totalExpense = document.getElementById("totalExpense");
const settlement = document.getElementById("settlement");
const expensesSection = document.getElementById("expenses"); // New expenses section
let total = 0;
let contributors = {};

// Hide expenses and settlement initially
expensesSection.style.display = "none";
settlement.style.display = "none";

// Event listener for expense form submission
expenseForm.addEventListener("submit", handleExpenseSubmission);

// Function to handle expense submission
function handleExpenseSubmission(event) {
  event.preventDefault();
  const expenseName = document.getElementById("expenseName").value;
  const expenseAmount = parseFloat(
    document.getElementById("expenseAmount").value
  );
  const contributor = document.getElementById("contributor").value;

  if (expenseName && !isNaN(expenseAmount) && contributor) {
    total += expenseAmount;
    contributors[contributor] =
      (contributors[contributor] || 0) + expenseAmount;
    updateTotal();
    updateSettlement();
    addExpenseToTable(expenseName, expenseAmount, contributor);
    expenseForm.reset();
    expensesSection.style.display = "block"; // Show expenses section after adding an expense
  } else {
    alert("Please fill in all fields correctly.");
  }
}

// Function to update total expenses
function updateTotal() {
  totalExpense.innerHTML = `<strong>Total Expenses: &#8377;${total.toFixed(
    2
  )}</strong>`;
}

// Function to update settlement
function updateSettlement() {
  settlement.innerHTML = "<h2>Settlement</h2>";

  if (Object.keys(contributors).length == 1) {
    settlement.innerHTML += "<p>No settlement required</p>";
    return; // Exit the function early
  }

  const avgExpense = total / Object.keys(contributors).length;
  let netBalances = calculateNetBalances(avgExpense);

  displaySettlementTable(netBalances);
  settlement.style.display = "block"; // Show settlement section after updating settlement
}

// Function to calculate net balances
function calculateNetBalances(avgExpense) {
  let netBalances = {};
  for (const contributor in contributors) {
    netBalances[contributor] = contributors[contributor] - avgExpense;
  }
  return netBalances;
}

// Function to display settlement table
function displaySettlementTable(netBalances) {
  let settlementTable = `
          <table>
              <thead>
                  <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Amount (&#8377;)</th>
                  </tr>
              </thead>
              <tbody>
      `;

  while (true) {
    let { maxCreditor, maxDebtor } = findMaxCreditorAndDebtor(netBalances);

    if (!maxCreditor || !maxDebtor) {
      break;
    }

    const minAmount = Math.min(
      netBalances[maxCreditor],
      -netBalances[maxDebtor]
    );
    netBalances[maxCreditor] -= minAmount;
    netBalances[maxDebtor] += minAmount;

    settlementTable += `
              <tr>
                  <td>${maxDebtor}</td>
                  <td>${maxCreditor}</td>
                  <td>${minAmount.toFixed(2)}</td>
              </tr>
          `;
  }

  settlementTable += `
              </tbody>
          </table>
      `;

  settlement.innerHTML += settlementTable;
}

// Function to find maximum creditor and debtor
function findMaxCreditorAndDebtor(netBalances) {
  let maxCreditor = null;
  let maxDebtor = null;

  for (const contributor in netBalances) {
    if (
      netBalances[contributor] > 0 &&
      (!maxCreditor || netBalances[contributor] > netBalances[maxCreditor])
    ) {
      maxCreditor = contributor;
    } else if (
      netBalances[contributor] < 0 &&
      (!maxDebtor || netBalances[contributor] < netBalances[maxDebtor])
    ) {
      maxDebtor = contributor;
    }
  }

  return { maxCreditor, maxDebtor };
}

// Function to add expense to the table
function addExpenseToTable(expenseName, expenseAmount, contributor) {
  const newRow = `
            <tr>
                <td>${expenseName}</td>
                <td>${expenseAmount}</td>
                <td>${contributor}</td>
            </tr>
        `;
  expenseBody.innerHTML += newRow;
}
