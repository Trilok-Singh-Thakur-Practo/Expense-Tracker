/**
 * Renders the add budget page
 */
function renderAddBudgetPage() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear previous content
    
    // Add navbar
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
        <div class="navbar-brand" style="padding-left: 15px;">Expense Tracker</div>
        <div class="navbar-menu">
            <div class="navbar-user" style="display: flex; align-items: center; justify-content: space-around;">
                <span id="userNameDisplay" style="margin-right: 700px;"></span>
                <button id="logoutBtn" class="btn btn-link" style="margin-left: 12px;">Logout</button>
            </div>
        </div>
    `;
    app.appendChild(navbar);
    
    // Update user display
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
        document.getElementById('userNameDisplay').textContent = currentUser.name;
    }
    
    // Add logout event listener
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
        Router.navigate('login');
    });
    
    // Create page container
    const container = document.createElement('div');
    container.className = 'container';
    app.appendChild(container);
    
    // Create page header
    const header = document.createElement('div');
    header.className = 'page-header';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.innerHTML = `
        <h1>Add Department Budget</h1>
        <button id="cancelBtn" class="btn btn-secondary">Cancel</button>
    `;
    container.appendChild(header);
    
    // Add cancel button event listener
    document.getElementById('cancelBtn').addEventListener('click', () => {
        Router.navigate('financeDashboard');
    });
    
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    container.appendChild(alertContainer);
    
    // Create form
    const formCard = document.createElement('div');
    formCard.className = 'card';
    formCard.innerHTML = `
        <form id="budgetForm" class="form" style="padding: 20px;">
            <div class="form-group">
                <label for="department">Department *</label>
                <select id="department" name="department" required>
                    <option value="">-- Select Department --</option>
                    <option value="1">Engineering</option>
                    <option value="2">Marketing</option>
                    <option value="3">Finance</option>
                    <option value="4">Human Resources</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="amount">Budget Amount *</label>
                <input type="number" id="amount" name="amount" min="1" step="1" required>
            </div>
            
            <div class="form-group">
                <label for="startDate">Start Date *</label>
                <input type="date" id="startDate" name="startDate" required>
            </div>
            
            <div class="form-group">
                <label for="endDate">End Date *</label>
                <input type="date" id="endDate" name="endDate" required>
            </div>
            
            <div class="form-group">
                <label for="description">Description (Optional)</label>
                <textarea id="description" name="description" rows="4"></textarea>
            </div>
            
            <div class="form-actions" style="text-align: center;">
                <button type="submit" class="btn btn-primary" id="submitBtn">Create Budget</button>
            </div>
        </form>
    `;
    container.appendChild(formCard);
    
    // Create existing budgets section
    const existingBudgetsCard = document.createElement('div');
    existingBudgetsCard.className = 'card mt-4';
    existingBudgetsCard.innerHTML = `
        <div class="card-header">
            <h2>Existing Department Budgets</h2>
        </div>
        <div id="existingBudgetsContainer" class="card-body">
            <p>Loading existing budgets...</p>
        </div>
    `;
    container.appendChild(existingBudgetsCard);
    
    // Set default dates
    const today = new Date();
    document.getElementById('startDate').value = today.toISOString().split('T')[0];
    
    // Set default end date to 1 month later
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    document.getElementById('endDate').value = nextMonth.toISOString().split('T')[0];
    
    // Load existing budgets
    loadExistingBudgets();
    
    // Add form submit handler
    document.getElementById('budgetForm').addEventListener('submit', handleBudgetFormSubmit);
}

/**
 * Load existing department budgets
 */
async function loadExistingBudgets() {
    const container = document.getElementById('existingBudgetsContainer');
    
    try {
        // Call API to get all department budgets - Fix: Remove leading slash
        const response = await Api.get('budgets');
        
        if (response.success && response.data && response.data.length > 0) {
            // Create table
            const table = document.createElement('table');
            table.className = 'table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Amount</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Used</th>
                        <th>Remaining</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
            
            const tbody = table.querySelector('tbody');
            
            // Add rows for each budget
            response.data.forEach(budget => {
                const usedPercentage = (budget.usedAmount / budget.amount) * 100;
                const remaining = budget.amount - budget.usedAmount;
                
                let statusClass = '';
                let statusText = '';
                
                if (usedPercentage >= 100) {
                    statusClass = 'status-danger';
                    statusText = 'Exceeded';
                } else if (usedPercentage >= 80) {
                    statusClass = 'status-warning';
                    statusText = 'Warning';
                } else {
                    statusClass = 'status-success';
                    statusText = 'Good';
                }
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${budget.departmentName}</td>
                    <td>$${budget.amount.toFixed(2)}</td>
                    <td>${new Date(budget.startDate).toLocaleDateString()}</td>
                    <td>${new Date(budget.endDate).toLocaleDateString()}</td>
                    <td>$${budget.usedAmount.toFixed(2)} (${usedPercentage.toFixed(1)}%)</td>
                    <td class="${remaining < 0 ? 'text-danger' : ''}">${remaining < 0 ? '-' : ''}$${Math.abs(remaining).toFixed(2)}</td>
                    <td>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            container.innerHTML = '';
            container.appendChild(table);
        } else {
            container.innerHTML = '<p>No existing department budgets found. Create your first budget above.</p>';
        }
    } catch (error) {
        console.error('Error loading existing budgets:', error);
        container.innerHTML = '<p class="error">Failed to load existing budgets. Please try again later.</p>';
    }
}

/**
 * Handle budget form submission
 * @param {Event} event - Form submit event
 */
async function handleBudgetFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = '';
    
    // Disable submit button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    
    // Get form data
    const departmentId = form.department.value;
    const amount = parseFloat(form.amount.value);
    const startDate = form.startDate.value;
    const endDate = form.endDate.value;
    const description = form.description.value.trim();
    
    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
        // Show error message
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.textContent = 'End date must be after start date';
        alertContainer.appendChild(alert);
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Budget';
        return;
    }
    
    // Create budget data
    const budgetData = {
        departmentId: departmentId,
        amount: amount,
        startDate: startDate,
        endDate: endDate,
        description: description
    };
    
    try {
        // Send to API - Fix: Remove leading slash
        const response = await Api.post('budgets', budgetData);
        
        if (response.success) {
            // Show success message
            const alert = document.createElement('div');
            alert.className = 'alert alert-success';
            alert.textContent = 'Department budget created successfully!';
            alertContainer.appendChild(alert);
            
            // Reset form
            form.reset();
            
            // Reset dates
            const today = new Date();
            form.startDate.value = today.toISOString().split('T')[0];
            
            const nextMonth = new Date(today);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            form.endDate.value = nextMonth.toISOString().split('T')[0];
            
            // Reload existing budgets
            loadExistingBudgets();
        } else {
            // Show error message
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger';
            alert.textContent = response.message || 'Failed to create budget';
            alertContainer.appendChild(alert);
        }
    } catch (error) {
        console.error('Error creating budget:', error);
        
        // Show error message
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.textContent = 'An error occurred while creating the budget';
        alertContainer.appendChild(alert);
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Budget';
    }
} 