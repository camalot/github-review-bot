#!/usr/bin/env bash

base_dir=$(dirname "$0");

# shellcheck source=.deploy/shared.sh
# shellcheck disable=SC1091
source "${base_dir}/shared.sh";

get_opts() {
	while getopts ":n:v:o:" opt; do
	  case $opt in
			n) export opt_project_name="$OPTARG";
			;;
			v) export opt_version="$OPTARG";
			;;
			o) export opt_docker_org="$OPTARG";
			;;
	    \?) __error "Invalid option $opt";
	    ;;
	  esac;
	done;
	return 0;
};

get_opts "$@";

PROJECT_NAME="${opt_project_name:-"${CI_PROJECT_NAME}"}";
BUILD_VERSION=${CI_BUILD_VERSION:-"1.0.0-snapshot"};
DOCKER_ORG="${opt_docker_org}";

[[ -z "${PROJECT_NAME// }" ]] && __error "'-p' (project name) attribute is required.";
[[ -z "${BUILD_VERSION// }" ]] && __error "'-v' (version) attribute is required.";
[[ -z "${DOCKER_ORG// }" ]] && __error "'-o' (docker org) attribute is required.";

tag="${DOCKER_ORG}/${PROJECT_NAME}";
tag_name_latest="${tag}:latest";
tag_name_ver="${tag}:${BUILD_VERSION}";

if [[ ! $BUILD_VERSION =~ -snapshot$ ]]; then
	docker tag "${tag_name_ver}" "${tag_name_latest}";
	if [[ ! -z "${DOCKER_HUB_USERNAME// }" ]] && [[ ! -z "${DOCKER_HUB_PASSWORD// }" ]]; then
		docker login --username "${DOCKER_HUB_USERNAME}" --password-stdin <<< "${DOCKER_HUB_PASSWORD}";
		docker push "${tag_name_latest}";
		docker push "${tag_name_ver}";
	else
		__warning "DOCKER_HUB_USERNAME and/or DOCKER_HUB_PASSWORD not supplied. Skipping docker publish"
	fi
fi

