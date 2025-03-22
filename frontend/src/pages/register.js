/**
 * Render the registration page
 */
async function renderRegisterPage() {
    const appElement = document.getElementById('app');
    
    // Clear previous content
    appElement.innerHTML = '';
    
    // Create registration container
    const registerContainer = document.createElement('div');
    registerContainer.className = 'auth-container';
    
    // Create registration card
    const registerCard = document.createElement('div');
    registerCard.className = 'auth-card';
    
    // Create registration title
    const registerTitle = document.createElement('h1');
    registerTitle.className = 'auth-title';
    registerTitle.textContent = 'Register';
    
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    
    // Create registration form
    const registerForm = document.createElement('form');
    registerForm.id = 'registerForm';
    registerForm.addEventListener('submit', handleRegisterFormSubmit);
    
    // Create name field
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    
    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = 'name';
    nameLabel.textContent = 'Name';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'form-control';
    nameInput.id = 'name';
    nameInput.name = 'name';
    nameInput.placeholder = 'Enter your name';
    nameInput.required = true;
    
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    
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
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    
    // Create role field
    const roleGroup = document.createElement('div');
    roleGroup.className = 'form-group';
    
    const roleLabel = document.createElement('label');
    roleLabel.htmlFor = 'role';
    roleLabel.textContent = 'Role';
    
    const roleSelect = document.createElement('select');
    roleSelect.className = 'form-select';
    roleSelect.id = 'role';
    roleSelect.name = 'role';
    roleSelect.required = true;
    
    // Add role options
    const employeeOption = document.createElement('option');
    employeeOption.value = 'EMPLOYEE';
    employeeOption.textContent = 'Employee';
    
    const managerOption = document.createElement('option');
    managerOption.value = 'MANAGER';
    managerOption.textContent = 'Manager';
    
    const financeOption = document.createElement('option');
    financeOption.value = 'FINANCE';
    financeOption.textContent = 'Finance';
    
    roleSelect.appendChild(employeeOption);
    roleSelect.appendChild(managerOption);
    roleSelect.appendChild(financeOption);
    
    roleGroup.appendChild(roleLabel);
    roleGroup.appendChild(roleSelect);
    
    // Create department field
    const departmentGroup = document.createElement('div');
    departmentGroup.className = 'form-group';
    departmentGroup.id = 'departmentGroup';
    
    const departmentLabel = document.createElement('label');
    departmentLabel.htmlFor = 'departmentId';
    departmentLabel.textContent = 'Department';
    
    const departmentSelect = document.createElement('select');
    departmentSelect.className = 'form-select';
    departmentSelect.id = 'departmentId';
    departmentSelect.name = 'departmentId';
    departmentSelect.required = true;
    
    // Set initial loading placeholder
    const loadingOption = document.createElement('option');
    loadingOption.value = '';
    loadingOption.textContent = 'Loading departments...';
    departmentSelect.appendChild(loadingOption);
    
    // Create reload button
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Departments';
    reloadButton.className = 'btn btn-outline-secondary btn-sm mt-2';
    reloadButton.type = 'button';
    reloadButton.style.display = 'none';
    reloadButton.onclick = async () => {
        await loadDepartments();
        reloadButton.style.display = 'none';
    };
    
    departmentGroup.appendChild(departmentLabel);
    departmentGroup.appendChild(departmentSelect);
    departmentGroup.appendChild(reloadButton);
    
    // Create register button
    const registerButton = document.createElement('button');
    registerButton.type = 'submit';
    registerButton.className = 'btn btn-block';
    registerButton.textContent = 'Register';
    
    // Create login link
    const loginLink = document.createElement('p');
    loginLink.className = 'text-center';
    loginLink.style.marginTop = '20px';
    loginLink.innerHTML = 'Already have an account? <a href="#" id="loginLink">Login</a>';
    
    // Append all elements to form
    registerForm.appendChild(nameGroup);
    registerForm.appendChild(emailGroup);
    registerForm.appendChild(passwordGroup);
    registerForm.appendChild(roleGroup);
    registerForm.appendChild(departmentGroup);
    registerForm.appendChild(registerButton);
    
    // Append form and other elements to card
    registerCard.appendChild(registerTitle);
    registerCard.appendChild(alertContainer);
    registerCard.appendChild(registerForm);
    registerCard.appendChild(loginLink);
    
    // Append card to container
    registerContainer.appendChild(registerCard);
    
    // Append container to app element
    appElement.appendChild(registerContainer);
    
    // Add event listener to login link
    document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('login');
    });
    
    // Function to load departments
    async function loadDepartments() {
        try {
            // Now safely get the department select element
            const departmentSelect = document.getElementById('departmentId');
            
            if (!departmentSelect) {
                console.error('Department select element not found');
                return;
            }
            
            // Show loading indicator
            departmentSelect.innerHTML = '<option value="">Loading departments...</option>';
            
            console.log('Loading departments...');
            
            // Get departments from the API using the utility function
            const departments = await DepartmentUtil.getAllDepartments();
            
            // Check if select still exists (user might have navigated away)
            if (!document.getElementById('departmentId')) {
                console.warn('Department select no longer in DOM, aborting load');
                return;
            }
            
            if (departments && departments.length > 0) {
                console.log('Departments loaded successfully:', departments);
                
                // Clear the select
                departmentSelect.innerHTML = '<option value="">Select Department</option>';
                
                // Add departments to the select
                departments.forEach(department => {
                    const option = document.createElement('option');
                    option.value = department.id;
                    option.textContent = department.name;
                    departmentSelect.appendChild(option);
                });
            } else {
                console.warn('No departments found or empty array returned');
                
                // Check again if departmentSelect still exists
                if (!document.getElementById('departmentId')) {
                    return;
                }
                
                departmentSelect.innerHTML = '<option value="">Select Department</option>';
                
                // Add mock departments manually as a fallback
                departmentSelect.innerHTML += '<option value="1">Engineering</option>';
                departmentSelect.innerHTML += '<option value="2">Marketing</option>';
                departmentSelect.innerHTML += '<option value="3">Finance</option>';
                departmentSelect.innerHTML += '<option value="4">HR</option>';
                
                // Show a warning message
                showAlert('No departments are available. Using mock departments data.', 'warning', 'alertContainer');
            }
        } catch (error) {
            console.error('Error loading departments:', error);
            
            // Safely get the department select again in case of error
            const departmentSelect = document.getElementById('departmentId');
            if (!departmentSelect) {
                console.error('Department select element not found during error handling');
                return;
            }
            
            // Add mock departments manually as a fallback
            departmentSelect.innerHTML = '<option value="">Select Department</option>';
            departmentSelect.innerHTML += '<option value="1">Engineering</option>';
            departmentSelect.innerHTML += '<option value="2">Marketing</option>';
            departmentSelect.innerHTML += '<option value="3">Finance</option>';
            departmentSelect.innerHTML += '<option value="4">HR</option>';
            
            // Show an error message
            showAlert('Error loading departments. Using mock data instead.', 'warning', 'alertContainer');
        }
    }
    
    // Now that the DOM elements are added, load the departments
    await loadDepartments();
    
    // Hide loading
    hideLoading();
}

/**
 * Handle registration form submission
 * @param {Event} e - Form submit event
 */
async function handleRegisterFormSubmit(e) {
    e.preventDefault();
    
    // Show loading
    showLoading();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const departmentId = document.getElementById('departmentId').value;
    
    try {
        // Validate company email (optional requirement from the prompt)
        /*
        if (!email.includes('@company.com')) {
            showAlert('Please use your company email address', 'warning', 'alertContainer');
            hideLoading();
            return;
        }
        */
        
        // Validate department ID
        if (!departmentId) {
            showAlert('Please select a department', 'warning', 'alertContainer');
            hideLoading();
            return;
        }
        
        // Additional validation to ensure the department ID is among the mock ones
        const mockDepts = [1, 2, 3, 4];
        if (!mockDepts.includes(parseInt(departmentId))) {
            showAlert('Please select a valid department from the list. Currently only Engineering (1), Marketing (2), Finance (3), and HR (4) are available.', 'warning', 'alertContainer');
            hideLoading();
            return;
        }
        
        // Prepare user data
        const userData = {
            name,
            email,
            password,
            role,
            departmentId: departmentId  // Send as string to be parsed on server side
        };
        
        console.log('Attempting to register with data:', { ...userData, password: '******' });
        
        // Call register API
        const result = await Auth.register(userData);
        
        if (result.success) {
            // Store the email temporarily to assist with login
            localStorage.setItem('lastRegisteredEmail', email);
            
            let successMessage = 'Registration successful! You can now login.';
            
            // Check for interrupted connection message
            if (result.data && result.data.message && (
                result.data.message.includes('interrupted') || 
                result.data.message.includes('likely successful')
            )) {
                successMessage = result.data.message;
            }
            
            // If this was a network error but likely successful case
            if (result.data && result.data.networkError) {
                showAlert(successMessage, 'info', 'alertContainer');
            } else {
                showAlert(successMessage, 'success', 'alertContainer');
            }
            
            // Redirect to login after a delay
            setTimeout(() => {
                Router.navigate('login');
            }, 3000);
        } else {
            let errorMessage = result.message || 'Registration failed. Please try again.';
            
            // Enhance error message for department not found
            if (errorMessage.includes('Department not found')) {
                errorMessage = 'Department not found. Please select a department from ID 1-4 only (Engineering, Marketing, Finance, HR).';
            }
            
            showAlert(errorMessage, 'danger', 'alertContainer');
        }
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'An error occurred during registration. Please try again.';
        
        // Check if it's a network error
        if (error.message && error.message.includes('network')) {
            errorMessage = 'Network error. The registration may have been successful despite the error. Please try logging in with your credentials.';
            showAlert(errorMessage, 'warning', 'alertContainer');
            
            // Redirect to login after a slightly longer delay
            setTimeout(() => {
                Router.navigate('login');
            }, 4000);
            
            // Hide loading and return early
            hideLoading();
            return;
        }
        
        showAlert(errorMessage, 'danger', 'alertContainer');
    } finally {
        // Hide loading
        hideLoading();
    }
} 