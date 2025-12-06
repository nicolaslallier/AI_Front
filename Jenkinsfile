pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKER_IMAGE = 'ai-front'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Install') {
            steps {
                echo 'Installing dependencies...'
                sh 'apk add --no-cache make docker'
                sh 'make install'
            }
        }

        stage('Validate') {
            steps {
                echo 'Running code quality checks...'
                sh 'make validate'
            }
        }

        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        echo 'Running unit tests...'
                        sh 'make test'
                    }
                    post {
                        always {
                            junit 'coverage/junit.xml'
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }

                stage('E2E Tests') {
                    steps {
                        echo 'Running E2E tests...'
                        sh 'make test-e2e'
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'Playwright Report'
                            ])
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'make build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh 'make docker-build'
                sh "docker tag ${DOCKER_IMAGE}:latest ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging...'
                sh 'make deploy-staging'
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                echo 'Deploying to production...'
                sh 'make deploy-production'
                sh 'make smoke-test'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification logic here (email, Slack, etc.)
        }
        success {
            echo 'Pipeline succeeded!'
            // Add notification logic here (email, Slack, etc.)
        }
    }
}

