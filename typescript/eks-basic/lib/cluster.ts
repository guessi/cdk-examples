import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Cluster } from "aws-cdk-lib/aws-eks";
import { User, Role } from "aws-cdk-lib/aws-iam";
import { KubectlV29Layer as kubectlLayer } from "@aws-cdk/lambda-layer-kubectl-v29";
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
  }

  private setupAwsAuth(cluster: Cluster) {
    // mapUsers
    const adminUser = User.fromUserName(this, "adminUser", "admin-cli");
    cluster.awsAuth.addUserMapping(adminUser, { groups: ["system:masters"] });

    // mapRoles
    const consoleRole = Role.fromRoleName(this, "Role", "Admin", {
      mutable: true,
    });
    cluster.awsAuth.addRoleMapping(consoleRole, { groups: ["system:masters"] });
  }
}
