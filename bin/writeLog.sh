#! /bin/bash
#
# Monitors ~/.bash_history and logs all `cd` commands to the log file:
# /var/log/terminal-cd.log
#
# @author daithi coombes <webeire@gmail.com>
# @url https://github.com/daithi-coombes/task-tracker

echo "writing cd changes to:"
echo -e '\t/var/lob/terminal-cd.log'
tail -f ~/.bash_history | while read line; do

  datetimeCmd="$(date -u -Ins) $line"
  regex="cd\s.*$"

  if [[ $line =~ $regex ]]; then
    echo "$datetimeCmd" | tee -a /var/log/terminal-cd.log
  fi
done
