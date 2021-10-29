#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { VpcWithBastion } from '../lib/vpc-with-bastion';

const app = new cdk.App();
new VpcWithBastion(app, 'VpcWithBastion');
