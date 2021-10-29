import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";

/*
 * Use 'cdk deploy -c key=keyName'
 */

export class VpcWithBastion extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // subnet definition for VPC
    const subnetConfig = [
      {
        name: "public",
        cidrMask: 22,
        subnetType: ec2.SubnetType.PUBLIC,
      },
      {
        name: "private",
        cidrMask: 22,
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      },
    ];

    // VPC
    const vpc = new ec2.Vpc(this, "Lab-VPC", {
      cidr: "10.101.0.0/16",
      maxAzs: 2,
      subnetConfiguration: subnetConfig,
    });

    // create bastion server
    const ec2Instance = new ec2.BastionHostLinux(this, "bastion", {
      vpc: vpc,
      subnetSelection: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    ec2Instance.allowSshAccessFrom(ec2.Peer.ipv4("10.101.0.0/16"));

    // CDK outputs
    new cdk.CfnOutput(this, "IP Address", {
      value: ec2Instance.instancePublicIp,
    });
  }
}
