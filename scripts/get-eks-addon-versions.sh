#!/bin/bash

set -euo pipefail

# Default configuration
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
  "1.34"
  "1.33"
  "1.32"
  "1.31"
  "1.30"
)

# Check prerequisites
check_prerequisites() {
  if ! command -v aws &>/dev/null; then
    echo "Error: AWS CLI is not installed or not in PATH" >&2
    exit 1
  fi

  if ! command -v jq &>/dev/null; then
    echo "Error: jq is not installed or not in PATH" >&2
    exit 1
  fi

  if ! aws sts get-caller-identity &>/dev/null; then
    echo "Error: AWS CLI is not configured or credentials are invalid" >&2
    exit 1
  fi
}

# Get addon version for specific addon and k8s version
get_addon_version() {
  local addon_name="$1"
  local k8s_version="$2"

  local version
  version=$(aws eks describe-addon-versions \
    --addon-name "$addon_name" \
    --kubernetes-version "$k8s_version" \
    --output json 2>/dev/null |
    jq -r '.addons[0].addonVersions[0].addonVersion // "N/A"')

  jq -n --arg addon "$addon_name" --arg k8s "$k8s_version" --arg ver "$version" \
    '{addon: $addon, k8s_version: $k8s, version: $ver}'
}

# Main execution
main() {
  echo "Checking prerequisites..." >&2
  check_prerequisites

  echo "Fetching EKS addon versions..." >&2

  # Create temporary file to store JSON results
  local temp_results
  temp_results=$(mktemp)

  # Use parallel processing with background jobs
  local pids=()
  for addon in "${ADDON_NAMES[@]}"; do
    for k8s_version in "${EKS_VERSIONS[@]}"; do
      {
        get_addon_version "$addon" "$k8s_version" >>"$temp_results"
      } &
      pids+=($!)
    done
  done

  # Wait for all background jobs to complete
  for pid in "${pids[@]}"; do
    wait "$pid"
  done

  # Convert EKS_VERSIONS array to JSON for jq
  local versions_json
  versions_json=$(printf '%s\n' "${EKS_VERSIONS[@]}" | jq -R . | jq -s .)

  # Process results with jq to create final JSON structure with ordered versions
  jq -s --argjson versions "$versions_json" '
    group_by(.addon) |
    map({
      key: .[0].addon,
      value: (
        . as $addon_data |
        $versions |
        map(. as $version | {
          key: $version,
          value: ($addon_data[] | select(.k8s_version == $version) | .version)
        }) |
        from_entries
      )
    }) |
    from_entries
  ' "$temp_results"

  # Cleanup
  rm -f "$temp_results"
}

# Run main function
main "$@"
