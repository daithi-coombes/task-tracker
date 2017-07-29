# task-tracker

### Installation

clone this repository and change to its directory:
```
git clone https://github.com/daithi-coombes/task-tracker
cd task-tracker
```

Copy the `config-dist.js` file as `config.js` and update the details if
needed. (current values are defaults and should work out of box).

if you want live metrics then add this to your `~/.bashrc` file: (@todo move
this into main application).
```
shopt -s histappend
export PROMPT_COMMAND="history -a;$PROMPT_COMMAND"
```

next run bash script to write cd changes to logfile. This will log directory
changes that you might make in your terminal. (@todo move start/stop into the
main application).
```
./bin/writeLog.sh
```

finally to view the gui, from project root directory, run the nodejs
application.
```
npm install
npm start
```

(@todo on some systems duplicate records are recored when new
 terminal is opened). This may need the collection created above to be set as
 unique.
```
db.dirChanges.createIndex({"dateTime":1},{unique: true})
```

# q[ -_-]p
