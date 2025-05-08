AC_INIT

AC_ARG_WITH([force],
            [AS_HELP_STRING([--with-force],
                            [apply force wherever necessary @<:@default=@:>@])],
            [ARG_FORCE='--force'],
            [ARG_FORCE=''])

AC_ARG_WITH([submodule-deinit],
            [AS_HELP_STRING([--with-submodule-deinit],
                            [deinitialize submodules before initializing @<:@default=no@:>@])],
            [ARG_SUBMODULE_DEINIT='yes'],
            [ARG_SUBMODULE_DEINIT='no'])

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

AC_MSG_CHECKING([env for BITBUCKET_WORKSPACE])
if ! test -z "$BITBUCKET_WORKSPACE"; then
    AC_MSG_RESULT([yes])
else
    AC_MSG_RESULT([no])
    AC_MSG_NOTICE([BITBUCKET_WORKSPACE in env is required for publishing])
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

sh -xc "npm --version"
sh -xc "node --version"
sh -xc "git --version"

AC_MSG_NOTICE([initializing npm project...])
npm install

# this allows for caching the directory. Git is able to determine that the
# submodule has been initialized through a copy operation, therefore we need to
# tell Git to drop it. This won't hurt the cache, as we explicitly check out
# commits, therefore the files are guaranteed to be the same
if test "$ARG_SUBMODULE_DEINIT" '=' 'yes'; then
    if ! test -z "$ARG_FORCE"; then
        AC_MSG_NOTICE([forcefully deinitializing (dangling) git submodules...])
    else
        AC_MSG_NOTICE([deinitializing (dangling) git submodules...])
    fi

    git submodule deinit --all $ARG_FORCE
fi

AC_MSG_NOTICE([initializing git submodules...])
git submodule update --init --remote --recursive

AC_OUTPUT
