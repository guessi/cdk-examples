import os
import boto3

from botocore.exceptions import ClientError

def lambda_handler(event, context):
    secret_name = os.getenv("HIDDEN_VALUE")

    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager')

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        raise e

    return get_secret_value_response['SecretString']