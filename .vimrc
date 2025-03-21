" Tiara's vim defaults
" Sharing a large portion of my vim config to illustrate what type of
" workflow this reference implementation is supporting, or even requiring
set nocompatible
syntax on
set wildmenu
set encoding=utf-8
set number
set backspace=indent,eol,start
set history=1000
set showcmd
set hidden
set ruler
set autoindent
set smartindent
set smarttab
set shiftwidth=4
set softtabstop=4
set tabstop=4
set expandtab
set list listchars=tab:\•\ ,space:·,eol:¬
set nowrap
set textwidth=80
set foldmethod=indent
set re=2
set hlsearch
nnoremap <space> za
vnoremap <space> zf
autocmd FileType md set tw=72 fo=cqt wm=0 wrap
augroup vimrc_autocmds
  autocmd BufEnter * highlight OverLength ctermbg=green guibg=#592929
  autocmd BufEnter * match OverLength /\%82v.*/
augroup END

