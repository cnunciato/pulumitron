import { remote } from "electron";
import { DeployKind, DeployResult, UpResult } from "./index";

const { getDocroot, deployBucketWebsite } = remote.require("./index.js");

const projectNameField = document.querySelector("#project-name") as HTMLInputElement;
const stackNameField = document.querySelector("#stack-name") as HTMLInputElement;
const sourcePathField = document.querySelector("#source-path") as HTMLInputElement;
const browseButton = document.querySelector("#browse-button") as HTMLButtonElement;
const previewButton = document.querySelector("#preview-button") as HTMLButtonElement;
const updateButton = document.querySelector("#update-button") as HTMLButtonElement;
const destroyButton = document.querySelector("#destroy-button") as HTMLButtonElement;
const outputField = document.querySelector("#output-field") as HTMLDivElement;
const resultField = document.querySelector("#result-field") as HTMLDivElement;
const resultLink = document.querySelector("#result-link") as HTMLAnchorElement;

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
        const result = await deploy("preview");

        if (result) {
            const out = result.stderr || result.stdout;
            const summary = result.summary;

            resultField.classList.toggle("hidden", false);
            resultLink.textContent = `✅ Done.`;
            outputField.textContent = out;
        }
    });

    updateButton.addEventListener("click", async () => {
        const result = await deploy("update") as UpResult;

        if (result) {
            const out = result.stderr || result.stdout;
            const summary = result.summary;
            const outputs = result.outputs;
            const url = `http://${outputs.websiteEndpoint.value}`

            resultLink.setAttribute("href", url);
            resultLink.textContent = `✅ Done: ${url}`;
            resultField.classList.toggle("hidden", false);
            outputField.textContent = out;
        }
    });

    destroyButton.addEventListener("click", async () => {
        const result = await deploy("destroy");

        if (result) {
            const out = result.stderr || result.stdout;
            const summary = result.summary;

            resultLink.textContent = "";
            resultField.classList.toggle("hidden", false);
            resultLink.textContent = `✅ Done.`;
            outputField.textContent = out;
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

    resultLink.textContent = "";
    resultField.classList.toggle("hidden", true);
    outputField.classList.toggle("hidden", false);
    outputField.scrollTop = 0;
    outputField.textContent = "Running...\n";

    return await deployBucketWebsite(projectName, stackName, sourcePath, action, (out: string) => {
        outputField.textContent += out;
        outputField.scrollTop = outputField.scrollHeight;
    });
}
