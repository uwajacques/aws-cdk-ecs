#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcsStack } from '../lib/ecs-stack';

const app = new cdk.App();

new EcsStack(app, 'JacquesEcsStack', {
  stackName: 'JacquesEcsStack',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});