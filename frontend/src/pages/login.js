/**
 * Render the login page
 */
function renderLoginPage() {
    const appElement = document.getElementById('app');
    
    // Clear previous content
    appElement.innerHTML = '';
    
    // Create login container
    const loginContainer = document.createElement('div');
    loginContainer.className = 'auth-container';
    
    // Create login card
    const loginCard = document.createElement('div');
    loginCard.className = 'auth-card';
    
    // Create login title
    const loginTitle = document.createElement('h1');
    loginTitle.className = 'auth-title';
    loginTitle.textContent = 'Login';
    
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    
    // Create login form
    const loginForm = document.createElement('form');
    loginForm.id = 'loginForm';
    loginForm.addEventListener('submit', handleLoginFormSubmit);
    
    // Create email field
    const emailGroup = document.createElement('div');
    emailGroup.className = 'form-group';
    
    const emailLabel = document.createElement('label');
    emailLabel.htmlFor = 'email';
    emailLabel.textContent = 'Email';
    
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-control';
    emailInput.id = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'Enter your email';
    emailInput.required = true;
    
    // Check if we have a recently registered email to pre-fill
    const lastRegisteredEmail = localStorage.getItem('lastRegisteredEmail');
    if (lastRegisteredEmail) {
        emailInput.value = lastRegisteredEmail;
        // Clear it after use
        localStorage.removeItem('lastRegisteredEmail');
        
        // Show a helpful message
        setTimeout(() => {
            showAlert('You were redirected from registration. Please enter your password to log in.', 'info', 'alertContainer');
        }, 300);
    }
    
    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);
    
    // Create password field
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'form-group';
    
    const passwordLabel = document.createElement('label');
    passwordLabel.htmlFor = 'password';
    passwordLabel.textContent = 'Password';
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.className = 'form-control';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.placeholder = 'Enter your password';
    passwordInput.required = true;
    
    // If we had a lastRegisteredEmail, focus the password field
    if (lastRegisteredEmail) {
        setTimeout(() => {
            passwordInput.focus();
        }, 500);
    }
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    
    // Create login button
    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.className = 'btn btn-block';
    loginButton.textContent = 'Login';
    
    // Create register link
    const registerLink = document.createElement('p');
    registerLink.className = 'text-center';
    registerLink.style.marginTop = '20px';
    registerLink.innerHTML = 'Don\'t have an account? <a href="#" id="registerLink">Register</a>';
    
    // Add event listener to register link
    loginForm.appendChild(emailGroup);
    loginForm.appendChild(passwordGroup);
    loginForm.appendChild(loginButton);
    
    // Append all elements to login card
    loginCard.appendChild(loginTitle);
    loginCard.appendChild(alertContainer);
    loginCard.appendChild(loginForm);
    loginCard.appendChild(registerLink);
    
    // Append login card to login container
    loginContainer.appendChild(loginCard);
    
    // Append login container to app element
    appElement.appendChild(loginContainer);
    
    // Add event listener to register link
    document.getElementById('registerLink').addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('register');
    });
    
    // Hide loading
    hideLoading();
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
async function handleLoginFormSubmit(e) {
    e.preventDefault();
    
    // Show loading
    showLoading();
    
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Call login API
        const result = await Auth.login(email, password);
        
        if (result.success) {
            // Redirect based on role
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
                        showAlert('Invalid user role', 'danger', 'alertContainer');
                }
            }
        } else {
            showAlert(result.message, 'danger', 'alertContainer');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('An error occurred during login. Please try again.', 'danger', 'alertContainer');
    } finally {
        // Hide loading
        hideLoading();
    }
} 