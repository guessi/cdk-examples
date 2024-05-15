import * as eks from "aws-cdk-lib/aws-eks";

// kube-proxy
export const kubeProxyVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_29, "v1.29.3-eksbuild.2"],
  [eks.KubernetesVersion.V1_28, "v1.28.8-eksbuild.2"],
  [eks.KubernetesVersion.V1_27, "v1.27.12-eksbuild.2"],
  [eks.KubernetesVersion.V1_26, "v1.26.15-eksbuild.2"],
  [eks.KubernetesVersion.V1_25, "v1.25.16-eksbuild.5"],
  [eks.KubernetesVersion.V1_24, "v1.24.17-eksbuild.8"],
]);

// coredns
export const coreDnsVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_29, "v1.11.1-eksbuild.9"],
  [eks.KubernetesVersion.V1_28, "v1.10.1-eksbuild.11"],
  [eks.KubernetesVersion.V1_27, "v1.10.1-eksbuild.11"],
  [eks.KubernetesVersion.V1_26, "v1.9.3-eksbuild.15"],
  [eks.KubernetesVersion.V1_25, "v1.9.3-eksbuild.15"],
  [eks.KubernetesVersion.V1_24, "v1.9.3-eksbuild.15"],
]);

// vpc-cni
export const vpcCniVersionMap: Map<eks.KubernetesVersion, string> = new Map([
  [eks.KubernetesVersion.V1_29, "v1.18.1-eksbuild.3"],
  [eks.KubernetesVersion.V1_28, "v1.18.1-eksbuild.3"],
  [eks.KubernetesVersion.V1_27, "v1.18.1-eksbuild.3"],
  [eks.KubernetesVersion.V1_26, "v1.18.1-eksbuild.3"],
  [eks.KubernetesVersion.V1_25, "v1.18.1-eksbuild.3"],
  [eks.KubernetesVersion.V1_24, "v1.18.1-eksbuild.3"],
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
  [eks.KubernetesVersion.V1_29, "v1.30.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_28, "v1.30.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_27, "v1.30.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_26, "v1.30.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_25, "v1.30.0-eksbuild.1"],
  [eks.KubernetesVersion.V1_24, "v1.30.0-eksbuild.1"],
]);
