pipeline {
  agent any

  tools {
    nodejs 'NodeJS_18' // Asegúrate de que esté definido en Jenkins (Manage Jenkins > Tools)
  }

  environment {
    CI = 'true'
    PORT=4000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=conectados
    JWT_SECRET=UnaClaveSegura
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/Grupo-5-Conectados/Conectados.git'
      }
    }

    stage('Instalar dependencias') {
      steps {
        sh 'npm install'
        sh 'npm run install:browsers'
      }
    }

    stage('Iniciar backend') {
      steps {
        dir('backend') {
          sh 'nohup npm start &'
        }
      }
    }

    stage('Iniciar frontend') {
      steps {
        dir('frontend') {
          sh 'nohup npm start &'
        }
      }
    }

    stage('Esperar servidores') {
      steps {
        sh 'sleep 10'
      }
    }

    stage('Ejecutar pruebas E2E (Playwright)') {
      steps {
        sh 'npm run test:e2e'
      }
    }

    stage('Publicar resultados Playwright') {
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
      junit '**/test-results/**/*.xml'
    }
  }
}
