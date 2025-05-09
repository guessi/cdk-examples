import { SubnetType } from "aws-cdk-lib/aws-ec2";
import {
  AuthenticationMode,
  KubernetesVersion,
  EndpointAccess,
  IpFamily,
  ClusterLoggingTypes,
} from "aws-cdk-lib/aws-eks";

export const clusterName = "cdk-eks-cluster";
export const clusterVersion = KubernetesVersion.V1_32;
export const endpointAccess = EndpointAccess.PUBLIC_AND_PRIVATE;
export const authenticationMode = AuthenticationMode.API_AND_CONFIG_MAP;
export const subnetType = SubnetType.PRIVATE_WITH_EGRESS;
export const ipFamily = IpFamily.IP_V4;
export const serviceIpv4Cidr = "172.20.0.0/16";
export const defaultCapacity = 0;
export const clusterLogging = [
  ClusterLoggingTypes.API,
  ClusterLoggingTypes.AUTHENTICATOR,
  ClusterLoggingTypes.SCHEDULER,
  ClusterLoggingTypes.AUDIT,
  ClusterLoggingTypes.CONTROLLER_MANAGER,
];
export const resolveConflicts = "OVERWRITE";

// Chart version definitions

export const chartVersionAwsLBC = "1.12.0";

// Managed Addons version definitions

export const addonKubeProxy = "kube-proxy";
export const addonCoreDns = "coredns";
export const addonVpcCni = "vpc-cni";
export const addonPodIdentityAgent = "eks-pod-identity-agent";
export const addonEbsCsiDriver = "aws-ebs-csi-driver";
export const addonCloudWatchObservability = "amazon-cloudwatch-observability";
export const addonMetricsServer = "metrics-server";

export const defaultAddonVersions = new Map([
  [addonKubeProxy, undefined],
  [addonCoreDns, "v1.11.4-eksbuild.2"],
  [addonVpcCni, "v1.19.4-eksbuild.1"],
  [addonPodIdentityAgent, "v1.3.5-eksbuild.2"],
  [addonEbsCsiDriver, "v1.42.0-eksbuild.1"],
  [addonCloudWatchObservability, "v3.6.0-eksbuild.2"],
  [addonMetricsServer, "v0.7.2-eksbuild.3"],
]);

export const addonVersions = new Map<string, Map<KubernetesVersion, string>>([
  [
    addonKubeProxy,
    new Map([
      [KubernetesVersion.V1_32, "v1.32.3-eksbuild.2"],
      [KubernetesVersion.V1_31, "v1.31.3-eksbuild.2"],
      [KubernetesVersion.V1_30, "v1.30.9-eksbuild.3"],
    ]),
  ],
]);
