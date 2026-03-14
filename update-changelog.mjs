import { readFileSync, writeFileSync } from "fs";

const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const changelogPath = "CHANGELOG.md";
const changelog = readFileSync(changelogPath, "utf8");

const header = `# ${version}\n### Updates\n- Security dependency updates (Dependabot).\n\n\n`;

if (!changelog.startsWith(`# ${version}\n`)) {
	writeFileSync(changelogPath, header + changelog);
}
