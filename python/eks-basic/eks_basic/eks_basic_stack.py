from aws_cdk import Stack
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_eks_v2_alpha as eks
from aws_cdk.lambda_layer_kubectl_v34 import KubectlV34Layer as KubectlLayer

from constructs import Construct


class EksBasicStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        eks_version = eks.KubernetesVersion.of("1.34")
        eks_cluster_name = "EksBasicStack"

        cluster_logging_setup = [
            eks.ClusterLoggingTypes.API,
            eks.ClusterLoggingTypes.AUDIT,
            eks.ClusterLoggingTypes.AUTHENTICATOR,
            eks.ClusterLoggingTypes.CONTROLLER_MANAGER,
            eks.ClusterLoggingTypes.SCHEDULER,
        ]

        # https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_eks/Cluster.html
        cluster = eks.Cluster(
            self,
            "EksBasicCluster",
            cluster_name=eks_cluster_name,
            version=eks_version,
            vpc_subnets=[ec2.SubnetSelection(subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS)],
            kubectl_provider_options=eks.KubectlProviderOptions(
                kubectl_layer=KubectlLayer(self, "kubectl"),
            ),
            endpoint_access=eks.EndpointAccess.PUBLIC_AND_PRIVATE,
            cluster_logging=cluster_logging_setup,
            default_capacity_type=eks.DefaultCapacityType.NODEGROUP,
            default_capacity=0,
        )

        cluster.add_nodegroup_capacity(
            "mng-al2023",
            instance_types=[
                ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.SMALL),
                ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
            ],
            ami_type=eks.NodegroupAmiType.AL2023_X86_64_STANDARD,
            min_size=2,
            max_size=5,
            disk_size=30
        )

        # https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_eks_v2_alpha/Addon.html
        eks.Addon(self, "KubeProxy", cluster=cluster, addon_name="kube-proxy")
        eks.Addon(self, "VpcCni", cluster=cluster, addon_name="vpc-cni")
        eks.Addon(self, "CoreDns", cluster=cluster, addon_name="coredns")
        eks.Addon(self, "EksPodIdentityAgent", cluster=cluster, addon_name="eks-pod-identity-agent")
        eks.Addon(self, "MetricsServer", cluster=cluster, addon_name="metrics-server")