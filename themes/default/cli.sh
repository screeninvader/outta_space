#!/bin/bash

PATH=$(pwd)/node_modules/.bin/:./node_modules/.bin/:$PATH

THEME_NAME=default
THEME_DIR=$(pwd)/themes/${THEME_NAME}/
OUT_DIR=$(pwd)/bundled/${THEME_NAME}/
SRC_DIR=$(pwd)/src/

function install() {
  npm install;
}

function build() {
  echo "less ${THEME_DIR}style.less to ${OUT_DIR}style.css"
  lessc ${THEME_DIR}style.less ${OUT_DIR}style.css

  echo "cp ${THEME_DIR}index.html ${OUT_DIR}index.html"
  cp -r \
    ${THEME_DIR}index.html \
    ${THEME_DIR}screeninvader-logo.png \
    ${THEME_DIR}favicon.ico \
    ${OUT_DIR} \
  ;

  echo "browserify ${SRC_DIR}main.js to ${OUT_DIR}bundle.js"
  browserify \
    -d ${SRC_DIR}main.js \
    -o ${OUT_DIR}bundle.js \
    --verbose \
    -t babelify \
    -t uglify-to-browserify \
  ;

  echo "html-inline ${OUT_DIR}index.html to $(pwd)/bundled/${THEME_NAME}.html"
  html-inline \
    -i ${OUT_DIR}index.html \
    -o $(pwd)/bundled/${THEME_NAME}.html \
  ;
}

if [ $1 ]
then
  function=$1
  shift
  $function $@
fi
