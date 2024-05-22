import { KubectlV29Layer as kubectlLayer } from "@aws-cdk/lambda-layer-kubectl-v29";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as addons from "./addon-versions";
import * as settings from "./cluster-settings";

export class EksCluster extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster = new eks.Cluster(this, "cdk-eks-cluster", {
      clusterName: settings.clusterName,
      version: settings.eksVersion,
      endpointAccess: settings.endpointAccess,
      kubectlLayer: new kubectlLayer(this, "kubectl"),
      vpcSubnets: [{ subnetType: settings.subnetType }],
      ipFamily: settings.ipFamily,
      serviceIpv4Cidr: settings.serviceIpv4Cidr,
      defaultCapacity: settings.defaultCapacity,
      clusterLogging: settings.clusterLogging,
      tags: settings.clusterTags,
      outputClusterName: true,
      outputConfigCommand: true,
    });

    // Create Managed Node Group with Launch Template
    this.createManagedNodeGroups(cluster, "cdk-managed");

    // Addons from Helm Charts
    this.createHelmCharts(cluster);

    // Managed Addons
    this.createManagedAddons(cluster, settings.eksVersion);

    // Setup ConfigMaps/aws-auth
    this.setupAwsAuth(cluster);
  }

  // Managed Node Groups
  private createManagedNodeGroups(
    cluster: eks.Cluster,
    nodeGroupNamePrefix: string
  ) {
    const customizedLaunchTemplate = new ec2.CfnLaunchTemplate(
      this,
      `{nodeGroupName}_LaunchTemplate`,
      {
        launchTemplateData: {
          blockDeviceMappings: [
            {
              deviceName: "/dev/xvda",
              ebs: {
                volumeType: "gp3",
                volumeSize: 20,
              },
            },
          ],
          metadataOptions: {
            httpTokens: ec2.LaunchTemplateHttpTokens.REQUIRED,
            httpPutResponseHopLimit: 2,
          },
        },
      }
    );

    cluster.addNodegroupCapacity(nodeGroupNamePrefix + "-al2-amd64-1", {
      amiType: eks.NodegroupAmiType.AL2_X86_64,
      instanceTypes: [new ec2.InstanceType("t3.medium")],
      desiredSize: 1,
      minSize: 1,
      maxSize: 5,
      capacityType: eks.CapacityType.SPOT,
      launchTemplateSpec: {
        id: customizedLaunchTemplate.ref,
        version: customizedLaunchTemplate.attrLatestVersionNumber,
      },
      tags: {
        "managed-by": "cdk",
      },
    });

    cluster.addNodegroupCapacity(nodeGroupNamePrefix + "-al2023-amd64-1", {
      amiType: eks.NodegroupAmiType.AL2023_X86_64_STANDARD,
      // HINT: required cdk v2.135.0 or higher version to support instanceTypes assignment when working with AL2023
      // - https://github.com/aws/aws-cdk/pull/29505
      // - https://github.com/aws/aws-cdk/releases/tag/v2.135.0
      instanceTypes: [new ec2.InstanceType("t3.medium")],
      desiredSize: 1,
      minSize: 1,
      maxSize: 5,
      capacityType: eks.CapacityType.SPOT,
      tags: {
        "managed-by": "cdk",
      },
    });

    cluster.addNodegroupCapacity(nodeGroupNamePrefix + "-al2023-arm64-1", {
      amiType: eks.NodegroupAmiType.AL2023_ARM_64_STANDARD,
      // HINT: required cdk v2.135.0 or higher version to support instanceTypes assignment when working with AL2023
      // - https://github.com/aws/aws-cdk/pull/29505
      // - https://github.com/aws/aws-cdk/releases/tag/v2.135.0
      instanceTypes: [new ec2.InstanceType("t4g.medium")],
      desiredSize: 1,
      minSize: 1,
      maxSize: 5,
      capacityType: eks.CapacityType.SPOT,
      tags: {
        "managed-by": "cdk",
      },
    });
  }

  private createHelmCharts(cluster: eks.Cluster) {
    // AWS Load Balancer Controller
    const awsLoadBalancerControllerChartVersion = "1.7.1";
    new eks.HelmChart(this, "aws-load-balancer-controller", {
      cluster: cluster,
      chart: "aws-load-balancer-controller",
      repository: "https://aws.github.io/eks-charts",
      namespace: "kube-system",
      release: "aws-load-balancer-controller",
      version: awsLoadBalancerControllerChartVersion,
      values: {
        clusterName: cluster.clusterName,
        vpcId: cluster.vpc.vpcId,
        region: cluster.vpc.env.region,
      },
      timeout: cdk.Duration.minutes(5),
      wait: true,
    });

    // metrics-server
    new eks.HelmChart(this, "metrics-server", {
      cluster: cluster,
      chart: "metrics-server",
      repository: "https://kubernetes-sigs.github.io/metrics-server",
      namespace: "kube-system",
      release: "metrics-server",
    });
  }

  private createManagedAddons(
    cluster: eks.Cluster,
    eksVersion: eks.KubernetesVersion
  ) {
    // general tags for managed addons
    let generalTags = [
      {
        key: "managed-by",
        value: "cdk",
      },
    ];

    // kube-proxy
    new eks.CfnAddon(this, "cfnAddonKubeProxy", {
      addonName: "kube-proxy",
      clusterName: cluster.clusterName,
      addonVersion: addons.kubeProxyVersionMap.get(eksVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });

    // coredns
    new eks.CfnAddon(this, "cfnAddonCoreDns", {
      addonName: "coredns",
      clusterName: cluster.clusterName,
      addonVersion: addons.coreDnsVersionMap.get(eksVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });

    // vpc-cni
    new eks.CfnAddon(this, "cfnAddonVpcCni", {
      addonName: "vpc-cni",
      clusterName: cluster.clusterName,
      addonVersion: addons.vpcCniVersionMap.get(eksVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });

    // eks-pod-identity-agent (Only Amazon EKS 1.24+ are supported)
    new eks.CfnAddon(this, "cfnAddonEksPodIdentityAgent", {
      addonName: "eks-pod-identity-agent",
      clusterName: cluster.clusterName,
      addonVersion: addons.eksPodIdentityAgentVersionMap.get(eksVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });

    // aws-ebs-csi-driver
    new eks.CfnAddon(this, "cfnAddonEbsCsi", {
      addonName: "aws-ebs-csi-driver",
      clusterName: cluster.clusterName,
      addonVersion: addons.ebsCsiVersionMap.get(eksVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });
  }

  private setupAwsAuth(cluster: eks.Cluster) {
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
