# pulumitron 👾

It's [Pulumi](https://pulumi.com/) ... in [Electron](https://www.electronjs.org/)!

## What is this?
It's a hackday project to experiment with the Pulumi Automation API, which lets you embed Pulumi into a program and run it programmatically. Here, I'm using the TypeScript API to deploy and manage a static website on AWS with Pulumi and Electron.

## How to use it

* [Install Pulumi](https://www.pulumi.com/docs/get-started/install/).
* Run `pulumi login`.
* [Configure your AWS credentials](https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/).
* [Have a static website](https://jamstack.org/generators/) somewhere on your computer.

```
npm install     # to install this project's dependencies.
npm start       # to run the Electron app.
```

[Lots more Automation API examples here](https://github.com/pulumi/automation-api-examples).

Enjoy!
