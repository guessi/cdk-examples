#!/usr/bin/env bash

NPM=$(which npm)
NCU=$(which ncu)
PIP=$(which pip3)

LATEST_CDK_VERSION=$(${NPM} view aws-cdk --json | jq -r .version)
echo "[debug] Latest CDK Version: ${LATEST_CDK_VERSION}"

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
        cat requirements.txt | sed 's/^aws-cdk-lib==.*/aws-cdk-lib=='${LATEST_CDK_VERSION}'/g' | tee requirements.txt
        $PIP install -r requirements.txt -U
    popd
done
