const opentelemetry = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

const traceExporter = new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
});

const sdk = new opentelemetry.NodeSDK({
    traceExporter,
    instrumentations: [
        new ExpressInstrumentation()
    ]
});

sdk.start();
