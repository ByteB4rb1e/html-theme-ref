AC_INIT

AC_CHECK_PROGS([GIT], [git], [no])
AS_IF([test "$GIT" == "no"], 
      [AC_MSG_ERROR([install Git, before continuing.])])

AC_CHECK_PROGS([NODE], [node], [no])
AS_IF([test "$NODE" == "no"], 
      [AC_MSG_ERROR([install Node.js (node), before continuing.])])

AC_CHECK_PROGS([NPM], [npm], [no])
AS_IF([test "$NPM" == "no"], 
      [AC_MSG_ERROR([install npm, before continuing.])])

AC_CHECK_PROGS([CURL], [curl], [no])
AS_IF([test "$CURL" == "no"], 
      [AC_MSG_ERROR([install curl, before continuing.])])

AC_MSG_NOTICE([initializing npm project...])
npm install

AC_MSG_NOTICE([initializing git submodules...])
git submodule update --init --remote --recursive

AC_OUTPUT
