import * as eks from "aws-cdk-lib/aws-eks";

// kube-proxy
export const kubeProxyVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_28, "v1.28.4-eksbuild.4"],
  [eks.KubernetesVersion.V1_27, "v1.27.8-eksbuild.4"],
  [eks.KubernetesVersion.V1_26, "v1.26.11-eksbuild.4"],
  [eks.KubernetesVersion.V1_25, "v1.25.16-eksbuild.1"],
  [eks.KubernetesVersion.V1_24, "v1.24.17-eksbuild.4"],
  [eks.KubernetesVersion.V1_23, "v1.23.17-eksbuild.5"],
]);

// coredns
export const coreDnsVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_28, "v1.10.1-eksbuild.6"],
  [eks.KubernetesVersion.V1_27, "v1.10.1-eksbuild.6"],
  [eks.KubernetesVersion.V1_26, "v1.9.3-eksbuild.10"],
  [eks.KubernetesVersion.V1_25, "v1.9.3-eksbuild.10"],
  [eks.KubernetesVersion.V1_24, "v1.9.3-eksbuild.10"],
  [eks.KubernetesVersion.V1_23, "v1.8.7-eksbuild.9"],
]);

// vpc-cni
export const vpcCniVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_28, "v1.16.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_27, "v1.16.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_26, "v1.16.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_25, "v1.16.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_24, "v1.16.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_23, "v1.15.5-eksbuild.1"],
]);

// eks-pod-identity-agent
export const eksPodIdentityAgentVersionMap: Map<eks.KubernetesVersion, string> =
  new Map([
    [eks.KubernetesVersion.V1_28, "v1.1.0-eksbuild.1"],
    [eks.KubernetesVersion.V1_27, "v1.1.0-eksbuild.1"],
    [eks.KubernetesVersion.V1_26, "v1.1.0-eksbuild.1"],
    [eks.KubernetesVersion.V1_25, "v1.1.0-eksbuild.1"],
    [eks.KubernetesVersion.V1_24, "v1.1.0-eksbuild.1"],
    // Only Amazon EKS 1.24+ are supported.
    // - https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html#pod-id-considerations
    // - https://aws.amazon.com/blogs/aws/amazon-eks-pod-identity-simplifies-iam-permissions-for-applications-on-amazon-eks-clusters/
  ]);

// aws-ebs-csi-driver
export const ebsCsiVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_28, "v1.26.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_27, "v1.26.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_26, "v1.26.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_25, "v1.26.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_24, "v1.26.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_23, "v1.26.1-eksbuild.1"],
]);
