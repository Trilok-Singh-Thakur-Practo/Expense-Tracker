/**
 * Simple router for handling page navigation
 */
const Router = {
    // Current route
    currentRoute: null,
    
    // Routes configuration
    routes: {
        login: {
            path: '/',
            render: renderLoginPage,
            requiresAuth: false
        },
        register: {
            path: '/register',
            render: renderRegisterPage,
            requiresAuth: false
        },
        employeeDashboard: {
            path: '/employee/dashboard',
            render: renderEmployeeDashboard,
            requiresAuth: true,
            roles: ['EMPLOYEE']
        },
        managerDashboard: {
            path: '/manager/dashboard',
            render: renderManagerDashboard,
            requiresAuth: true,
            roles: ['MANAGER']
        },
        financeDashboard: {
            path: '/finance/dashboard',
            render: renderFinanceDashboard,
            requiresAuth: true,
            roles: ['FINANCE']
        },
        addExpense: {
            path: '/expense/add',
            render: renderAddExpensePage,
            requiresAuth: true,
            roles: ['EMPLOYEE', 'MANAGER']
        },
        addBudget: {
            path: '/budget/add',
            render: renderAddBudgetPage,
            requiresAuth: true,
            roles: ['FINANCE']
        }
    },
    
    /**
     * Initialize the router
     */
    init: async () => {
        // Set up error handling for the whole application
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
            // Prevent the error from breaking the app entirely
            event.preventDefault();
        });
        
        // Initialize departments first
        try {
            await DepartmentUtil.initializeDepartments();
            console.log('Departments initialized successfully');
        } catch (error) {
            console.error('Failed to initialize departments, but continuing with app initialization:', error);
            // Continue with initialization even if departments fail
        }
        
        // Handle browser navigation
        window.addEventListener('popstate', Router.handleRouteChange);
        
        // Initial route - Get the current path from the URL
        const currentPath = window.location.pathname;
        
        // Find the route that matches the current path
        let initialRoute = '/';
        for (const [name, route] of Object.entries(Router.routes)) {
            if (route.path === currentPath) {
                initialRoute = currentPath;
                break;
            }
        }
        
        // Navigate to the initial route
        Router.navigateToRoute(initialRoute);
    },
    
    /**
     * Handle route change
     */
    handleRouteChange: () => {
        // Call async method without awaiting - this is intentional as we don't need to wait
        Router.navigateToRoute(window.location.pathname);
    },
    
    /**
     * Navigate to a specific route
     * @param {string} path - Route path
     */
    navigateToRoute: async (path = window.location.pathname) => {
        // Default to home if no path specified
        if (path === '') path = '/';
        
        // Find route by path
        let matchedRoute = null;
        for (const [name, route] of Object.entries(Router.routes)) {
            if (route.path === path) {
                matchedRoute = { name, ...route };
                break;
            }
        }
        
        // Default to login if route not found
        if (!matchedRoute) {
            window.history.replaceState(null, '', '/');
            matchedRoute = { name: 'login', ...Router.routes.login };
        }
        
        // Check if user is authenticated for protected routes
        if (matchedRoute.requiresAuth && !Auth.isAuthenticated()) {
            window.history.replaceState(null, '', '/');
            matchedRoute = { name: 'login', ...Router.routes.login };
        }
        
        // Check if user has required role
        if (matchedRoute.roles && !Auth.hasRole(matchedRoute.roles)) {
            // Redirect to appropriate dashboard based on role
            const user = Auth.getCurrentUser();
            if (user) {
                switch (user.role) {
                    case 'EMPLOYEE':
                        window.history.replaceState(null, '', '/employee/dashboard');
                        matchedRoute = { name: 'employeeDashboard', ...Router.routes.employeeDashboard };
                        break;
                    case 'MANAGER':
                        window.history.replaceState(null, '', '/manager/dashboard');
                        matchedRoute = { name: 'managerDashboard', ...Router.routes.managerDashboard };
                        break;
                    case 'FINANCE':
                        window.history.replaceState(null, '', '/finance/dashboard');
                        matchedRoute = { name: 'financeDashboard', ...Router.routes.financeDashboard };
                        break;
                    default:
                        window.history.replaceState(null, '', '/');
                        matchedRoute = { name: 'login', ...Router.routes.login };
                }
            } else {
                window.history.replaceState(null, '', '/');
                matchedRoute = { name: 'login', ...Router.routes.login };
            }
        }
        
        // Render the page
        Router.currentRoute = matchedRoute;
        // Check if the render function is async (returns a Promise)
        try {
            const renderResult = matchedRoute.render();
            if (renderResult instanceof Promise) {
                await renderResult;
            }
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    },
    
    /**
     * Navigate to a named route
     * @param {string} routeName - Route name
     */
    navigate: (routeName) => {
        const route = Router.routes[routeName];
        if (route) {
            window.history.pushState(null, '', route.path);
            // Call async method without awaiting - this is intentional as we don't need to wait
            Router.navigateToRoute(route.path);
        }
    }
};

// Make Router globally accessible
window.Router = Router; 