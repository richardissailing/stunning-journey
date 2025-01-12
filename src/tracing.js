const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

function setupTracing(serviceName) {
    const exporter = new JaegerExporter({
        endpoint: 'http://jaeger:14268/api/traces'
    });

    const sdk = new opentelemetry.NodeSDK({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
        traceExporter: exporter,
        instrumentations: [getNodeAutoInstrumentations()]
    });

    sdk.start();
}

module.exports = { setupTracing };