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
        git branch: 'main', url: 'https://github.com/Grupo-5-Conectados/Conectados.git'
      }
    }

    stage('Instalar dependencias backend') {
      steps {
        sh 'npm install'
      }
    }

    stage('Instalar dependencias frontend') {
      steps {
        dir('conectados-frontend') {
          sh 'npm install'
        }
      }
    }

    stage('Instalar dependencias de Selenium') {
      steps {
        sh 'npm install selenium-webdriver chromedriver'
      }
    }

    stage('Levantar backend') {
      steps {
        sh 'nohup npm run start &'
        sleep time: 5, unit: 'SECONDS'
      }
    }

    stage('Levantar frontend') {
      environment {
        REACT_APP_API_URL = 'http://localhost:4000/api'
        REACT_APP_SOCKET_URL = 'http://localhost:4000'
      }
      steps {
        dir('conectados-frontend') {
          sh 'nohup npm start &'
        }
        sleep time: 10, unit: 'SECONDS'
      }
    }

    stage('Ejecutar pruebas E2E (Selenium)') {
      steps {
        sh 'node tests/login.test.js'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: '**/tests/*.js', allowEmptyArchive: true
    }
  }
}
