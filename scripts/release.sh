#!/usr/bin/env bash

# the goal is to build minified ready-to-be-released version into resources/release
# resources/release should be still working and we should be able to load it as unpacked extension for testing
# (our test tasks rely on it)
#
# for our code we use clojurescript with :advanced optimizations
# for devtools we use build_applications.py which does concatenation and minification of devtools files,
# it also embeds resource files and compiles lazy-loaded code into modules
#
# steps:
# - move some required destination files to resources/release
# - compile implant into resources/release/dirac/compiled
# - move existing sources in resources/unpacked into a temp folder
# - zero dirac/require-implant.js in the temp folder
# - run build_applications.py on the files in temp folder as input, output to resources/release
# - move static resources to resources/release
# - remove unneeded files from resources/release

set -e

. "$(dirname "${BASH_SOURCE[0]}")/config.sh"

pushd "$ROOT"

./scripts/check-versions.sh

if [ -z "$RELEASE_BUILD_DEVTOOLS" ] ; then
  echo "invalid config: RELEASE_BUILD_DEVTOOLS is empty"
  exit 111
fi

if [ -d "$RELEASE_BUILD_DEVTOOLS" ] ; then
  rm -rf "$RELEASE_BUILD_DEVTOOLS"/*
fi
if [ ! -d "$RELEASE_BUILD_DEVTOOLS" ] ; then
  mkdir -p "$RELEASE_BUILD_DEVTOOLS"
fi

FRONTEND="$DEVTOOLS_ROOT/front_end"

if [ -z "$1" ] ; then
  lein compile-release
else
  lein compile-release-pseudo-names
fi

popd

pushd "$DEVTOOLS_ROOT"

# http://stackoverflow.com/a/34676160/84283
WORK_DIR=`mktemp -q -d /tmp/dirac-build-XXXXXXX`
if [ $? -ne 0 ]; then
  echo "$0: Can't create temp file, exiting..."
  exit 1
fi

function cleanup {
  if [[ "$WORK_DIR" == /tmp/dirac-build-* ]] ; then  # this is just a paranoid test if something went terribly wrong and mktemp returned "/" or something non-tmp-ish
    rm -rf "$WORK_DIR"
    # echo "Deleted temp working directory $WORK_DIR"
  else
    echo "Unexpected temporary directory. Delete it manually '$WORK_DIR'."
  fi
}
trap cleanup EXIT

mkdir -p "$WORK_DIR"

cp -r "$FRONTEND"/* "$WORK_DIR"
cp -r "$RELEASE_BUILD_DEVTOOLS/dirac" "$WORK_DIR"

echo -n "" > "$WORK_DIR/dirac/require-implant.js" # when doing advanced build, all implant files are required automatically

./scripts/build_applications.py inspector toolbox --input_path "$WORK_DIR" --output_path "$RELEASE_BUILD_DEVTOOLS" --debug 0

popd

pushd "$ROOT"

# copy static resources
# this should be kept in sync with devtools_frontend_resources target of devtools.gyp
cp -r "$FRONTEND/Images" "$RELEASE_BUILD_DEVTOOLS"
cp -r "$FRONTEND/emulated_devices" "$RELEASE_BUILD_DEVTOOLS"
cp "$FRONTEND/devtools.js" "$RELEASE_BUILD_DEVTOOLS"

# ad-hoc cleanup
rm -rf "$RELEASE_BUILD_DEVTOOLS/dirac"
rm -rf "$RELEASE_BUILD_DEVTOOLS/Images/src"

rm -rf "$RELEASE_BUILD/compiled/background"
rm -rf "$RELEASE_BUILD/compiled/options"

popd