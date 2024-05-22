import { Construct } from "constructs";
import { Cluster, KubernetesVersion, CfnAddon } from "aws-cdk-lib/aws-eks";
import * as settings from "./settings";

export class ManagedAddons extends Construct {
  constructor(
    scope: Construct,
    id: string,
    cluster: Cluster,
    clusterVersion: KubernetesVersion
  ) {
    super(scope, id);
    // general tags for managed addons
    let generalTags = [
      {
        key: "managed-by",
        value: "cdk",
      },
    ];

    // kube-proxy
    new CfnAddon(this, "cfnAddonKubeProxy", {
      addonName: "kube-proxy",
      clusterName: cluster.clusterName,
      addonVersion: settings.versionMapKubeProxy.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });

    // coredns
    new CfnAddon(this, "cfnAddonCoreDns", {
      addonName: "coredns",
      clusterName: cluster.clusterName,
      addonVersion: settings.versionMapCoreDNS.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });

    // vpc-cni
    new CfnAddon(this, "cfnAddonVpcCni", {
      addonName: "vpc-cni",
      clusterName: cluster.clusterName,
      addonVersion: settings.versionMapVpcCni.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });

    // eks-pod-identity-agent (Only Amazon EKS 1.24+ are supported)
    new CfnAddon(this, "cfnAddonEksPodIdentityAgent", {
      addonName: "eks-pod-identity-agent",
      clusterName: cluster.clusterName,
      addonVersion: settings.versionMapPodIdentityAgent.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });

    // aws-ebs-csi-driver
    new CfnAddon(this, "cfnAddonEbsCsi", {
      addonName: "aws-ebs-csi-driver",
      clusterName: cluster.clusterName,
      addonVersion: settings.versionMapEbsCsiDriver.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });

    // amazon-cloudwatch-observability
    new CfnAddon(this, "cfnAddonAmazonCloudwatchObservability", {
      addonName: "amazon-cloudwatch-observability",
      clusterName: cluster.clusterName,
      addonVersion: settings.versionMapCwObservability.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
      tags: generalTags,
    });
  }
}
