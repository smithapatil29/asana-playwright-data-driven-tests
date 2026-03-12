pipeline {
  agent { label 'windows' }

  options {
    timestamps()
    ansiColor('xterm')
  }

  environment {
    CI = 'true'
    TARGET_PROJECT = 'Web Application'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'npm ci'
        bat 'npx playwright install chrome'
      }
    }

    stage('Inject Test Credentials') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'asana-login',
            usernameVariable: 'ASANA_EMAIL',
            passwordVariable: 'ASANA_PASSWORD'
          )
        ]) {
          // Keep credentials out of source control and inject at runtime.
          bat 'node -e "const fs=require(\"fs\"); const p=\"data/project-run-config.json\"; const cfg=JSON.parse(fs.readFileSync(p,\"utf8\")); cfg.credentials=cfg.credentials||{}; cfg.credentials.email=process.env.ASANA_EMAIL; cfg.credentials.password=process.env.ASANA_PASSWORD; fs.writeFileSync(p, JSON.stringify(cfg, null, 2));"'
        }
      }
    }

    stage('Run Playwright') {
      steps {
        // Required run: TARGET_PROJECT=Web Application and Chrome project only.
        bat 'npm run test:allure -- --project=chrome'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'allure-results/**,allure-report/**,playwright-report/**,test-results/**', allowEmptyArchive: true

      // Publish Allure when plugin is present; do not fail build if unavailable.
      script {
        try {
          allure([
            includeProperties: false,
            jdk: '',
            reportBuildPolicy: 'ALWAYS',
            results: [[path: 'allure-results']]
          ])
        } catch (err) {
          echo "Allure publish skipped: ${err.message}"
        }
      }
    }
  }
}
