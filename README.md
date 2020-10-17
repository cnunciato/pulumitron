# pulumitron 👾

It's [Pulumi](https://pulumi.com/) ... in [Electron](https://www.electronjs.org/)!

A hackday project to experiment with Pulumi's automation API, which lets you embed Pulumi in an application and run it programmatically. In this example, I'm using the Node.js API (now distributed with [@pulumi/pulumi](https://www.npmjs.com/package/@pulumi/pulumi)) to deploy and manage static websites on AWS with [Electron](https://www.electronjs.org/), a popular framework for developing cross-platform desktop applications.

<img width="400" alt="image" src="https://user-images.githubusercontent.com/274700/96325203-d7a2f400-0fda-11eb-90bc-a018fe142b32.png">

## Prerequisites

* [Install Pulumi](https://www.pulumi.com/docs/get-started/install/).
* Run `pulumi login`.
* [Configure your AWS credentials](https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/).
* [Have a static website](https://jamstack.org/generators/) somewhere on your computer.

## Run it

```
npm install     # to install this project's dependencies.
npm start       # to run the Electron app.
```

Give yourself a [project name](https://www.pulumi.com/docs/intro/concepts/project/), [stack name](https://www.pulumi.com/docs/intro/concepts/stack/), browse to the folder containing your website. Click Preview to see what Pulumi will deploy, then Update to deploy it. Click Destroy to tear everything down, then Remove to delete the stack as well. Pulumitron deploys your website as an [AWS S3 bucket](https://aws.amazon.com/s3/).)

[Many more examples of using the automation API here](https://github.com/pulumi/automation-api-examples).

Enjoy! 🍻
