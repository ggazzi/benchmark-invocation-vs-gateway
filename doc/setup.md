# Experiment Setup

## How-To

This assumes you have full access to an AWS account where you can run this benchmark.

Instructions are based on the AWS Web Console, but the same could be achieved with the CLI.

### Ensure you have an appropriate `bun` layer for Lambdas

If you need to deploy it to your AWS account, can check the [`bun-lambda` documentation](https://github.com/oven-sh/bun/blob/main/packages/bun-lambda/README.md#setup) for instructions.

### Set up the callee Lambda 

1. Create and configure a new Lambda function 
    - Set the Runtime to custom with Amazon Linux
    - Set the handler to `handler.fetch`
    - Set the architecture to whichever architecture you configured when you built/deployed the Lambda Layer for bun.
    - Attach the Lambda Layer to the function

2. Deploy the code
    - Run `make callee`
    - Upload `dist/callee.zip` for the created Lambda

3. Test the lambda
    - Invoke it with an empty JSON object as payload (`{}`)
    - It should execute successfully and result in "Hello from Lambda!"
    - Invoke it again, since it's warmed up
    - It should execute successfully with a duration around 200ms

### Set up the API Gateway

1. Create a new API Gateway
  - Set the endpoint type to Regional

2. Create a new top-level resource called `test`

3. Create the GET method for `/test`
  - Choose the Lambda integration
  - Enable Lambda proxy integration
  - Pick the callee lambda you just created

4. Test the endpoint on the Web console
  - Run a GET request to this endpoint
  - The response should have status 200, body "Hello from Lambda!" and the "Content-Type" header set to "text/plain".

5. Deploy the API

6. Test the endpoint on your browser
  - Click Stages on the Web Console sidebar
  - Navigate to the GET method of the `/test` endpoint
  - Copy the Invoke URL
  - Open this URL in your browser
  - You should see the plain text "Hello from Lambda!"

### Set up the `caller` Lambda