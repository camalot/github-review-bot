FROM node:alpine

# set version label
ARG PROJECT_NAME="github-review-bot"
ARG BUILD_VERSION="1.0.0-snapshot"

ARG PUID=3000
ARG PGID=3000

ARG VUSER="abc"
ARG VGROUP="abc"


ENV GRB_ORGANIZATION=""
ENV GRB_ACCESS_TOKEN=""
ENV GRB_WEBHOOK_SECRET=""
ENV GRB_BOT_URL=""
ENV GRB_AUTH_CLIENT_ID=""
ENV GRB_AUTH_CLIENT_SECRET=""
ENV GRB_BOT_USERNAME=""

RUN addgroup "${VGROUP}" -g "${PGID}" && \
	adduser -S -G "${VGROUP}" -u "${PUID}" "${VUSER}"

LABEL \
	LABEL="${PROJECT_NAME}-v${BUILD_VERSION}" \
	VERSION="${BUILD_VERSION}" \
	MAINTAINER="camalot <camalot@gmail.com>"

EXPOSE 3000

COPY . /app
WORKDIR /app

RUN \
	chown -R "${VUSER}:${VGROUP}" /app

USER ${VUSER}

RUN \
	# npm run test && \
	npm version "${BUILD_VERSION}" --git-tag-version && \
	npm install --production;

ENTRYPOINT ["npm", "start"]
