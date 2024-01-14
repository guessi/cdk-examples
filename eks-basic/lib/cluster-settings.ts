import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";

export const clusterName = "cdk-eks-cluster";
export const eksVersion = eks.KubernetesVersion.V1_28;
export const endpointAccess = eks.EndpointAccess.PUBLIC_AND_PRIVATE;
export const subnetType = ec2.SubnetType.PRIVATE_WITH_EGRESS;
export const ipFamily = eks.IpFamily.IP_V4;
export const serviceIpv4Cidr = "172.20.0.0/16";
export const defaultCapacity = 0;
export const clusterLogging = [
  eks.ClusterLoggingTypes.API,
  eks.ClusterLoggingTypes.AUTHENTICATOR,
  eks.ClusterLoggingTypes.SCHEDULER,
  eks.ClusterLoggingTypes.AUDIT,
  eks.ClusterLoggingTypes.CONTROLLER_MANAGER,
];
export const clusterTags = {
  "managed-by": "cdk",
};
