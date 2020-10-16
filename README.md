# pulumitron 👾

It's [Pulumi](https://pulumi.com/) ... in [Electron](https://www.electronjs.org/)!

A hackday project to experiment with Pulumi's automation API, which lets you run Pulumi programmatically in the language of your choice. Here, I'm using the TypeScript API to deploy and manage a static website on AWS with Pulumi and Electron.

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

Give yourself a [project name](https://www.pulumi.com/docs/intro/concepts/project/), [stack name](https://www.pulumi.com/docs/intro/concepts/stack/), browse to your site root, and go. (The app deploys your site as an AWS S3 bucket.)

[Many more automation API examples here](https://github.com/pulumi/automation-api-examples).

Enjoy!
