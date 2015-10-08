#! /bin/bash

###
# logging
###
script /var/log/terminal-activities.log &
export PROMPT_COMMAND='history -a'

###
# main()
###
xrandr --output VGA1 --right-of LVDS1
tmux
