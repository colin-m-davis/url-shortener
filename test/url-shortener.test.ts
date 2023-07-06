import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as UrlShortener from '../lib/url-shortener-stack';

describe('UrlShortenerStack', () => {
    test('synthesis', () => {
        const app = new cdk.App();
        const stack = new UrlShortener.UrlShortenerStack(app, 'MyTestStack');
        const template = Template.fromStack(stack);

        template.hasResourceProperties("AWS::Lambda::Function", {
            Handler: 'lambda.generate',
            Runtime: 'nodejs18.x',
        });

        template.hasResourceProperties("AWS::Lambda::Function", {
            Handler: 'lambda.go',
            Runtime: 'nodejs18.x',
        });
    });

    test('matches the snapshot', () => {
        const app = new cdk.App();
        const stack = new UrlShortener.UrlShortenerStack(app, 'MyTestStack');
        const template = Template.fromStack(stack);

        expect(template.toJSON()).toMatchSnapshot();
    });
});
