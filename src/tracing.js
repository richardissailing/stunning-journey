import opentelemetry from '@opentelemetry/sdk-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

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