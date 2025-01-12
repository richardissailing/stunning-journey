# DevOps Implementation Project

This project demonstrates a complete DevOps setup for a Node.js application, featuring CI/CD pipeline, monitoring, and blue/green deployment strategy.

## Features

### CI/CD Pipeline
- Automated testing and deployment using GitHub Actions
- Docker containerization
- Blue/Green deployment strategy
- Automated rollback on failure

### Monitoring Stack
- Prometheus metrics collection
- Grafana dashboards
- Custom application metrics
- Health check endpoints
- Request duration tracking
- Error rate monitoring

### Infrastructure
- Containerized Node.js application
- Nginx load balancer
- Blue/Green deployment setup
- Docker Compose orchestration

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Git

## Project Structure
```
.
├── .github/
│   └── workflows/
│       └── main.yml           # CI/CD pipeline configuration
├── grafana/
│   ├── dashboards/           # Grafana dashboard definitions
│   └── provisioning/         # Grafana provisioning configs
├── nginx/
│   └── nginx.conf            # Nginx load balancer configuration
├── prometheus/
│   ├── prometheus.yml        # Prometheus configuration
│   └── rules/               # Alert rules
├── src/
│   ├── app.js              # Main application code
│   ├── server.js           # Server entry point
│   └── metrics.js          # Metrics configuration
├── docker-compose.yml      # Standard deployment
├── docker-compose.blue-green.yml  # Blue/Green deployment
└── Dockerfile             # Application containerization
```

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Start the standard stack:
```bash
docker-compose up -d
```

Or start with blue/green deployment:
```bash
docker-compose -f docker-compose.blue-green.yml up -d
```

## Accessing Services

- Blue Deployment: http://localhost:3002
- Green Deployment: http://localhost:3003
- Load Balancer: http://localhost:80
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (login: admin/admin)

## Blue/Green Deployment

### Manual Switching
```bash
# Switch to green deployment
./switch-deployment.sh green

# Switch to blue deployment
./switch-deployment.sh blue
```

### Testing Deployments
```bash
# Run deployment tests
./test-deployment.sh
```

## Monitoring

### Available Metrics
The application exposes the following metrics at `/metrics`:
- HTTP request duration
- Request counts by endpoint
- Error rates
- Node.js runtime metrics

### Grafana Dashboards
1. Access Grafana at http://localhost:3001
2. Login with admin/admin
3. Navigate to Dashboards
4. Select "Blue/Green Deployment Dashboard"

### Key Metrics
- Request Rate by Deployment
- Response Time by Deployment
- Error Rate
- Memory Usage
- Health Status

## Development

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Local development:
```bash
npm run dev
```

## CI/CD Pipeline

The GitHub Actions pipeline includes:
1. Automated testing
2. Docker image building
3. Container registry publishing
4. Blue/Green deployment
5. Automatic rollback on failure

## Troubleshooting

### Common Issues

1. Port Conflicts
```bash
# Check for port usage
sudo lsof -i :<port>
# Stop conflicting service or modify port in docker-compose
```

2. Deployment Switching Issues
```bash
# Verify services
docker-compose -f docker-compose.blue-green.yml ps
# Check logs
docker-compose -f docker-compose.blue-green.yml logs
```

3. Monitoring Issues
```bash
# Verify Prometheus targets
curl http://localhost:9090/targets
# Check metrics endpoint
curl http://localhost:3002/metrics
```

4. Grafana Issues
```bash
# Check Grafana logs
docker-compose -f docker-compose.blue-green.yml logs grafana
# Verify datasource
curl -u admin:admin http://localhost:3001/api/datasources
```

## Configuration

### Environment Variables
- `NODE_ENV`: Set environment (development/production)
- `PORT`: Application port (default: 3000)
- `DEPLOYMENT_COLOR`: Blue/Green deployment identifier

### Prometheus Configuration
Prometheus is configured to scrape metrics from:
- Blue deployment (app-blue:3000)
- Green deployment (app-green:3000)
- Prometheus itself

### Nginx Configuration
The load balancer is configured to:
- Route traffic to active deployment
- Handle health checks
- Provide zero-downtime switching

