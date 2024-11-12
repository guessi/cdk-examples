import { Construct } from "constructs";
import { Cluster, NodegroupAmiType, CapacityType } from "aws-cdk-lib/aws-eks";
import {
  CfnLaunchTemplate,
  LaunchTemplateHttpTokens,
  InstanceType,
} from "aws-cdk-lib/aws-ec2";

export class NodeGroups extends Construct {
  constructor(scope: Construct, id: string, cluster: Cluster) {
    super(scope, id);

    const nodeGroupNamePrefix = "cdk-managed";

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

    // HINT: required cdk v2.135.0 or higher version to support instanceTypes assignment when working with AL2023
    // - https://github.com/aws/aws-cdk/pull/29505
    // - https://github.com/aws/aws-cdk/releases/tag/v2.135.0
    cluster.addNodegroupCapacity(nodeGroupNamePrefix + "-al2023", {
      amiType: NodegroupAmiType.AL2023_X86_64_STANDARD,
      instanceTypes: [
        new InstanceType("t3a.medium"),
        new InstanceType("t3.medium"),
      ],
      desiredSize: 2,
      minSize: 2,
      maxSize: 5,
      capacityType: CapacityType.SPOT,
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
