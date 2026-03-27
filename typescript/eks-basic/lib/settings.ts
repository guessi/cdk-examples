import { SubnetType } from "aws-cdk-lib/aws-ec2";
import {
  KubernetesVersion,
  EndpointAccess,
  IpFamily,
  ClusterLoggingTypes,
  DefaultCapacityType,
} from "aws-cdk-lib/aws-eks-v2";

export const clusterName = "cdk-eks-cluster";

export const clusterVersion = KubernetesVersion.V1_35;
export const endpointAccess = EndpointAccess.PUBLIC_AND_PRIVATE;
export const subnetType = SubnetType.PRIVATE_WITH_EGRESS;
export const ipFamily = IpFamily.IP_V4;
export const serviceIpv4Cidr = "172.20.0.0/16";
export const defaultCapacityType = DefaultCapacityType.NODEGROUP;
export const defaultCapacity = 0;
export const clusterLogging = [
  ClusterLoggingTypes.API,
  ClusterLoggingTypes.AUTHENTICATOR,
  ClusterLoggingTypes.SCHEDULER,
  ClusterLoggingTypes.AUDIT,
  ClusterLoggingTypes.CONTROLLER_MANAGER,
];

// Chart version definitions
export const chartVersionAwsLBC = "3.1.0";

// Managed Addons
export const addonKubeProxy = "kube-proxy";
export const addonCoreDns = "coredns";
export const addonVpcCni = "vpc-cni";
export const addonPodIdentityAgent = "eks-pod-identity-agent";
export const addonEbsCsiDriver = "aws-ebs-csi-driver";
export const addonCloudWatchObservability = "amazon-cloudwatch-observability";
export const addonMetricsServer = "metrics-server";

// Addon Configuration with versions and enabled status
export interface AddonConfig {
  enabled: boolean;
  versions: Map<KubernetesVersion, string>;
}

export const addonVersions = new Map<string, AddonConfig>([
  [
    addonKubeProxy,
    {
      enabled: true,
      versions: new Map([
        [KubernetesVersion.V1_35, "v1.35.2-eksbuild.4"],
        [KubernetesVersion.V1_34, "v1.34.5-eksbuild.2"],
        [KubernetesVersion.V1_33, "v1.33.9-eksbuild.2"],
        [KubernetesVersion.V1_32, "v1.32.13-eksbuild.2"],
        [KubernetesVersion.V1_31, "v1.31.14-eksbuild.6"],
        [KubernetesVersion.V1_30, "v1.30.14-eksbuild.24"],
      ]),
    },
  ],
  [
    addonCoreDns,
    {
      enabled: true,
      versions: new Map([
        [KubernetesVersion.V1_35, "v1.13.2-eksbuild.4"],
        [KubernetesVersion.V1_34, "v1.13.2-eksbuild.4"],
        [KubernetesVersion.V1_33, "v1.13.2-eksbuild.4"],
        [KubernetesVersion.V1_32, "v1.11.4-eksbuild.33"],
        [KubernetesVersion.V1_31, "v1.11.4-eksbuild.33"],
        [KubernetesVersion.V1_30, "v1.11.4-eksbuild.33"],
      ]),
    },
  ],
  [
    addonVpcCni,
    {
      enabled: true,
      versions: new Map([
        [KubernetesVersion.V1_35, "v1.21.1-eksbuild.5"],
        [KubernetesVersion.V1_34, "v1.21.1-eksbuild.5"],
        [KubernetesVersion.V1_33, "v1.21.1-eksbuild.5"],
        [KubernetesVersion.V1_32, "v1.21.1-eksbuild.5"],
        [KubernetesVersion.V1_31, "v1.21.1-eksbuild.5"],
        [KubernetesVersion.V1_30, "v1.21.1-eksbuild.5"],
      ]),
    },
  ],
  [
    addonPodIdentityAgent,
    {
      enabled: true,
      versions: new Map([
        [KubernetesVersion.V1_35, "v1.3.10-eksbuild.2"],
        [KubernetesVersion.V1_34, "v1.3.10-eksbuild.2"],
        [KubernetesVersion.V1_33, "v1.3.10-eksbuild.2"],
        [KubernetesVersion.V1_32, "v1.3.10-eksbuild.2"],
        [KubernetesVersion.V1_31, "v1.3.10-eksbuild.2"],
        [KubernetesVersion.V1_30, "v1.3.10-eksbuild.2"],
      ]),
    },
  ],
  [
    addonEbsCsiDriver,
    {
      enabled: false,
      versions: new Map([
        [KubernetesVersion.V1_35, "v1.57.1-eksbuild.1"],
        [KubernetesVersion.V1_34, "v1.57.1-eksbuild.1"],
        [KubernetesVersion.V1_33, "v1.57.1-eksbuild.1"],
        [KubernetesVersion.V1_32, "v1.57.1-eksbuild.1"],
        [KubernetesVersion.V1_31, "v1.57.1-eksbuild.1"],
        [KubernetesVersion.V1_30, "v1.57.1-eksbuild.1"],
      ]),
    },
  ],
  [
    addonCloudWatchObservability,
    {
      enabled: false,
      versions: new Map([
        [KubernetesVersion.V1_35, "v5.2.3-eksbuild.1"],
        [KubernetesVersion.V1_34, "v5.2.3-eksbuild.1"],
        [KubernetesVersion.V1_33, "v5.2.3-eksbuild.1"],
        [KubernetesVersion.V1_32, "v5.2.3-eksbuild.1"],
        [KubernetesVersion.V1_31, "v5.2.3-eksbuild.1"],
        [KubernetesVersion.V1_30, "v5.2.3-eksbuild.1"],
      ]),
    },
  ],
  [
    addonMetricsServer,
    {
      enabled: false,
      versions: new Map([
        [KubernetesVersion.V1_35, "v0.8.1-eksbuild.4"],
        [KubernetesVersion.V1_34, "v0.8.1-eksbuild.4"],
        [KubernetesVersion.V1_33, "v0.8.1-eksbuild.4"],
        [KubernetesVersion.V1_32, "v0.8.1-eksbuild.4"],
        [KubernetesVersion.V1_31, "v0.8.1-eksbuild.4"],
        [KubernetesVersion.V1_30, "v0.8.0-eksbuild.3"],
      ]),
    },
  ],
]);
