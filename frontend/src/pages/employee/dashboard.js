/**
 * Render the employee dashboard
 */
function renderEmployeeDashboard() {
    const appElement = document.getElementById('app');
    
    // Clear previous content
    appElement.innerHTML = '';
    
    // Add navbar
    appElement.appendChild(createNavbar());
    
    // Create dashboard container
    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'container';
    
    // Create dashboard header
    const dashboardHeader = document.createElement('div');
    dashboardHeader.className = 'dashboard-header';
    
    const dashboardTitle = document.createElement('h2');
    dashboardTitle.className = 'dashboard-title';
    dashboardTitle.textContent = 'Employee Dashboard';
    
    const addExpenseButton = document.createElement('button');
    addExpenseButton.className = 'btn';
    addExpenseButton.textContent = 'Add New Expense';
    addExpenseButton.addEventListener('click', () => {
        Router.navigate('addExpense');
    });
    
    dashboardHeader.appendChild(dashboardTitle);
    dashboardHeader.appendChild(addExpenseButton);
    
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    
    // Create dashboard stats
    const dashboardStats = document.createElement('div');
    dashboardStats.className = 'dashboard-cards';
    
    // Create stat cards
    const pendingExpenses = createStatCard('Pending Expenses', '0', 'Awaiting approval');
    const approvedExpenses = createStatCard('Approved Expenses', '0', 'Ready for payment');
    const rejectedExpenses = createStatCard('Rejected Expenses', '0', 'Not approved');
    const totalExpenses = createStatCard('Total Expenses', '0', 'All time');
    
    dashboardStats.appendChild(pendingExpenses);
    dashboardStats.appendChild(approvedExpenses);
    dashboardStats.appendChild(rejectedExpenses);
    dashboardStats.appendChild(totalExpenses);
    
    // Create expenses table card
    const expensesCard = document.createElement('div');
    expensesCard.className = 'card';
    
    const expensesCardHeader = document.createElement('div');
    expensesCardHeader.className = 'card-header';
    expensesCardHeader.textContent = 'Your Expenses';
    
    const expensesCardBody = document.createElement('div');
    expensesCardBody.className = 'card-body';
    
    // Create expenses table
    const expensesTable = document.createElement('table');
    expensesTable.className = 'table';
    
    // Create table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Department', 'Name', 'Type', 'Amount',  'Date', 'Status', 'Actions'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    tableHeader.appendChild(headerRow);
    expensesTable.appendChild(tableHeader);
    
    // Create table body
    const tableBody = document.createElement('tbody');
    tableBody.id = 'expensesTableBody';
    
    // Add placeholder message if no expenses
    const placeholderRow = document.createElement('tr');
    const placeholderCell = document.createElement('td');
    placeholderCell.colSpan = headers.length;
    placeholderCell.textContent = 'Loading expenses...';
    placeholderCell.style.textAlign = 'center';
    placeholderRow.appendChild(placeholderCell);
    tableBody.appendChild(placeholderRow);
    
    expensesTable.appendChild(tableBody);
    expensesCardBody.appendChild(expensesTable);
    
    expensesCard.appendChild(expensesCardHeader);
    expensesCard.appendChild(expensesCardBody);
    
    // Append all elements to dashboard container
    dashboardContainer.appendChild(dashboardHeader);
    dashboardContainer.appendChild(alertContainer);
    dashboardContainer.appendChild(dashboardStats);
    dashboardContainer.appendChild(expensesCard);
    
    // Append dashboard container to app element
    appElement.appendChild(dashboardContainer);
    
    // Load user expenses
    loadUserExpenses();
    
    // Hide loading
    hideLoading();
}

/**
 * Create a stat card for the dashboard
 * @param {string} label - Card label
 * @param {string} value - Card value
 * @param {string} description - Card description
 * @returns {HTMLElement} - Stat card element
 */
function createStatCard(label, value, description) {
    const statCard = document.createElement('div');
    statCard.className = 'stat-card';
    
    const statCardLabel = document.createElement('div');
    statCardLabel.className = 'stat-card-label';
    statCardLabel.textContent = label;
    
    const statCardValue = document.createElement('div');
    statCardValue.className = 'stat-card-value';
    statCardValue.textContent = value;
    
    const statCardDescription = document.createElement('div');
    statCardDescription.className = 'stat-card-description';
    statCardDescription.textContent = description;
    
    statCard.appendChild(statCardLabel);
    statCard.appendChild(statCardValue);
    statCard.appendChild(statCardDescription);
    
    return statCard;
}

/**
 * Load user expenses for the employee dashboard
 */
async function loadUserExpenses() {
    try {
        // Show loading
        showLoading();
        
        // Get current user
        const user = Auth.getCurrentUser();
        if (!user) {
            Router.navigate('login');
            return;
        }
        
        // Make sure the table element exists before proceeding
        const tableBody = document.getElementById('expensesTableBody');
        if (!tableBody) {
            console.error('Expenses table not found in DOM. Aborting expenses load.');
            hideLoading();
            return;
        }
        

        const userId = user.id || 1;
        
        // Call API to get user expenses
        const response = await Api.get(ApiEndpoints.expenses.getByUser(userId));
        
        // Hide loading
        hideLoading();
        
        if (response.success) {
            const expenses = response.data;
            // Log the raw response data in detail
            console.log('Number of expenses received:', expenses.length);
            
            if (expenses && expenses.length > 0) {
                console.log('First expense object structure:', expenses[0]);
                console.log('Status values found:', [...new Set(expenses.map(e => e.status))]);
            }
            
            // Pass correct table ID parameter
            updateExpensesTable('expensesTableBody', expenses);
            updateDashboardStats(expenses);
        } else {
            showAlert(response.message, 'danger', 'alertContainer');
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
        showAlert('An error occurred while loading expenses', 'danger', 'alertContainer');
        hideLoading();
    }
}

/**
 * Update the expenses table with the loaded expenses
 * @param {string} tableBodyId - ID of the table body to update
 * @param {Array} expenses - List of expenses to display
 */
function updateExpensesTable(tableBodyId, expenses) {
    // Debug log the data
    console.log(`Expenses data for employee dashboard with table ID: "${tableBodyId}":`, expenses);
    
    const tableBody = document.getElementById(tableBodyId);
    
    // Check if the element exists before trying to update it
    if (!tableBody) {
        console.error(`Cannot find expenses table body element with ID: ${tableBodyId}`);
        return;
    }
    
    // Clear previous content
    tableBody.innerHTML = '';
    
    // If no expenses, show message
    if (!expenses || expenses.length === 0) {
        const placeholderRow = document.createElement('tr');
        const placeholderCell = document.createElement('td');
        placeholderCell.colSpan = 7;
        placeholderCell.textContent = 'No expenses found. Add a new expense to get started.';
        placeholderCell.style.textAlign = 'center';
        placeholderRow.appendChild(placeholderCell);
        tableBody.appendChild(placeholderRow);
        return;
    }
    
    // Add expenses to table
    expenses.forEach(expense => {
        try {
            const row = document.createElement('tr');
            
            // Department cell
            const departmentCell = document.createElement('td');
            departmentCell.textContent = expense.department || 'General';
            row.appendChild(departmentCell);
            
            // Name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = expense.name || 'No name';
            row.appendChild(nameCell);
            
            // Type cell
            const typeCell = document.createElement('td');
            typeCell.textContent = expense.type || 'Unknown';
            row.appendChild(typeCell);
            
            // Amount cell
            const amountCell = document.createElement('td');
            amountCell.textContent = expense.amount ? `$${expense.amount.toFixed(2)}` : '$0.00';
            row.appendChild(amountCell);
            
            // Date cell
            const dateCell = document.createElement('td');
            dateCell.textContent = expense.date ? new Date(expense.date).toLocaleDateString() : 'No date';
            row.appendChild(dateCell);
            
            // Status cell
            const statusCell = document.createElement('td');
            statusCell.textContent = expense.status || 'Unknown';
            if (expense.status) {
                statusCell.className = `status-${expense.status.toLowerCase()}`;
            }
            row.appendChild(statusCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            
            // Only show delete button for pending expenses - using plaintext instead of just icon
            console.log('Raw expense data:', JSON.stringify(expense));
            console.log('Expense status:', expense.status, 'Type:', typeof expense.status);
            
            // Check if status is pending using more flexible matching
            const isPending = expense.status === 'PENDING' || 
                             (typeof expense.status === 'string' && expense.status.toUpperCase() === 'PENDING') ||
                             (typeof expense.status === 'string' && expense.status.toUpperCase().includes('PEND'));
            
            console.log('Is expense pending?', isPending);
            
            if (isPending) {
                console.log('Creating delete button for expense ID:', expense.id);
                
                // Create a more obvious delete button with text and icon
                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger';
                deleteButton.textContent = 'Delete';  // Use text instead of just an icon
                deleteButton.style.marginRight = '5px';
                deleteButton.style.backgroundColor = '#e74c3c'; // Force red color
                deleteButton.style.color = 'white';
                deleteButton.style.padding = '4px 8px';
                deleteButton.style.border = 'none';
                deleteButton.style.borderRadius = '3px';
                deleteButton.style.cursor = 'pointer';
                
                deleteButton.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this expense?')) {
                        deleteExpense(expense.id);
                    }
                });
                
                actionsCell.appendChild(deleteButton);
                console.log('Delete button added to DOM');
            }
            
            // View button
            const viewButton = document.createElement('button');
            viewButton.className = 'btn';
            viewButton.innerHTML = '<i class="fas fa-eye"></i>';
            viewButton.addEventListener('click', () => {
                // Use the UI utilities modal function
                if (window.UI && typeof window.UI.showExpenseDetailModal === 'function') {
                    window.UI.showExpenseDetailModal(expense);
                } else {
                    // Fallback to the old alert method if function not available
                    // Build a safe details string
                    const name = expense.name || 'No name';
                    const amount = expense.amount ? `$${expense.amount.toFixed(2)}` : '$0.00';
                    const type = expense.type || 'Unknown';
                    const date = expense.date ? new Date(expense.date).toLocaleDateString() : 'No date';
                    const status = expense.status || 'Unknown';
                    const receiptUrl = expense.receiptUrl ? `Receipt: ${expense.receiptUrl}` : '';
                    
                    alert(`
                        Expense Details:
                        Name: ${name}
                        Amount: ${amount}
                        Type: ${type}
                        Date: ${date}
                        Status: ${status}
                        ${receiptUrl}
                    `);
                }
            });
            actionsCell.appendChild(viewButton);
            
            // Make sure to append actions cell to the row
            row.appendChild(actionsCell);
            console.log('Actions cell appended to row, contains children:', actionsCell.childNodes.length);
            
            // Append row to table body
            tableBody.appendChild(row);
            console.log('Row appended to table body');
        } catch (error) {
            console.error('Error rendering expense row:', error, expense);
        }
    });
}

/**
 * Update dashboard statistics based on expenses
 * @param {Array} expenses - List of expenses
 */
function updateDashboardStats(expenses) {
    if (!expenses) return;
    
    // Get stats
    const pendingCount = expenses.filter(e => e.status === 'PENDING').length;
    const approvedCount = expenses.filter(e => e.status === 'APPROVED').length;
    const rejectedCount = expenses.filter(e => e.status === 'REJECTED').length;
    const totalCount = expenses.length;
    
    // Get total amounts
    const pendingAmount = expenses
        .filter(e => e.status === 'PENDING')
        .reduce((total, e) => total + e.amount, 0);
    
    const approvedAmount = expenses
        .filter(e => e.status === 'APPROVED')
        .reduce((total, e) => total + e.amount, 0);
    
    const totalAmount = expenses
        .reduce((total, e) => total + e.amount, 0);
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    
    // Update pending expenses
    statCards[0].querySelector('.stat-card-value').textContent = `${pendingCount} ($${pendingAmount.toFixed(2)})`;
    
    // Update approved expenses
    statCards[1].querySelector('.stat-card-value').textContent = `${approvedCount} ($${approvedAmount.toFixed(2)})`;
    
    // Update rejected expenses
    statCards[2].querySelector('.stat-card-value').textContent = rejectedCount;
    
    // Update total expenses
    statCards[3].querySelector('.stat-card-value').textContent = `${totalCount} ($${totalAmount.toFixed(2)})`;
}

/**
 * Delete an expense
 * @param {number} expenseId - ID of the expense to delete
 */
async function deleteExpense(expenseId) {
    try {
        // Show loading
        showLoading();
        
        // Call API to delete expense
        const response = await Api.delete(ApiEndpoints.expenses.delete(expenseId));
        
        // Hide loading
        hideLoading();
        
        if (response.success) {
            showAlert('Expense deleted successfully', 'success', 'alertContainer');
            
            // Reload expenses
            loadUserExpenses();
        } else {
            showAlert(response.message, 'danger', 'alertContainer');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        showAlert('An error occurred while deleting the expense', 'danger', 'alertContainer');
        hideLoading();
    }
} 