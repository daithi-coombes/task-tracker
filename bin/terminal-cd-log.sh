#! /bin/bash

tail -fn0 ~/.bash_history | awk -v date="$(date +"%Y-%m-%d %r")" '/^cd .*$/ {
  print date, $2| "tee /var/log/terminal-cd.log"
}'
