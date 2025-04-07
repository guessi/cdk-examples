import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AccessPolicy,
  AccessScopeType,
  AuthenticationMode,
  Cluster,
} from "aws-cdk-lib/aws-eks";
import { User, Role } from "aws-cdk-lib/aws-iam";
import { KubectlV32Layer as kubectlLayer } from "@aws-cdk/lambda-layer-kubectl-v32";
import { NodeGroups } from "./node-groups";
import { Charts } from "./charts";
import { ManagedAddons } from "./managed-addons";
import * as settings from "./settings";

export class EksCluster extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cluster = new Cluster(this, "cdk-eks-cluster", {
      clusterName: settings.clusterName,
      version: settings.clusterVersion,
      endpointAccess: settings.endpointAccess,
      kubectlLayer: new kubectlLayer(this, "kubectl"),
      authenticationMode: settings.authenticationMode,
      vpcSubnets: [{ subnetType: settings.subnetType }],
      ipFamily: settings.ipFamily,
      serviceIpv4Cidr: settings.serviceIpv4Cidr,
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
