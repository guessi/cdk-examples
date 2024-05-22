import { SubnetType } from "aws-cdk-lib/aws-ec2";
import {
  KubernetesVersion,
  EndpointAccess,
  IpFamily,
  ClusterLoggingTypes,
} from "aws-cdk-lib/aws-eks";

export const clusterName = "cdk-eks-cluster";
export const targetEksVersion = KubernetesVersion.V1_29;
export const endpointAccess = EndpointAccess.PUBLIC_AND_PRIVATE;
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

// Chart version definitions

export const chartVersionAwsLBC = "1.8.0";

// Managed Addons version definitions

export const versionsKubeProxy: Map<KubernetesVersion, string> = new Map([
  [KubernetesVersion.V1_29, "v1.29.3-eksbuild.2"],
  [KubernetesVersion.V1_28, "v1.28.8-eksbuild.2"],
  [KubernetesVersion.V1_27, "v1.27.12-eksbuild.2"],
  [KubernetesVersion.V1_26, "v1.26.15-eksbuild.2"],
  [KubernetesVersion.V1_25, "v1.25.16-eksbuild.5"],
  [KubernetesVersion.V1_24, "v1.24.17-eksbuild.8"],
]);

export const versionsCoreDNS: Map<KubernetesVersion, string> = new Map([
  [KubernetesVersion.V1_29, "v1.11.1-eksbuild.9"],
  [KubernetesVersion.V1_28, "v1.10.1-eksbuild.11"],
  [KubernetesVersion.V1_27, "v1.10.1-eksbuild.11"],
  [KubernetesVersion.V1_26, "v1.9.3-eksbuild.15"],
  [KubernetesVersion.V1_25, "v1.9.3-eksbuild.15"],
  [KubernetesVersion.V1_24, "v1.9.3-eksbuild.15"],
]);

export const versionsVpcCni: Map<KubernetesVersion, string> = new Map([
  [KubernetesVersion.V1_29, "v1.18.1-eksbuild.3"],
  [KubernetesVersion.V1_28, "v1.18.1-eksbuild.3"],
  [KubernetesVersion.V1_27, "v1.18.1-eksbuild.3"],
  [KubernetesVersion.V1_26, "v1.18.1-eksbuild.3"],
  [KubernetesVersion.V1_25, "v1.18.1-eksbuild.3"],
  [KubernetesVersion.V1_24, "v1.18.1-eksbuild.3"],
]);

export const versionsPodIdentityAgent: Map<KubernetesVersion, string> = new Map(
  [
    [KubernetesVersion.V1_29, "v1.2.0-eksbuild.1"],
    [KubernetesVersion.V1_28, "v1.2.0-eksbuild.1"],
    [KubernetesVersion.V1_27, "v1.2.0-eksbuild.1"],
    [KubernetesVersion.V1_26, "v1.2.0-eksbuild.1"],
    [KubernetesVersion.V1_25, "v1.2.0-eksbuild.1"],
    [KubernetesVersion.V1_24, "v1.2.0-eksbuild.1"],
  ]
);

export const versionsEbsCsiDriver: Map<KubernetesVersion, string> = new Map([
  [KubernetesVersion.V1_29, "v1.30.0-eksbuild.1"],
  [KubernetesVersion.V1_28, "v1.30.0-eksbuild.1"],
  [KubernetesVersion.V1_27, "v1.30.0-eksbuild.1"],
  [KubernetesVersion.V1_26, "v1.30.0-eksbuild.1"],
  [KubernetesVersion.V1_25, "v1.30.0-eksbuild.1"],
  [KubernetesVersion.V1_24, "v1.30.0-eksbuild.1"],
]);

export const versionsCwObservability: Map<KubernetesVersion, string> = new Map([
  [KubernetesVersion.V1_29, "v1.6.0-eksbuild.1"],
  [KubernetesVersion.V1_28, "v1.6.0-eksbuild.1"],
  [KubernetesVersion.V1_27, "v1.6.0-eksbuild.1"],
  [KubernetesVersion.V1_26, "v1.6.0-eksbuild.1"],
  [KubernetesVersion.V1_25, "v1.6.0-eksbuild.1"],
  [KubernetesVersion.V1_24, "v1.6.0-eksbuild.1"],
]);

/*
  The addon versions above are generated by the script below

  Replace the addon name with the following ones
  - "kube-proxy"
  - "coredns"
  - "vpc-cni"
  - "eks-pod-identity-agent"
  - "aws-ebs-csi-driver"
  - "amazon-cloudwatch-observability"

  ADDON_NAME=kube-proxy

  SUPPORTED_K8S_VERSION=("1.29" "1.28" "1.27" "1.26" "1.25" "1.24")

  for K8S_VERSION in ${SUPPORTED_K8S_VERSION[@]}; do \
    aws eks describe-addon-versions \
      --addon-name ${ADDON_NAME} \
      --kubernetes-version ${K8S_VERSION} \
      --output json | \
        jq '.addons[].addonVersions[0].addonVersion'
  done
*/
