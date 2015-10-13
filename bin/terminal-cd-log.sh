#! /bin/bash

#tail -f ~/.bash_history | while read line; do echo -n $(date -u -Ins);
#  echo "$line" | awk '/^cd .*$/ {
#    print $line, $2| "tee /var/log/terminal-cd.log"
#  }'
#done

tail -f ~/.bash_history | while read line; do echo -n $(date -u -Ins); echo -e "\t$line"; done | tee /var/log/terminal-cd.log

#tail -fn0 ~/.bash_history | awk -v date="$(date -u -Ins)" '/^cd .*$/ {
#  print $(date -u -Ins), $2| "tee /var/log/terminal-cd.log"
#}'

#tail -fn0 ~/.bash_history | awk -v date="$(date +"%Y-%m-%d %r")" '/^cd .*$/ {
#  print date, $2| "tee /var/log/terminal-cd.log"
#}'
