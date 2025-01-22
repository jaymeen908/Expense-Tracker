const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const transactionForm = document.getElementById('transaction-form');
const transactionListEl = document.getElementById('transactions');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const netIncomeEl = document.getElementById('net-income');
const searchInput = document.getElementById('search');
const themeToggle = document.getElementById('theme-toggle');
const toast = document.getElementById('toast');

// Show Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update UI
function updateUI() {
    transactionListEl.innerHTML = transactions.length
        ? ''
        : '<li class="empty">No transactions yet.</li>';
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${transaction.date} - ${transaction.description} (${transaction.category}): 
            <strong>${transaction.amount > 0 ? '+' : ''}$${transaction.amount.toFixed(2)}</strong>
            <button onclick="deleteTransaction(${index})">Delete</button>
        `;
        if (transaction.amount > 0) totalIncome += transaction.amount;
        else totalExpenses += Math.abs(transaction.amount);
        transactionListEl.appendChild(li);
    });

    totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
    netIncomeEl.textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
}

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveToLocalStorage();
    updateUI();
    showToast('Transaction deleted successfully');
}

// Add Transaction
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!date || !description || !category || isNaN(amount)) {
        showToast('Please fill all fields.');
        return;
    }

    transactions.push({ date, description, category, amount });
    saveToLocalStorage();
    updateUI();
    transactionForm.reset();
    showToast('Transaction added successfully');
});

// Search Transactions
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTransactions = transactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm)
    );
    updateFilteredUI(filteredTransactions);
});

function updateFilteredUI(filteredTransactions) {
    transactionListEl.innerHTML = filteredTransactions.length
        ? ''
        : '<li class="empty">No matching transactions.</li>';
    filteredTransactions.forEach((transaction) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${transaction.date} - ${transaction.description} (${transaction.category}): 
            <strong>${transaction.amount > 0 ? '+' : ''}$${transaction.amount.toFixed(2)}</strong>
        `;
        transactionListEl.appendChild(li);
    });
}

// Clear Search
document.getElementById('clear-search').addEventListener('click', () => {
    searchInput.value = '';
    updateUI();
});

// Toggle Dark Mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    saveToLocalStorage();
});

// Initialize
updateUI();
