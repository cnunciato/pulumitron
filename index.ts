import { app, BrowserWindow, dialog, shell } from "electron";
export { PreviewResult, UpResult, DestroyResult } from "@pulumi/pulumi/x/automation";
import * as pulumi from "@pulumi/pulumi";
import * as automation from "@pulumi/pulumi/x/automation";
import * as aws from "@pulumi/aws";
import * as glob from "glob";
import * as mime from "mime";
import * as fs from "fs";

app.on("ready", () => {
    const win = new BrowserWindow({
        width: 1440,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });

    win.loadFile("../index.html");

    win.webContents.on("new-window", (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
});

export async function getDocroot(): Promise<string[]> {
    const dir = await dialog.showOpenDialog({
        properties: [ "openDirectory" ],
    });

    if (!dir) {
        return [];
    }

    return dir.filePaths;
}

export type DeployResult = automation.PreviewResult | automation.UpResult | automation.DestroyResult;
export type DeployKind = "preview" | "update" | "destroy";

async function bucketWebsite(sourcePath: string, subdomain?: string) {

    // Make a website bucket.
    const bucket = new aws.s3.Bucket("bucket", {
        acl: aws.s3.PublicReadAcl,
        forceDestroy: true,
        website: {
            indexDocument: "index.html",
        },
    });

    // Make a bucket object for every file of the website.
    glob.sync(`${sourcePath}/**/*`).forEach((path: string) => {
        if (!fs.lstatSync(path).isDirectory()) {
            let object = new aws.s3.BucketObject(path.replace(sourcePath, ""), {
                bucket,
                source: new pulumi.asset.FileAsset(path),
                contentType: mime.getType(path) || undefined,
                acl: aws.s3.PublicReadAcl,
            });
        }
    });

    // Return the results.
    return {
        websiteEndpoint: bucket.websiteEndpoint,
    };
}

export async function deployBucketWebsite(projectName: string, stackName: string, sourcePath: string, subdomain: string, action: DeployKind, onOutput: (out: string) => void): Promise<DeployResult | undefined> {

    const stack = await automation.LocalWorkspace.createOrSelectStack({
        stackName,
        projectName,
        program: async () => await bucketWebsite(sourcePath, subdomain),
    });

    await stack.workspace.installPlugin("aws", "v3.6.1");
    await stack.setConfig("aws:region", { value: "us-west-2" });
    await stack.refresh({ onOutput });

    let result;

    switch (action) {
        case "preview":
            result = await stack.preview();
            break;
        case "update":
            result = await stack.up({ onOutput });
            break;
        case "destroy":
            result = await stack.destroy({ onOutput });
            break;
    }

    return result;
}
