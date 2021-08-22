import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsAssets from '@aws-cdk/aws-ecr-assets';
import * as path from 'path';
import { Vpc } from '@aws-cdk/aws-ec2';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';

interface EcsStackProps extends cdk.StackProps {}

export class EcsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: EcsStackProps) {
        super(scope, id, props);

        const vpc = new Vpc(this, 'VPC');

        const cluster = new ecs.Cluster(this, 'cluster', {
            clusterName: 'jacques-ecs-cluster',
            vpc
        })
        new ApplicationLoadBalancedFargateService(this, 'jacques-ecs-service', {
            cluster,
            serviceName: 'jacques-ecs-service',
            loadBalancerName: 'jacques-ecs-service-alb',
            taskImageOptions: {
                family: 'jacques-ecs-service-task-def',
                image: ecs.ContainerImage.fromDockerImageAsset(
                    new ecsAssets.DockerImageAsset(this, 'docker-image', {
                        directory: path.join(__dirname, '..', '..')
                    }
                    )
                ),
            }
        })
    }
}
