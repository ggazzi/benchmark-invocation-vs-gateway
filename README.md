# benchmark-invocation-vs-gateway

This is a small experiment to check the performance difference of directly invoking an AWS Lambda vs. going through an API Gateway that invokes the Lambda via the AWS integration.

Definitions:
- **Caller**: a Lambda that wants to ultimately invoke another Lambda
- **Callee**: the Lambda that gets invoked, directly or via the API Gateway

The assumptions for this experiment are the following:
- Both Lambdas and the API Gateway are in the same region and VPC.
- The callee's executions take around 200ms.

For instructions on how to run this experiment, check the [setup document](./doc/setup.md).
For the results, check the [results document](./doc/results.md).

## Dependencies

- nodejs
- typescript
- bash
- zip
