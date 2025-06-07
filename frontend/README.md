# Banking System Frontend

This is a modern banking system frontend built with React 18, TypeScript, and Microfrontend architecture using Module Federation.

## Architecture

### Shell Application (Port 3000)
- Main application shell that orchestrates all microfrontends
- Provides shared navigation, layout, and routing
- Consumes microfrontends as remote modules

### Microfrontends
- **Account MFE** (Port 3001): Account management functionality
- **Transaction MFE** (Port 3002): Transaction processing (planned)
- **Notification MFE** (Port 3003): Notification management (planned)

## Tech Stack

- **React 18** with TypeScript
- **Ant Design** for UI components
- **Module Federation** for microfrontend architecture
- **React Router** for routing
- **React Query** for data fetching
- **Webpack 5** for bundling

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Java 17+ (for backend services)
- Docker (for infrastructure)

### Installation

#### Windows
```bash
# Run the installation script
install-frontend.bat
```

#### Linux/macOS
```bash
# Make script executable and run
chmod +x install-frontend.sh
./install-frontend.sh
```

#### Manual Installation
```bash
# Install shell application dependencies
cd frontend
npm install

# Install account microfrontend dependencies
cd account-mfe
npm install
```

### Development

#### Start All Applications
```bash
# Terminal 1: Start shell application
cd frontend
npm start
# Runs on http://localhost:3000

# Terminal 2: Start account microfrontend
cd frontend/account-mfe
npm start
# Runs on http://localhost:3001
```

#### Access the Application
- **Main Application**: http://localhost:3000
- **Account MFE (standalone)**: http://localhost:3001

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Shared components
│   │   ├── Header.tsx     # Application header
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   └── ErrorBoundary.tsx
│   ├── pages/
│   │   └── Dashboard.tsx  # Main dashboard
│   ├── @types/           # TypeScript declarations
│   ├── App.tsx           # Main app component
│   ├── index.tsx         # Entry point
│   └── index.css         # Global styles
├── account-mfe/          # Account microfrontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccountList.tsx
│   │   │   ├── AccountDetail.tsx
│   │   │   └── CreateAccount.tsx
│   │   ├── AccountApp.tsx # MFE main component
│   │   └── index.tsx     # MFE entry point
│   └── webpack.config.js # MFE webpack config
├── package.json
├── webpack.config.js     # Shell webpack config
└── tsconfig.json
```

## Features

### Shell Application
- ✅ Modern banking dashboard
- ✅ Navigation sidebar with module routing
- ✅ User authentication UI
- ✅ Notification system
- ✅ Error boundaries for microfrontend failures
- ✅ Responsive design

### Account Microfrontend
- ✅ Account listing with search and filters
- ✅ Account creation form
- ✅ Account detail view
- ✅ Balance and status management
- ✅ Real-time statistics

## Development Guidelines

### Adding New Microfrontends

1. **Create new microfrontend directory**:
```bash
mkdir frontend/new-mfe
cd frontend/new-mfe
npm init -y
```

2. **Configure webpack.config.js**:
```javascript
new ModuleFederationPlugin({
  name: 'newMfe',
  filename: 'remoteEntry.js',
  exposes: {
    './NewApp': './src/NewApp',
  },
  // ... shared dependencies
})
```

3. **Update shell webpack.config.js**:
```javascript
remotes: {
  newMfe: 'newMfe@http://localhost:3004/remoteEntry.js',
}
```

4. **Add route in shell App.tsx**:
```tsx
<Route
  path="/new-feature/*"
  element={
    <Suspense fallback={<LoadingFallback />}>
      <NewMfe />
    </Suspense>
  }
/>
```

### Code Standards
- Use TypeScript for all components
- Follow React functional component patterns
- Use Ant Design components consistently
- Implement proper error boundaries
- Add loading states for async operations

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Integration with Backend

The frontend is designed to work with the Java Spring Boot backend services:

- **Account Service**: http://localhost:8081
- **Transaction Service**: http://localhost:8082
- **Notification Service**: http://localhost:8083
- **API Gateway**: http://localhost:8080

### API Integration
```typescript
// Example API service
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const accountService = {
  getAccounts: () => api.get('/accounts'),
  createAccount: (data) => api.post('/accounts', data),
  getAccount: (id) => api.get(`/accounts/${id}`),
};
```

## Deployment

### Production Build
```bash
# Build shell application
cd frontend
npm run build

# Build microfrontends
cd account-mfe
npm run build
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Troubleshooting

### Common Issues

1. **Module Federation Loading Errors**:
   - Ensure all microfrontends are running
   - Check network connectivity between applications
   - Verify webpack configurations

2. **TypeScript Errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check module federation type declarations

3. **Port Conflicts**:
   - Ensure ports 3000, 3001, 3002, 3003 are available
   - Update webpack.config.js if different ports are needed

### Development Tips
- Use browser dev tools to debug module federation
- Check network tab for failed remote module loads
- Use React Developer Tools for component debugging

## Contributing

1. Follow the established project structure
2. Write TypeScript for all new code
3. Add proper error handling and loading states
4. Test microfrontend integration thoroughly
5. Update documentation for new features

## License

This project is part of the Banking System technical interview preparation. 