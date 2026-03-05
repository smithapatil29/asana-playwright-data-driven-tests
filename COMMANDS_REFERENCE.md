# Commands Reference

PowerShell command reference for all requested run combinations.

## Local
### 0) All tests (Web + Mobile) for all browsers
```powershell
Remove-Item Env:TARGET_PROJECT -ErrorAction SilentlyContinue; npm run test:allure
```

### 1) Web Application for all browsers
```powershell
$env:TARGET_PROJECT="Web Application"; npm run test:allure
```

### 2) Web Application for Chrome
```powershell
$env:TARGET_PROJECT="Web Application"; npm run test:allure -- --project=chrome
```

### 3) Web Application for Firefox
```powershell
$env:TARGET_PROJECT="Web Application"; npm run test:allure -- --project=firefox
```

### 4) Web Application for WebKit
```powershell
$env:TARGET_PROJECT="Web Application"; npm run test:allure -- --project=webkit
```

### 5) Mobile Application for all browsers
```powershell
$env:TARGET_PROJECT="Mobile Application"; npm run test:allure
```

### 6) Mobile Application for Chrome
```powershell
$env:TARGET_PROJECT="Mobile Application"; npm run test:allure -- --project=chrome
```

### 7) Mobile Application for Firefox
```powershell
$env:TARGET_PROJECT="Mobile Application"; npm run test:allure -- --project=firefox
```

### 8) Mobile Application for WebKit
```powershell
$env:TARGET_PROJECT="Mobile Application"; npm run test:allure -- --project=webkit
```

## Docker

### 1) All tests (Web + Mobile) for all browsers
```powershell
docker compose build tests-all; docker compose run --rm tests-all
```

### 2) All tests for Chrome
```powershell
docker compose build tests-all; docker compose run --rm tests-all npm run test:allure:docker -- --project=chrome
```

### 3) All tests for Firefox
```powershell
docker compose build tests-all; docker compose run --rm tests-all npm run test:allure:docker -- --project=firefox
```

### 4) All tests for WebKit
```powershell
docker compose build tests-all; docker compose run --rm tests-all npm run test:allure:docker -- --project=webkit
```

### 5) Web Application for all browsers
```powershell
docker compose build tests-web; docker compose run --rm tests-web
```

### 6) Web Application for Chrome
```powershell
docker compose build tests-web; docker compose run --rm tests-web npm run test:allure:docker:web -- --project=chrome
```

### 7) Web Application for Firefox
```powershell
docker compose build tests-web; docker compose run --rm tests-web npm run test:allure:docker:web -- --project=firefox
```

### 8) Web Application for WebKit
```powershell
docker compose build tests-web; docker compose run --rm tests-web npm run test:allure:docker:web -- --project=webkit
```

### 9) Mobile Application for all browsers
```powershell
docker compose build tests-mobile; docker compose run --rm tests-mobile
```

### 10) Mobile Application for Chrome
```powershell
docker compose build tests-mobile; docker compose run --rm tests-mobile npm run test:allure:docker:mobile -- --project=chrome
```

### 11) Mobile Application for Firefox
```powershell
docker compose build tests-mobile; docker compose run --rm tests-mobile npm run test:allure:docker:mobile -- --project=firefox
```

### 12) Mobile Application for WebKit
```powershell
docker compose build tests-mobile; docker compose run --rm tests-mobile npm run test:allure:docker:mobile -- --project=webkit
```

## Report Commands

```powershell
npm run allure:generate;npm run allure:open

```
