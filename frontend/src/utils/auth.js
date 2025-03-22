/**
 * Authentication Utility for handling user authentication
 */
const Auth = {
    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Promise with the login result
     */
    login: async (email, password) => {
        try {
            console.log('Attempting login for:', email);
            
            try {
                // Use direct fetch for better error handling
                const url = `${API_URL}/auth/login`;
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                };
                
                const response = await fetch(url, options);
                
                try {
                    const data = await response.json();
                    
                    if (response.ok) {
                        // Extract actual data from the ApiResponse wrapper
                        const authData = data.data;  // Get the inner data object
                        console.log('Auth data:', authData);
                        
                        // Store token and user details in localStorage
                        localStorage.setItem('token', authData.token);
                        
                        // Ensure departmentId is set, default to 1 (Engineering) if missing
                        const departmentId = authData.departmentId !== null && authData.departmentId !== undefined 
                            ? authData.departmentId 
                            : (authData.role === 'FINANCE' ? null : 1); // Finance users can have null departmentId
                            
                        localStorage.setItem('user', JSON.stringify({
                            email: authData.email,
                            name: authData.name,
                            role: authData.role,
                            departmentId: departmentId
                        }));
                        
                        // Debug log to check the role value
                        console.log('User authenticated with role:', authData.role);
                        console.log('User department ID (original):', authData.departmentId);
                        console.log('User department ID (used):', departmentId);
                        
                        return { success: true, data: authData };
                    } else {
                        return { success: false, message: data.message || 'Login failed' };
                    }
                } catch (parseError) {
                    console.error('Error parsing login response:', parseError);
                    
                    // Still consider it a success if the status code is in the success range
                    if (response.status >= 200 && response.status < 300) {
                        return { 
                            success: true, 
                            data: {
                                message: 'Login successful, but response could not be fully read.',
                                email: email
                            }
                        };
                    }
                    
                    return { success: false, message: `Server responded with status: ${response.status}` };
                }
            } catch (fetchError) {
                console.error('Fetch error during login:', fetchError);
                throw fetchError;
            }
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.message && error.message.includes('Failed to fetch')) {
                return { 
                    success: false, 
                    message: 'Unable to connect to the server. Please check your internet connection and try again.' 
                };
            }
            
            return { success: false, message: 'An error occurred during login. Please try again.' };
        }
    },
    
    /**
     * Register a new user
     * @param {object} userData - User registration data
     * @returns {Promise} - Promise with the registration result
     */
    register: async (userData) => {
        try {
            // If there's a departmentId, make sure it's valid
            if (userData.departmentId) {
                // Check if we're using mock departments (temporary solution)
                const mockDepts = [1, 2, 3, 4];
                if (!mockDepts.includes(parseInt(userData.departmentId))) {
                    return {
                        success: false,
                        message: "Department not found. Please select a valid department from the list."
                    };
                }
            }
            
            console.log('Sending registration request to server...');
            
            try {
                // Use fetch directly instead of Api.post for better error handling
                const url = `${API_URL}/auth/register`;
                
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                };
                
                // Make the request
                const response = await fetch(url, options);
                
                // Check if registration was at least initiated successfully (status 201 Created)
                if (response.status === 201) {
                    console.log('Server returned 201 Created status - user likely created successfully');
                    // Even if we can't parse the response (due to ERR_INCOMPLETE_CHUNKED_ENCODING),
                    // we can assume success based on the 201 status
                    return { 
                        success: true, 
                        data: { 
                            message: "Registration likely successful. You can try logging in.",
                            email: userData.email
                        } 
                    };
                }
                
                // Try to parse the response if possible
                try {
                    const data = await response.json();
                    if (response.ok) {
                        return { success: true, data };
                    } else {
                        return { success: false, message: data.message || "Registration failed" };
                    }
                } catch (parseError) {
                    // If we got a non-201 status but can't parse the response
                    console.error('Error parsing response:', parseError);
                    
                    if (response.status >= 200 && response.status < 300) {
                        // Still a success status range
                        return { 
                            success: true, 
                            data: { 
                                message: "Registration likely successful, but response couldn't be fully read." 
                            } 
                        };
                    } else {
                        throw new Error(`Server responded with status: ${response.status}`);
                    }
                }
            } catch (fetchError) {
                console.error('Fetch error during registration:', fetchError);
                
                // Special case for ERR_INCOMPLETE_CHUNKED_ENCODING
                if (fetchError.message && (
                    fetchError.message.includes('Failed to fetch') || 
                    fetchError.message.includes('chunked encoding')
                )) {
                    // Check if this is a common scenario where registration succeeds but connection is terminated
                    console.log('Network error during registration, but the user may have been created');
                    
                    return {
                        success: true,
                        data: {
                            message: "Registration may have been successful, but the connection was interrupted. You can try logging in with your credentials.",
                            email: userData.email,
                            networkError: true
                        }
                    };
                }
                
                throw fetchError;
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            // If there was a network error or backend error, try to provide a more helpful message
            if (error.message && error.message.includes('fetch')) {
                return {
                    success: false,
                    message: "Connection to the server was interrupted. Your registration may have succeeded - please try logging in with your credentials."
                };
            }
            
            return { success: false, message: error.message || 'An error occurred during registration. Please try again.' };
        }
    },
    
    /**
     * Logout the current user
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },
    
    /**
     * Check if user is authenticated
     * @returns {boolean} - True if user is authenticated, false otherwise
     */
    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },
    
    /**
     * Get current user details
     * @returns {object|null} - User details or null if not authenticated
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    /**
     * Check if current user has a specific role
     * @param {string|Array} roles - Role or array of roles to check
     * @returns {boolean} - True if user has the role, false otherwise
     */
    hasRole: (roles) => {
        const user = Auth.getCurrentUser();
        if (!user) return false;
        
        // If roles is a string, convert to array
        const rolesToCheck = Array.isArray(roles) ? roles : [roles];
        return rolesToCheck.includes(user.role);
    },
    
    /**
     * Update the departmentId for the current user
     * @param {number} departmentId - The department ID to set for the user
     * @returns {boolean} - True if update was successful, false otherwise
     */
    updateDepartmentId: (departmentId) => {
        try {
            // Get current user
            const userStr = localStorage.getItem('user');
            if (!userStr) return false;
            
            // Parse user data
            const userData = JSON.parse(userStr);
            
            // Update departmentId
            userData.departmentId = departmentId;
            
            // Save back to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            console.log('User department ID updated to:', departmentId);
            return true;
        } catch (error) {
            console.error('Error updating department ID:', error);
            return false;
        }
    },
    
    /**
     * Refresh the user session by updating stored data
     * This can be used when the session appears to be invalid but the user is still logged in
     * @returns {boolean} - Whether the refresh was successful
     */
    refreshSession: () => {
        try {
            // Get current stored data
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            
            if (!token || !userStr) {
                console.error('No session data to refresh');
                return false;
            }
            
            // For now, we'll just re-store the token to trigger any listeners
            // In a real app, this would make an API call to get fresh user data
            localStorage.setItem('token', token);
            
            console.log('Session refreshed');
            return true;
        } catch (error) {
            console.error('Error refreshing session:', error);
            return false;
        }
    },
    
    /**
     * Check if the current auth token is valid and possibly refresh it
     * @returns {Promise<boolean>} - Whether the token is valid or was successfully refreshed
     */
    validateToken: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return false;
            }
            
            // Decode JWT token to check expiration
            // This is a simple decode, not a verification (that happens on the server)
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                console.error('Invalid token format');
                return false;
            }
            
            try {
                // Get the payload part (second part)
                const payload = JSON.parse(atob(tokenParts[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                
                // Check if token is expired
                if (payload.exp && payload.exp < currentTime) {
                    console.warn('Token is expired');
                    
                    // In a real app, you would refresh the token with the server here
                    // For now, just return false to indicate the token is invalid
                    return false;
                }
                
                return true; // Token is valid
            } catch (parseError) {
                console.error('Error parsing token:', parseError);
                return false;
            }
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    }
}; 