import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AccessPolicy,
  AccessScopeType,
  Cluster,
} from "aws-cdk-lib/aws-eks-v2";
import { User, Role } from "aws-cdk-lib/aws-iam";
import { KubectlV35Layer as KubectlLayer } from "@aws-cdk/lambda-layer-kubectl-v35";
import { NodeGroups } from "./node-groups";
import { Charts } from "./helm-charts";
import { ManagedAddons } from "./managed-addons";
import * as settings from "./settings";

export class EksCluster extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cluster = new Cluster(this, "cdk-eks-cluster", {
      clusterName: settings.clusterName,
      version: settings.clusterVersion,
      endpointAccess: settings.endpointAccess,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlLayer(this, "kubectl"),
      },
      vpcSubnets: [{ subnetType: settings.subnetType }],
      ipFamily: settings.ipFamily,
      serviceIpv4Cidr: settings.serviceIpv4Cidr,
      defaultCapacityType: settings.defaultCapacityType,
      defaultCapacity: settings.defaultCapacity,
      clusterLogging: settings.clusterLogging,
    });

    new NodeGroups(this, "NodeGroup", cluster);
    new Charts(this, "Charts", cluster);
    new ManagedAddons(this, "ManagedAddons", cluster);

    // Setup Access Entries
    this.setupAccessEntries(cluster);
  }

  private setupAccessEntries(cluster: Cluster) {
    cluster.grantAccess(
      "clusterAdminAccessUser",
      User.fromUserName(this, "admin-user-access", "admin-cli").userArn,
      [
        AccessPolicy.fromAccessPolicyName("AmazonEKSClusterAdminPolicy", {
          accessScopeType: AccessScopeType.CLUSTER,
        }),
      ]
    );

    cluster.grantAccess(
      "clusterAdminAccessRole",
      Role.fromRoleName(this, "admin-role-access", "Admin").roleArn,
      [
        AccessPolicy.fromAccessPolicyName("AmazonEKSClusterAdminPolicy", {
          accessScopeType: AccessScopeType.CLUSTER,
        }),
      ]
    );
  }
}
