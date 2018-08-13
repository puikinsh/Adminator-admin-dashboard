#!/bin/bash
git config --global url."https://".insteadOf git://
npm install
npm run docker-dev