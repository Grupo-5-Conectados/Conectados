pipeline {
  agent any

  tools {
    nodejs 'NodeJS_20'
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
          bat 'npm install'
        }
      }
    }

    stage('Instalar dependencias frontend') {
      steps {
        dir('conectados-frontend') {
          bat 'npm install'
        }
      }
    }

    stage('Instalar dependencias de tests') {
      steps {
        dir('tests') {
          bat 'npm install'
        }
      }
    }

    stage('Verificar herramientas') {
      steps {
        bat 'node -v'
        bat 'npm -v'
        bat 'where wait-on || exit 0'
        bat 'npx wait-on --version || exit 0'
      }
    }

    stage('Levantar backend') {
      steps {
        dir('conectados-backend') {
          // Levantar backend en segundo plano (con start /b en Windows)
          bat 'start /b cmd /c "npm start > backend.log 2>&1"'
        }
        // Esperar a que el backend esté levantado
        bat 'npx wait-on http://localhost:4000/api/health'
      }
    }

    stage('Levantar frontend') {
      environment {
        REACT_APP_API_URL = 'http://localhost:4000/api'
        REACT_APP_SOCKET_URL = 'http://localhost:4000'
      }
      steps {
        dir('conectados-frontend') {
          // Levantar frontend en segundo plano
          bat 'start /b cmd /c "npm start > frontend.log 2>&1"'
        }
        bat 'npx wait-on http://localhost:3000'
      }
    }

    stage('Ejecutar pruebas automatizadas') {
      steps {
        dir('tests') {
          bat 'node run-all-tests.js'
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
