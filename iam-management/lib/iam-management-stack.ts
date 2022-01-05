import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from "aws-cdk-lib/aws-iam";

export class IamManagementStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create IAM User
    const sampleUser = new iam.User(this, 'SampleUser');

    // Attach Managed Policy to IAM User
    sampleUser.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2ReadOnlyAccess"),
    );

    // Attach Customized Policy to IAM User
    const userDefinedInlinePolicy = new iam.Policy(this, 'ec2-managed-tags', {
      statements: [
        new iam.PolicyStatement({
          resources: ['*'],
          actions: [
            'ec2:DeleteTags',
            'ec2:CreateTags',
          ],
          effect: iam.Effect.ALLOW,
        }),
      ],
    });
    sampleUser.attachInlinePolicy(userDefinedInlinePolicy);

    // Create IAM Group
    const sampleGroup = new iam.Group(this, 'SampleGroup');

    // Attach Managed Policy to IAM Group
    sampleGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchReadOnlyAccess"),
    );

    // Attach Customized Policy to IAM User
    const groupDefinedInlinePolicy = new iam.Policy(this, 'allow-list-all-buckets', {
      statements: [
        new iam.PolicyStatement({
          resources: ['*'],
          actions: [
            's3:ListAllMyBuckets',
          ],
          effect: iam.Effect.ALLOW,
        }),
      ],
    });
    sampleGroup.attachInlinePolicy(groupDefinedInlinePolicy);

    // Add IAM User to IAM Group
    sampleGroup.addUser(sampleUser);

    // Create IAM Role
    const sampleRole = new iam.Role(this, 'SampleRole', {
      assumedBy: new iam.ServicePrincipal('sns.amazonaws.com'),
    });

    // Attach Managed Policy to IAM Role
    sampleRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSLambda_ReadOnlyAccess"),
    );

    // Attach Customized Policy to IAM Role
    sampleRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'lambda:InvokeFunction',
      ],
    }));
  }
}
