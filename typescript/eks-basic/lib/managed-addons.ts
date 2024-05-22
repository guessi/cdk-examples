import { Construct } from "constructs";
import { Cluster, KubernetesVersion, CfnAddon } from "aws-cdk-lib/aws-eks";
import {
  versionsKubeProxy,
  versionsCoreDNS,
  versionsVpcCni,
  versionsPodIdentityAgent,
  versionsEbsCsiDriver,
  versionsCwObservability,
} from "./settings";

export class ManagedAddons extends Construct {
  constructor(
    scope: Construct,
    id: string,
    cluster: Cluster,
    clusterVersion: KubernetesVersion
  ) {
    super(scope, id);

    // kube-proxy
    new CfnAddon(this, "cfnAddonKubeProxy", {
      addonName: "kube-proxy",
      clusterName: cluster.clusterName,
      addonVersion: versionsKubeProxy.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
    });

    // coredns
    new CfnAddon(this, "cfnAddonCoreDns", {
      addonName: "coredns",
      clusterName: cluster.clusterName,
      addonVersion: versionsCoreDNS.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
    });

    // vpc-cni
    new CfnAddon(this, "cfnAddonVpcCni", {
      addonName: "vpc-cni",
      clusterName: cluster.clusterName,
      addonVersion: versionsVpcCni.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
    });

    // eks-pod-identity-agent (Only Amazon EKS 1.24+ are supported)
    new CfnAddon(this, "cfnAddonEksPodIdentityAgent", {
      addonName: "eks-pod-identity-agent",
      clusterName: cluster.clusterName,
      addonVersion: versionsPodIdentityAgent.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
    });

    // aws-ebs-csi-driver
    new CfnAddon(this, "cfnAddonEbsCsi", {
      addonName: "aws-ebs-csi-driver",
      clusterName: cluster.clusterName,
      addonVersion: versionsEbsCsiDriver.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
    });

    // amazon-cloudwatch-observability
    new CfnAddon(this, "cfnAddonAmazonCloudwatchObservability", {
      addonName: "amazon-cloudwatch-observability",
      clusterName: cluster.clusterName,
      addonVersion: versionsCwObservability.get(clusterVersion),
      resolveConflicts: "OVERWRITE",
    });
  }
}
