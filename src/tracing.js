import * as opentelemetry from '@opentelemetry/sdk-node';

export function setupTracing(serviceName) {
  // Check if we're in a testing environment
  if (process.env.NODE_ENV === 'test') {
    console.log(`Tracing setup for service: ${serviceName}`);
    return { 
      start: () => {}, 
      shutdown: () => {} 
    };
  }

  // Actual tracing implementation for production/development
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
  return sdk;
}