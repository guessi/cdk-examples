import { CfnOutput, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class VpcWithBastion extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // CIDR definition for the VPC
    const vpcCidr = "10.101.0.0/16";

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
      cidr: vpcCidr,
      maxAzs: 2,
      subnetConfiguration: subnetConfig,
    });

    // Subnet Tagging
    for (const subnet of vpc.publicSubnets) {
      Tags.of(subnet).add(
        "public-subnet",
        "true",
      );
    }

    for (const subnet of vpc.privateSubnets) {
      Tags.of(subnet).add(
        "private-subnet",
        "true",
      );
    }

    // (Optional) Extra subnet setup
    // const publicSubnetExtra = new ec2.PublicSubnet(this, 'extra-public-subnet', {
    //   availabilityZone: 'us-east-1c',
    //   cidrBlock: '10.101.240.0/22',
    //   vpcId: vpc.vpcId,
    // });
    //
    // const routeIgw = new ec2.CfnRoute(this, 'RouteIGW', {
    //   destinationCidrBlock: '0.0.0.0/0',
    //   routeTableId: publicSubnetExtra.routeTable.routeTableId,
    //   gatewayId: vpc.internetGatewayId,
    // });

    // (Optional) Bastion server
    // const ec2Instance = new ec2.BastionHostLinux(this, "bastion", {
    //   vpc: vpc,
    //   subnetSelection: {
    //     subnetType: ec2.SubnetType.PUBLIC,
    //   },
    // });
    //
    // ec2Instance.allowSshAccessFrom(ec2.Peer.ipv4(vpcCidr));

    // (Optional) CDK outputs
    // new CfnOutput(this, "IP Address", {
    //   value: ec2Instance.instancePublicIp,
    // });
  }
}
