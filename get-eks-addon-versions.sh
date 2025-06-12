#!/usr/bin/env bash

ADDON_NAMES=(
  "kube-proxy"
  "coredns"
  "vpc-cni"
  "eks-pod-identity-agent"
  "aws-ebs-csi-driver"
  "amazon-cloudwatch-observability"
  "metrics-server"
)

EKS_VERSIONS=(
  "1.33"
  "1.32"
  "1.31"
  "1.30"
)

for ADDON_NAME in ${ADDON_NAMES[@]}; do
  echo "ADDON_NAME: ${ADDON_NAME}"
  for EKS_VERSION in ${EKS_VERSIONS[@]}; do
    aws eks describe-addon-versions --addon-name "${ADDON_NAME}" --kubernetes-version "${EKS_VERSION}" --query "addons[*].addonVersions[0].addonVersion" --output "text"
  done
  echo
done
