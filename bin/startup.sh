#! /bin/bash

# note: this is my own personal script for setting up 2nd monitor and running
# tmux. Not part of the taskTraker package.

xrandr --output VGA1 --right-of LVDS1
tmux
