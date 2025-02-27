const initA11yFocusSearchField = function() {
  var urlSearch = window.location.search;
  var urlParams = new URLSearchParams(urlSearch);
  if (urlParams.has('s')) {
    var searchField = document.querySelector('main input[name="s"]') as HTMLElement;
    if (searchField) {
      searchField.focus({ preventScroll: true });
    }
  }
};

export default initA11yFocusSearchField;
