# Asana Playwright Data-Driven Tests (TypeScript)

Playwright + TypeScript data-driven UI automation with Allure reporting.

## Commands : copy/paste command combinations (Local + Docker, all browser/app permutations) 
- Check: [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md)

## Prerequisites
- Node.js 18+
- npm install
- npx playwirght install

## Security note: 
Note: `credentials.email` and `credentials.password` in the project-run-config.json are masked (`********`)- 
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

## Config
Project and credential settings are in [data/project-run-config.json](data/project-run-config.json):
- `execution.all`: when `true`, runs both Web and Mobile projects.
- `execution.webApplication`: enable/disable Web project when `execution.all` is `false`.
- `execution.mobileApplication`: enable/disable Mobile project when `execution.all` is `false`.
- `browsers.all`: when `true`, runs all browser projects (`chrome`, `firefox`, `webkit`).
- `browsers.chrome` / `browsers.firefox` / `browsers.webkit`: enable specific browsers when `browsers.all` is `false`.
- `baseURL`: application URL used by Playwright tests.
- `credentials.email` / `credentials.password`: login credentials.
- `targetProjectDefault`: default filter when `TARGET_PROJECT` is not set.

## Project Structure
- [playwright.config.ts](playwright.config.ts): Playwright configuration
- [data/testscenarios](data/testscenarios): category-specific scenario files
- [src/pages](src/pages): page objects (`LoginPage`, `BoardPage`)
- [tests/datadrivenTests.spec.ts](tests/datadrivenTests.spec.ts): dynamic test generation from JSON


Scenario data files:
- [data/testscenarios/web-application.json](data/testscenarios/web-application.json)
- [data/testscenarios/mobile-application.json](data/testscenarios/mobile-application.json)

## Covered test cases
Current data set includes:
- Web Application: 3 positive + 5 negative scenarios
- Mobile Application: 3 positive + 5 negative scenarios


Each scenario can be:
- Positive (default): validates expected task/column/tags.
- Negative: set `expectedResult: "negative"` and one `negativeCheck`:
	- `taskNotFound`
	- `taskNotInColumn`
	- `missingTags`
	- `projectNotFound`
