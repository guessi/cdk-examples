import aws_cdk as core
import aws_cdk.assertions as assertions

from lambda_secret_manager.lambda_secret_manager_stack import LambdaSecretManagerStack

# example tests. To run these tests, uncomment this file along with the example
# resource in lambda_secret_manager/lambda_secret_manager_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = LambdaSecretManagerStack(app, "lambda-secret-manager")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
