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

### Docker Configuration
Before starting, ensure Docker is properly configured:

1. Configure Docker DNS:
```json
{
    "dns": ["8.8.8.8", "8.8.4.4"],
    "dns-opts": ["ndots:1"],
    "mtu": 1500,
    "ipv6": false
}
```

2. Apply configuration:
```bash
sudo systemctl restart docker
```

### Project Structure
```
.
├── .github/
│   └── workflows/          # CI/CD pipeline configurations
├── grafana/
│   ├── dashboards/        # Grafana dashboard definitions
│   └── provisioning/      # Grafana configuration
│       └── datasources/   # Datasource configurations
├── loki/                  # Loki configuration
├── nginx/
│   └── nginx.conf         # Load balancer configuration
├── prometheus/
│   └── prometheus.yml     # Prometheus configuration
├── src/                   # Application source code
├── promtail/              # Loki configuration
├── docker-compose.blue-green.yml
└── Dockerfile
```

### Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Start the services in order:
```bash
# Start core services
docker-compose -f docker-compose.blue-green.yml up -d nginx prometheus grafana

# Start applications
docker-compose -f docker-compose.blue-green.yml up -d app-blue app-green

# Start monitoring services
docker-compose -f docker-compose.blue-green.yml up -d jaeger loki
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

1. Docker DNS Issues
```bash
# Check Docker DNS configuration
cat /etc/docker/daemon.json

# Verify DNS resolution
docker run busybox nslookup google.com
```

2. Service Health Check
```bash
# Check service status
docker-compose -f docker-compose.blue-green.yml ps

# View service logs
docker-compose -f docker-compose.blue-green.yml logs [service-name]
```

3. Deployment Issues
```bash
# Verify deployments
curl http://localhost:3002/health
curl http://localhost:3003/health

# Check container logs
docker logs devtakehome_app-blue_1
docker logs devtakehome_app-green_1
```

4. Monitoring
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Verify metrics endpoint
curl http://localhost:3002/metrics
```

5. Logging
```bash
# Check Loki logs
curl -X GET "http://localhost:3100/loki/api/v1/query"

# Verify log collection
docker-compose -f docker-compose.blue-green.yml logs loki
```
