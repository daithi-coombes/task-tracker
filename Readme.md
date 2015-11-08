# task-tracker

### Installation

clone this repository and change to its directory:
```
git clone https://github.com/daithi-coombes/task-tracker
cd task-tracker
```

if you want live metrics then add this to your `~/.bashrc` file:
```
shopt -s histappend
export PROMPT_COMMAND="history -a;$PROMPT_COMMAND"
```

next run the bash script that log changes to your terminal history
and the node app to write logs to the database
```
./bin/terminalCD.sh
node bin/watchLog.js
```

finally to view the gui, change to `app` directory and run `meteor` application:
```
cd app
meteor
```

# q[ -_-]p
