#!/bin/bash

echo "running jshint"
jshint \
  src/ modules/ \
;

echo 'cli.sh build the themes in node_modules'
find node_modules/ -type f -name cli.sh \
  -exec {} build \;\
;

echo "ln -s ./bundled/default.html ./bundled/index.html"
cd bundled/
ln -sf default.html index.html
cd ../
