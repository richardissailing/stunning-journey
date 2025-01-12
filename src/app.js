const express = require('express');
const winston = require('winston');
const { register, metrics } = require('./metrics');

const app = express();

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'express-app' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Request logging and metrics middleware
app.use((req, res, next) => {
    const start = Date.now();
    const end = metrics.httpRequestDuration.startTimer();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const labels = {
            method: req.method,
            route: req.route?.path || req.path,
            status_code: res.statusCode
        };

        // Record metrics
        end(labels);
        metrics.httpRequestTotal.inc(labels);

        // Log request
        logger.info('Request processed', {
            ...labels,
            duration,
            userAgent: req.get('user-agent')
        });
    });

    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    const labels = {
        method: req.method,
        route: req.route?.path || req.path,
        error_type: err.name || 'UnknownError'
    };

    metrics.httpRequestErrors.inc(labels);

    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    res.status(500).json({
        error: 'Internal Server Error',
        requestId: req.id
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        logger.error('Error generating metrics', { error: err });
        res.status(500).end(err);
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Express.js example app!' });
});

// Sample data endpoint
app.get('/api/data', (req, res) => {
    setTimeout(() => {
        res.json({ data: 'Sample data response' });
    }, Math.random() * 1000);
});

// Error endpoint
app.get('/api/error', (req, res, next) => {
    next(new Error('Test error endpoint'));
});

module.exports = app;
