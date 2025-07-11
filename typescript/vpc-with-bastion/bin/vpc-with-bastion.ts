#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcWithBastion } from '../lib/vpc-with-bastion';

const app = new cdk.App();
new VpcWithBastion(app, 'VpcWithBastion', {
  /* NOTE:
     env is required if `maxAzs` is more than 2
     - ref: https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-ec2.Vpc.html#maxazs
  */
  // env: {
  //   account: '1234567890',
  //   region: 'us-east-1',
  // },
});
