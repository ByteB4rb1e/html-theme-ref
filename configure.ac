AC_INIT

AC_CHECK_PROGS([NPM], [npm])

AC_MSG_NOTICE([initializing npm project...])
npm install

AC_MSG_NOTICE([initializing git submodules...])
git submodule update --init --remote --recursive

AC_OUTPUT
