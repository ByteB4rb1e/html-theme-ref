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

AC_CHECK_PROGS([MAKE], [make], [no])
AS_IF([test "$NPM" == "no"], 
      [AC_MSG_ERROR([install GNU Make (make), before continuing.])])

AC_MSG_CHECKING([env for BITBUCKET_USERNAME])
if ! test -z "$BITBUCKET_USERNAME"; then
    AC_MSG_RESULT([yes])
else
    AC_MSG_RESULT([no])
    AC_MSG_NOTICE([BITBUCKET_USERNAME in env is required for publishing])
fi

AC_MSG_CHECKING([env for BITBUCKET_REPO_SLUG])
if ! test -z "$BITBUCKET_REPO_SLUG"; then
    AC_MSG_RESULT([yes])
else
    AC_MSG_RESULT([no])
    AC_MSG_NOTICE([BITBUCKET_REPO_SLUG in env is required for publishing])
fi

AC_MSG_CHECKING([env for BITBUCKET_ACCESS_TOKEN])
if ! test -z "$BITBUCKET_ACCESS_TOKEN"; then
    AC_MSG_RESULT([yes])
else
    AC_MSG_RESULT([no])
    AC_MSG_NOTICE([BITBUCKET_ACCESS_TOKEN in env is required for publishing])
fi

# fail fast
set -e

AC_MSG_NOTICE([initializing npm project...])
npm install

AC_MSG_NOTICE([initializing git submodules...])
git submodule update --init --remote --recursive

AC_OUTPUT
