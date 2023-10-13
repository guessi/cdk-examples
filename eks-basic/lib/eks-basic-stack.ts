import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import * as iam from "aws-cdk-lib/aws-iam";
import { KubectlV27Layer } from "@aws-cdk/lambda-layer-kubectl-v27";

export class EksBasicStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const clusterName = "cdk-eks-cluster";

    const cluster = new eks.Cluster(this, "cdk-eks-cluster", {
      clusterName: clusterName,
      version: eks.KubernetesVersion.V1_27,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      kubectlLayer: new KubectlV27Layer(this, "kubectl"),
      vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
      ipFamily: eks.IpFamily.IP_V4,
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

    const instanceTypes = [
      new ec2.InstanceType("t3a.medium"),
      new ec2.InstanceType("t3.medium"),
    ];

    cluster.addNodegroupCapacity("mng-1", {
      nodegroupName: "mng-1",
      amiType: eks.NodegroupAmiType.AL2_X86_64,
      instanceTypes: instanceTypes,
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

    // AWS Load Balancer Controller
    const awsLoadBalancerController = new eks.HelmChart(
      this,
      "aws-load-balancer-controller",
      {
        cluster: cluster,
        chart: "aws-load-balancer-controller",
        repository: "https://aws.github.io/eks-charts",
        namespace: "kube-system",
        release: "aws-load-balancer-controller",
        version: "1.6.1",
        values: {
          clusterName: clusterName,
          vpcId: cluster.vpc.vpcId,
          region: cluster.vpc.env.region,
        },
        timeout: cdk.Duration.minutes(5),
        wait: true,
      }
    );

    // metrics-server
    const metricsServer = new eks.HelmChart(this, "metrics-server", {
      cluster: cluster,
      chart: "metrics-server",
      repository: "https://kubernetes-sigs.github.io/metrics-server",
      namespace: "kube-system",
      release: "metrics-server",
    });

    // kube-proxy
    const cfnAddonKubeProxy = new eks.CfnAddon(this, "cfnAddonKubeProxy", {
      addonName: "kube-proxy",
      clusterName: cluster.clusterName,

      // addonVersion: "addonVersion",
      // configurationValues: "configurationValues",
      // preserveOnDelete: false,
      resolveConflicts: "OVERWRITE",
      // serviceAccountRoleArn: "serviceAccountRoleArn",
      tags: [
        {
          key: "managed-by",
          value: "cdk",
        },
      ],
    });

    // coredns
    const cfnAddonCoreDns = new eks.CfnAddon(this, "cfnAddonCoreDns", {
      addonName: "coredns",
      clusterName: cluster.clusterName,

      // addonVersion: "addonVersion",
      // configurationValues: "configurationValues",
      // preserveOnDelete: false,
      resolveConflicts: "OVERWRITE",
      // serviceAccountRoleArn: "serviceAccountRoleArn",
      tags: [
        {
          key: "managed-by",
          value: "cdk",
        },
      ],
    });

    // vpc-cni
    const cfnAddonVpcCni = new eks.CfnAddon(this, "cfnAddonVpcCni", {
      addonName: "vpc-cni",
      clusterName: cluster.clusterName,

      // addonVersion: "addonVersion",
      // configurationValues: "configurationValues",
      // preserveOnDelete: false,
      resolveConflicts: "OVERWRITE",
      // serviceAccountRoleArn: "serviceAccountRoleArn",
      tags: [
        {
          key: "managed-by",
          value: "cdk",
        },
      ],
    });
  }
}
