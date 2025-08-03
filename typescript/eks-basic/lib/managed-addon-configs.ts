import {
  addonKubeProxy,
  addonCoreDns,
  addonVpcCni,
  addonPodIdentityAgent,
  addonEbsCsiDriver,
  addonCloudWatchObservability,
  addonMetricsServer,
} from "./settings";

/**
 * Configuration interface for EKS addons
 */
export interface AddonConfig {
  /** Logical ID for the CDK construct */
  id: string;
  /** AWS addon name */
  name: string;
  /** Optional configuration values as an object */
  configurationValues?: Record<string, any>;
  /** Optional description for documentation */
  description?: string;
  /** Pod Identity configuration for this addon */
  podIdentity?: PodIdentityConfig;
}

/**
 * Configuration interface for Pod Identity associations
 */
export interface PodIdentityConfig {
  /** AWS managed policy name */
  managedPolicyName: string;
  /** Kubernetes service account name */
  serviceAccount: string;
  /** Optional namespace (defaults to kube-system) */
  namespace?: string;
}

/**
 * All EKS addon configurations
 */
export const addonConfigs: AddonConfig[] = [
  {
    id: "KubeProxy",
    name: addonKubeProxy,
    description: "Kubernetes network proxy",
  },
  {
    id: "CoreDns",
    name: addonCoreDns,
    description: "DNS server for Kubernetes clusters",
  },
  {
    id: "VpcCni",
    name: addonVpcCni,
    description: "Amazon VPC CNI plugin for Kubernetes",
    configurationValues: {
      // Disable: aws-eks-nodeagent
      nodeAgent: {
        enabled: false,
      },
    },
    podIdentity: {
      managedPolicyName: "AmazonEKS_CNI_Policy",
      serviceAccount: "aws-node",
    },
  },
  {
    id: "EksPodIdentityAgent",
    name: addonPodIdentityAgent,
    description: "EKS Pod Identity Agent (requires EKS 1.24+)",
  },
  {
    id: "EbsCsiDriver",
    name: addonEbsCsiDriver,
    description: "Amazon EBS CSI driver",
    configurationValues: {
      // Enable: volumemodifier
      controller: {
        volumeModificationFeature: {
          enabled: true,
        },
      },
      // Disable: ebs-csi-node-windows
      node: {
        enableWindows: false,
      },
      // Disable: csi-snapshotter
      sidecars: {
        snapshotter: {
          forceEnable: false,
        },
      },
    },
    podIdentity: {
      managedPolicyName: "service-role/AmazonEBSCSIDriverPolicy",
      serviceAccount: "ebs-csi-controller-sa",
    },
  },
  {
    id: "AmazonCloudwatchObservability",
    name: addonCloudWatchObservability,
    description: "Amazon CloudWatch Observability addon",
  },
  {
    id: "MetricsServer",
    name: addonMetricsServer,
    description: "Kubernetes Metrics Server",
  },
];
