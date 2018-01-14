#!/usr/bin/env bash

set -e;

base_dir=$(dirname "$0");
# shellcheck source=/dev/null
source "${base_dir}/shared.sh";

get_opts() {
	while getopts ":v:n:f" opt; do
	  case $opt in
      v) export opt_version="$OPTARG";
      ;;
      n) export opt_name="$OPTARG";
      ;;
			f) export opt_force=1;
			;;
	    \?) echo "Invalid option -$OPTARG" >&2;
	    exit 1;
	    ;;
	  esac;
	done;

	return 0;
};


get_opts "$@";

FORCE_DEPLOY=${opt_force:-0};
TAG_VERSION="${opt_version:-"${CI_BUILD_VERSION:-"latest"}"}";
INSTANCE_NAME="${opt_name:-"${CI_PROJECT_NAME}"}";
DOCKER_IMAGE="camalot/${INSTANCE_NAME}:${TAG_VERSION}";

[[ -z "${INSTANCE_NAME// }" ]] && __error "Environment Variable 'CI_PROJECT_NAME' was not defined";
[[ -z "${DOCKER_REGISTRY// }" ]] && __error "Environment Variable 'DOCKER_REGISTRY' was not defined";

docker pull "${DOCKER_REGISTRY}/${DOCKER_IMAGE}";


# CHECK IF IT IS CREATED, IF IT IS, THEN DEPLOY
DC_INFO=$(docker ps --all --format "table {{.Status}}\t{{.Names}}" | awk '/vault$/ {print $0}');
__info "DC_INFO: $DC_INFO"
DC_STATUS=$(echo "${DC_INFO}" | awk '{print $1}');
__info "DC_STATUS: $DC_STATUS"
__info "FORCE_DEPLOY: $FORCE_DEPLOY"
if [[ -z "${DC_STATUS}" ]] && [ $FORCE_DEPLOY -eq 0 ]; then
	__warning "Container '$DOCKER_IMAGE' not deployed. Skipping deployment";
	exit 0;
fi

if [[ ! $DC_STATUS =~ ^Exited$ ]]; then
  __info "stopping container";
	docker stop "${INSTANCE_NAME}" || __warning "Unable to stop '${INSTANCE_NAME}'";
fi
if [[ ! -z "${DC_INFO}" ]]; then
  __info "removing image";
	docker rm "${INSTANCE_NAME}" || __warning "Unable to remove '${INSTANCE_NAME}'";
fi


docker run -d \
	--user 0 \
	--restart unless-stopped \
	--name "${INSTANCE_NAME}" \
	-P \
	-e PUID=1000 -e PGID=1000 \
	-e TZ=America_Chicago \
	-e GRB_AUTH_CLIENT_ID="${GRB_AUTH_CLIENT_ID}" \
	-e GRB_AUTH_CLIENT_SECRET="${GRB_AUTH_CLIENT_SECRET}" \
	-e GRB_ORGANIZATION="${GRB_ORGANIZATION}" \
	-e GRB_WEBHOOK_SECRET="${GRB_WEBHOOK_SECRET}" \
	-e GRB_BOT_USERNAME="${GRB_BOT_USERNAME}" \
	-e GRB_BOT_URL="${GRB_BOT_URL}" \
	-e GRB_ACCESS_TOKEN="${GRB_ACCESS_TOKEN}" \
	-t "${DOCKER_IMAGE}";
