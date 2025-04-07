import { Construct } from "constructs";
import { Cluster, CfnAddon } from "aws-cdk-lib/aws-eks";
import {
  addonVersions,
  clusterVersion,
  defaultAddonVersions,
  resolveConflicts,
  supportedAddonKubeProxy,
  supportedAddonCoreDns,
  supportedAddonVpcCni,
  supportedAddonPodIdentityAgent,
  supportedAddonEbsCsiDriver,
  supportedAddonCloudWatchObservability,
  supportedAddonMetricsServer,
} from "./settings";

export class ManagedAddons extends Construct {
  constructor(scope: Construct, id: string, cluster: Cluster) {
    super(scope, id);

    // kube-proxy
    new CfnAddon(this, "cfnAddonKubeProxy", {
      addonName: supportedAddonKubeProxy,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(supportedAddonKubeProxy),
      resolveConflicts: resolveConflicts,
    });

    // coredns
    new CfnAddon(this, "cfnAddonCoreDns", {
      addonName: supportedAddonCoreDns,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(supportedAddonCoreDns),
      resolveConflicts: resolveConflicts,
    });

    // vpc-cni
    new CfnAddon(this, "cfnAddonVpcCni", {
      addonName: supportedAddonVpcCni,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(supportedAddonVpcCni),
      resolveConflicts: resolveConflicts,
    });

    // eks-pod-identity-agent (Only Amazon EKS 1.24+ are supported)
    new CfnAddon(this, "cfnAddonEksPodIdentityAgent", {
      addonName: supportedAddonPodIdentityAgent,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(supportedAddonPodIdentityAgent),
      resolveConflicts: resolveConflicts,
    });

    // aws-ebs-csi-driver
    new CfnAddon(this, "cfnAddonEbsCsi", {
      addonName: supportedAddonEbsCsiDriver,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(supportedAddonEbsCsiDriver),
      resolveConflicts: resolveConflicts,
    });

    // amazon-cloudwatch-observability
    new CfnAddon(this, "cfnAddonAmazonCloudwatchObservability", {
      addonName: supportedAddonCloudWatchObservability,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(supportedAddonCloudWatchObservability),
      resolveConflicts: resolveConflicts,
    });

    // metrics-server
    new CfnAddon(this, "cfnAddonMetricsServer", {
      addonName: supportedAddonMetricsServer,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(supportedAddonMetricsServer),
      resolveConflicts: resolveConflicts,
    });
  }

  private getAddonVersion(addonName: string) {
    return (
      addonVersions?.get(addonName)?.get(clusterVersion) ??
      defaultAddonVersions?.get(addonName) ??
      undefined
    );
  }
}
