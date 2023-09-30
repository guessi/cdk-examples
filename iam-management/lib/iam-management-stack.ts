import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";

export class IamManagementStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create IAM User
    const demoUser = new iam.User(this, "DemoUser", {
      userName: "cdk-demo-user",
    });

    // Attach Managed Policy to IAM User
    demoUser.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("IAMReadOnlyAccess")
    );

    // Attach Customized Policy to IAM User
    const userDefinedInlinePolicy = new iam.Policy(
      this,
      "iam-list-users-groups",
      {
        statements: [
          new iam.PolicyStatement({
            resources: ["*"],
            actions: ["iam:ListUsers", "iam:ListGroups"],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }
    );
    demoUser.attachInlinePolicy(userDefinedInlinePolicy);

    // Create IAM Group
    const demoGroup = new iam.Group(this, "DemoGroup", {
      groupName: "cdk-demo-group",
    });

    // Attach Managed Policy to IAM Group
    demoGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("IAMReadOnlyAccess")
    );

    // Attach Customized Policy to IAM User
    const groupDefinedInlinePolicy = new iam.Policy(
      this,
      "iam-list-user-groups",
      {
        statements: [
          new iam.PolicyStatement({
            resources: ["*"],
            actions: ["iam:ListUsers", "iam:ListGroups"],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }
    );
    demoGroup.attachInlinePolicy(groupDefinedInlinePolicy);

    // Add IAM User to IAM Group
    demoGroup.addUser(demoUser);

    // Create IAM Role
    const demoRole = new iam.Role(this, "DemoRole", {
      roleName: "cdk-demo-role",
      description: "CDK Demo Role",
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    // Attach Managed Policy to IAM Role
    demoRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("IAMReadOnlyAccess")
    );

    // Attach Customized Policy to IAM Role
    demoRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["iam:ListUsers", "iam:ListGroups"],
        effect: iam.Effect.ALLOW,
      })
    );
  }
}
