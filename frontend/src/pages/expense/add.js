/**
 * Renders the add expense page
 */
function renderAddExpensePage() {
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
        <h1>Add New Expense</h1>
        <button id="cancelBtn" class="btn btn-secondary">Cancel</button>
    `;
    container.appendChild(header);
    
    // Add cancel button event listener
    document.getElementById('cancelBtn').addEventListener('click', () => {
        // Navigate back based on user role
        if (currentUser) {
            if (currentUser.role === 'EMPLOYEE') {
                Router.navigate('employeeDashboard');
            } else if (currentUser.role === 'MANAGER') {
                Router.navigate('managerDashboard');
            } else {
                Router.navigate('login');
            }
        } else {
            Router.navigate('login');
        }
    });
    
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    container.appendChild(alertContainer);
    
    // Create form
    const formCard = document.createElement('div');
    formCard.className = 'card';
    formCard.innerHTML = `
        <form id="expenseForm" class="form" style="padding: 20px;">
            <div class="form-group">
                <label for="expenseName">Expense Name *</label>
                <input type="text" id="expenseName" name="expenseName" required>
            </div>
            
            <div class="form-group">
                <label for="amount">Amount *</label>
                <input type="number" id="amount" name="amount" min="0.01" step="0.01" required>
            </div>
            
            <div class="form-group">
                <label for="expenseType">Expense Type *</label>
                <select id="expenseType" name="expenseType" required>
                    <option value="">-- Select Expense Type --</option>
                    <option value="ESSENTIAL">Essential</option>
                    <option value="DISCRETIONARY">Discretionary</option>
                    <option value="HYBRID">Hybrid</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="date">Date *</label>
                <input type="date" id="date" name="date" required>
            </div>
            
            <div class="form-group">
                <label for="receiptUrl">Receipt URL (Optional)</label>
                <input type="url" id="receiptUrl" name="receiptUrl" placeholder="http://example.com/receipt.pdf">
            </div>
            
            <div class="form-group">
                <label for="notes">Notes (Optional)</label>
                <textarea id="notes" name="notes" rows="4"></textarea>
            </div>
            
            <div id="budgetInfo" class="budget-info">
                <h3>Budget Information</h3>
                <div id="budgetDetails" class="budget-details">
                    <p>Loading budget information...</p>
                </div>
            </div>
            
            <div class="form-actions" style="text-align: center;">
                <button type="submit" class="btn btn-primary" id="submitBtn">Submit Expense</button>
            </div>
        </form>
    `;
    container.appendChild(formCard);
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Load budget information
    loadBudgetInformation();
    
    // Add form submit handler
    document.getElementById('expenseForm').addEventListener('submit', handleExpenseFormSubmit);
}

/**
 * Load budget information for the user's department
 */
async function loadBudgetInformation() {
    const budgetDetails = document.getElementById('budgetDetails');
    const submitBtn = document.getElementById('submitBtn');
    
    try {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            budgetDetails.innerHTML = '<p class="error">No user information available</p>';
            return;
        }
        
        // Check if departmentId exists
        if (!currentUser.departmentId) {
            console.warn('User has no departmentId in their profile:', currentUser);
            
            // Create a department selection form
            budgetDetails.innerHTML = `
                <div class="alert alert-warning">
                    <p>Please select your department to continue:</p>
                    <div class="form-group">
                        <select id="departmentSelect" class="form-select">
                            <option value="">-- Select Department --</option>
                            <option value="1">Engineering</option>
                            <option value="2">Marketing</option>
                            <option value="3">Finance</option>
                            <option value="4">Human Resources</option>
                        </select>
                    </div>
                    <button id="saveDepartmentBtn" class="btn btn-primary mt-2">Save Department</button>
                </div>
            `;
            
            // Add event listener to save button
            document.getElementById('saveDepartmentBtn').addEventListener('click', () => {
                const selectedDept = document.getElementById('departmentSelect').value;
                if (!selectedDept) {
                    alert('Please select a department');
                    return false;
                }
                
                // Update the user's department
                if (Auth.updateDepartmentId(parseInt(selectedDept))) {
                    // Reload the budget information
                    loadBudgetInformation();
                } else {
                    alert('Failed to update department. Please try again.');
                }
                return false; // Prevent any potential message channel issues
            });
            
            return;
        }
        
        // Get department budget from the API
        try {
            const response = await Api.get(`/budgets/department/${currentUser.departmentId}`);
        
            if (response && response.success && response.data) {
            const budget = response.data;
            const remainingBudget = budget.amount - budget.usedAmount;
            const usedPercentage = (budget.usedAmount / budget.amount) * 100;
            
            budgetDetails.innerHTML = `
                <div class="budget-stat">
                    <span>Total Budget:</span>
                    <span class="budget-value">$${budget.amount.toFixed(2)}</span>
                </div>
                <div class="budget-stat">
                    <span>Used Amount:</span>
                    <span class="budget-value">$${budget.usedAmount.toFixed(2)}</span>
                </div>
                <div class="budget-stat">
                    <span>Remaining Budget:</span>
                    <span class="budget-value ${remainingBudget < 0 ? 'error' : ''}">${remainingBudget < 0 ? '-' : ''}$${Math.abs(remainingBudget).toFixed(2)}</span>
                </div>
                
                <div class="budget-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${Math.min(usedPercentage, 100)}%; background-color: ${usedPercentage > 90 ? '#ff4d4d' : usedPercentage > 70 ? '#ffa64d' : '#4caf50'}"></div>
                    </div>
                    <div class="progress-text">${usedPercentage.toFixed(1)}% Used</div>
                </div>
            `;
            
            // Disable submit button if budget exceeded
            if (remainingBudget <= 0) {
                submitBtn.disabled = true;
                
                // Add warning message
                const warningMessage = document.createElement('div');
                warningMessage.className = 'alert alert-warning';
                warningMessage.textContent = 'Warning: Department budget has been exceeded. New expenses require special approval.';
                document.getElementById('alertContainer').appendChild(warningMessage);
            }
        } else {
                // Permission denied or budget not available
                showFallbackBudgetInfo(currentUser, response);
            }
        } catch (apiError) {
            console.error('API error while loading budget:', apiError);
            // Show fallback info even if the API call fails
            showFallbackBudgetInfo(currentUser, { 
                success: false, 
                message: apiError.message || 'Failed to connect to budget service'
            });
        }
    } catch (error) {
        console.error('Error loading budget information:', error);
        
        // Show detailed error message
        let errorMessage = 'Failed to load budget information';
        if (error.message) {
            errorMessage += `: ${error.message}`;
        }
        
        budgetDetails.innerHTML = `
            <div class="error-container">
                <p class="error">${errorMessage}</p>
                <div class="support-info">
                    <p>If this issue persists, please contact support with the following information:</p>
                    <ul>
                        <li>Department ID: ${currentUser ? (currentUser.departmentId || 'Not set') : 'Unknown'}</li>
                        <li>User Role: ${currentUser ? (currentUser.role || 'Unknown') : 'Unknown'}</li>
                        <li>Error: ${error.message || 'Unknown error'}</li>
                    </ul>
                </div>
                <button id="retryBudgetBtn" class="btn btn-outline-primary">Retry Loading Budget</button>
            </div>
        `;
        
        // Add retry button event listener
        document.getElementById('retryBudgetBtn').addEventListener('click', () => {
            loadBudgetInformation();
            return false; // Prevent any potential message channel issues
        });
    }
}

/**
 * Shows fallback budget information when actual budget data cannot be accessed
 * @param {Object} currentUser - The current user object
 * @param {Object} response - The API response (if any)
 */
function showFallbackBudgetInfo(currentUser, response) {
    const budgetDetails = document.getElementById('budgetDetails');
    const alertContainer = document.getElementById('alertContainer');
    
    // Process response or error
    let message = 'No budget information available for your department';
            
    if (response && response.message) {
        message = response.message;
    } else if (!response) {
        message = 'Could not connect to the server. Please check your connection and try again.';
    }
    
    // Check for specific no active budget message
    if (response && response.message && response.message.includes("No active budget")) {
        // Show warning alert at the top
        const noBudgetAlert = document.createElement('div');
        noBudgetAlert.className = 'alert alert-warning';
        noBudgetAlert.innerHTML = `
            <strong>Warning:</strong> No active budget found for department ${getDepartmentName(currentUser.departmentId)}.
            <p>You cannot submit expenses without an active budget. Please contact the Finance department or select a different department.</p>
        `;
        alertContainer.innerHTML = ''; // Clear any existing alerts
        alertContainer.appendChild(noBudgetAlert);
        
        // Show detailed info in the budget details section
        budgetDetails.innerHTML = `
            <div class="alert alert-warning">
                <h4>No Active Budget Found</h4>
                <p>There is no active budget for ${getDepartmentName(currentUser.departmentId)} department.</p>
                <p>Options:</p>
                <ul>
                    <li>Contact your Finance department to create a budget</li>
                    <li>Select a different department (if you belong to multiple departments)</li>
                </ul>
                <div class="form-group mt-3">
                    <label for="noBudgetDeptSelect">Change Department:</label>
                    <select id="noBudgetDeptSelect" class="form-select mt-2">
                        <option value="">-- Select Department --</option>
                        <option value="1">Engineering</option>
                        <option value="2">Marketing</option>
                        <option value="3">Finance</option>
                        <option value="4">Human Resources</option>
                    </select>
                </div>
                <button id="noBudgetChangeDeptBtn" class="btn btn-primary mt-2">Change Department</button>
            </div>
        `;
        
        // Add event listener for department change
        document.getElementById('noBudgetChangeDeptBtn').addEventListener('click', () => {
            const selectedDept = document.getElementById('noBudgetDeptSelect').value;
            if (!selectedDept) {
                alert('Please select a department');
                return false;
            }
            
            if (Auth.updateDepartmentId(parseInt(selectedDept))) {
                // Reload budget information
                loadBudgetInformation();
            } else {
                alert('Failed to update department');
            }
            return false;
        });
        
        return; // Skip the rest of the function
    }
    
    // Show more user-friendly error with session refresh option if it seems to be an auth issue
    if (response && response.statusCode === 403) {
        // Check if this is a permissions issue rather than an auth issue
        if (response.message && response.message.includes('permission')) {
            // This is likely a permissions issue - user doesn't have rights to view department budgets
            
            // Different handling based on user role
            if (currentUser.role === 'EMPLOYEE') {
                budgetDetails.innerHTML = `
                    <div class="alert alert-info">
                        <p>Budget information is not available for your role. You can still submit expenses.</p>
                        <p>Your expenses will be reviewed by your department manager.</p>
                        <div class="department-info mt-3">
                            <p><strong>Your Department:</strong> ${getDepartmentName(currentUser.departmentId)}</p>
                            <p><strong>Your Role:</strong> ${currentUser.role}</p>
                        </div>
                    </div>
                `;
            } else if (currentUser.role === 'MANAGER') {
                budgetDetails.innerHTML = `
                    <div class="alert alert-warning">
                        <p>You don't have permission to view this department's budget.</p>
                        <p>Please confirm you've selected the correct department:</p>
                        <div class="form-group mt-2">
                            <select id="departmentSelectManager" class="form-select">
                                <option value="">-- Select Department --</option>
                                <option value="1">Engineering</option>
                                <option value="2">Marketing</option>
                                <option value="3">Finance</option>
                                <option value="4">Human Resources</option>
                            </select>
                        </div>
                        <button id="updateDeptBtn" class="btn btn-primary mt-2">Update Department</button>
                    </div>
                `;
                
                // Add event listener for department update
                document.getElementById('updateDeptBtn').addEventListener('click', () => {
                    const selectedDept = document.getElementById('departmentSelectManager').value;
                    if (!selectedDept) {
                        alert('Please select a department');
                        return false;
                    }
                    
                    if (Auth.updateDepartmentId(parseInt(selectedDept))) {
                        loadBudgetInformation();
                    } else {
                        alert('Failed to update department');
                    }
                    return false; // Prevent any potential message channel issues
                });
            } else {
                // FINANCE or other roles
                budgetDetails.innerHTML = `
                    <div class="alert alert-warning">
                        <p>${response.message}</p>
                        <p>If you believe you should have access to this information, please contact the system administrator.</p>
                        <button id="reloadBudgetBtn" class="btn btn-primary btn-sm mt-2">Try Again</button>
                    </div>
                `;
                
                document.getElementById('reloadBudgetBtn').addEventListener('click', () => {
                    loadBudgetInformation();
                    return false;
                });
            }
        } else {
            // This is more likely a session expiry issue
            budgetDetails.innerHTML = `
                <div class="alert alert-warning">
                    <p>${response.message}</p>
                    <p>This could be due to your session expiring.</p>
                    <button id="refreshSessionBtn" class="btn btn-outline-primary btn-sm mt-2">Refresh Session</button>
                    <button id="reloadBudgetBtn" class="btn btn-primary btn-sm mt-2 ml-2">Try Again</button>
                </div>
            `;
            
            // Add event listeners for the buttons
            document.getElementById('refreshSessionBtn').addEventListener('click', () => {
                Auth.refreshSession();
                loadBudgetInformation();
                return false;
            });
            
            document.getElementById('reloadBudgetBtn').addEventListener('click', () => {
                loadBudgetInformation();
                return false;
            });
        }
    } else {
        budgetDetails.innerHTML = `<p class="error">${message}</p>`;
    }
    
    // Log more details for debugging
    console.log('Budget API response:', response);
}

/**
 * Get department name from department ID
 * @param {number} departmentId - The department ID
 * @returns {string} - The department name
 */
function getDepartmentName(departmentId) {
    const departments = {
        1: 'Engineering',
        2: 'Marketing',
        3: 'Finance',
        4: 'Human Resources'
    };
    
    return departments[departmentId] || `Department ${departmentId}`;
}

/**
 * Handle expense form submission
 * @param {Event} event - Form submit event
 */
async function handleExpenseFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = '';
    
    // Disable submit button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Get form data
    const expenseName = form.expenseName.value.trim();
    const amount = parseFloat(form.amount.value);
    const expenseType = form.expenseType.value;
    const date = form.date.value;
    const receiptUrl = form.receiptUrl.value.trim();
    const notes = form.notes.value.trim();
    
    // Get current user
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) {
        // Show error
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.textContent = 'You must be logged in to submit an expense';
        alertContainer.appendChild(alert);
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Expense';
        return;
    }
    
    // Validate department ID - show warning but allow submission
    if (!currentUser.departmentId) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-warning';
        alert.textContent = 'You do not have a department assigned. Please select a department.';
        alertContainer.appendChild(alert);
        
        // Focus on budget section
        document.getElementById('budgetInfo').scrollIntoView();
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Expense';
        return;
    }
    
    // Create expense data
    const expenseData = {
        name: expenseName,
        amount: amount,
        type: expenseType,
        date: date,
        receiptUrl: receiptUrl || null, // Ensure null if empty string
        notes: notes || null, // Ensure null if empty string
        departmentId: currentUser.departmentId
    };
    
    // Add employeeId if we have it (might not be in test/mock environment)
    if (currentUser.id) {
        expenseData.employeeId = currentUser.id;
    }
    
    try {
        // Send to API - use consistent endpoint format
        const response = await Api.post('/expenses', expenseData);
        
        if (response && response.success) {
            // Show success message
            const alert = document.createElement('div');
            alert.className = 'alert alert-success';
            alert.textContent = 'Expense submitted successfully!';
            alertContainer.appendChild(alert);
            
            // Reset form
            form.reset();
            form.date.value = new Date().toISOString().split('T')[0];
            
            // Show additional messaging for employees about the review process
            if (currentUser.role === 'EMPLOYEE') {
                const infoAlert = document.createElement('div');
                infoAlert.className = 'alert alert-info';
                infoAlert.textContent = 'Your expense has been submitted for review by your department manager.';
                alertContainer.appendChild(infoAlert);
            }
            
            // Reload budget information if we might have access (not EMPLOYEE)
            if (currentUser.role !== 'EMPLOYEE') {
            loadBudgetInformation();
            }
            
            // Redirect after a short delay
            setTimeout(() => {
                if (currentUser.role === 'EMPLOYEE') {
                    Router.navigate('employeeDashboard');
                } else if (currentUser.role === 'MANAGER') {
                    Router.navigate('managerDashboard');
                }
            }, 2000);
        } else {
            // Show error message
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger';
            
            // Check for specific error conditions and provide better guidance
            let errorMessage = response && response.message 
                ? response.message 
                : 'Failed to submit expense. Please check your inputs and try again.';
                
            // Specific handling for no active budget
            if (errorMessage.includes('No active budget')) {
                alert.textContent = 'Cannot submit expense: There is no active budget for this department.';
                
                // Create a more detailed explanation
                const helpAlert = document.createElement('div');
                helpAlert.className = 'alert alert-info';
                helpAlert.innerHTML = `
                    <p>To submit an expense, your department must have an active budget.</p>
                    <p>Options:</p>
                    <ul>
                        <li>Contact your Finance department to create a budget for department: ${getDepartmentName(currentUser.departmentId)}</li>
                        <li>Select a different department that has an active budget (if you belong to multiple departments)</li>
                    </ul>
                `;
                alertContainer.appendChild(helpAlert);
                
                // Provide option to select a different department
                const departmentForm = document.createElement('div');
                departmentForm.className = 'mt-3';
                departmentForm.innerHTML = `
                    <div class="form-group">
                        <label for="changeDepartmentSelect">Change Department:</label>
                        <select id="changeDepartmentSelect" class="form-select mt-2">
                            <option value="">-- Select Department --</option>
                            <option value="1">Engineering</option>
                            <option value="2">Marketing</option>
                            <option value="3">Finance</option>
                            <option value="4">Human Resources</option>
                        </select>
                    </div>
                    <button id="changeDepartmentBtn" class="btn btn-primary mt-2">Change Department</button>
                `;
                alertContainer.appendChild(departmentForm);
                
                // Add event listener for department change
                document.getElementById('changeDepartmentBtn').addEventListener('click', () => {
                    const selectedDept = document.getElementById('changeDepartmentSelect').value;
                    if (!selectedDept) {
                        alert('Please select a department');
                        return false;
                    }
                    
                    if (Auth.updateDepartmentId(parseInt(selectedDept))) {
                        // Clear alerts
                        alertContainer.innerHTML = '';
                        const successMsg = document.createElement('div');
                        successMsg.className = 'alert alert-success';
                        successMsg.textContent = `Department changed to ${getDepartmentName(parseInt(selectedDept))}. Reloading budget information...`;
                        alertContainer.appendChild(successMsg);
                        
                        // Reload budget information
                        loadBudgetInformation();
                        
                        // Re-enable the submit button
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit Expense';
                    } else {
                        alert('Failed to update department');
                    }
                    return false;
                });
            } else {
                // For other errors, just show the message
                alert.textContent = errorMessage;
                
                // If it's an authorization error, provide more helpful guidance
                if (response && response.statusCode === 403) {
                    const helpAlert = document.createElement('div');
                    helpAlert.className = 'alert alert-warning';
                    helpAlert.innerHTML = `
                        <p>You may not have permission to submit expenses for this department.</p>
                        <p>Please verify you've selected the correct department in your profile.</p>
                    `;
                    alertContainer.appendChild(helpAlert);
                }
            }
            
            alertContainer.appendChild(alert);
        }
    } catch (error) {
        console.error('Error submitting expense:', error);
        
        // Show error message
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.textContent = 'An error occurred while submitting the expense. Please try again later.';
        alertContainer.appendChild(alert);
        
        // Add more details if available
        if (error.message) {
            const detailsAlert = document.createElement('div');
            detailsAlert.className = 'alert alert-info';
            detailsAlert.textContent = `Error details: ${error.message}`;
            alertContainer.appendChild(detailsAlert);
        }
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Expense';
    }
} 