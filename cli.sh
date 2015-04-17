#!/bin/bash

function build() {
  echo "running jshint"
  jshint \
    src/ \
  ;

  echo 'cli.sh build the themes in node_modules'
  find node_modules/ -type f -name cli.sh \
    -exec {} build \;\
  ;

  echo 'cli.sh build the themes in themes/'
  find themes/ -type f -name cli.sh \
    -exec {} build \;\
  ;

  echo "ln -s ./bundled/default.html ./bundled/index.html"
  cd bundled/
  ln -sf default.html index.html
  cd ../
}

build
while inotifywait -e close_write src/* node_modules; do build; done
