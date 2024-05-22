import { Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Cluster, HelmChart } from "aws-cdk-lib/aws-eks";

export class Charts extends Construct {
  constructor(scope: Construct, id: string, cluster: Cluster) {
    super(scope, id);

    // AWS Load Balancer Controller
    const awsLoadBalancerControllerChartVersion = "1.8.0";

    new HelmChart(this, "aws-load-balancer-controller", {
      cluster: cluster,
      chart: "aws-load-balancer-controller",
      repository: "https://aws.github.io/eks-charts",
      namespace: "kube-system",
      release: "aws-load-balancer-controller",
      version: awsLoadBalancerControllerChartVersion,
      values: {
        clusterName: cluster.clusterName,
        vpcId: cluster.vpc.vpcId,
        region: cluster.vpc.env.region,
      },
      timeout: Duration.minutes(5),
      wait: true,
    });

    // metrics-server
    new HelmChart(this, "metrics-server", {
      cluster: cluster,
      chart: "metrics-server",
      repository: "https://kubernetes-sigs.github.io/metrics-server",
      namespace: "kube-system",
      release: "metrics-server",
    });
  }
}
