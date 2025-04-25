import { Construct } from "constructs";
import { Cluster, CfnAddon } from "aws-cdk-lib/aws-eks";
import {
  addonVersions,
  clusterVersion,
  defaultAddonVersions,
  resolveConflicts,
  addonKubeProxy,
  addonCoreDns,
  addonVpcCni,
  addonPodIdentityAgent,
  addonEbsCsiDriver,
  addonCloudWatchObservability,
  addonMetricsServer,
} from "./settings";

export class ManagedAddons extends Construct {
  constructor(scope: Construct, id: string, cluster: Cluster) {
    super(scope, id);

    // kube-proxy
    new CfnAddon(this, "cfnAddonKubeProxy", {
      addonName: addonKubeProxy,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(addonKubeProxy),
      resolveConflicts: resolveConflicts,
    });

    // coredns
    new CfnAddon(this, "cfnAddonCoreDns", {
      addonName: addonCoreDns,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(addonCoreDns),
      resolveConflicts: resolveConflicts,
    });

    // vpc-cni
    new CfnAddon(this, "cfnAddonVpcCni", {
      addonName: addonVpcCni,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(addonVpcCni),
      resolveConflicts: resolveConflicts,
    });

    // eks-pod-identity-agent (Only Amazon EKS 1.24+ are supported)
    new CfnAddon(this, "cfnAddonEksPodIdentityAgent", {
      addonName: addonPodIdentityAgent,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(addonPodIdentityAgent),
      resolveConflicts: resolveConflicts,
    });

    // aws-ebs-csi-driver
    new CfnAddon(this, "cfnAddonEbsCsi", {
      addonName: addonEbsCsiDriver,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(addonEbsCsiDriver),
      resolveConflicts: resolveConflicts,
    });

    // amazon-cloudwatch-observability
    new CfnAddon(this, "cfnAddonAmazonCloudwatchObservability", {
      addonName: addonCloudWatchObservability,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(addonCloudWatchObservability),
      resolveConflicts: resolveConflicts,
    });

    // metrics-server
    new CfnAddon(this, "cfnAddonMetricsServer", {
      addonName: addonMetricsServer,
      clusterName: cluster.clusterName,
      addonVersion: this.getAddonVersion(addonMetricsServer),
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
