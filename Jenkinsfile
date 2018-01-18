#!groovy
import com.bit13.jenkins.*

if(env.BRANCH_NAME ==~ /master$/) {
		return
}


node ("docker") {
	def ProjectName = "peer-review-bot"
	def slack_notify_channel = null

	def SONARQUBE_INSTANCE = "bit13"

	def MAJOR_VERSION = 1
	def MINOR_VERSION = 2


	properties ([
		buildDiscarder(logRotator(numToKeepStr: '25', artifactNumToKeepStr: '25')),
		disableConcurrentBuilds(),
		pipelineTriggers([
			pollSCM('H/30 * * * *')
		]),
	])

	env.PROJECT_MAJOR_VERSION = MAJOR_VERSION
	env.PROJECT_MINOR_VERSION = MINOR_VERSION

	env.CI_BUILD_VERSION = Branch.getSemanticVersion(this)
	env.CI_DOCKER_ORGANIZATION = Accounts.GIT_ORGANIZATION
	env.CI_PROJECT_NAME = ProjectName
	currentBuild.result = "SUCCESS"

	def errorMessage = null
	wrap([$class: 'TimestamperBuildWrapper']) {
		wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
			Notify.slack(this, "STARTED", null, slack_notify_channel)
			try {
					stage ("install" ) {
						deleteDir()
						env.GRB_WEBHOOK_SECRET = SecretsVault.get(this, "secret", "GRB_WEBHOOK_SECRET")
						env.GRB_AUTH_CLIENT_SECRET = SecretsVault.get(this, "secret", "GRB_AUTH_CLIENT_SECRET")
						env.GRB_ACCESS_TOKEN = SecretsVault.get(this, "secret", "GRB_ACCESS_TOKEN")
						env.GRB_ORGANIZATION = SecretsVault.get(this, "secret", "GRB_ORGANIZATION")
						env.GRB_AUTH_CLIENT_ID = SecretsVault.get(this, "secret", "GRB_AUTH_CLIENT_ID")
						env.GRB_BOT_USERNAME = SecretsVault.get(this, "secret", "GRB_BOT_USERNAME")
						env.GRB_BOT_URL = SecretsVault.get(this, "secret", "GRB_BOT_URL")

						Branch.checkout(this, env.CI_PROJECT_NAME)
						Pipeline.install(this)
					}
					stage ("build") {
						sh script: "${WORKSPACE}/.deploy/build.sh -n '${env.CI_PROJECT_NAME}' -v '${env.CI_BUILD_VERSION}' -o '${env.CI_DOCKER_ORGANIZATION}'"
					}
					stage ("test") {
						withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: env.CI_ARTIFACTORY_CREDENTIAL_ID,
														usernameVariable: 'ARTIFACTORY_USERNAME', passwordVariable: 'ARTIFACTORY_PASSWORD']]) {
							sh script: "${WORKSPACE}/.deploy/test.sh -n '${env.CI_PROJECT_NAME}' -v '${env.CI_BUILD_VERSION}' -o ${env.CI_DOCKER_ORGANIZATION}"
						}
					}
					stage ("deploy") {
						sh script: "${WORKSPACE}/.deploy/deploy.sh -n '${env.CI_PROJECT_NAME}' -v '${env.CI_BUILD_VERSION}' -f"
					}
					stage ('publish') {
						// this only will publish if the incominh branch IS develop
						Branch.publish_to_master(this)
						Pipeline.publish_buildInfo(this)
						withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: env.CI_DOCKER_HUB_CREDENTIAL_ID,
						 								usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD']]) {
							sh script:  "${WORKSPACE}/.deploy/publish.sh -n '${env.CI_PROJECT_NAME}' -v '${env.CI_BUILD_VERSION}' -o '${env.CI_DOCKER_ORGANIZATION}'"
						}

					}
			} catch(err) {
				currentBuild.result = "FAILURE"
				errorMessage = err.message
				throw err
			}
			finally {
				Pipeline.finish(this, currentBuild.result, errorMessage)
			}
		}
	}
}
