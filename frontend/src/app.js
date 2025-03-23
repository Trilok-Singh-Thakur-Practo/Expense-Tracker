/**
 * Main application script
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the router - this handles async initialization
    Router.init().catch(error => {
        console.error('Error initializing application:', error);
    });
});

/**
 * Show loading indicator
 */
function showLoading() {
    let loadingElement = document.getElementById('loading');
    
    // If loading element doesn't exist, create it
    if (!loadingElement) {
        loadingElement = document.createElement('div');
        loadingElement.id = 'loading';
        loadingElement.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loadingElement);
    }
    
    loadingElement.style.display = 'flex';
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

/**
 * Show an alert message
 * @param {string} message - Message to display
 * @param {string} type - Alert type (success, warning, danger)
 * @param {string} containerId - ID of container element to append alert
 */
function showAlert(message, type = 'success', containerId = 'alertContainer') {
    const alertContainer = document.getElementById(containerId);
    if (!alertContainer) return;
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.float = 'right';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => alert.remove();
    alert.appendChild(closeBtn);
    
    // Add to container
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode === alertContainer) {
            alertContainer.removeChild(alert);
        }
    }, 5000);
}

/**
 * Create navigation bar based on user role
 * @returns {HTMLElement} - Navigation bar element
 */
function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    
    const container = document.createElement('div');
    container.className = 'navbar-container container';
    
    // Brand
    const brand = document.createElement('a');
    brand.className = 'navbar-brand';
    brand.textContent = 'Expense Tracker';
    brand.href = '#';
    brand.onclick = (e) => {
        e.preventDefault();
        
        // Navigate to appropriate dashboard based on role
        const user = Auth.getCurrentUser();
        if (user) {
            switch (user.role) {
                case 'EMPLOYEE':
                    Router.navigate('employeeDashboard');
                    break;
                case 'MANAGER':
                    Router.navigate('managerDashboard');
                    break;
                case 'FINANCE':
                    Router.navigate('financeDashboard');
                    break;
                default:
                    Router.navigate('login');
            }
        } else {
            Router.navigate('login');
        }
    };
    
    container.appendChild(brand);
    
    // Navigation links
    const nav = document.createElement('ul');
    nav.className = 'navbar-nav';
    
    // If user is logged in, show appropriate links
    if (Auth.isAuthenticated()) {
        const user = Auth.getCurrentUser();
        
        // Add links based on role
        if (user.role === 'EMPLOYEE') {
            const addExpenseItem = document.createElement('li');
            addExpenseItem.className = 'nav-item';
            
            const addExpenseLink = document.createElement('a');
            addExpenseLink.className = 'nav-link';
            addExpenseLink.textContent = 'Add Expense';
            addExpenseLink.href = '#';
            addExpenseLink.onclick = (e) => {
                e.preventDefault();
                Router.navigate('addExpense');
            };
            
            addExpenseItem.appendChild(addExpenseLink);
            nav.appendChild(addExpenseItem);
        }
        
        if (user.role === 'FINANCE') {
            const addBudgetItem = document.createElement('li');
            addBudgetItem.className = 'nav-item';
            
            const addBudgetLink = document.createElement('a');
            addBudgetLink.className = 'nav-link';
            addBudgetLink.textContent = 'Add Budget';
            addBudgetLink.href = '#';
            addBudgetLink.onclick = (e) => {
                e.preventDefault();
                Router.navigate('addBudget');
            };
            
            addBudgetItem.appendChild(addBudgetLink);
            nav.appendChild(addBudgetItem);
        }
        
        // User profile dropdown
        const profileItem = document.createElement('li');
        profileItem.className = 'nav-item';
        
        const profileName = document.createElement('span');
        profileName.className = 'nav-link';
        profileName.textContent = `Hi, ${user.name} (${user.role})`;
        profileItem.appendChild(profileName);
        
        // Logout button
        const logoutItem = document.createElement('li');
        logoutItem.className = 'nav-item';
        
        const logoutLink = document.createElement('a');
        logoutLink.className = 'nav-link';
        logoutLink.textContent = 'Logout';
        logoutLink.href = '#';
        logoutLink.onclick = (e) => {
            e.preventDefault();
            Auth.logout();
        };
        
        logoutItem.appendChild(logoutLink);
        
        nav.appendChild(profileItem);
        nav.appendChild(logoutItem);
    }
    
    container.appendChild(nav);
    navbar.appendChild(container);
    
    return navbar;
} 