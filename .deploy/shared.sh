#!/usr/bin/env bash

__error() {
	RED='\033[0;31m';
	NC='\033[0m';
	dt=$(date "+%F %T");
	(>&2 echo -e "${RED}[$dt]\tERROR\t$(basename $0)\t${1:-"Unknown Error"}${NC}");
	exit 9;
}
__warning() {
	YELLOW='\033[0;33m';
	NC='\033[0m';
	dt=$(date "+%F %T");
	(>&2 echo -e "${YELLOW}[$dt]\tWARNING\t$(basename $0)\t${1:-"Unknown Warning"}${NC}");
}
__info() {
	NC='\033[0m';
	dt=$(date "+%F %T");
	(>&2 echo -e "${NC}[$dt]\tINFO\t$(basename $0)\t${1:-"Unknown Message"}${NC}");
}
