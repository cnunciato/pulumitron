import { remote } from "electron";
import { PreviewResult, UpResult, DestroyResult, OpMap } from "@pulumi/pulumi/x/automation";
import { DeployKind, DeployResult } from "./index";
import { output } from "@pulumi/pulumi";

const { getDocroot, deployBucketWebsite } = remote.require("./index.js");

const projectNameField = document.querySelector("#project-name") as HTMLInputElement;
const stackNameField = document.querySelector("#stack-name") as HTMLInputElement;
const sourcePathField = document.querySelector("#source-path") as HTMLInputElement;
const browseButton = document.querySelector("#browse-button") as HTMLButtonElement;
const previewButton = document.querySelector("#preview-button") as HTMLButtonElement;
const updateButton = document.querySelector("#update-button") as HTMLButtonElement;
const destroyButton = document.querySelector("#destroy-button") as HTMLButtonElement;
const removeButton = document.querySelector("#remove-button") as HTMLButtonElement;
const outputField = document.querySelector("#output-field") as HTMLDivElement;
const outputSpinner = document.querySelector("#output-running") as HTMLLIElement;
const resultSpan = document.querySelector("#result-span") as HTMLSpanElement;
const resultSuccess = document.querySelector("#result-success") as HTMLLIElement;
const resultFailure = document.querySelector("#result-failure") as HTMLLIElement;

let projectName: string;
let stackName: string;
let sourcePath: string;

if (browseButton && previewButton && updateButton && destroyButton) {

    browseButton.addEventListener("click", async (event) => {
        const paths = await getDocroot();
        sourcePath = paths[0];
        sourcePathField.value = sourcePath || "";
    });

    previewButton.addEventListener("click", async () => {
        const deployResult = await deploy("preview");

        if (deployResult) {
            const result = deployResult.result as PreviewResult;
            setResult(deployResult, `<span>${stringifyChanges(result.summary.resourceChanges)}</span>`);
        }
    });

    updateButton.addEventListener("click", async () => {
        const deployResult = await deploy("update");

        if (deployResult) {
            const result = deployResult.result as UpResult;
            const url = result.outputs.websiteEndpoint.value;
            setResult(deployResult, `Deployed! <a class="text-purple-700" href="${url}" target="_new">${url}</a>`);
        }
    });

    destroyButton.addEventListener("click", async () => {
        const deployResult = await deploy("destroy");

        if (deployResult) {
            const result = deployResult.result as DestroyResult;
            const deleted = result.summary.resourceChanges?.delete || 0;
            setResult(deployResult, `<span>${stringifyChanges(result.summary.resourceChanges)}</span>`);
        }
    });

    removeButton.addEventListener("click", async () => {
        const deployResult = await deploy("remove");

        if (deployResult) {
            setResult(deployResult, `<span>Stack removed.</span>`);
        }
    });
}

async function deploy(action: DeployKind): Promise<DeployResult | undefined> {
    projectName = projectNameField.value;
    stackName = stackNameField.value;
    stackName = stackNameField.value;
    sourcePath = sourcePathField.value;

    if (!projectName || !stackName || !sourcePath) {
        alert("Required value missing.");
        return;
    }

    setRunning(true);
    setResultSpan("");
    setOutput("");

    const deployResult: DeployResult = await deployBucketWebsite(projectName, stackName, sourcePath, action, (out: string) => {
        setOutput(out, true);
    });

    setRunning(false);

    if (typeof deployResult === "undefined") {
        setOutput("");
    } else if (deployResult.result instanceof Error) {
        setOutput(deployResult.result.message);
    } else if (deployResult.result) {
        setOutput(deployResult.result.stderr || deployResult.result.stdout);
    }

    return deployResult;
}

function setRunning(running: boolean) {
    outputSpinner.classList.toggle("hidden", !running);
    resultSuccess.classList.toggle("hidden", running);
    resultFailure.classList.toggle("hidden", running);

    [previewButton, updateButton, destroyButton, removeButton]
        .forEach(button => button.toggleAttribute("disabled", running));
}

function setOutput(content: string, append?: boolean) {
    outputField.textContent = append ? outputField.textContent + content : content;
    outputField.scrollTop = outputField.scrollHeight;
}

function setResult(result: DeployResult, innerHTML: string) {
    resultSuccess.classList.toggle("hidden", result.error !== undefined);
    resultFailure.classList.toggle("hidden", result.error === undefined);
    setResultSpan(innerHTML);
}

function setResultSpan(innerHTML: string) {
    resultSpan.innerHTML = innerHTML;
}

function stringifyChanges(map: OpMap | undefined): string {
    return `Summary: ${map ? Object.entries(map).map(([k, v]) => `${k}: ${v}`).join(", ") : ""}`;
}
