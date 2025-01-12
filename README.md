# DevOps Implementation Project

A comprehensive DevOps setup for a Node.js application featuring blue/green deployment, monitoring, tracing, and log aggregation.

## Features

### Core Infrastructure
- Blue/Green Deployment Strategy
- Nginx Load Balancer
- Docker Containerization
- Automated Testing and CI/CD

### Monitoring Stack
- Prometheus metrics collection
- Grafana dashboards
- Jaeger distributed tracing
- Loki log aggregation
- Health check monitoring

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Git

### Project Structure
```
.
├── .github/
│   └── workflows/          # CI/CD pipeline configurations
├── grafana/
│   ├── dashboards/        # Grafana dashboard definitions
│   └── provisioning/      # Grafana configuration
│       └── datasources/   # Datasource configurations
├── nginx/
│   └── nginx.conf         # Load balancer configuration
├── prometheus/
│   └── prometheus.yml     # Prometheus configuration
├── src/                   # Application source code
├── docker-compose.blue-green.yml
└── Dockerfile
```

### Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Start the services:
```bash
docker-compose -f docker-compose.blue-green.yml up -d
```

### Service Endpoints

- Blue Deployment: http://localhost:3002
- Green Deployment: http://localhost:3003
- Load Balancer: http://localhost:80
- Grafana: http://localhost:3001 (admin/admin)
- Prometheus: http://localhost:9090
- Jaeger UI: http://localhost:16686
- Loki: http://localhost:3100

## Deployment

### Blue/Green Deployment

Switch between deployments:
```bash
./scripts/switch-deployment.sh blue  # Switch to blue deployment
./scripts/switch-deployment.sh green # Switch to green deployment
```

Test deployments:
```bash
./scripts/test-deployment.sh
```

### Monitoring

#### Metrics
Access application metrics at `/metrics` endpoint in Prometheus format:
- HTTP request duration
- Request counts by endpoint
- Error rates
- Node.js runtime metrics

#### Tracing
Distributed tracing with Jaeger:
- Request tracing across services
- Performance bottleneck identification
- Error tracking

#### Logging
Log aggregation with Loki:
- Centralized logging
- Structured log format
- Real-time log tailing

### Testing

Run the test suite:
```bash
npm test
```

Generate test traffic:
```bash
./test-traffic.sh
```

## Configuration

### Environment Variables
```
NODE_ENV=production
DEPLOYMENT_COLOR=[blue|green]
```

### Prometheus Configuration
Target metrics endpoints:
- Blue deployment (app-blue:3000)
- Green deployment (app-green:3000)
- Prometheus itself

### Nginx Configuration
Load balancer settings:
- Health check endpoints
- Proxy configuration
- Zero-downtime switching

## Troubleshooting

### Common Issues

1. Service Health Check
```bash
# Check service status
docker-compose -f docker-compose.blue-green.yml ps

# View service logs
docker-compose -f docker-compose.blue-green.yml logs [service-name]
```

2. Deployment Issues
```bash
# Verify deployments
curl http://localhost:3002/health
curl http://localhost:3003/health
```

3. Monitoring
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Verify metrics endpoint
curl http://localhost:3002/metrics
```

4. Logging
```bash
# Check Loki logs
curl -X GET "http://localhost:3100/loki/api/v1/query" 
```

### Best Practices

1. Deployment
- Always verify health checks before switching
- Use gradual rollout for changes
- Monitor metrics during deployment

2. Monitoring
- Set up alerts for critical metrics
- Regular dashboard reviews
- Keep monitoring overhead low

3. Logging
- Use structured logging
- Include request IDs
- Set appropriate log levels

