import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';


export class SecurityHubNotificationsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'SecurityHubNotificationsTopic', {
      displayName: 'SecurityHubNotificationsTopic',
      topicName: 'SecurityHubNotificationsTopic',
      fifo: false,
    });

    topic.grantPublish(new iam.ServicePrincipal('events.amazonaws.com'));

    const subscription = new sns.Subscription(this, 'SecurityHubNotificationsSubscription', {
      endpoint: 'foo@example.com',
      protocol: sns.SubscriptionProtocol.EMAIL,
      topic: topic,
    });

    const rule = new events.Rule(this, 'SecurityHubNotificationsRule', {
      enabled: true,
      targets: [new targets.SnsTopic(topic)],
      eventPattern: {
        source: ["aws.securityhub"],
        detail: {
            "findings": {
              "Severity": {
                "Label": ["CRITICAL", "HIGH", "MEDIUM"]
              }
           }
        }
      }
    });
  }
}
