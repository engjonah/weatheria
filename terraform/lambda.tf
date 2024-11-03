# Example IAM role for Lambda
resource "aws_iam_role" "citySearchLambdaRole" {
  name = "lambda_execution_role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow"
      }
    ]
  })
}

# Attach policies to the Lambda execution role
resource "aws_iam_role_policy_attachment" "citySearchLambdaRolePolicy" {
  role       = aws_iam_role.citySearchLambdaRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "citySearchLambda" {
  function_name = "citySearchLambda"
  role          = aws_iam_role.citySearchLambdaRole.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  filename      = "../citySearchLambda/my-lambda-function.zip"

  environment {
    variables = {
      MONGODB_URI: var.MONGODB_URI
    }
  }

  memory_size = 128 
  timeout     = 15    
}


