import { Construct } from "constructs";
import { aws_eks, aws_iam } from "aws-cdk-lib";
import { Cluster } from "@aws-cdk/aws-eks-v2-alpha";
import {
  addonVersions,
  clusterVersion,
  addonPodIdentityAgent,
} from "./settings";
import {
  addonConfigs,
  AddonConfig,
  PodIdentityConfig,
} from "./managed-addon-configs";

export class ManagedAddons extends Construct {
  private readonly cluster: Cluster;
  private readonly addons: Map<string, aws_eks.CfnAddon> = new Map();
  private readonly podIdentityRoles: Map<string, aws_iam.Role> = new Map();

  constructor(scope: Construct, id: string, cluster: Cluster) {
    super(scope, id);
    this.cluster = cluster;

    this.createAddons();
  }

  /**
   * Gets an addon resource by name for external reference
   */
  public getAddon(addonName: string): aws_eks.CfnAddon | undefined {
    return this.addons.get(addonName);
  }

  /**
   * Gets a Pod Identity role by service account name
   */
  public getPodIdentityRole(serviceAccount: string): aws_iam.Role | undefined {
    return this.podIdentityRoles.get(serviceAccount);
  }

  /**
   * Gets all addon resources
   */
  public getAllAddons(): Map<string, aws_eks.CfnAddon> {
    return new Map(this.addons);
  }

  /**
   * Creates all EKS managed addons
   */
  private createAddons(): void {
    // First, create the Pod Identity Agent addon (required for Pod Identity associations)
    const podIdentityAgentConfig = addonConfigs.find(
      (config) => config.name === addonPodIdentityAgent
    );
    if (podIdentityAgentConfig) {
      const podIdentityAgent = this.createAddon(podIdentityAgentConfig);
      this.addons.set(podIdentityAgentConfig.name, podIdentityAgent);
    }

    // Then create other addons with proper dependencies
    addonConfigs
      .filter((config) => config.name !== addonPodIdentityAgent)
      .forEach((config) => {
        const addon = this.createAddon(config);
        this.addons.set(config.name, addon);

        // Add dependency on Pod Identity Agent if this addon uses Pod Identity
        if (config.podIdentity) {
          const podIdentityAgent = this.addons.get(addonPodIdentityAgent);
          if (podIdentityAgent) {
            addon.addDependency(podIdentityAgent);
          }
        }
      });
  }

  /**
   * Creates a single EKS addon with the given configuration
   */
  private createAddon(config: AddonConfig): aws_eks.CfnAddon {
    // Create Pod Identity role if needed
    let podIdentityAssociations:
      | aws_eks.CfnAddon.PodIdentityAssociationProperty[]
      | undefined;

    if (config.podIdentity) {
      const role = this.createPodIdentityRole(
        `Role${config.id}PodIdentity`,
        config.podIdentity.managedPolicyName
      );

      // Store the role for external access
      this.podIdentityRoles.set(config.podIdentity.serviceAccount, role);

      // Create Pod Identity association
      podIdentityAssociations = [
        {
          roleArn: role.roleArn,
          serviceAccount: config.podIdentity.serviceAccount,
        },
      ];
    }

    const addonProps: aws_eks.CfnAddonProps = {
      clusterName: this.cluster.clusterName,
      addonName: config.name,
      addonVersion: this.getAddonVersion(config.name),
      ...(config.configurationValues && {
        configurationValues: JSON.stringify(config.configurationValues),
      }),
      ...(podIdentityAssociations && {
        podIdentityAssociations,
      }),
    };

    return new aws_eks.CfnAddon(this, config.id, addonProps);
  }

  /**
   * Creates an IAM role for Pod Identity with the required policies
   */
  private createPodIdentityRole(
    roleId: string,
    managedPolicyName: string
  ): aws_iam.Role {
    const role = new aws_iam.Role(this, roleId, {
      assumedBy: new aws_iam.ServicePrincipal("pods.eks.amazonaws.com"),
      managedPolicies: [
        aws_iam.ManagedPolicy.fromAwsManagedPolicyName(managedPolicyName),
      ],
    });

    // Workaround for missing `sts:TagSession` permission
    role.assumeRolePolicy?.addStatements(
      new aws_iam.PolicyStatement({
        actions: ["sts:AssumeRole", "sts:TagSession"],
        principals: [new aws_iam.ServicePrincipal("pods.eks.amazonaws.com")],
      })
    );

    return role;
  }

  /**
   * Gets the addon version from version mappings with improved error handling
   */
  private getAddonVersion(addonName: string): string | undefined {
    const addonMap = addonVersions?.get(addonName);
    if (!addonMap) {
      console.warn(
        `Warning: No version mappings found for addon: ${addonName}`
      );
      return undefined;
    }

    // Try exact object match first
    let version = addonMap.get(clusterVersion);

    // If no exact match, try version string comparison
    if (!version) {
      for (const [kubernetesVersion, addonVersion] of addonMap.entries()) {
        if (kubernetesVersion.version === clusterVersion.version) {
          version = addonVersion;
          break;
        }
      }
    }

    if (!version) {
      console.warn(
        `Warning: No version found for addon ${addonName} with Kubernetes version ${clusterVersion.version}`
      );
      console.warn(
        `Available versions for ${addonName}:`,
        Array.from(addonMap.keys()).map((k) => k.version)
      );
      return undefined;
    }

    return version;
  }
}
