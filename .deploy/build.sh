#!/usr/bin/env bash

set -e;

base_dir=$(dirname "$0");
# shellcheck source=/dev/null
source "${base_dir}/shared.sh";

get_opts() {
	while getopts ":p:f" opt; do
	  case $opt in
			p) export opt_project_name="$OPTARG";
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

project="${opt_project_name:-"${CI_PROJECT_NAME}"}";
push_registry="${DOCKER_PUSH_REGISTRY}"
BUILD_VERSION=${CI_BUILD_VERSION:-"1.0.0-snapshot"};

[[ -z "${DOCKER_PUSH_REGISTRY// }" ]] && __error "Environment Variable 'DOCKER_PUSH_REGISTRY' was not defined";
[[ -z "${project// }" ]] && __error "Environment Variable 'CI_PROJECT_NAME' was not defined, and project argument (-p) was not defined.";

org="camalot";
tag="${org}/${project}";

tag_name_latest="${tag}:latest";
tag_name_ver="${tag}:${BUILD_VERSION}";

docker build ${opt_force}--pull \
	--build-arg BUILD_VERSION="${BUILD_VERSION}" \
	--build-arg PORJECT_NAME="${project}" \
	--tag "${tag_name_ver}" \
	"${base_dir}/../";

[[ ! $BUILD_VERSION =~ -snapshot$ ]] && \
	docker tag "${tag_name_ver}" "${tag_name_latest}" && \
	docker tag "${tag_name_ver}" "${push_registry}/${tag_name_latest}" && \
	docker push "${push_registry}/${tag_name_latest}";

docker tag "${tag_name_ver}" "${push_registry}/${tag_name_ver}";
docker push "${push_registry}/${tag_name_ver}";
