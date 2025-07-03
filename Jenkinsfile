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
    DB_PASSWORD = '03Valepin08'
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
        dir('conectados-backend') {
          sh 'npm install'
        }
      }
    }

    stage('Instalar dependencias frontend') {
      steps {
        dir('conectados-frontend') {
          sh 'npm install'
        }
      }
    }

    stage('Instalar dependencias de tests') {
      steps {
        dir('tests') {
          sh 'npm install'
        }
      }
    }

    stage('Verificar herramientas') {
      steps {
        sh 'node -v'
        sh 'npm -v'
        sh 'which wait-on || true'
        sh 'wait-on --version || true'
      }
    }

    stage('Levantar backend') {
      steps {
        dir('conectados-backend') {
          sh 'nohup npm start &'
        }
        sh 'npx wait-on http://localhost:4000/api/health'
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
        sh 'npx wait-on http://localhost:3000'
      }
    }

    stage('Ejecutar pruebas automatizadas') {
      steps {
        dir('tests') {
          sh 'node run-all-tests.js'
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: '**/tests/screenshots/**, **/tests/reports/**', allowEmptyArchive: true
    }
    failure {
      echo 'La ejecución falló. Revisa los logs y capturas.'
    }
    success {
      echo 'Pruebas completadas correctamente.'
    }
  }
}
