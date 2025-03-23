/**
 * UI utilities for the Expense Tracker application
 */

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
    
    return departmentId && departments[departmentId] ? departments[departmentId] : `Department ${departmentId || 'Unknown'}`;
}

/**
 * Get employee name from the current system if available
 * @param {number} employeeId - The employee ID
 * @returns {string} - The employee name or a formatted ID string
 */
function getEmployeeName(employeeId) {
    // In a real system, this would query a user directory or cache
    // Here we're just showing the ID with proper formatting
    return employeeId ? `Employee #${employeeId}` : 'Unknown Employee';
}

/**
 * Shows an expense detail modal with options to approve/reject for managers
 * @param {Object} expense - The expense object to display
 */
function showExpenseDetailModal(expense) {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-overlay';
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        width: 500px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `;

    // Log the expense object to debug
    console.log("Expense object in modal:", expense);

    // Get employee information - handle all possible property names
    let employeeName = 'Unknown';
    if (expense.employeeName) {
        employeeName = expense.employeeName;
    } else if (expense.user && expense.user.name) {
        employeeName = expense.user.name;
    } else if (expense.employeeId || expense.userId) {
        employeeName = getEmployeeName(expense.employeeId || expense.userId);
    }
    
    // Get department information - handle all possible property names
    let departmentName = 'Unknown';
    if (expense.department && expense.department.name) {
        departmentName = expense.department.name;           
    } else if (expense.departmentName) {
        departmentName = expense.departmentName;
    } else if (expense.departmentId) {
        departmentName = getDepartmentName(expense.departmentId);
    } else {
        const currentUser = Auth.getCurrentUser();
        if (currentUser && currentUser.departmentId) {
            departmentName = getDepartmentName(currentUser.departmentId);
        }
    }

    // Build other safe data values
    const name = expense.name || 'No name';
    const amount = expense.amount ? `$${parseFloat(expense.amount).toFixed(2)}` : '$0.00';
    const type = expense.type || 'Unknown';
    const date = expense.date ? new Date(expense.date).toLocaleDateString() : 'No date';
    const status = expense.status || 'Unknown';
    const notes = expense.notes || 'No notes provided';
    const rejectionReason = expense.rejectionReason ? 
        `<div class="detail-item"><strong>Rejection Reason:</strong> ${expense.rejectionReason}</div>` : '';
    const receiptUrl = expense.receiptUrl ? 
        `<div class="detail-item"><strong>Receipt:</strong> <a href="${expense.receiptUrl}" target="_blank">View Receipt</a></div>` : 
        '<div class="detail-item"><strong>Receipt:</strong> No receipt uploaded</div>';

    // Create content HTML
    modalContent.innerHTML = `
        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <h3 style="margin: 0;">Expense Details</h3>
            <button id="closeModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div class="expense-details" style="margin-bottom: 20px;">
            <div class="detail-item"><strong>Employee:</strong> ${employeeName}</div>
            <div class="detail-item"><strong>Department:</strong> ${departmentName}</div>
            <div class="detail-item"><strong>Name:</strong> ${name}</div>
            <div class="detail-item"><strong>Amount:</strong> ${amount}</div>
            <div class="detail-item"><strong>Type:</strong> ${type}</div>
            <div class="detail-item"><strong>Date:</strong> ${date}</div>
            <div class="detail-item"><strong>Status:</strong> <span class="status-badge status-${status.toLowerCase()}" 
                style="padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; 
                background-color: ${getStatusColor(status)}; color: white;">${status}</span></div>
            <div class="detail-item"><strong>Notes:</strong> ${notes}</div>
            ${rejectionReason}
            ${receiptUrl}
        </div>
    `;

    // Append action buttons for managers if the expense is pending
    const currentUser = Auth.getCurrentUser();
    const actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;';
    
    if (currentUser && currentUser.role === 'MANAGER' && expense.status === 'PENDING') {
        // Add approve button
        const approveButton = document.createElement('button');
        approveButton.className = 'btn btn-success';
        approveButton.innerHTML = '<i class="fas fa-check"></i> Approve';
        approveButton.style.backgroundColor = '#28a745';
        approveButton.style.color = 'white';
        approveButton.style.border = 'none';
        approveButton.style.padding = '8px 15px';
        approveButton.style.borderRadius = '4px';
        approveButton.style.cursor = 'pointer';
        approveButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to approve this expense?')) {
                updateExpenseStatus(expense.id, 'APPROVED');
                modalContainer.remove();
            }
        });
        actionButtonsContainer.appendChild(approveButton);
        
        // Add reject button
        const rejectButton = document.createElement('button');
        rejectButton.className = 'btn btn-danger';
        rejectButton.innerHTML = '<i class="fas fa-times"></i> Reject';
        rejectButton.style.backgroundColor = '#dc3545';
        rejectButton.style.color = 'white';
        rejectButton.style.border = 'none';
        rejectButton.style.padding = '8px 15px';
        rejectButton.style.borderRadius = '4px';
        rejectButton.style.cursor = 'pointer';
        rejectButton.addEventListener('click', () => {
            const reason = prompt('Please provide a reason for rejection:');
            if (reason) {
                updateExpenseStatus(expense.id, 'REJECTED', reason);
                modalContainer.remove();
            }
        });
        actionButtonsContainer.appendChild(rejectButton);
    }
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'btn btn-secondary';
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#6c757d';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '8px 15px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        modalContainer.remove();
    });
    actionButtonsContainer.appendChild(closeButton);
    
    // Add buttons to modal
    modalContent.appendChild(actionButtonsContainer);
    
    // Add modal to container and container to document
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    
    // Add close event for X button
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        modalContainer.remove();
    });

    // Add click outside to close
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer.remove();
        }
    });
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
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-overlay';
        loadingElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
        `;
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        // Add keyframes for spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        loadingElement.appendChild(spinner);
        document.body.appendChild(loadingElement);
        
        // Create data object
        const data = { status: status };
        if (status === 'REJECTED' && rejectionReason) {
            data.rejectionReason = rejectionReason;
        }
        
        // Call API to update expense status
        const endpoint = `/expenses/${expenseId}/status/${status}`;
        const response = await Api.put(endpoint, data);
        
        // Remove loading
        loadingElement.remove();
        
        if (response && response.success) {
            // Show success message
            const alertContainer = document.getElementById('alertContainer');
            if (alertContainer) {
                const alert = document.createElement('div');
                alert.className = 'alert alert-success';
                alert.textContent = `Expense has been ${status.toLowerCase()} successfully`;
                alertContainer.innerHTML = '';
                alertContainer.appendChild(alert);
            }
            
            // Reload data if we're on a dashboard
            if (typeof loadDepartmentExpenses === 'function') {
                loadDepartmentExpenses();
            } else if (typeof loadUserExpenses === 'function') {
                loadUserExpenses();
            }
        } else {
            alert(`Failed to update expense status: ${response ? response.message : 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error updating expense status:', error);
        alert(`An error occurred while updating the expense status: ${error.message || 'Unknown error'}`);
    }
}

/**
 * Get color for expense status badge
 * @param {string} status - Expense status
 * @returns {string} - Color code
 */
function getStatusColor(status) {
    const colors = {
        'PENDING': '#ffc107',  // Yellow
        'APPROVED': '#28a745', // Green
        'REJECTED': '#dc3545', // Red
        'PAID': '#17a2b8'      // Blue
    };
    
    return colors[status] || '#6c757d'; // Default gray
}

// Export objects for global use
window.UI = {
    showExpenseDetailModal,
    updateExpenseStatus,
    getStatusColor,
    getDepartmentName,
    getEmployeeName
}; 