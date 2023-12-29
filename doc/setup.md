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
    - Run `npm run build && script/zip_lambda_with_modules callee`
    - Upload `dist/callee.zip` for the created Lambda

3. Test the lambda
    - Invoke it with any payload
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

1. Create and configure a new Lambda function
    - Follow the instructions from the callee Lambda
    - Set the timeout to 2min 30s
    - Set the following environment variables
      - `API_GATEWAY_URL`: the Invoke URL for GET `/test`
      - `LAMBDA_FUNCTION_NAME`: the name of the callee Lambda

2. Give the Lambda permission to invoke the callee
    - Go to the IAM web console, then its "Roles" section
    - Find the role for the caller lambda (it will include its function name)
    - Add a new inline policy with the following contents:

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": "lambda:InvokeFunction",
          "Resource": "arn:aws:lambda:*:<your-account-id>:function:<callee-lambda-name>"
        }
      ]
    }
    ```

3. Deploy the code
    - Run `npm run build && script/zip_lambda_with_modules callee`
    - Upload `dist/callee.zip` for the created Lambda

4. Run the lambda to obtain results
    - Invoke it with any payload
    - It should execute successfully and return an object describing the results of the experiment.
