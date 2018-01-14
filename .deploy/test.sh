#!/usr/bin/env bash
set -e;

base_dir=$(dirname "$0");
# shellcheck source=/dev/null
source "${base_dir}/shared.sh";

get_opts() {
	while getopts ":v:n:o:" opt; do
	  case $opt in
        v) export opt_version="$OPTARG";
        ;;
        n) export opt_name="$OPTARG";
        ;;
        o) export opt_org="$OPTARG";
        ;;
	    \?) echo "Invalid option -$OPTARG" >&2;
	    exit 1;
	    ;;
	  esac;
	done;

	return 0;
};

tag_exists() {
    RESULT=$(curl -u "${ARTIFACTORY_USERNAME}:${ARTIFACTORY_PASSWORD}" --insecure -s -X GET "https://${DOCKER_REGISTRY}/v2/$1/tags/list?page_size=10000");
    EXISTS=$(echo "$RESULT" | jq -r "[.tags | to_entries | .[] | .value == \"$2\"] | any");
    test $EXISTS = true;
}

[[ -p "${ARTIFACTORY_USERNAME// }" ]] && __error "Environment variable 'ARTIFACTORY_USERNAME' missing";
[[ -p "${ARTIFACTORY_PASSWORD// }" ]] && __error "Environment variable 'ARTIFACTORY_PASSWORD' missing";

get_opts "$@";

DOCKER_ORG="${opt_org:-"${CI_DOCKER_ORGANIZATION:-"camalot"}"}";
TAG_VERSION="${opt_version:-"${CI_BUILD_VERSION:-"latest"}"}";
INSTANCE_NAME="${opt_name:-"${CI_PROJECT_NAME}"}";
DOCKER_IMAGE="${DOCKER_ORG}/${INSTANCE_NAME}";

[[ -z "${INSTANCE_NAME// }" ]] && __error "Environment Variable 'CI_PROJECT_NAME' was not defined";
[[ -z "${DOCKER_REGISTRY// }" ]] && __error "Environment Variable 'DOCKER_REGISTRY' was not defined";

! tag_exists "${DOCKER_IMAGE}" "${TAG_VERSION}" && __error "Tag '${DOCKER_IMAGE}/${TAG_VERSION}' was not found";

exit 0;
