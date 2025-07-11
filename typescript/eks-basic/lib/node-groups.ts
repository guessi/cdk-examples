import { Construct } from "constructs";

import {
  Cluster,
  NodegroupAmiType,
  CapacityType,
} from "aws-cdk-lib/aws-eks-v2";

import { InstanceType, InstanceClass, InstanceSize } from "aws-cdk-lib/aws-ec2";

import {
  CompositePrincipal,
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

import { addonVersions } from "./settings";

export class NodeGroups extends Construct {
  constructor(scope: Construct, id: string, cluster: Cluster) {
    super(scope, id);

    const nodeGroupRole = this.nodeGroupRole();

    // HINT: required cdk v2.135.0 or higher version to support instanceTypes assignment when working with AL2023
    // - https://github.com/aws/aws-cdk/pull/29505
    // - https://github.com/aws/aws-cdk/releases/tag/v2.135.0
    cluster.addNodegroupCapacity("mng-1", {
      amiType: NodegroupAmiType.AL2023_X86_64_STANDARD,
      instanceTypes: [
        InstanceType.of(InstanceClass.T3A, InstanceSize.SMALL),
        InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
      ],
      desiredSize: 2,
      minSize: 2,
      maxSize: 5,
      diskSize: 30,
      capacityType: CapacityType.SPOT,
      nodeRole: nodeGroupRole,
      tags: {
        "managed-by": "cdk",
      },
    });
  }

  private nodeGroupRole() {
    const nodeGroupRole = new Role(this, "nodeGroupRole", {
      assumedBy: new CompositePrincipal(
        new ServicePrincipal("ec2.amazonaws.com")
      ),
    });

    const policies = [
      // Minimum policies
      "AmazonEC2ContainerRegistryPullOnly",
      "AmazonEKSWorkerNodePolicy",

      // (Optional) Only required if you need "EC2 Instance Connect"
      "AmazonSSMManagedInstanceCore",

      // (Optional) Only required if you are using "SSM"
      "AmazonSSMPatchAssociation",
    ];

    // Add CloudWatch policies only if observability is enabled
    if (addonVersions.get("amazon-cloudwatch-observability")?.enabled) {
      policies.push(
        "CloudWatchAgentServerPolicy",
        "AWSXrayWriteOnlyAccess",
      );
    }

    policies.forEach((policy) => {
      nodeGroupRole.addManagedPolicy(
        ManagedPolicy.fromAwsManagedPolicyName(policy)
      );
    });
    return nodeGroupRole;
  }
}
