# Asana Playwright Data-Driven Tests (TypeScript)

Playwright + TypeScript data-driven UI automation with Allure reporting.

## Commands for reference : Copy Paste
- combinations (Local + Docker, all browser/app permutations) 
- Check: [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md)

## Prerequisites
- Node.js 18+
- npm install
- npx playwirght install

## Security note: 
Note: `credentials.email` and `credentials.password` in the [data/project-run-config.json](data/project-run-config.json) are masked (`********`)- 
- Replace both with valid values before running tests.

## Quick Start
All commands run across 3 browser projects by default: `chrome`, `firefox`, and `webkit`.

Command references:
- Local command combinations: [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md) (Local section)
- Report generation/open commands: [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md) (Report commands section)

## Run with Docker
Command references:
- Docker build and run combinations: [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md) (Docker section)
- Web-only across all browsers: [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md) (Docker item 5)
- Mobile-only across all browsers: [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md) (Docker item 9)

Note: Docker services use Docker-safe scripts that clean report folder contents (not the mounted folders themselves).

## Run with GitHub Actions
Workflow file:
- [.github/workflows/data-driven-tests.yml](.github/workflows/data-driven-tests.yml)

### Required repository secrets
Add these in `Settings -> Secrets and variables -> Actions`:
- `ASANA_EMAIL`
- `ASANA_PASSWORD`

### Manual run
1. Open the repository `Actions` tab.
2. Open workflow `Data-Driven Playwright Tests`.
3. Click `Run workflow`.
4. Choose runtime inputs:
- `target_project`:
	- `Web Application and Mobile Application` (default)
	- `Web Application`
	- `Mobile Application`
- `browser`:
	- `all` (default)
	- `chrome`
	- `firefox`
	- `webkit`

Runtime behavior:
- If `target_project=Web Application and Mobile Application`, workflow sets `TARGET_PROJECT=all`.
- If `browser=all`, workflow runs all Playwright projects.
- If a browser is selected, workflow runs only that browser (`--project=<browser>`).

### Artifacts and report
Each run uploads `playwright-allure-artifacts` containing:
- `allure-results`
- `allure-report` (if generated in run)
- `playwright-report`
- `test-results`

To generate/open Allure locally from downloaded artifacts (Windows CMD):
```cmd
cd /d "C:\path\to\playwright-allure-artifacts"
npx allure-commandline generate allure-results --clean -o allure-report
npx allure-commandline open allure-report
```

## Config
Project and credential settings are in [data/project-run-config.json](data/project-run-config.json):
- `targetProjects`: controls configured project scope (`"all"` or `['webApplication', 'mobileApplication']`).
- `projectLabels`: display names used for project labels (`webApplication`, `mobileApplication`).
- Browser selection is standard Playwright via `projects` in `playwright.config.ts` and optional CLI `--project=<chrome|firefox|webkit>`.
- `baseURL`: application URL used by Playwright tests.
- `credentials.email` / `credentials.password`: login credentials.
- `targetProjectDefault`: default filter when `TARGET_PROJECT` is not set.

## Project Structure
- [playwright.config.ts](playwright.config.ts): Playwright configuration
- [data/testscenarios](data/testscenarios): category-specific scenario files
- [src/pages](src/pages): page objects (`LoginPage`, `BoardPage`)
- [tests/datadrivenTests.spec.ts](tests/datadrivenTests.spec.ts): dynamic test generation from JSON


## Scenario data files:
- [data/testscenarios/web-application.json](data/testscenarios/web-application.json)
- [data/testscenarios/mobile-application.json](data/testscenarios/mobile-application.json)

## Covered test cases
Current data set includes:
- Web Application: 3 positive scenarios
- Mobile Application: 3 positive scenarios


Each scenario validates expected task/column/tags.
