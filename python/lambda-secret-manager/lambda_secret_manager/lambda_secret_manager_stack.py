from aws_cdk import (
    Stack, SecretValue,
    aws_secretsmanager as secretsmanager,
    aws_lambda as lambda_,
    aws_iam as iam,
)

from constructs import Construct

class LambdaSecretManagerStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        ss = secretsmanager.Secret(self, "Secret",
            secret_object_value={
                "HIDDEN_VALUE": SecretValue.unsafe_plain_text("TOP_SECRET"),
            }
        )

        fn = lambda_.Function(self, "Function",
            runtime=lambda_.Runtime.PYTHON_3_13,
            handler="app.lambda_handler",
            code=lambda_.Code.from_asset("lambda_code"),
            environment={
                "HIDDEN_VALUE": ss.secret_name,
            },
        )

        fn.add_to_role_policy(iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            actions=[
                'secretsmanager:GetSecretValue',
            ],
            resources=[
                ss.secret_arn,
            ],
        ))