/**
 * Render the finance dashboard
 */
function renderFinanceDashboard() {
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
    dashboardTitle.textContent = 'Finance Dashboard';
    
    const manageBudgetsButton = document.createElement('button');
    manageBudgetsButton.className = 'btn';
    manageBudgetsButton.textContent = 'Manage Budgets';
    manageBudgetsButton.addEventListener('click', () => {
        Router.navigate('budgets');
    });
    
    dashboardHeader.appendChild(dashboardTitle);
    dashboardHeader.appendChild(manageBudgetsButton);
    
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    
    // Create dashboard stats
    const dashboardStats = document.createElement('div');
    dashboardStats.className = 'dashboard-cards';
    
    // Create stat cards
    const totalBudget = createStatCard('Total Budget', '$0', 'All departments');
    const totalExpenses = createStatCard('Total Expenses', '$0', 'All departments');
    const pendingPayments = createStatCard('Pending Payments', '$0', 'Ready for payment');
    const departmentCount = createStatCard('Total Departments', '0', 'Active departments');
    
    dashboardStats.appendChild(totalBudget);
    dashboardStats.appendChild(totalExpenses);
    dashboardStats.appendChild(pendingPayments);
    dashboardStats.appendChild(departmentCount);
    
    // Create tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';
    
    // We'll create individual tab sections instead of separating headers and content
    
    // Expenses for Payment tab
    const approvedSection = document.createElement('div');
    approvedSection.className = 'tab-section';
    
    const approvedTab = document.createElement('div');
    approvedTab.className = 'tab active';
    approvedTab.textContent = 'Expenses for Payment';
    approvedTab.dataset.tab = 'approved';
    
    const approvedContent = document.createElement('div');
    approvedContent.className = 'tab-content active';
    approvedContent.dataset.tab = 'approved';
    
    // Create expenses table for approved tab
    const approvedTable = createExpensesTable('approvedTableBody');
    approvedContent.appendChild(approvedTable);
    
    approvedSection.appendChild(approvedTab);
    approvedSection.appendChild(approvedContent);
    
    // Paid Expenses tab
    const paidSection = document.createElement('div');
    paidSection.className = 'tab-section';
    
    const paidTab = document.createElement('div');
    paidTab.className = 'tab';
    paidTab.textContent = 'Paid Expenses';
    paidTab.dataset.tab = 'paid';
    
    const paidContent = document.createElement('div');
    paidContent.className = 'tab-content';
    paidContent.dataset.tab = 'paid';
    
    // Create expenses table for paid tab
    const paidTable = createExpensesTable('paidTableBody');
    paidContent.appendChild(paidTable);
    
    paidSection.appendChild(paidTab);
    paidSection.appendChild(paidContent);
    
    // Department Budgets tab
    const budgetsSection = document.createElement('div');
    budgetsSection.className = 'tab-section';
    
    const budgetsTab = document.createElement('div');
    budgetsTab.className = 'tab';
    budgetsTab.textContent = 'Department Budgets';
    budgetsTab.dataset.tab = 'budgets';
    
    const budgetsContent = document.createElement('div');
    budgetsContent.className = 'tab-content';
    budgetsContent.dataset.tab = 'budgets';
    
    // Create budgets table
    const budgetsTable = createBudgetsTable('budgetsTableBody');
    budgetsContent.appendChild(budgetsTable);
    
    budgetsSection.appendChild(budgetsTab);
    budgetsSection.appendChild(budgetsContent);
    
    // Reports tab
    const reportsSection = document.createElement('div');
    reportsSection.className = 'tab-section';
    
    const reportsTab = document.createElement('div');
    reportsTab.className = 'tab';
    reportsTab.textContent = 'Reports';
    reportsTab.dataset.tab = 'reports';
    
    const reportsContent = document.createElement('div');
    reportsContent.className = 'tab-content';
    reportsContent.dataset.tab = 'reports';
    
    // Create reports container
    const reportsContainer = document.createElement('div');
    reportsContainer.className = 'reports-container';
    
    // Create charts container
    const chartsContainer = document.createElement('div');
    chartsContainer.className = 'charts-container';
    
    // Add placeholder for charts (in a real app, we would use a charting library)
    const chartPlaceholder = document.createElement('div');
    chartPlaceholder.className = 'chart-placeholder';
    chartPlaceholder.textContent = 'Expense charts and reports will be displayed here.';
    
    chartsContainer.appendChild(chartPlaceholder);
    reportsContainer.appendChild(chartsContainer);
    reportsContent.appendChild(reportsContainer);
    
    reportsSection.appendChild(reportsTab);
    reportsSection.appendChild(reportsContent);
    
    // Add all sections to the tabs container
    tabsContainer.appendChild(approvedSection);
    tabsContainer.appendChild(paidSection);
    tabsContainer.appendChild(budgetsSection);
    tabsContainer.appendChild(reportsSection);
    
    // Add event listeners to tabs
    const tabs = tabsContainer.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab content
            const tabContents = tabsContainer.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show content for clicked tab
            const tabContentToShow = tabsContainer.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`);
            tabContentToShow.classList.add('active');
        });
    });
    
    // Append all elements to dashboard container
    dashboardContainer.appendChild(dashboardHeader);
    dashboardContainer.appendChild(alertContainer);
    dashboardContainer.appendChild(dashboardStats);
    dashboardContainer.appendChild(tabsContainer);
    
    // Append dashboard container to app element
    appElement.appendChild(dashboardContainer);
    
    // Load data
    loadFinanceData();
    
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
 * Create expenses table
 * @param {string} tableBodyId - ID for the table body
 * @returns {HTMLElement} - Table element
 */
function createExpensesTable(tableBodyId) {
    const tableContainer = document.createElement('div');
    tableContainer.className = 'card';
    
    // Create expenses table
    const expensesTable = document.createElement('table');
    expensesTable.className = 'table';
    
    // Create table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Department', 'Employee', 'Expense', 'Amount', 'Date', 'Status', 'Actions'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    tableHeader.appendChild(headerRow);
    expensesTable.appendChild(tableHeader);
    
    // Create table body
    const tableBody = document.createElement('tbody');
    tableBody.id = tableBodyId;
    
    // Add placeholder message
    const placeholderRow = document.createElement('tr');
    const placeholderCell = document.createElement('td');
    placeholderCell.colSpan = headers.length;
    placeholderCell.textContent = 'Loading expenses...';
    placeholderCell.style.textAlign = 'center';
    placeholderRow.appendChild(placeholderCell);
    tableBody.appendChild(placeholderRow);
    
    expensesTable.appendChild(tableBody);
    tableContainer.appendChild(expensesTable);
    
    return tableContainer;
}

/**
 * Create budgets table
 * @param {string} tableBodyId - ID for the table body
 * @returns {HTMLElement} - Table element
 */
function createBudgetsTable(tableBodyId) {
    const tableContainer = document.createElement('div');
    tableContainer.className = 'card';
    
    // Create budgets table
    const budgetsTable = document.createElement('table');
    budgetsTable.className = 'table';
    
    // Create table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Department', 'Budget Amount', 'Used', 'Remaining', 'Used %', 'Actions'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    tableHeader.appendChild(headerRow);
    budgetsTable.appendChild(tableHeader);
    
    // Create table body
    const tableBody = document.createElement('tbody');
    tableBody.id = tableBodyId;
    
    // Add placeholder message
    const placeholderRow = document.createElement('tr');
    const placeholderCell = document.createElement('td');
    placeholderCell.colSpan = headers.length;
    placeholderCell.textContent = 'Loading budgets...';
    placeholderCell.style.textAlign = 'center';
    placeholderRow.appendChild(placeholderCell);
    tableBody.appendChild(placeholderRow);
    
    budgetsTable.appendChild(tableBody);
    tableContainer.appendChild(budgetsTable);
    
    return tableContainer;
}

/**
 * Load finance data for the dashboard
 */
async function loadFinanceData() {
    try {
        // Show loading
        showLoading();
        
        // Check if user is authenticated and has finance role
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || currentUser.role !== 'FINANCE') {
            console.error('Unauthorized access to finance dashboard');
            Router.navigate('login');
            return;
        }
        
        // Check if at least one of the table elements exists before proceeding
        const approvedTable = document.getElementById('approvedTableBody');
        const budgetsTable = document.getElementById('budgetsTableBody');
        if (!approvedTable || !budgetsTable) {
            console.error('Finance dashboard tables not found in DOM. Aborting data load.');
            hideLoading();
            return;
        }
        
        try {
            // Load expenses and budgets in parallel
            // Handle potential errors with each request individually
            let expensesResponse;
            try {
                console.log('Fetching expenses...');
                expensesResponse = await Api.get(ApiEndpoints.expenses.getAll);
                console.log('Expenses response:', expensesResponse);
            } catch (expensesError) {
                console.error('Error fetching expenses:', expensesError);
                expensesResponse = {
                    success: false,
                    message: 'Failed to load expenses: ' + (expensesError.message || 'Unknown error'),
                    data: []
                };
            }
            
            let budgetsResponse;
            try {
                console.log('Fetching budgets...');
                budgetsResponse = await Api.get(ApiEndpoints.budgets.getAll);
                console.log('Budgets response:', budgetsResponse);
            } catch (budgetsError) {
                console.error('Error fetching budgets:', budgetsError);
                budgetsResponse = {
                    success: false,
                    message: 'Failed to load budgets: ' + (budgetsError.message || 'Unknown error'),
                    data: []
                };
            }
            
            // Hide loading
            hideLoading();
            
            // Process expenses data
            if (expensesResponse && expensesResponse.success) {
                const expenses = expensesResponse.data;
                
                // Update tables
                const approvedExpenses = expenses.filter(e => e.status === 'APPROVED');
                const paidExpenses = expenses.filter(e => e.status === 'PAID');
                
                updateExpensesTable('approvedTableBody', approvedExpenses);
                updateExpensesTable('paidTableBody', paidExpenses);
                
                // Update stats
                updateExpenseStats(expenses);
            } else {
                const errorMsg = expensesResponse ? expensesResponse.message : 'Failed to load expenses';
                showAlert(errorMsg, 'danger', 'alertContainer');
            }
            
            // Process budgets data
            if (budgetsResponse && budgetsResponse.success) {
                const budgets = budgetsResponse.data;
                
                // Update budgets table
                updateBudgetsTable(budgets);
                
                // Update budget stats
                updateBudgetStats(budgets);
            } else {
                const errorMsg = budgetsResponse ? budgetsResponse.message : 'Failed to load budgets';
                showAlert(errorMsg, 'warning', 'alertContainer');
            }
        } catch (apiError) {
            console.error('API error loading finance data:', apiError);
            showAlert('Error communicating with the server. Please try again later.', 'danger', 'alertContainer');
            hideLoading();
        }
    } catch (error) {
        console.error('Error loading finance data:', error);
        showAlert('An error occurred while loading finance data', 'danger', 'alertContainer');
        hideLoading();
    }
}

/**
 * Update expenses table
 * @param {string} tableBodyId - ID of the table body
 * @param {Array} expenses - Expenses to display
 */
function updateExpensesTable(tableBodyId, expenses) {
    // Debug log the parameters
    console.log(`Updating finance table with ID: "${tableBodyId}"`, typeof tableBodyId);
    console.log(`Finance expenses data:`, expenses);
    
    const tableBody = document.getElementById(tableBodyId);
    
    // Check if the element exists before trying to update it
    if (!tableBody) {
        console.error(`Cannot find table body element with ID: ${tableBodyId}`);
        return;
    }
    
    // Clear previous content
    tableBody.innerHTML = '';
    
    // If no expenses, show message
    if (!expenses || expenses.length === 0) {
        const placeholderRow = document.createElement('tr');
        const placeholderCell = document.createElement('td');
        placeholderCell.colSpan = 7;
        placeholderCell.textContent = 'No expenses found.';
        placeholderCell.style.textAlign = 'center';
        placeholderRow.appendChild(placeholderCell);
        tableBody.appendChild(placeholderRow);
        return;
    }
    
    // Add expenses to table
    expenses.forEach(expense => {
        try {
            const row = document.createElement('tr');
            
            // Department cell - safely access nested properties
            const departmentCell = document.createElement('td');
            if ( expense.department && expense.department.name) {
                departmentCell.textContent = expense.department.name;
            } else {
                departmentCell.textContent = 'Unknown';
            }
            row.appendChild(departmentCell);
            
            // Employee cell
            const employeeCell = document.createElement('td');
            if (expense.employee && expense.employee.name) {
                employeeCell.textContent = expense.employee.name;
            } else {
                employeeCell.textContent = 'Unknown';
            }
            row.appendChild(employeeCell);
            
            // Expense name cell
            const expenseCell = document.createElement('td');
            expenseCell.textContent = expense.name || 'No name';
            row.appendChild(expenseCell);
            
            // Amount cell
            const amountCell = document.createElement('td');
            amountCell.textContent = expense.amount ? `$${expense.amount.toFixed(2)}` : '$0.00';
            row.appendChild(amountCell);
            
            // Date cell
            const dateCell = document.createElement('td');
            if (expense.date) {
                // Handle date that comes as a string "YYYY-MM-DD"
                if (typeof expense.date === 'string') {
                    dateCell.textContent = new Date(expense.date).toLocaleDateString();
                } 
                // Handle date that comes as an array [YYYY, MM, DD]
                else if (Array.isArray(expense.date) && expense.date.length >= 3) {
                    const [year, month, day] = expense.date;
                    // Note: month is 0-indexed in JavaScript Date
                    dateCell.textContent = new Date(year, month - 1, day).toLocaleDateString();
                }
                // Handle Date object directly
                else if (expense.date instanceof Date) {
                    dateCell.textContent = expense.date.toLocaleDateString();
                }
                else {
                    dateCell.textContent = 'Invalid date format';
                }
            } else {
                dateCell.textContent = 'No date';
            }
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
            
            // For approved expenses, show mark as paid button
            if (expense.status === 'APPROVED') {
                const payButton = document.createElement('button');
                payButton.className = 'btn btn-success';
                payButton.innerHTML = '<i class="fas fa-money-bill-wave"></i>';
                payButton.title = 'Mark as Paid';
                payButton.style.marginRight = '5px';
                payButton.addEventListener('click', () => {
                    if (confirm('Mark this expense as paid?')) {
                        markExpenseAsPaid(expense.id);
                    }
                });
                actionsCell.appendChild(payButton);
            }
            
            // View button
            const viewButton = document.createElement('button');
            viewButton.className = 'btn';
            viewButton.innerHTML = '<i class="fas fa-eye"></i>';
            viewButton.title = 'View Details';
            viewButton.addEventListener('click', () => {
                // Use the UI utilities modal function
                if (window.UI && typeof window.UI.showExpenseDetailModal === 'function') {
                    window.UI.showExpenseDetailModal(expense);
                } else {
                    // Fallback to the old alert method if function not available
                    // Build a safe details string
                    const department = expense.employee && expense.employee.department && expense.employee.department.name 
                        ? expense.employee.department.name : 'Unknown';
                    const employee = expense.employee && expense.employee.name ? expense.employee.name : 'Unknown';
                    const name = expense.name || 'No name';
                    const amount = expense.amount ? `$${expense.amount.toFixed(2)}` : '$0.00';
                    const type = expense.type || 'Unknown';
                    const date = expense.date ? new Date(expense.date).toLocaleDateString() : 'No date';
                    const status = expense.status || 'Unknown';
                    const receiptUrl = expense.receiptUrl ? `Receipt: ${expense.receiptUrl}` : '';
                    
                    alert(`
                        Expense Details:
                        Department: ${department}
                        Employee: ${employee}
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
            
            row.appendChild(actionsCell);
            
            tableBody.appendChild(row);
        } catch (error) {
            console.error('Error rendering expense row:', error, expense);
        }
    });
}

/**
 * Update budgets table
 * @param {Array} budgets - Budgets to display
 */
function updateBudgetsTable(budgets) {
    // Debug budget data
    console.log('Budget data:', budgets);
    
    const tableBody = document.getElementById('budgetsTableBody');
    
    // Check if the element exists before trying to update it
    if (!tableBody) {
        console.error('Cannot find budgets table body element');
        return;
    }
    
    // Clear previous content
    tableBody.innerHTML = '';
    
    // If no budgets, show message
    if (!budgets || budgets.length === 0) {
        const placeholderRow = document.createElement('tr');
        const placeholderCell = document.createElement('td');
        placeholderCell.colSpan = 6;
        placeholderCell.textContent = 'No budgets found.';
        placeholderCell.style.textAlign = 'center';
        placeholderRow.appendChild(placeholderCell);
        tableBody.appendChild(placeholderRow);
        return;
    }
    
    // Add budgets to table
    budgets.forEach(budget => {
        try {
            const row = document.createElement('tr');
            
            // Department cell
            const departmentCell = document.createElement('td');
            if (budget.department && budget.department.name) {
                departmentCell.textContent = budget.department.name;
            } else {
                departmentCell.textContent = 'Unknown';
            }
            row.appendChild(departmentCell);
            
            // Budget amount cell
            const amountCell = document.createElement('td');
            amountCell.textContent = budget.amount ? `$${budget.amount.toFixed(2)}` : '$0.00';
            row.appendChild(amountCell);
            
            // Used amount cell
            const usedCell = document.createElement('td');
            usedCell.textContent = budget.used ? `$${budget.used.toFixed(2)}` : '$0.00';
            row.appendChild(usedCell);
            
            // Remaining amount cell
            const remainingCell = document.createElement('td');
            remainingCell.textContent = budget.remaining ? `$${budget.remaining.toFixed(2)}` : '$0.00';
            row.appendChild(remainingCell);
            
            // Usage percentage cell
            const percentCell = document.createElement('td');
            let usagePercent = 0;
            if (budget.amount && budget.used && budget.amount > 0) {
                usagePercent = (budget.used / budget.amount) * 100;
            }
            percentCell.textContent = `${usagePercent.toFixed(2)}%`;
            
            // Color-code based on usage
            if (usagePercent >= 90) {
                percentCell.className = 'danger';
            } else if (usagePercent >= 75) {
                percentCell.className = 'warning';
            } else {
                percentCell.className = 'success';
            }
            
            row.appendChild(percentCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            
            // Edit button
            const editButton = document.createElement('button');
            editButton.className = 'btn';
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.title = 'Edit Budget';
            editButton.style.marginRight = '5px';
            editButton.addEventListener('click', () => {
                if (budget.id) {
                    Router.navigate(`editBudget/${budget.id}`);
                } else {
                    alert('Cannot edit budget: Missing ID');
                }
            });
            actionsCell.appendChild(editButton);
            
            // View expenses button
            const viewButton = document.createElement('button');
            viewButton.className = 'btn';
            viewButton.innerHTML = '<i class="fas fa-list"></i>';
            viewButton.title = 'View Department Expenses';
            viewButton.addEventListener('click', () => {
                if (budget.department && budget.department.id) {
                    Router.navigate(`departmentExpenses/${budget.department.id}`);
                } else {
                    alert('Cannot view expenses: Missing department ID');
                }
            });
            actionsCell.appendChild(viewButton);
            
            row.appendChild(actionsCell);
            
            tableBody.appendChild(row);
        } catch (error) {
            console.error('Error rendering budget row:', error, budget);
        }
    });
}

/**
 * Update expense statistics
 * @param {Array} expenses - All expenses
 */
function updateExpenseStats(expenses) {
    if (!expenses) return;
    
    // Get total expenses amount
    const totalAmount = expenses.reduce((total, e) => total + e.amount, 0);
    
    // Get approved expenses amount (pending payment)
    const approvedAmount = expenses
        .filter(e => e.status === 'APPROVED')
        .reduce((total, e) => total + e.amount, 0);
    
    // Update stats
    const statCards = document.querySelectorAll('.stat-card');
    
    // Update total expenses
    statCards[1].querySelector('.stat-card-value').textContent = `$${totalAmount.toFixed(2)}`;
    
    // Update pending payments
    statCards[2].querySelector('.stat-card-value').textContent = `$${approvedAmount.toFixed(2)}`;
}

/**
 * Update budget statistics
 * @param {Array} budgets - All budgets
 */
function updateBudgetStats(budgets) {
    if (!budgets) return;
    
    // Get total budget amount
    const totalBudget = budgets.reduce((total, b) => total + b.amount, 0);
    
    // Get department count
    const departmentCount = budgets.length;
    
    // Update stats
    const statCards = document.querySelectorAll('.stat-card');
    
    // Update total budget
    statCards[0].querySelector('.stat-card-value').textContent = `$${totalBudget.toFixed(2)}`;
    
    // Update department count
    statCards[3].querySelector('.stat-card-value').textContent = departmentCount;
}

/**
 * Mark an expense as paid
 * @param {number} expenseId - The ID of the expense to mark as paid
 */
async function markExpenseAsPaid(expenseId) {
    try {
        // Show loading
        showLoading();
        
        // Call API to mark expense as paid
        try {
            const response = await Api.put(ApiEndpoints.expenses.markAsPaid(expenseId), {});
            
            // Hide loading
            hideLoading();
            
            if (response && response.success) {
                showAlert('Expense marked as paid successfully', 'success', 'alertContainer');
                
                // Reload data
                loadFinanceData();
            } else {
                const errorMsg = response ? response.message : 'Failed to mark expense as paid';
                showAlert(errorMsg, 'danger', 'alertContainer');
            }
        } catch (apiError) {
            console.error('API error marking expense as paid:', apiError);
            showAlert('Error communicating with the server. Please try again later.', 'danger', 'alertContainer');
            hideLoading();
        }
    } catch (error) {
        console.error('Error marking expense as paid:', error);
        showAlert('An error occurred while marking the expense as paid', 'danger', 'alertContainer');
        hideLoading();
    }
} 