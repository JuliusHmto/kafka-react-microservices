# Banking System with Kafka & Microfrontends

A comprehensive banking system demonstrating enterprise-level architecture patterns, event-driven design with Apache Kafka 4.0.0, and React.js microfrontends.

## 🏗️ Architecture Overview

This project showcases a modern banking system with:

- **Event-Driven Architecture** using Apache Kafka 4.0.0
- **Microservices Backend** in Java with Spring Boot
- **Microfrontends** using React.js with Module Federation
- **Design Patterns** including CQRS, Event Sourcing, Saga Pattern
- **Domain-Driven Design** for banking operations

## 📋 Project Structure

```
kafka-react/
├── backend/                          # Java Microservices
│   ├── account-service/              # Account management
│   ├── transaction-service/          # Transaction processing
│   ├── notification-service/         # Event-driven notifications
│   ├── fraud-detection-service/      # Real-time fraud detection
│   ├── audit-service/               # Event sourcing & audit logs
│   └── api-gateway/                 # Spring Cloud Gateway
├── frontend/                        # React Microfrontends
│   ├── shell-app/                   # Main container app
│   ├── account-dashboard/           # Account management UI
│   ├── transactions/                # Transaction history
│   ├── payments/                    # Payment processing
│   └── admin-portal/                # Administrative interface
├── infrastructure/                  # Docker & Kafka setup
│   ├── docker-compose.yml          # Full stack orchestration
│   ├── kafka/                      # Kafka configurations
│   └── monitoring/                 # Prometheus & Grafana
└── docs/                           # Architecture documentation
```

## 🚀 Key Technologies

### Backend
- **Java 17** - Latest LTS version
- **Spring Boot 3.x** - Microservices framework
- **Apache Kafka 4.0.0** - Event streaming platform
- **Spring Cloud** - Microservices ecosystem
- **PostgreSQL** - Primary database
- **Redis** - Caching layer
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **Module Federation** - Microfrontends architecture
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **React Query** - State management
- **Webpack 5** - Module bundler

### Infrastructure
- **Docker** - Containerization
- **Kubernetes** - Orchestration (optional)
- **Prometheus** - Monitoring
- **Grafana** - Observability dashboards

## 🎯 Key Features Demonstrated

### 1. Event-Driven Architecture
- **Event Sourcing** for audit trails
- **CQRS** pattern implementation
- **Saga Pattern** for distributed transactions
- **Event-driven notifications**

### 2. Banking Operations
- Account creation and management
- Real-time transaction processing
- Fraud detection using ML patterns
- Automated notifications
- Audit and compliance logging

### 3. Design Patterns
- **Factory Pattern** for account types
- **Observer Pattern** for event handling
- **Strategy Pattern** for transaction rules
- **Command Pattern** for operations
- **Repository Pattern** for data access

### 4. Microfrontends
- Independent deployable UI modules
- Shared component library
- Event-driven communication
- Progressive loading

## 🏃‍♂️ Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+

### 1. Clone and Setup
```bash
git clone <repository-url>
cd kafka-react
```

### 2. Start Infrastructure
```bash
# Start Kafka, PostgreSQL, Redis
docker-compose up -d kafka zookeeper postgres redis

# Wait for services to be ready
./scripts/wait-for-services.sh
```

### 3. Start Backend Services
```bash
cd backend
./start-services.sh
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

### 5. Access Applications
- **Main App**: http://localhost:3000
- **Admin Portal**: http://localhost:3001
- **Kafka UI**: http://localhost:8080
- **Grafana**: http://localhost:3001

## 📊 Kafka Topics & Events

### Core Banking Events
- `account.created` - Account creation events
- `transaction.initiated` - Transaction start
- `transaction.completed` - Transaction completion
- `fraud.detected` - Fraud detection alerts
- `notification.sent` - Notification delivery

### Event Schema Registry
All events follow Avro schema definitions for type safety and evolution.

## 🧪 Testing Strategy

- **Unit Tests** - JUnit 5, Mockito
- **Integration Tests** - TestContainers for Kafka
- **Contract Tests** - Pact for service communication
- **E2E Tests** - Cypress for frontend flows

## 📈 Observability

### Monitoring
- **Prometheus** metrics collection
- **Grafana** dashboards
- **Kafka monitoring** with JMX
- **Application tracing** with Zipkin

### Key Metrics
- Transaction throughput
- Event processing latency
- Error rates and patterns
- Business KPIs

## 🔒 Security

- JWT-based authentication
- OAuth 2.0 integration
- Event encryption at rest
- API rate limiting
- RBAC implementation

## 🎓 Interview Focus Areas

This project demonstrates knowledge in:

1. **Distributed Systems Design**
2. **Event-Driven Architecture**
3. **Microservices Patterns**
4. **Frontend Architecture**
5. **Data Consistency Patterns**
6. **Monitoring & Observability**
7. **Testing Strategies**
8. **Security Best Practices**

## 📚 Additional Resources

- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Microservices Patterns](https://microservices.io/patterns/)
- [React Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Domain-Driven Design](https://domainlanguage.com/ddd/)

## 🤝 Contributing

This is a demonstration project for interview preparation. Feel free to extend and modify for learning purposes.

## 📄 License

This project is for educational purposes only. 