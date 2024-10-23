from aws_cdk import Stack
from aws_cdk import aws_eks as eks
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_iam as iam

from aws_cdk.lambda_layer_kubectl_v31 import KubectlV31Layer

from constructs import Construct


class EksBasicStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        vpc = ec2.Vpc(
            self,
            "Vpc",
            ip_addresses=ec2.IpAddresses.cidr("192.168.0.0/16")
        )

        eks_version = eks.KubernetesVersion.V1_31
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
            vpc=vpc,
            vpc_subnets=[ec2.SubnetSelection(subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS)],
            cluster_name=eks_cluster_name,
            version=eks_version,
            kubectl_layer=KubectlV31Layer(self, "kubectl"),
            default_capacity=0,
            authentication_mode=eks.AuthenticationMode.API_AND_CONFIG_MAP,
            endpoint_access=eks.EndpointAccess.PUBLIC_AND_PRIVATE,
            cluster_logging=cluster_logging_setup,
        )

        cluster.add_nodegroup_capacity(
            "mng-al2023",
            instance_types=[
                ec2.InstanceType("m5.large")
            ],
            ami_type=eks.NodegroupAmiType.AL2023_X86_64_STANDARD,
            min_size=2,
            max_size=5,
            disk_size=30
        )

        # Depends on what you need, use eks.Addon() or eks.CfnAddon()
        # - https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_eks/Addon.html
        # - https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_eks/CfnAddon.html
        eks.Addon(self, "KubeProxy", cluster=cluster, addon_name="kube-proxy")
        eks.Addon(self, "VpcCni", cluster=cluster, addon_name="vpc-cni")
        eks.Addon(self, "CoreDns", cluster=cluster, addon_name="coredns")
        eks.Addon(self, "EksPodIdentityAgent", cluster=cluster, addon_name="eks-pod-identity-agent")

        # https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_eks/HelmChart.html
        eks.HelmChart(
            self,
            "MetricsServer",
            cluster=cluster,
            chart="metrics-server",
            repository="https://kubernetes-sigs.github.io/metrics-server",
            namespace="kube-system",
        )

        # https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_eks/README.html#access-entry
        # cluster.grant_access(
        #     "eksAdminViewRoleAccess",
        #     "arn:aws:iam::123456789012:role/Admin",
        #     [
        #         eks.AccessPolicy.from_access_policy_name(
        #             "AmazonEKSAdminViewPolicy",
        #             access_scope_type=eks.AccessScopeType.CLUSTER
        #         )
        #     ],
        # )
