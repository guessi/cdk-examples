import { Construct } from "constructs";
import { Cluster, NodegroupAmiType, CapacityType } from "aws-cdk-lib/aws-eks";
import {
  CfnLaunchTemplate,
  LaunchTemplateHttpTokens,
  InstanceType,
} from "aws-cdk-lib/aws-ec2";

import {
  CompositePrincipal,
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

export class NodeGroups extends Construct {
  constructor(scope: Construct, id: string, cluster: Cluster) {
    super(scope, id);

    const customizedLaunchTemplate = new CfnLaunchTemplate(
      this,
      `{nodeGroupName}_LaunchTemplate`,
      {
        launchTemplateData: {
          blockDeviceMappings: [
            {
              deviceName: "/dev/xvda",
              ebs: {
                volumeType: "gp3",
                volumeSize: 30,
              },
            },
          ],
          metadataOptions: {
            httpTokens: LaunchTemplateHttpTokens.REQUIRED,
            httpPutResponseHopLimit: 2,
          },
        },
      }
    );

    // IAM Role for node groups
    const nodeGroupRole = new Role(this, "nodeGroupRole", {
      assumedBy: new CompositePrincipal(
        new ServicePrincipal("ec2.amazonaws.com")
      ),
    });

    nodeGroupRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryReadOnly"
      )
    );
    nodeGroupRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSWorkerNodePolicy")
    );
    nodeGroupRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonEKS_CNI_Policy")
    );

    // (Optional) Only required if you need "EC2 Instance Connect"
    nodeGroupRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")
    );
    // (Optional) Only required if you are using "SSM"
    nodeGroupRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMPatchAssociation")
    );

    // (Optional) Only required if you have "Amazon CloudWatch Observability" setup
    nodeGroupRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy")
    );

    nodeGroupRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AWSXrayWriteOnlyAccess")
    );

    // HINT: required cdk v2.135.0 or higher version to support instanceTypes assignment when working with AL2023
    // - https://github.com/aws/aws-cdk/pull/29505
    // - https://github.com/aws/aws-cdk/releases/tag/v2.135.0
    cluster.addNodegroupCapacity("mng-1", {
      amiType: NodegroupAmiType.AL2023_X86_64_STANDARD,
      instanceTypes: [
        new InstanceType("t3a.medium"),
        new InstanceType("t3.medium"),
      ],
      desiredSize: 2,
      minSize: 2,
      maxSize: 5,
      capacityType: CapacityType.SPOT,
      nodeRole: nodeGroupRole,
      launchTemplateSpec: {
        id: customizedLaunchTemplate.ref,
        version: customizedLaunchTemplate.attrLatestVersionNumber,
      },
      tags: {
        "managed-by": "cdk",
      },
    });
  }
}
