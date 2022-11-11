import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import * as iam from "aws-cdk-lib/aws-iam";
import { KubectlV23Layer } from "@aws-cdk/lambda-layer-kubectl-v23";

export class EksBasicStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster = new eks.Cluster(this, "cdk-eks-cluster", {
      clusterName: "cdk-eks-cluster",
      version: eks.KubernetesVersion.V1_23,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      kubectlLayer: new KubectlV23Layer(this, "kubectl"),
      vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
      serviceIpv4Cidr: "172.20.0.0/16",
      defaultCapacity: 0,
      clusterLogging: [
        eks.ClusterLoggingTypes.API,
        eks.ClusterLoggingTypes.AUTHENTICATOR,
        eks.ClusterLoggingTypes.SCHEDULER,
        eks.ClusterLoggingTypes.AUDIT,
        eks.ClusterLoggingTypes.CONTROLLER_MANAGER,
      ],
      tags: {
        "managed-by": "cdk",
      },
      outputClusterName: true,
      outputConfigCommand: true,
    });

    cluster.addNodegroupCapacity("mng-1", {
      nodegroupName: "mng-1",
      amiType: eks.NodegroupAmiType.AL2_X86_64,
      instanceTypes: [new ec2.InstanceType("t3.small")],
      desiredSize: 2,
      minSize: 2,
      maxSize: 5,
      diskSize: 20,
      capacityType: eks.CapacityType.SPOT,
      tags: {
        "managed-by": "cdk",
      },
    });

    // mapUsers
    const adminUser = iam.User.fromUserName(this, "adminUser", "admin-cli");
    cluster.awsAuth.addUserMapping(adminUser, { groups: ["system:masters"] });

    // mapRoles
    const consoleRole = iam.Role.fromRoleName(this, "Role", "Admin", {
      mutable: true,
    });
    cluster.awsAuth.addRoleMapping(consoleRole, { groups: ["system:masters"] });
  }
}
