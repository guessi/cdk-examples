import { SubnetType } from "aws-cdk-lib/aws-ec2";
import {
  KubernetesVersion,
  EndpointAccess,
  IpFamily,
  ClusterLoggingTypes,
  DefaultCapacityType,
} from "@aws-cdk/aws-eks-v2-alpha";

export const clusterName = "cdk-eks-cluster";

export const clusterVersion = KubernetesVersion.V1_33;
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

export const chartVersionAwsLBC = "1.15.0";

// Managed Addons version definitions

export const addonKubeProxy = "kube-proxy";
export const addonCoreDns = "coredns";
export const addonVpcCni = "vpc-cni";
export const addonPodIdentityAgent = "eks-pod-identity-agent";
export const addonEbsCsiDriver = "aws-ebs-csi-driver";
export const addonCloudWatchObservability = "amazon-cloudwatch-observability";
export const addonMetricsServer = "metrics-server";

export const addonVersions = new Map<string, Map<KubernetesVersion, string>>([
  [
    addonKubeProxy,
    new Map([
      [KubernetesVersion.V1_33, "v1.33.3-eksbuild.10"],
      [KubernetesVersion.V1_32, "v1.32.6-eksbuild.12"],
      [KubernetesVersion.V1_31, "v1.31.10-eksbuild.12"],
      [KubernetesVersion.V1_30, "v1.30.14-eksbuild.8"],
    ]),
  ],
  [
    addonCoreDns,
    new Map([
      [KubernetesVersion.V1_33, "v1.12.4-eksbuild.1"],
      [KubernetesVersion.V1_32, "v1.11.4-eksbuild.24"],
      [KubernetesVersion.V1_31, "v1.11.4-eksbuild.24"],
      [KubernetesVersion.V1_30, "v1.11.4-eksbuild.24"],
    ]),
  ],
  [
    addonVpcCni,
    new Map([
      [KubernetesVersion.V1_33, "v1.20.4-eksbuild.1"],
      [KubernetesVersion.V1_32, "v1.20.4-eksbuild.1"],
      [KubernetesVersion.V1_31, "v1.20.4-eksbuild.1"],
      [KubernetesVersion.V1_30, "v1.20.4-eksbuild.1"],
    ]),
  ],
  [
    addonPodIdentityAgent,
    new Map([
      [KubernetesVersion.V1_33, "v1.3.9-eksbuild.5"],
      [KubernetesVersion.V1_32, "v1.3.9-eksbuild.5"],
      [KubernetesVersion.V1_31, "v1.3.9-eksbuild.5"],
      [KubernetesVersion.V1_30, "v1.3.9-eksbuild.5"],
    ]),
  ],
  [
    addonEbsCsiDriver,
    new Map([
      [KubernetesVersion.V1_33, "v1.52.1-eksbuild.1"],
      [KubernetesVersion.V1_32, "v1.52.1-eksbuild.1"],
      [KubernetesVersion.V1_31, "v1.52.1-eksbuild.1"],
      [KubernetesVersion.V1_30, "v1.52.1-eksbuild.1"],
    ]),
  ],
  [
    addonCloudWatchObservability,
    new Map([
      [KubernetesVersion.V1_33, "v4.7.0-eksbuild.1"],
      [KubernetesVersion.V1_32, "v4.7.0-eksbuild.1"],
      [KubernetesVersion.V1_31, "v4.7.0-eksbuild.1"],
      [KubernetesVersion.V1_30, "v4.7.0-eksbuild.1"],
    ]),
  ],
  [
    addonMetricsServer,
    new Map([
      [KubernetesVersion.V1_33, "v0.8.0-eksbuild.3"],
      [KubernetesVersion.V1_32, "v0.8.0-eksbuild.3"],
      [KubernetesVersion.V1_31, "v0.8.0-eksbuild.3"],
      [KubernetesVersion.V1_30, "v0.8.0-eksbuild.3"],
    ]),
  ],
]);
