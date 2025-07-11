import { Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Cluster, HelmChart } from "aws-cdk-lib/aws-eks-v2";
import * as settings from "./settings";

export class Charts extends Construct {
  constructor(scope: Construct, id: string, cluster: Cluster) {
    super(scope, id);

    // AWS Load Balancer Controller
    new HelmChart(this, "aws-load-balancer-controller", {
      cluster: cluster,
      chart: "aws-load-balancer-controller",
      repository: "https://aws.github.io/eks-charts",
      namespace: "kube-system",
      release: "aws-load-balancer-controller",
      version: settings.chartVersionAwsLBC,
      values: {
        clusterName: cluster.clusterName,
        vpcId: cluster.vpc.vpcId,
        region: cluster.vpc.env.region,
      },
      timeout: Duration.minutes(5),
      wait: true,
    });
  }
}
