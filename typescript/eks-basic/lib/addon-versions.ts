import * as eks from "aws-cdk-lib/aws-eks";

// kube-proxy
export const kubeProxyVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_29, "v1.29.1-eksbuild.2"],
  [eks.KubernetesVersion.V1_28, "v1.28.6-eksbuild.2"],
  [eks.KubernetesVersion.V1_27, "v1.27.10-eksbuild.2"],
  [eks.KubernetesVersion.V1_26, "v1.26.13-eksbuild.2"],
  [eks.KubernetesVersion.V1_25, "v1.25.16-eksbuild.3"],
  [eks.KubernetesVersion.V1_24, "v1.24.17-eksbuild.8"],
]);

// coredns
export const coreDnsVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_29, "v1.11.1-eksbuild.6"],
  [eks.KubernetesVersion.V1_28, "v1.10.1-eksbuild.7"],
  [eks.KubernetesVersion.V1_27, "v1.10.1-eksbuild.7"],
  [eks.KubernetesVersion.V1_26, "v1.9.3-eksbuild.11"],
  [eks.KubernetesVersion.V1_25, "v1.9.3-eksbuild.11"],
  [eks.KubernetesVersion.V1_24, "v1.9.3-eksbuild.11"],
]);

// vpc-cni
export const vpcCniVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_29, "v1.17.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_28, "v1.17.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_27, "v1.17.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_26, "v1.17.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_25, "v1.17.1-eksbuild.1"],
  [eks.KubernetesVersion.V1_24, "v1.17.1-eksbuild.1"],
]);

// eks-pod-identity-agent
export const eksPodIdentityAgentVersionMap: Map<eks.KubernetesVersion, string> =
  new Map([
    [eks.KubernetesVersion.V1_29, "v1.2.0-eksbuild.1"],
    [eks.KubernetesVersion.V1_28, "v1.2.0-eksbuild.1"],
    [eks.KubernetesVersion.V1_27, "v1.2.0-eksbuild.1"],
    [eks.KubernetesVersion.V1_26, "v1.2.0-eksbuild.1"],
    [eks.KubernetesVersion.V1_25, "v1.2.0-eksbuild.1"],
    [eks.KubernetesVersion.V1_24, "v1.2.0-eksbuild.1"],
  ]);

// aws-ebs-csi-driver
export const ebsCsiVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_29, "v1.28.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_28, "v1.28.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_27, "v1.28.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_26, "v1.28.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_25, "v1.28.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_24, "v1.28.0-eksbuild.1"],
]);
