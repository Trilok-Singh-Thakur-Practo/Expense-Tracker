/**
 * API Utility for making HTTP requests to the backend
 */
const API_URL = 'http://localhost:8080/api';

// Import Auth module to check token validity
// Note: This assumes Auth is globally available
// In a real app with modules, you'd use a proper import

const Api = {
    /**
     * Makes a fetch request to the API
     * @param {string} endpoint - API endpoint
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {object} data - Request body data
     * @returns {Promise} - Promise with the response
     */
    request: async (endpoint, method = 'GET', data = null) => {
        // Ensure endpoint starts with a slash
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${API_URL}${normalizedEndpoint}`;
        const token = localStorage.getItem('token');
        
        // Check if token is required for this endpoint
        const isPublicEndpoint = normalizedEndpoint.includes('/public/') || 
                                normalizedEndpoint === '/auth/login' || 
                                normalizedEndpoint === '/auth/register';
        
        // Validate token for non-public endpoints
        if (!isPublicEndpoint && token) {
            const isValid = await Auth.validateToken();
            if (!isValid) {
                console.warn('Invalid or expired token detected');
                // Could try to refresh token here in the future
                // For now, log the issue but continue with the request
            }
        }
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add token to headers if available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const options = {
            method,
            headers
        };
        
        // Add body if data is provided (for POST, PUT requests)
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            
            // Handle unauthorized access
            if (response.status === 401) {
                // Clear token and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
                return null;
            }
            
            // Handle forbidden error
            if (response.status === 403) {
                console.error('Access forbidden:', url);
                
                // Try to provide more context about the forbidden error
                let message = 'You do not have permission to access this resource';
                
                // For specific endpoints, provide more helpful messages
                if (normalizedEndpoint.includes('/budgets/department/')) {
                    message = 'You do not have permission to view this department\'s budget information. This might be because you are not assigned to this department or your role does not have budget viewing privileges.';
                } else if (normalizedEndpoint.includes('/expenses')) {
                    message = 'You do not have permission to access expense information for this department or user.';
                }
                
                return {
                    success: false,
                    message: message,
                    statusCode: 403
                };
            }
            
            // Handle empty response
            if (response.status === 204) {
                return {
                    success: true,
                    data: null,
                    message: 'No content'
                };
            }
            
            // Try to parse response as JSON, with fallback for non-JSON responses
            try {
                const contentType = response.headers.get('content-type');
                
                // Check if response is JSON
                if (contentType && contentType.includes('application/json')) {
                    const responseData = await response.json();
                    return responseData;
                } else {
                    // Handle non-JSON responses
                    const text = await response.text();
                    return {
                        success: response.ok,
                        message: text || `Server responded with status: ${response.status}`,
                        statusCode: response.status
                    };
                }
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                
                // If response parsing fails but status is OK, return a success with empty data
                if (response.ok) {
                    return {
                        success: true,
                        message: 'Request successful, but response could not be parsed',
                        data: null
                    };
                } else {
                    return {
                        success: false,
                        message: `Error ${response.status}: ${response.statusText || 'Unknown error'}`,
                        statusCode: response.status
                    };
                }
            }
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    },
    
    /**
     * Makes a GET request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Promise with the response
     */
    get: (endpoint) => {
        return Api.request(endpoint, 'GET');
    },
    
    /**
     * Makes a POST request
     * @param {string} endpoint - API endpoint
     * @param {object} data - Request body data
     * @returns {Promise} - Promise with the response
     */
    post: (endpoint, data) => {
        return Api.request(endpoint, 'POST', data);
    },
    
    /**
     * Makes a PUT request
     * @param {string} endpoint - API endpoint
     * @param {object} data - Request body data
     * @returns {Promise} - Promise with the response
     */
    put: (endpoint, data) => {
        return Api.request(endpoint, 'PUT', data);
    },
    
    /**
     * Makes a DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Promise with the response
     */
    delete: (endpoint) => {
        return Api.request(endpoint, 'DELETE');
    }
};

// API endpoints for better organization
const ApiEndpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register'
    },
    expenses: {
        getAll: '/expenses',
        getByUser: (userId) => `/expenses/user/${userId}`,
        getByDepartment: (departmentId) => `/expenses/department/${departmentId}`,
        getByStatus: (status) => `/expenses/status/${status}`,
        create: '/expenses',
        updateStatus: (expenseId, status) => `/expenses/${expenseId}/status/${status}`,
        markAsPaid: (expenseId) => `/expenses/${expenseId}/status/PAID`,
        delete: (expenseId) => `/expenses/${expenseId}`
    },
    budgets: {
        getAll: '/budgets',
        getById: (id) => `/budgets/${id}`,
        getByDepartment: (departmentId) => `/budgets/department/${departmentId}`,
        getCurrentByDepartment: (departmentId) => `/budgets/department/${departmentId}/current`,
        create: '/budgets'
    },
    departments: {
        getAll: '/departments',
        getById: (id) => `/departments/${id}`,
        create: '/departments'
    }
}; 