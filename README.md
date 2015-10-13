# task-tracker

### Installation

##### <u>First</u>
make sure that your terminal is logging history in realtime, even across
emulator sessions such as `tmux` etc. For me, on a Debian 8, the solution was
to append the following to `~/.bashrc`:

```bash
shopt -s histappend
export PROMPT_COMMAND="history -a;$PROMPT_COMMAND"
```
more info [here](https://askubuntu.com/questions/67283)


##### <u>Second</u>
clone this repo and run the bash scripts in `bin/` folder:
```bash
git clone https://github.com/daithi-coombes/taskTraker.git
cd bin
./terminal-cd-log.sh
```

Now your terminal cd changes, across all sessions, should be logged to:
```
/var/log/terminal-cd.log
```

# q[ -_-]p
