const fs = require("fs");
const path = require("path");

const TEMPLATE_DIR = path.resolve(__dirname, "../../Template");

function printUsage() {
  console.log("Usage: node sync-claude-settings.js <target-project-path>");
}

function loadFile(filePath) {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  }
  return null;
}

function syncClaudeMd(targetDir) {
  const templatePath = path.join(TEMPLATE_DIR, "CLAUDE.md");
  const targetPath = path.join(targetDir, "CLAUDE.md");

  console.log(`Checking CLAUDE.md...`);

  const templateContent = loadFile(templatePath);
  if (!templateContent) {
    console.error("Error: Template CLAUDE.md not found at " + templatePath);
    return;
  }

  const targetContent = loadFile(targetPath);

  if (!targetContent) {
    console.log("Creating CLAUDE.md from template...");
    fs.writeFileSync(targetPath, templateContent);
    return;
  }

  console.log("CLAUDE.md exists. checking for missing sections...");

  const sectionsToCheck = [
    "## 🚀 開発コマンド",
    "## 🎯 コーディング姿勢",
    "## ⚡ 禁止事項",
  ];

  let appended = false;
  let newContent = targetContent;

  for (const section of sectionsToCheck) {
    if (!targetContent.includes(section)) {
      console.log(`Adding missing section: ${section}`);
      // Find content in template for this section
      // Regex needed to handle template content structure
      const regex = new RegExp(
        `${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?(?=^## |$)`,
        "m"
      );
      const match = templateContent.match(regex);
      if (match) {
        newContent += `\n\n${match[0]}`;
        appended = true;
      }
    }
  }

  if (appended) {
    fs.writeFileSync(targetPath, newContent);
    console.log("Updated CLAUDE.md with missing sections.");
  } else {
    console.log("CLAUDE.md seems up to date (or custom). No changes made.");
  }
}

function syncMcpJson(targetDir) {
  const templatePath = path.join(TEMPLATE_DIR, ".mcp.json");
  const targetPath = path.join(targetDir, ".mcp.json");

  console.log(`Checking .mcp.json...`);

  const templateContent = loadFile(templatePath);
  if (!templateContent) {
    // Template might not have it, that's fine
    return;
  }

  const targetContent = loadFile(targetPath);
  let targetJson = targetContent ? JSON.parse(targetContent) : {};
  let templateJson;
  try {
    templateJson = JSON.parse(templateContent);
  } catch (e) {
    console.error("Error parsing template .mcp.json");
    return;
  }

  let updated = false;

  const rootKeys = Object.keys(templateJson);
  for (const key of rootKeys) {
    if (typeof templateJson[key] === "object" && templateJson[key] !== null) {
      if (!targetJson[key]) {
        targetJson[key] = {};
        updated = true;
      }

      Object.keys(templateJson[key]).forEach((serverName) => {
        if (!targetJson[key][serverName]) {
          console.log(`Adding MCP server config: ${serverName}`);
          targetJson[key][serverName] = templateJson[key][serverName];
          updated = true;
        }
      });
    }
  }

  if (updated) {
    fs.writeFileSync(targetPath, JSON.stringify(targetJson, null, 2));
    console.log("Updated .mcp.json.");
  } else {
    console.log(".mcp.json is up to date.");
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    printUsage();
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), args[0]);
  if (!fs.existsSync(targetDir)) {
    console.error(`Target directory does not exist: ${targetDir}`);
    process.exit(1);
  }

  console.log(`Syncing Claude settings to: ${targetDir}`);

  try {
    syncClaudeMd(targetDir);
    syncMcpJson(targetDir);
    console.log("Done.");
  } catch (error) {
    console.error("Error during sync:", error);
  }
}

main();
