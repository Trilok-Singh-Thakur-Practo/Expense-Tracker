# Expense Tracker Frontend

This is the frontend for the Expense Tracker application.

## Running the Frontend

### Using npm/Node.js (Recommended)

1. Make sure you have Node.js installed on your system
2. Navigate to the frontend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
   This will start a live-server with hot reloading at http://localhost:8080

### Alternative methods

#### Using Python's built-in HTTP server

```bash
# Python 3
cd frontend
python -m http.server 8080
```

#### Using PHP's built-in server

```bash
cd frontend
php -S localhost:8080
```

#### Using any other HTTP server

You can use any HTTP server that can serve static files, such as:
- Apache
- Nginx
- Caddy

Just configure it to serve the files from the frontend directory.

## Troubleshooting

If you encounter JavaScript errors related to missing functions or undefined variables, make sure:

1. You are running the server from the correct directory (the `frontend` folder)
2. All script tags in index.html are correctly ordered
3. The browser cache is cleared (try hard refresh with Ctrl+Shift+R or Cmd+Shift+R)

## Development

The app uses vanilla JavaScript with a custom router. The structure is:
- `src/utils/` - Utility functions including API calls, authentication, and routing
- `src/pages/` - Page rendering functions
- `src/assets/` - Static assets like CSS and images 