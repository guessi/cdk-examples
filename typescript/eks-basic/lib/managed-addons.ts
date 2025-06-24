import { Construct } from "constructs";
import { Cluster, Addon } from "@aws-cdk/aws-eks-v2-alpha";
import {
  addonVersions,
  clusterVersion,
  defaultAddonVersions,
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
    new Addon(this, "KubeProxy", {
      cluster,
      addonName: addonKubeProxy,
      addonVersion: this.getAddonVersion(addonKubeProxy),
    });

    // coredns
    new Addon(this, "CoreDns", {
      cluster,

      addonName: addonCoreDns,
      addonVersion: this.getAddonVersion(addonCoreDns),
    });

    // vpc-cni
    new Addon(this, "VpcCni", {
      cluster,
      addonName: addonVpcCni,
      addonVersion: this.getAddonVersion(addonVpcCni),
    });

    // eks-pod-identity-agent (Only Amazon EKS 1.24+ are supported)
    new Addon(this, "EksPodIdentityAgent", {
      cluster,
      addonName: addonPodIdentityAgent,
      addonVersion: this.getAddonVersion(addonPodIdentityAgent),
    });

    // aws-ebs-csi-driver
    new Addon(this, "EbsCsiDriver", {
      cluster,
      addonName: addonEbsCsiDriver,
      addonVersion: this.getAddonVersion(addonEbsCsiDriver),
    });

    // amazon-cloudwatch-observability
    new Addon(this, "AmazonCloudwatchObservability", {
      cluster,
      addonName: addonCloudWatchObservability,
      addonVersion: this.getAddonVersion(addonCloudWatchObservability),
    });

    // metrics-server
    new Addon(this, "MetricsServer", {
      cluster,
      addonName: addonMetricsServer,
      addonVersion: this.getAddonVersion(addonMetricsServer),
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
