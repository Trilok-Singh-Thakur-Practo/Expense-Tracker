/**
 * Utility for managing departments
 */

// Use the existing API_URL from api.js instead of redeclaring it
// const API_URL = 'http://localhost:8080/api';

// Define mock departments that will be used when API calls fail
const MOCK_DEPARTMENTS = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Marketing' },
    { id: 3, name: 'Finance' },
    { id: 4, name: 'Human Resources' }
];

const DepartmentUtil = {
    /**
     * Initialize departments if not already initialized
     */
    initializeDepartments: async () => {
        try {
            console.log('Attempting to initialize departments...');
            
            // Return mock departments immediately instead of making API calls
            console.log('Using mock departments due to backend issues');
            return {
                success: true,
                message: "Using mock departments due to backend issues",
                data: MOCK_DEPARTMENTS
            };
            
            /* Temporarily disable API calls since they're failing
            const response = await fetch(`${API_URL}/public/departments/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Add these options to help with CORS issues
                mode: 'cors',
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}, ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Department initialization response:', data);
            return data;
            */
        } catch (error) {
            console.error('Failed to initialize departments:', error.message);
            // Return mock departments as fallback
            return {
                success: true,
                message: "Using mock departments due to backend errors",
                data: MOCK_DEPARTMENTS
            };
        }
    },
    
    /**
     * Create default departments directly in case the initialize endpoint fails
     * This is currently disabled because it also fails with the chunked encoding error
     */
    createDefaultDepartments: async () => {
        console.log('Using mock departments instead of trying to create them');
        return {
            success: true,
            message: "Using mock departments",
            data: MOCK_DEPARTMENTS
        };
        
        /* Temporarily disabled because this is also failing
        try {
            console.log('Trying fallback: Creating departments one by one...');
            const departments = [
                { name: "Engineering" },
                { name: "Marketing" },
                { name: "Finance" },
                { name: "Human Resources" }
            ];
            
            // Create each department
            const createdDepts = [];
            for (const dept of departments) {
                const response = await fetch(`${API_URL}/public/departments/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dept),
                    mode: 'cors',
                    credentials: 'same-origin'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    createdDepts.push(data.data);
                }
            }
            
            if (createdDepts.length > 0) {
                console.log('Created departments via fallback:', createdDepts);
                return { success: true, data: createdDepts };
            } else {
                throw new Error('Could not create any departments');
            }
        } catch (error) {
            console.error('Department creation fallback failed:', error);
            return null;
        }
        */
    },
    
    /**
     * Get all departments
     */
    getAllDepartments: async () => {
        try {
            console.log('Skipping API call and using mock departments');
            // Return mock departments directly rather than in a success response object
            return MOCK_DEPARTMENTS;
            
            /* Temporarily disabled API calls
            console.log('Attempting to get all departments...');
            const response = await fetch(`${API_URL}/public/departments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}, ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('All departments:', data);
            return data;
            */
        } catch (error) {
            console.error('Failed to get departments:', error.message);
            // Return mock departments directly as fallback
            return MOCK_DEPARTMENTS;
        }
    }
};

// Make it globally accessible
window.DepartmentUtil = DepartmentUtil; 