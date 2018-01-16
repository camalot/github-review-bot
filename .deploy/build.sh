#!/usr/bin/env bash

set -e;

base_dir=$(dirname "$0");
# shellcheck source=/dev/null
source "${base_dir}/shared.sh";

get_opts() {
	while getopts ":n:o:v:f" opt; do
	  case $opt in
			n) export opt_project_name="$OPTARG";
			;;
			o) export opt_organization="$OPTARG";
			;;
			v) export opt_version="$OPTARG";
			;;
			f) export opt_force="--no-cache ";
			;;
	    \?) echo "Invalid option -$OPTARG" >&2;
	    exit 1;
	    ;;
	  esac;
	done;

	return 0;
};

get_opts "$@";

BUILD_PROJECT="${opt_project_name:-"${CI_PROJECT_NAME}"}";
PUSH_REGISTRY="${DOCKER_PUSH_REGISTRY}"
BUILD_VERSION="${opt_version:-"${CI_BUILD_VERSION:-"1.0.0-snapshot"}"}";
BUILD_ORGANIZATION="${opt_organization:-"camalot"}";

[[ -z "${PUSH_REGISTRY// }" ]] && __error "Environment Variable 'DOCKER_PUSH_REGISTRY' was not defined";
[[ -z "${BUILD_PROJECT// }" ]] && __error "Environment Variable 'CI_PROJECT_NAME' was not defined, and project argument (-p) was not defined.";
[[ -z "${BUILD_ORGANIZATION// }" ]] && __error "Environment Variable 'CI_PROJECT_NAME' was not defined, and project argument (-p) was not defined.";

tag="${BUILD_ORGANIZATION}/${BUILD_PROJECT}";

tag_name_latest="${tag}:latest";
tag_name_ver="${tag}:${BUILD_VERSION}";

docker build ${opt_force}--pull \
	--build-arg BUILD_VERSION="${BUILD_VERSION}" \
	--build-arg PROJECT_NAME="${BUILD_PROJECT}" \
	--tag "${tag_name_ver}" \
	"${base_dir}/../";

[[ ! $BUILD_VERSION =~ -snapshot$ ]] && \
	docker tag "${tag_name_ver}" "${tag_name_latest}" && \
	docker tag "${tag_name_ver}" "${PUSH_REGISTRY}/${tag_name_latest}" && \
	docker push "${PUSH_REGISTRY}/${tag_name_latest}";

docker tag "${tag_name_ver}" "${PUSH_REGISTRY}/${tag_name_ver}";
docker push "${PUSH_REGISTRY}/${tag_name_ver}";
