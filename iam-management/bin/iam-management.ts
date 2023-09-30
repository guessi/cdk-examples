#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IamManagementStack } from "../lib/iam-management-stack";

const app = new cdk.App();
new IamManagementStack(app, 'IamManagementStack');