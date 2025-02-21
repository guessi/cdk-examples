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
      version: settings.targetEksVersion,
      endpointAccess: settings.endpointAccess,
      kubectlLayer: new kubectlLayer(this, "kubectl"),
      authenticationMode: AuthenticationMode.API_AND_CONFIG_MAP,
      vpcSubnets: [{ subnetType: settings.subnetType }],
      ipFamily: settings.ipFamily,
      serviceIpv4Cidr: settings.serviceIpv4Cidr,
      defaultCapacity: settings.defaultCapacity,
      clusterLogging: settings.clusterLogging,
    });

    new NodeGroups(this, "NodeGroup", cluster);
    new Charts(this, "Charts", cluster);
    new ManagedAddons(this, "ManagedAddons", cluster, settings.targetEksVersion);

    // Setup ConfigMaps/aws-auth
    this.setupAwsAuth(cluster);

    // Setup Access Entries
    this.setupAccessEntries(cluster);
  }

  private setupAwsAuth(cluster: Cluster) {
    // mapUsers
    cluster.awsAuth.addUserMapping(
      User.fromUserName(this, "admin-user-aws-atuh", "admin-cli"),
      { groups: ["system:masters"] }
    );

    // mapRoles
    cluster.awsAuth.addRoleMapping(
      Role.fromRoleName(this, "admin-role-aws-auth", "Admin"),
      { groups: ["system:masters"] }
    );
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
