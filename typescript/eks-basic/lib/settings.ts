import { SubnetType } from "aws-cdk-lib/aws-ec2";
import {
  KubernetesVersion,
  EndpointAccess,
  IpFamily,
  ClusterLoggingTypes,
  DefaultCapacityType,
} from "@aws-cdk/aws-eks-v2-alpha";

export const clusterName = "cdk-eks-cluster";

export const clusterVersion = KubernetesVersion.V1_34;
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
export const chartVersionAwsLBC = "1.17.1";

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
        [KubernetesVersion.V1_34, "v1.34.1-eksbuild.2"],
        [KubernetesVersion.V1_33, "v1.33.7-eksbuild.2"],
        [KubernetesVersion.V1_32, "v1.32.11-eksbuild.2"],
        [KubernetesVersion.V1_31, "v1.31.14-eksbuild.2"],
        [KubernetesVersion.V1_30, "v1.30.14-eksbuild.20"],
      ]),
    },
  ],
  [
    addonCoreDns,
    {
      enabled: true,
      versions: new Map([
        [KubernetesVersion.V1_34, "v1.13.1-eksbuild.1"],
        [KubernetesVersion.V1_33, "v1.13.1-eksbuild.1"],
        [KubernetesVersion.V1_32, "v1.11.4-eksbuild.28"],
        [KubernetesVersion.V1_31, "v1.11.4-eksbuild.28"],
        [KubernetesVersion.V1_30, "v1.11.4-eksbuild.28"],
      ]),
    },
  ],
  [
    addonVpcCni,
    {
      enabled: true,
      versions: new Map([
        [KubernetesVersion.V1_34, "v1.21.1-eksbuild.1"],
        [KubernetesVersion.V1_33, "v1.21.1-eksbuild.1"],
        [KubernetesVersion.V1_32, "v1.21.1-eksbuild.1"],
        [KubernetesVersion.V1_31, "v1.21.1-eksbuild.1"],
        [KubernetesVersion.V1_30, "v1.21.1-eksbuild.1"],
      ]),
    },
  ],
  [
    addonPodIdentityAgent,
    {
      enabled: true,
      versions: new Map([
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
        [KubernetesVersion.V1_34, "v1.54.0-eksbuild.1"],
        [KubernetesVersion.V1_33, "v1.54.0-eksbuild.1"],
        [KubernetesVersion.V1_32, "v1.54.0-eksbuild.1"],
        [KubernetesVersion.V1_31, "v1.54.0-eksbuild.1"],
        [KubernetesVersion.V1_30, "v1.54.0-eksbuild.1"],
      ]),
    },
  ],
  [
    addonCloudWatchObservability,
    {
      enabled: false,
      versions: new Map([
        [KubernetesVersion.V1_34, "v4.10.0-eksbuild.1"],
        [KubernetesVersion.V1_33, "v4.10.0-eksbuild.1"],
        [KubernetesVersion.V1_32, "v4.10.0-eksbuild.1"],
        [KubernetesVersion.V1_31, "v4.10.0-eksbuild.1"],
        [KubernetesVersion.V1_30, "v4.10.0-eksbuild.1"],
      ]),
    },
  ],
  [
    addonMetricsServer,
    {
      enabled: false,
      versions: new Map([
        [KubernetesVersion.V1_34, "v0.8.0-eksbuild.6"],
        [KubernetesVersion.V1_33, "v0.8.0-eksbuild.6"],
        [KubernetesVersion.V1_32, "v0.8.0-eksbuild.6"],
        [KubernetesVersion.V1_31, "v0.8.0-eksbuild.6"],
        [KubernetesVersion.V1_30, "v0.8.0-eksbuild.3"],
      ]),
    },
  ],
]);
