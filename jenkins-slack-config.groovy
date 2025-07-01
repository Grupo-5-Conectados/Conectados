// Configuración de Jenkins para integración con Slack
// Este archivo debe ser ejecutado en Jenkins Script Console o como Job DSL

// Configurar notificación de Slack
node {
    // Configuración del canal de Slack
    def slackChannel = '#conectados'
    def slackToken = 'YOUR_SLACK_TOKEN' // Reemplazar con token real
    
    // Función para enviar notificación a Slack
    def sendSlackNotification(String message, String color = 'good') {
        try {
            slackSend(
                channel: slackChannel,
                color: color,
                message: message,
                tokenCredentialId: 'slack-token' // Credencial configurada en Jenkins
            )
        } catch (Exception e) {
            echo "Error enviando notificación a Slack: ${e.message}"
        }
    }
    
    // Notificación de inicio de pipeline
    sendSlackNotification('🚀 Pipeline iniciado - Ejecutando pruebas Selenium')
    
    // Ejecutar pipeline
    try {
        // Aquí iría la lógica del pipeline
        echo 'Pipeline ejecutándose...'
        
        // Notificación de éxito
        sendSlackNotification('✅ Pipeline completado exitosamente - Pruebas Selenium pasaron')
        
    } catch (Exception e) {
        // Notificación de fallo
        sendSlackNotification('❌ Pipeline falló - Revisar pruebas Selenium', 'danger')
        throw e
    }
}

// Configuración adicional para Jenkins
// Agregar al Jenkinsfile si se usa Job DSL

/*
pipeline {
    agent any
    
    environment {
        SLACK_CHANNEL = '#conectados'
    }
    
    stages {
        // ... stages existentes ...
    }
    
    post {
        success {
            script {
                // Notificación de éxito con detalles
                def message = """
                ✅ Pipeline Conectados - ÉXITO
                📊 Pruebas Selenium: ${env.BUILD_NUMBER}
                ⏱️ Duración: ${currentBuild.durationString}
                🔗 Build: ${env.BUILD_URL}
                """
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'good',
                    message: message
                )
            }
        }
        
        failure {
            script {
                // Notificación de fallo con detalles
                def message = """
                ❌ Pipeline Conectados - FALLO
                📊 Pruebas Selenium: ${env.BUILD_NUMBER}
                ⏱️ Duración: ${currentBuild.durationString}
                🔗 Build: ${env.BUILD_URL}
                📋 Logs: ${env.BUILD_URL}console
                """
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'danger',
                    message: message
                )
            }
        }
        
        unstable {
            script {
                // Notificación de inestable
                def message = """
                ⚠️ Pipeline Conectados - INESTABLE
                📊 Pruebas Selenium: ${env.BUILD_NUMBER}
                ⏱️ Duración: ${currentBuild.durationString}
                🔗 Build: ${env.BUILD_URL}
                """
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'warning',
                    message: message
                )
            }
        }
    }
}
*/

// Instrucciones para configurar Slack en Jenkins:
/*
1. Instalar plugin "Slack Notification" en Jenkins
2. Configurar credenciales de Slack:
   - Ir a Jenkins > Manage Jenkins > Credentials
   - Agregar credencial de tipo "Secret text"
   - ID: slack-token
   - Secret: [Tu token de Slack]

3. Configurar notificaciones globales:
   - Ir a Jenkins > Manage Jenkins > Configure System
   - Buscar sección "Slack"
   - Workspace: [Tu workspace de Slack]
   - Credential: slack-token

4. Configurar canal por defecto:
   - Default channel: #conectados
   - Team domain: [Tu dominio de Slack]

5. Probar configuración:
   - Usar botón "Test Connection"
   - Verificar que llegue mensaje de prueba
*/ 