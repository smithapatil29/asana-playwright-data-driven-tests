const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

function getCliProject(args) {
  const projectEq = args.find((arg) => arg.startsWith('--project='));
  if (projectEq) {
    return projectEq.split('=')[1]?.trim() || 'all';
  }

  const projectIndex = args.findIndex((arg) => arg === '--project');
  if (projectIndex >= 0 && args[projectIndex + 1]) {
    return String(args[projectIndex + 1]).trim();
  }

  return 'all';
}

function getRunMode() {
  if (process.env.RUN_MODE) {
    return process.env.RUN_MODE;
  }

  if (fs.existsSync('/.dockerenv')) {
    return 'docker';
  }

  return 'local';
}

function getBaseUrl() {
  try {
    const configPath = path.resolve(__dirname, '..', 'data', 'project-run-config.json');
    const raw = fs.readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.baseURL || 'n/a';
  } catch {
    return 'n/a';
  }
}

function writeAllureEnvironment(args) {
  const resultsDir = path.resolve(__dirname, '..', 'allure-results');
  fs.mkdirSync(resultsDir, { recursive: true });

  const targetProject = process.env.TARGET_PROJECT || 'all';
  const browserProject = getCliProject(args);
  const runMode = getRunMode();
  const lines = [
    `TARGET_PROJECT=${targetProject}`,
    `browser=${browserProject}`,
    `baseURL=${getBaseUrl()}`,
    `runMode=${runMode}`,
    `os=${os.platform()} ${os.release()}`,
    `node=${process.version}`,
    `ci=${process.env.CI ? 'true' : 'false'}`
  ];

  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), `${lines.join('\n')}\n`, 'utf8');
}

function run() {
  const args = process.argv.slice(2);
  writeAllureEnvironment(args);

  const playwrightCli = require.resolve('@playwright/test/cli');
  const result = spawnSync(process.execPath, [playwrightCli, 'test', ...args], {
    stdio: 'inherit',
    shell: false,
    env: process.env
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

run();