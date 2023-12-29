import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import {
  LambdaClient, InvokeCommand
} from "@aws-sdk/client-lambda";

import benny from 'benny';

// Read environment variables
const API_GATEWAY_URL = process.env.API_GATEWAY_URL as string;

const LAMBDA_CLIENT = new LambdaClient({});
const LAMBDA_COMMAND = new InvokeCommand({
  FunctionName: process.env.LAMBDA_FUNCTION_NAME as string,
  Payload: JSON.stringify({}),
})

async function invokeCallee(): Promise<void> {
  const response = await LAMBDA_CLIENT.send(LAMBDA_COMMAND);
  if (response.StatusCode !== 200) {
    throw new Error(`Unexpected status code ${response.StatusCode}`);
  }
}

async function requestCallee(): Promise<void> {
  const response = await fetch(API_GATEWAY_URL);
  if (response.status !== 200) {
    throw new Error(`Unexpected status code ${response.status}`);
  }
}

async function warmUp(): Promise<void> {
  for (const _ of Array(3)) {
    await requestCallee();
  }
}

async function runSuite(): Promise<object> {
  await warmUp();

  return new Promise((resolve) => {
    benny.suite(
      'Invocation vs. API Gateway',

      benny.add('Invocation', invokeCallee),
      benny.add('API Gateway', requestCallee),

      benny.complete((summary) => {
        const result = summary.results.map((item) => {
          return {
            name: item.name,
            stats: {
              mean_ms: item.details.mean * 1000,
              stdDev_ms: item.details.standardDeviation * 1000,
              min_ms: item.details.min * 1000,
              max_ms: item.details.max * 1000,
            },
            numSamples: item.details.sampleResults.length,
            samples_ms: item.details.sampleResults.map((x) => x * 1000),
          }
        });

        resolve(result);
      })
    )
  })
}

export const lambdaHandler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const result = { variations: await runSuite() };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  };
}

runSuite().then(console.log)

