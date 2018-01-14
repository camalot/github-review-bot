#!groovy
import com.bit13.jenkins.*

if(env.BRANCH_NAME ==~ /master$/) {
		return
}


node ("docker") {
	def ProjectName = "github-review-bot"
	def slack_notify_channel = null

	def SONARQUBE_INSTANCE = "bit13"

	def MAJOR_VERSION = 1
	def MINOR_VERSION = 0


	properties ([
		buildDiscarder(logRotator(numToKeepStr: '25', artifactNumToKeepStr: '25')),
		disableConcurrentBuilds(),
		pipelineTriggers([
			pollSCM('H/30 * * * *')
		]),
	])
	// withCredentials([[$class: 'StringBinding', credentialsId: "f98b8136-b4bf-4c0e-aa0f-92bdfbc0bf35",
	// 															 variable: 'VAULT_AUTH_TOKEN']]) {
	// 	env.GRB_BOT_URL = sh (returnStdout: true, script: "curl --insecure -sL -H \"X-Vault-Token: ${env.VAULT_AUTH_TOKEN}\" -X GET ${env.VAULT_SERVER}/v1/secret/GRB_BOT_URL | jq '.data | to_entries[] | .value'")
	// 	env.GRB_WEBHOOK_SECRET = sh (returnStdout: true, script: "curl --insecure -sL -H \"X-Vault-Token: ${env.VAULT_AUTH_TOKEN}\" -X GET ${env.VAULT_SERVER}/v1/secret/GRB_WEBHOOK_SECRET | jq '.data | to_entries[] | .value'")
	// 	env.GRB_AUTH_CLIENT_SECRET = sh (returnStdout: true, script: "curl --insecure -sL -H \"X-Vault-Token: ${env.VAULT_AUTH_TOKEN}\" -X GET ${env.VAULT_SERVER}/v1/secret/GRB_AUTH_CLIENT_SECRET | jq '.data | to_entries[] | .value'")
	// 	env.GRB_ACCESS_TOKEN = sh (returnStdout: true, script: "curl --insecure -sL -H \"X-Vault-Token: ${env.VAULT_AUTH_TOKEN}\" -X GET ${env.VAULT_SERVER}/v1/secret/GRB_ACCESS_TOKEN | jq '.data | to_entries[] | .value'")
	// 	env.GRB_ORGANIZATION = sh (returnStdout: true, script: "curl --insecure -sL -H \"X-Vault-Token: ${env.VAULT_AUTH_TOKEN}\" -X GET ${env.VAULT_SERVER}/v1/secret/GRB_ORGANIZATION | jq '.data | to_entries[] | .value'")
	// 	env.GRB_AUTH_CLIENT_ID = sh (returnStdout: true, script: "curl --insecure -sL -H \"X-Vault-Token: ${env.VAULT_AUTH_TOKEN}\" -X GET ${env.VAULT_SERVER}/v1/secret/GRB_AUTH_CLIENT_ID | jq '.data | to_entries[] | .value'")
	// 	env.GRB_BOT_USERNAME = sh (returnStdout: true, script: "curl --insecure -sL -H \"X-Vault-Token: ${env.VAULT_AUTH_TOKEN}\" -X GET ${env.VAULT_SERVER}/v1/secret/GRB_BOT_USERNAME | jq '.data | to_entries[] | .value'")
	// }
	// def secrets = [
	// 	[$class: 'VaultSecret', path: 'secret', secretValues: [
	// 		[$class: 'VaultSecretValue', envVar: 'GRB_WEBHOOK_SECRET', vaultKey: 'GRB_WEBHOOK_SECRET'],
	// 		[$class: 'VaultSecretValue', envVar: 'GRB_AUTH_CLIENT_SECRET', vaultKey: 'GRB_AUTH_CLIENT_SECRET'],
	// 		[$class: 'VaultSecretValue', envVar: 'GRB_ACCESS_TOKEN', vaultKey: 'GRB_ACCESS_TOKEN'],
	// 		[$class: 'VaultSecretValue', envVar: 'GRB_ORGANIZATION', vaultKey: 'GRB_ORGANIZATION'],
	// 		[$class: 'VaultSecretValue', envVar: 'GRB_BOT_URL', vaultKey: 'GRB_BOT_URL'],
	// 		[$class: 'VaultSecretValue', envVar: 'GRB_AUTH_CLIENT_ID', vaultKey: 'GRB_AUTH_CLIENT_ID'],
	// 		[$class: 'VaultSecretValue', envVar: 'GRB_BOT_USERNAME', vaultKey: 'GRB_BOT_USERNAME']
	// 	]]
	// ]
	// echo "URL: ${env.VAULT_SERVER}"
	// def configuration = [$class: 'VaultConfiguration', vaultUrl: env.VAULT_SERVER, vaultCredentialId: env.CI_VAULT_CREDENTIAL_ID]

	env.GRB_WEBHOOK_SECRET = Vault.getSecret("secret/", "GRB_WEBHOOK_SECRET")
	env.GRB_AUTH_CLIENT_SECRET = Vault.getSecret("secret/", "GRB_AUTH_CLIENT_SECRET")
	env.GRB_ACCESS_TOKEN = Vault.getSecret("secret/", "GRB_ACCESS_TOKEN")
	env.GRB_ORGANIZATION = Vault.getSecret("secret/", "GRB_ORGANIZATION")
	env.GRB_AUTH_CLIENT_ID = Vault.getSecret("secret/", "GRB_AUTH_CLIENT_ID")
	env.GRB_BOT_USERNAME = Vault.getSecret("secret/", "GRB_BOT_USERNAME")

	env.PROJECT_MAJOR_VERSION = MAJOR_VERSION
	env.PROJECT_MINOR_VERSION = MINOR_VERSION

	env.CI_BUILD_VERSION = Branch.getSemanticVersion(this)
	env.CI_DOCKER_ORGANIZATION = Accounts.GIT_ORGANIZATION
	env.CI_PROJECT_NAME = ProjectName
	currentBuild.result = "SUCCESS"
	def errorMessage = null
	wrap([$class: 'TimestamperBuildWrapper']) {
		wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
			// wrap([$class: 'VaultBuildWrapper', configuration: configuration, vaultSecrets: secrets]) {
				Notify.slack(this, "STARTED", null, slack_notify_channel)
				try {
						stage ("install" ) {
								deleteDir()
								Branch.checkout_vsts(this, teamName, env.CI_PROJECT_NAME)
								Pipeline.install(this)
						}
						stage ("build") {
								sh script: "${WORKSPACE}/.deploy/build.sh -p '${env.CI_PROJECT_NAME}'"
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
						}
				} catch(err) {
					currentBuild.result = "FAILURE"
					errorMessage = err.message
					throw err
				}
				finally {
					Pipeline.finish(this, currentBuild.result, errorMessage)
				}
			// }
		}
	}
}
