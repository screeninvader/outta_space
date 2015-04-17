# Outta Space

...is a web frontend for
[ScreenInvader](http://github.com/screeninvader/screeninvader) based
on [Janosh](https://github.com/kallaballa/Janosh) new WebSocket-API.

Project goals are to stay close to ECMAScript 6  with as little runtime
dependencies as possible, keeping the codebase read- and
hackable, and to provide a responsive and themeable userinterface.

At the moment it's highly experimental. Some basic features are not there
yet, changes in architecture and the API are to be expected.

Contributions are very welcome, the project is licensed under [AGPLv3
or later](http://www.gnu.org/licenses/agpl-3.0.html).

#### Installation:
```sh
  git clone http://github.com/screeninvader/outta_space
  cd outta_space
  #install all dependencies of outta_space as well as the themes in themes/

  npm run setup 
  #OR 
  ./cli.sh setup

```
This process will first run npm install for outta_space,
then progress into themes/ and execute ./themes/{theme_name}/cli.sh install
for every cli.sh file it finds.
themes install through npm get their dependencies installed automatically.

#### Themes:

custom themes can be installed in one of two ways:
###### npm: (production)
```sh
npm install screeninvader/screeninvader-theme-default
```
themes installed through npm will be saved in the node_modules directory.
use for production.

###### git: (development)
```sh
git clone https://github.com/screeninvader/screeninvader-theme-default themes/themename
```
the themes/ directory contains a .gitignore file 
that ignores anything in there except the default theme,

only use this directory for the development of new themes and
manage those themes in separate git repositories.

#### the build process:
you can trigger a build for all themes and outta_space by running:
```sh
npm start
#OR
./cli.sh build
```
This renders all themes it finds,
then starts a watch process using inotifywait from the inotify-tools.
it listens to changes to both 
the src/ directory as well as the themes/ directory,
the build will be retriggered whenever one of the files get saved.

#### File Structure
```sh
  #resulting file structure:
  bundled/ #root dir to be served using http server
    default.html #default theme html file
    index.html #symlink to default.html
    default/
      # directory containing the default theme files,
      # unminified and including sourcemaps
```
if you added your own custom themes then there will be 
one more .html file and one more directory in the bundled/ directory,
themename.html and themename/index.html

#### Production Use:
run npm start in the outta_space root directory.

this will bundle all themes installed using npm or git (see above)
and collect them in the bundled/ directory.

To make the screeninvader use them just rsync/scp them to the
/lounge/www directory of your screeninvader install.

Almost automatic upload will be available in the future.
