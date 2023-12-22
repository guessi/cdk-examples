import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import * as iam from "aws-cdk-lib/aws-iam";
import { KubectlV28Layer } from "@aws-cdk/lambda-layer-kubectl-v28";

export class EksBasicStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const clusterName = "cdk-eks-cluster";

    const targetKubernetesVersion = eks.KubernetesVersion.V1_28;

    const cluster = new eks.Cluster(this, "cdk-eks-cluster", {
      clusterName: clusterName,
      version: targetKubernetesVersion,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      kubectlLayer: new KubectlV28Layer(this, "kubectl"),
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

    const customizedLaunchTemplate = new ec2.CfnLaunchTemplate(this, "LT", {
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
    });

    // default setup with volume type "gp2"
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

    // customized setup with volume type "gp3"
    cluster.addNodegroupCapacity("mng-2", {
      nodegroupName: "mng-2",
      amiType: eks.NodegroupAmiType.AL2_X86_64,
      instanceTypes: instanceTypes,
      desiredSize: 2,
      minSize: 2,
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

    // mapUsers
    const adminUser = iam.User.fromUserName(this, "adminUser", "admin-cli");
    cluster.awsAuth.addUserMapping(adminUser, { groups: ["system:masters"] });

    // mapRoles
    const consoleRole = iam.Role.fromRoleName(this, "Role", "Admin", {
      mutable: true,
    });
    cluster.awsAuth.addRoleMapping(consoleRole, { groups: ["system:masters"] });

    // Addons from Helm Charts

    // AWS Load Balancer Controller
    const awsLoadBalancerControllerChartVersion = "1.6.2";
    const awsLoadBalancerController = new eks.HelmChart(
      this,
      "aws-load-balancer-controller",
      {
        cluster: cluster,
        chart: "aws-load-balancer-controller",
        repository: "https://aws.github.io/eks-charts",
        namespace: "kube-system",
        release: "aws-load-balancer-controller",
        version: awsLoadBalancerControllerChartVersion,
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

    // Managed Addons

    // kube-proxy
    const kubeProxyVersionMap: Map<eks.KubernetesVersion, string> = new Map([
      [eks.KubernetesVersion.V1_28, "v1.28.4-eksbuild.1"],
      [eks.KubernetesVersion.V1_27, "v1.27.6-eksbuild.2"],
      [eks.KubernetesVersion.V1_26, "v1.26.11-eksbuild.1"],
      [eks.KubernetesVersion.V1_25, "v1.25.16-eksbuild.1"],
      [eks.KubernetesVersion.V1_24, "v1.24.17-eksbuild.4"],
      [eks.KubernetesVersion.V1_23, "v1.23.17-eksbuild.5"],
    ]);

    const cfnAddonKubeProxy = new eks.CfnAddon(this, "cfnAddonKubeProxy", {
      addonName: "kube-proxy",
      clusterName: cluster.clusterName,

      addonVersion: kubeProxyVersionMap.get(targetKubernetesVersion),
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
    const coreDnsVersionMap: Map<eks.KubernetesVersion, string> = new Map([
      [eks.KubernetesVersion.V1_28, "v1.10.1-eksbuild.6"],
      [eks.KubernetesVersion.V1_27, "v1.10.1-eksbuild.6"],
      [eks.KubernetesVersion.V1_26, "v1.9.3-eksbuild.10"],
      [eks.KubernetesVersion.V1_25, "v1.9.3-eksbuild.10"],
      [eks.KubernetesVersion.V1_24, "v1.9.3-eksbuild.10"],
      [eks.KubernetesVersion.V1_23, "v1.8.7-eksbuild.9"],
    ]);

    const cfnAddonCoreDns = new eks.CfnAddon(this, "cfnAddonCoreDns", {
      addonName: "coredns",
      clusterName: cluster.clusterName,

      addonVersion: coreDnsVersionMap.get(targetKubernetesVersion),
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
    const vpcCniVersionMap: Map<eks.KubernetesVersion, string> = new Map([
      [eks.KubernetesVersion.V1_28, "v1.15.5-eksbuild.1"],
      [eks.KubernetesVersion.V1_27, "v1.15.5-eksbuild.1"],
      [eks.KubernetesVersion.V1_26, "v1.15.5-eksbuild.1"],
      [eks.KubernetesVersion.V1_25, "v1.15.5-eksbuild.1"],
      [eks.KubernetesVersion.V1_24, "v1.15.5-eksbuild.1"],
      [eks.KubernetesVersion.V1_23, "v1.15.5-eksbuild.1"],
    ]);

    const cfnAddonVpcCni = new eks.CfnAddon(this, "cfnAddonVpcCni", {
      addonName: "vpc-cni",
      clusterName: cluster.clusterName,

      addonVersion: vpcCniVersionMap.get(targetKubernetesVersion),
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

    // eks-pod-identity-agent
    const eksPodIdentityAgentVersionMap: Map<eks.KubernetesVersion, string> = new Map([
      [eks.KubernetesVersion.V1_28, "v1.0.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_27, "v1.0.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_26, "v1.0.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_25, "v1.0.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_24, "v1.0.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_23, "v1.0.0-eksbuild.1"],
    ]);

    const cfnAddonEksPodIdentityAgent = new eks.CfnAddon(this, "cfnAddonEksPodIdentityAgent", {
      addonName: "eks-pod-identity-agent",
      clusterName: cluster.clusterName,

      addonVersion: eksPodIdentityAgentVersionMap.get(targetKubernetesVersion),
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

    // aws-ebs-csi-driver
    const ebsCsiVersionMap: Map<eks.KubernetesVersion, string> = new Map([
      [eks.KubernetesVersion.V1_28, "v1.26.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_27, "v1.26.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_26, "v1.26.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_25, "v1.26.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_24, "v1.26.0-eksbuild.1"],
      [eks.KubernetesVersion.V1_23, "v1.26.0-eksbuild.1"],
    ]);

    const cfnAddonEbsCsi = new eks.CfnAddon(this, "cfnAddonEbsCsi", {
      addonName: "aws-ebs-csi-driver",
      clusterName: cluster.clusterName,

      addonVersion: ebsCsiVersionMap.get(targetKubernetesVersion),
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
