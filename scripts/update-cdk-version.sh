#!/usr/bin/env bash

NPM=$(which npm)
NCU=$(which ncu)
PIP=$(which pip3)

$NPM install --global npm-check-updates

for folder in $(find typescript -type d -depth 1); do
    echo "[debug] entering folder $folder"
    pushd $folder
        $NPM update
        $NCU --upgrade
        $NPM install
    popd
done

for folder in $(find python -type d -depth 1); do
    echo "[debug] entering folder $folder"
    pushd $folder
        # First upgrade CDK packages without version constraints
        $PIP install --upgrade aws-cdk-lib constructs

        # Handle special EKS packages for eks-basic
        if [ "${folder}" = "python/eks-basic" ]; then
            $PIP install --upgrade aws-cdk.aws-eks-v2-alpha aws-cdk.lambda-layer-kubectl-v34
        fi

        # Get current versions
        CDK_VERSION=$($PIP show aws-cdk-lib | grep "^Version:" | cut -d' ' -f2)

        # Update requirements.txt using sed
        sed -i.bak \
            -e "s/^aws-cdk-lib==.*/aws-cdk-lib==$CDK_VERSION/" \
            -e "s/^constructs[>=<~!].*/constructs>=10.0.0,<11.0.0/" \
            requirements.txt

        # Handle EKS-specific packages
        if [ "${folder}" = "python/eks-basic" ]; then
            EKS_VERSION=$($PIP show aws-cdk.aws-eks-v2-alpha | grep "^Version:" | cut -d' ' -f2)
            KUBECTL_VERSION=$($PIP show aws-cdk.lambda-layer-kubectl-v34 | grep "^Version:" | cut -d' ' -f2)

            sed -i.bak2 \
                -e "s/^aws-cdk\.aws-eks-v2-alpha==.*/aws-cdk.aws-eks-v2-alpha==$EKS_VERSION/" \
                -e "s/^aws-cdk\.lambda-layer-kubectl-v34==.*/aws-cdk.lambda-layer-kubectl-v34==$KUBECTL_VERSION/" \
                requirements.txt
            rm -f requirements.txt.bak2
        fi

        rm -f requirements.txt.bak
    popd
done
