require('./tracing').setupTracing(process.env.DEPLOYMENT_COLOR || 'app');

const express = require('express');
const promClient = require('prom-client');
const winston = require('winston');

const app = express();

// Prometheus metrics setup
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5]
});
register.registerMetric(httpRequestDuration);

// Logging setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: process.env.DEPLOYMENT_COLOR || 'app' },
    transports: [
        new winston.transports.Console()
    ]
});

// Middleware for metrics and logging
app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const labels = {
            method: req.method,
            route: req.route?.path || req.path,
            code: res.statusCode
        };
        
        httpRequestDuration.observe(labels, duration / 1000);
        
        logger.info('Request processed', {
            ...labels,
            duration,
            userAgent: req.get('user-agent')
        });
    });
    
    next();
});

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the app!' });
});

module.exports = app;