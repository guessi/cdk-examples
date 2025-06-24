#!/usr/bin/env bash

NPM=$(which npm)
NCU=$(which ncu)
PIP=$(which pip3)

$NPM install --global npm-check-updates

for folder in $(find typescript -type d -depth 1); do
    echo "[debug] entering folder $folder"
    pushd $folder
        $NCU --upgrade
        $NPM install
    popd
done

for folder in $(find python -type d -depth 1); do
    echo "[debug] entering folder $folder"
    pushd $folder
        $PIP install -r requirements.txt -U
        $PIP freeze | grep 'aws-cdk-lib' > requirements.txt

        if [ "${folder}" = "python/eks-basic" ]; then
          $PIP freeze | grep -E '(aws-cdk-lib|aws-cdk\.(aws-eks-v2-alpha|lambda-layer-kubectl))' > requirements.txt
        fi

        echo 'constructs>=10.0.0,<11.0.0' >> requirements.txt
    popd
done
