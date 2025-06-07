pipeline {
  agent any

  tools {
    nodejs 'NodeJS_18'
  }

  environment {
    // Variables backend
    CI = 'true'
    PORT = '4000'
    DB_HOST = 'localhost'
    DB_USER = 'root'
    DB_PASSWORD = 'password'
    DB_NAME = 'conectados'
    JWT_SECRET = 'UnaClaveSegura'
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/Grupo-5-Conectados/Conectados.git'
      }
    }

    stage('Instalar dependencias backend') {
      steps {
        sh 'npm install'
        sh 'npx playwright install'
      }
    }

    stage('Instalar dependencias frontend') {
      steps {
        dir('frontend') {
          sh 'npm install'
        }
      }
    }

    stage('Levantar backend') {
      steps {
        sh 'nohup npm run start &'
        sleep 5
      }
    }

    stage('Levantar frontend') {
      environment {
        REACT_APP_API_URL = 'http://localhost:4000/api'
        REACT_APP_SOCKET_URL = 'http://localhost:4000'
      }
      steps {
        dir('frontend') {
          sh 'nohup npm start &'
        }
        sleep 10
      }
    }

    stage('Ejecutar pruebas E2E (Playwright)') {
      steps {
        sh 'npx playwright test --reporter=html'
      }
    }

    stage('Publicar reporte HTML de Playwright') {
      steps {
        publishHTML(target: [
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright Report',
          alwaysLinkToLastBuild: true,
          keepAll: true
        ])
      }
    }
  }

 post {
  always {
    archiveArtifacts artifacts: '**/playwright-report/**', allowEmptyArchive: true
    junit testResults: '**/test-results/**/*.xml', allowEmptyResults: true
        }
    }
}
