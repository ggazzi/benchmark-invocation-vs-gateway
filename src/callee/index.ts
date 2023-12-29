import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";

export const lambdaHandler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Wait 200ms before responding
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
    },
    body: "Hello from Lambda!",
  };
}

