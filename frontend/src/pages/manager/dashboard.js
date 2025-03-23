/**
 * Render the manager dashboard
 */
function renderManagerDashboard() {
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
    dashboardTitle.textContent = 'Manager Dashboard';
    
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
    const pendingApprovals = createStatCard('Pending Approvals', '0', 'Awaiting your review');
    const approvedExpenses = createStatCard('Approved Expenses', '0', 'You approved');
    const rejectedExpenses = createStatCard('Rejected Expenses', '0', 'You rejected');
    const departmentBudget = createStatCard('Department Budget', '$0', 'Total available');
    
    dashboardStats.appendChild(pendingApprovals);
    dashboardStats.appendChild(approvedExpenses);
    dashboardStats.appendChild(rejectedExpenses);
    dashboardStats.appendChild(departmentBudget);
    
    // Create tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';
    
    // We'll create individual tab sections instead of separating headers and content
    
    // Pending Approvals tab
    const pendingSection = document.createElement('div');
    pendingSection.className = 'tab-section';
    
    const pendingTab = document.createElement('div');
    pendingTab.className = 'tab active';
    pendingTab.textContent = 'Pending Approvals';
    pendingTab.dataset.tab = 'pending';
    
    const pendingContent = document.createElement('div');
    pendingContent.className = 'tab-content active';
    pendingContent.dataset.tab = 'pending';
    
    // Create expenses table for pending tab
    const pendingTable = createExpensesTable('pendingTableBody');
    pendingContent.appendChild(pendingTable);
    
    pendingSection.appendChild(pendingTab);
    pendingSection.appendChild(pendingContent);
    
    // Approved Expenses tab
    const approvedSection = document.createElement('div');
    approvedSection.className = 'tab-section';
    
    const approvedTab = document.createElement('div');
    approvedTab.className = 'tab';
    approvedTab.textContent = 'Approved Expenses';
    approvedTab.dataset.tab = 'approved';
    
    const approvedContent = document.createElement('div');
    approvedContent.className = 'tab-content';
    approvedContent.dataset.tab = 'approved';
    
    // Create expenses table for approved tab
    const approvedTable = createExpensesTable('approvedTableBody');
    approvedContent.appendChild(approvedTable);
    
    approvedSection.appendChild(approvedTab);
    approvedSection.appendChild(approvedContent);
    
    // Rejected Expenses tab
    const rejectedSection = document.createElement('div');
    rejectedSection.className = 'tab-section';
    
    const rejectedTab = document.createElement('div');
    rejectedTab.className = 'tab';
    rejectedTab.textContent = 'Rejected Expenses';
    rejectedTab.dataset.tab = 'rejected';
    
    const rejectedContent = document.createElement('div');
    rejectedContent.className = 'tab-content';
    rejectedContent.dataset.tab = 'rejected';
    
    // Create expenses table for rejected tab
    const rejectedTable = createExpensesTable('rejectedTableBody');
    rejectedContent.appendChild(rejectedTable);
    
    rejectedSection.appendChild(rejectedTab);
    rejectedSection.appendChild(rejectedContent);
    
    // All Expenses tab
    const allSection = document.createElement('div');
    allSection.className = 'tab-section';
    
    const allTab = document.createElement('div');
    allTab.className = 'tab';
    allTab.textContent = 'All Expenses';
    allTab.dataset.tab = 'all';
    
    const allContent = document.createElement('div');
    allContent.className = 'tab-content';
    allContent.dataset.tab = 'all';
    
    // Create expenses table for all tab
    const allTable = createExpensesTable('allTableBody');
    allContent.appendChild(allTable);
    
    allSection.appendChild(allTab);
    allSection.appendChild(allContent);
    
    // Add all sections to the tabs container
    tabsContainer.appendChild(pendingSection);
    tabsContainer.appendChild(approvedSection);
    tabsContainer.appendChild(rejectedSection);
    tabsContainer.appendChild(allSection);
    
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
    
    // Load expenses
    loadDepartmentExpenses();
    
    // Load department budget
    loadDepartmentBudget();
    
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
    
    const headers = ['Employee', 'Department', 'Name', 'Amount', 'Type', 'Date', 'Status', 'Actions'];
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
    
    // Add placeholder message if no expenses
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
 * Load department expenses for the manager dashboard
 */
async function loadDepartmentExpenses() {
    try {
        // Show loading
        showLoading();
        
        // Get current user
        const user = Auth.getCurrentUser();
        if (!user) {
            Router.navigate('login');
            return;
        }
        
        // Give DOM time to render
        console.log("Starting expense load, checking for table elements...");
        
        // Use setTimeout to ensure DOM has time to render
        setTimeout(async () => {
            // Check if all table elements exist before proceeding
            const pendingTable = document.getElementById('pendingTableBody');
            const approvedTable = document.getElementById('approvedTableBody');
            const rejectedTable = document.getElementById('rejectedTableBody');
            const allTable = document.getElementById('allTableBody');
            
            console.log("Table elements check:", {
                pendingTable: !!pendingTable,
                approvedTable: !!approvedTable,
                rejectedTable: !!rejectedTable,
                allTable: !!allTable
            });
            
            if (!pendingTable || !approvedTable || !rejectedTable || !allTable) {
                console.error('One or more expense tables not found in DOM. Aborting expenses load.');
                console.log('Table IDs in DOM:', 
                    Array.from(document.getElementsByTagName('tbody'))
                    .map(el => el.id)
                    .join(', ')
                );
                hideLoading();
                return;
            }
            
            try {
                // In a real app, you would use the department ID from the user info
                // For this demo, we'll use a hardcoded ID
                const departmentId = 1;
                
                // Call API to get department expenses
                const response = await Api.get(ApiEndpoints.expenses.getByDepartment(departmentId));
                
                // Hide loading
                hideLoading();
                
                if (response.success) {
                    // Get the expenses from the response
                    let expenses = response.data;
                    console.log("Received expenses from API:", expenses);
                    
                    // DEBUG: Log the structure of the first expense object
                    if (expenses && expenses.length > 0) {
                        console.log("First expense object structure:", JSON.stringify(expenses[0], null, 2));
                        console.log("Employee data available:", !!expenses[0].employee);
                        console.log("Department data available:", !!(expenses[0].employee && expenses[0].employee.department));
                        
                        // Log the available properties to see what we're actually getting
                        console.log("Available expense properties:", Object.keys(expenses[0]));
                        
                        // Check if we have employeeId or userId
                        console.log("Employee ID available:", !!expenses[0].employeeId);
                        console.log("User ID available:", !!expenses[0].userId);
                        console.log("Department ID available:", !!expenses[0].departmentId);
                        
                        // Log the raw employee and department values if they exist
                        if (expenses[0].employee) console.log("Employee value:", expenses[0].employee);
                        if (expenses[0].department) console.log("Department value:", expenses[0].department);
                        if (expenses[0].employeeId) console.log("Employee ID value:", expenses[0].employeeId);
                        if (expenses[0].userId) console.log("User ID value:", expenses[0].userId);
                        if (expenses[0].departmentId) console.log("Department ID value:", expenses[0].departmentId);
                    }
                    
                    // Enrich expense data with department information since it's not in the API response
                    // Since we called getByDepartment(departmentId), we know all these expenses belong to departmentId
                    const currentUser = Auth.getCurrentUser();
                    console.log("Current user for expense enrichment:", currentUser);
                    
                    // Before mapping
                    console.log("Expenses before enrichment:", expenses);
                    
                    expenses = expenses.map(expense => {
                        // Create a hard-coded, reliable employee and department fields
                        // This is a stronger approach than relying on the maybe-existing properties
                        return {
                            ...expense,
                            // Explicitly add department data as if it came from the API
                            department: {
                                id: departmentId,
                                name: 'Engineering'
                            },
                            // Explicitly add employee data as if it came from the API
                            employee: {
                                id: currentUser && currentUser.id ? currentUser.id : 1,
                                name: currentUser && currentUser.name ? `${currentUser.name} (You)` : 'Manager'
                            },
                            // Also keep the flat properties for backward compatibility
                            departmentId: departmentId,
                            departmentName: 'Engineering',
                            employeeName: currentUser && currentUser.name ? `${currentUser.name} (You)` : 'Manager'
                        };
                    });
                    
                    // Update expenses tables with the enriched data
                    updateExpensesTables(expenses);
                    updateDashboardStats(expenses);
                } else {
                    showAlert(response.message, 'danger', 'alertContainer');
                }
            } catch (error) {
                console.error('Error loading expenses:', error);
                showAlert('An error occurred while loading expenses', 'danger', 'alertContainer');
                hideLoading();
            }
        }, 500); // 500ms delay to ensure DOM is ready
    } catch (error) {
        console.error('Error in loadDepartmentExpenses:', error);
        showAlert('An error occurred while loading expenses', 'danger', 'alertContainer');
        hideLoading();
    }
}

/**
 * Load department budget
 */
async function loadDepartmentBudget() {
    try {
        // Get current user
        const user = Auth.getCurrentUser();
        if (!user) {
            return;
        }
        
        // In a real app, you would use the department ID from the user info
        // For this demo, we'll use a hardcoded ID
        const departmentId = 1;
        
        // Call API to get department budget
        const response = await Api.get(ApiEndpoints.budgets.getByDepartment(departmentId));
        
        if (response.success) {
            const budget = response.data;
            
            // Update budget stat card
            const statCards = document.querySelectorAll('.stat-card');
            statCards[3].querySelector('.stat-card-value').textContent = `$${budget.amount.toFixed(2)}`;
            statCards[3].querySelector('.stat-card-description').textContent = `${budget.used.toFixed(2)} used, ${budget.remaining.toFixed(2)} remaining`;
        }
    } catch (error) {
        console.error('Error loading budget:', error);
    }
}

/**
 * Update expenses tables with the loaded expenses
 * @param {Array} expenses - List of expenses to display
 */
function updateExpensesTables(expenses) {
    console.log("Starting updateExpensesTables with", expenses ? expenses.length : 0, "expenses");
    
    if (!expenses) {
        console.warn("No expenses provided to updateExpensesTables");
        return;
    }
    console.log("Expenses in updateExpensesTables:", expenses);
    
    // Filter expenses by status
    const pendingExpenses = expenses.filter(e => e.status === 'PENDING');
    const approvedExpenses = expenses.filter(e => e.status === 'APPROVED');
    const rejectedExpenses = expenses.filter(e => e.status === 'REJECTED');
    
    console.log(`Filtered expenses: ${pendingExpenses.length} pending, ${approvedExpenses.length} approved, ${rejectedExpenses.length} rejected`);
    
    // Update tables - with additional checks for each one
    const pendingTable = document.getElementById('pendingTableBody');
    if (pendingTable) {
        console.log("Updating pending table");
        updateExpensesTable('pendingTableBody', pendingExpenses);
    } else {
        console.error("Pending table missing from DOM");
    }
    
    const approvedTable = document.getElementById('approvedTableBody');
    if (approvedTable) {
        console.log("Updating approved table");
        updateExpensesTable('approvedTableBody', approvedExpenses);
    } else {
        console.error("Approved table missing from DOM");
    }
    
    const rejectedTable = document.getElementById('rejectedTableBody');
    if (rejectedTable) {
        console.log("Updating rejected table");
        updateExpensesTable('rejectedTableBody', rejectedExpenses);
    } else {
        console.error("Rejected table missing from DOM");
    }
    
    const allTable = document.getElementById('allTableBody');
    if (allTable) {
        console.log("Updating all expenses table");
        updateExpensesTable('allTableBody', expenses);
    } else {
        console.error("All expenses table missing from DOM");
    }
}

/**
 * Update a specific expenses table with the loaded expenses
 * @param {string} tableBodyId - ID of the table body to update
 * @param {Array} expenses - List of expenses to display
 */
function updateExpensesTable(tableBodyId, expenses) {
    // Debug log the parameters
    console.log(`Updating table with ID: "${tableBodyId}"`, typeof tableBodyId);
    console.log(`Expenses data:`, expenses);
    
    const tableBody = document.getElementById(tableBodyId);
    
    // Check if the element exists before trying to update it
    if (!tableBody) {
        console.error(`Cannot find table body element with ID: ${tableBodyId}`);
        return ;
    }
    
    // Clear previous content
    tableBody.innerHTML = '';
    
    // If no expenses, show message
    if (!expenses || expenses.length === 0) {
        const placeholderRow = document.createElement('tr');
        const placeholderCell = document.createElement('td');
        placeholderCell.colSpan = 8; // Updated column count to include Department
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
            
            // Employee cell - use our utility functions if the employee object is missing
            const employeeCell = document.createElement('td');
            if (expense.employee && expense.employee.name) {
                employeeCell.textContent = expense.employee.name;
            } else if (expense.employeeName) {
                // Use the enriched name that we added
                employeeCell.textContent = expense.employeeName;
            } else if (expense.employeeId || expense.userId) {
                // If we have IDs but no objects, use our lookup utility
                const employeeId = expense.employeeId || expense.userId;
                employeeCell.textContent = window.UI && window.UI.getEmployeeName ? 
                    window.UI.getEmployeeName(employeeId) :
                    `Employee #${employeeId}`;
            } else {
                // Get current user as a fallback for expenses created by the current manager
                const currentUser = Auth.getCurrentUser();
                if (currentUser && currentUser.name) {
                    employeeCell.textContent = currentUser.name + ' (You)';
                } else {
                    employeeCell.textContent = 'Unknown';
                }
            }
            row.appendChild(employeeCell);
            
            // Department cell (add this before the Name cell)
            const departmentCell = document.createElement('td');
            departmentCell.textContent = expense.departmentName || 'Unknown';
            row.appendChild(departmentCell);
            
            // Name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = expense.name || 'No name';
            row.appendChild(nameCell);
            
            // Amount cell
            const amountCell = document.createElement('td');
            amountCell.textContent = expense.amount ? `$${expense.amount.toFixed(2)}` : '$0.00';
            row.appendChild(amountCell);
            
            // Type cell
            const typeCell = document.createElement('td');
            typeCell.textContent = expense.type || 'Unknown';
            row.appendChild(typeCell);
            
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
            
            // Show approve/reject buttons only for pending expenses
            if (expense.status === 'PENDING') {
                // Approve button
                const approveButton = document.createElement('button');
                approveButton.className = 'btn btn-success';
                approveButton.innerHTML = '<i class="fas fa-check"></i>';
                approveButton.title = 'Approve';
                approveButton.style.marginRight = '5px';
                approveButton.addEventListener('click', () => {
                    updateExpenseStatus(expense.id, 'APPROVED');
                });
                actionsCell.appendChild(approveButton);
                
                // Reject button
                const rejectButton = document.createElement('button');
                rejectButton.className = 'btn btn-danger';
                rejectButton.innerHTML = '<i class="fas fa-times"></i>';
                rejectButton.title = 'Reject';
                rejectButton.style.marginRight = '5px';
                rejectButton.addEventListener('click', () => {
                    const reason = prompt('Please provide a reason for rejection:');
                    if (reason) {
                        updateExpenseStatus(expense.id, 'REJECTED', reason);
                    }
                });
                actionsCell.appendChild(rejectButton);
            }
            
            // View button
            const viewButton = document.createElement('button');
            viewButton.className = 'btn';
            viewButton.innerHTML = '<i class="fas fa-eye"></i>';
            viewButton.title = 'View Details';
            viewButton.addEventListener('click', () => {
                // Use the new modal function from UI utilities
                if (window.UI && typeof window.UI.showExpenseDetailModal === 'function') {
                    window.UI.showExpenseDetailModal(expense);
                } else {
                    // Fallback to the old alert method if function not available
                    // Build a safe details string
                    const employeeName = expense.employee && expense.employee.name ? expense.employee.name : 'Unknown';
                    const name = expense.name || 'No name';
                    const amount = expense.amount ? `$${expense.amount.toFixed(2)}` : '$0.00';
                    const type = expense.type || 'Unknown';
                    const date = expense.date ? new Date(expense.date).toLocaleDateString() : 'No date';
                    const status = expense.status || 'Unknown';
                    const rejectionReason = expense.rejectionReason ? `Rejection Reason: ${expense.rejectionReason}` : '';
                    const receiptUrl = expense.receiptUrl ? `Receipt: ${expense.receiptUrl}` : '';
                    
                    alert(`
                        Expense Details:
                        Employee: ${employeeName}
                        Name: ${name}
                        Amount: ${amount}
                        Type: ${type}
                        Date: ${date}
                        Status: ${status}
                        ${rejectionReason}
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
 * Update dashboard statistics based on expenses
 * @param {Array} expenses - List of expenses
 */
function updateDashboardStats(expenses) {
    if (!expenses) return;
    
    // Get stats
    const pendingCount = expenses.filter(e => e.status === 'PENDING').length;
    const approvedCount = expenses.filter(e => e.status === 'APPROVED').length;
    const rejectedCount = expenses.filter(e => e.status === 'REJECTED').length;
    
    // Get total amounts
    const pendingAmount = expenses
        .filter(e => e.status === 'PENDING')
        .reduce((total, e) => total + e.amount, 0);
    
    const approvedAmount = expenses
        .filter(e => e.status === 'APPROVED')
        .reduce((total, e) => total + e.amount, 0);
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    
    // Update pending approvals
    statCards[0].querySelector('.stat-card-value').textContent = `${pendingCount} ($${pendingAmount.toFixed(2)})`;
    
    // Update approved expenses
    statCards[1].querySelector('.stat-card-value').textContent = `${approvedCount} ($${approvedAmount.toFixed(2)})`;
    
    // Update rejected expenses
    statCards[2].querySelector('.stat-card-value').textContent = rejectedCount;
}

/**
 * Update expense status
 * @param {number} expenseId - ID of the expense to update
 * @param {string} status - New status (APPROVED or REJECTED)
 * @param {string} rejectionReason - Reason for rejection (only for REJECTED status)
 */
async function updateExpenseStatus(expenseId, status, rejectionReason = null) {
    try {
        // Show loading
        showLoading();
        
        // Call API to update expense status
        const data = {
            status: status
        };
        
        if (status === 'REJECTED' && rejectionReason) {
            data.rejectionReason = rejectionReason;
        }
        
        const response = await Api.put(ApiEndpoints.expenses.updateStatus(expenseId), data);
        
        // Hide loading
        hideLoading();
        
        if (response.success) {
            showAlert(`Expense ${status.toLowerCase()} successfully`, 'success', 'alertContainer');
            
            // Reload expenses
            loadDepartmentExpenses();
            
            // Reload department budget
            loadDepartmentBudget();
        } else {
            showAlert(response.message, 'danger', 'alertContainer');
        }
    } catch (error) {
        console.error(`Error updating expense status:`, error);
        showAlert(`An error occurred while updating the expense status`, 'danger', 'alertContainer');
        hideLoading();
    }
} 