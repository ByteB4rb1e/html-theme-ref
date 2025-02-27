import MoveTo = require('moveto');

const initA11ySkipLink = function() {
  // Go through all the headings of the page and select the first one
  var a11ySkipLinkTarget = document.querySelectorAll('h1, h2, h3, h4, h5, h6')[0] as HTMLElement;
  var a11ySkipLink = document.querySelectorAll('.skip-link')[0] as HTMLElement;

  // Register trigger element
  // eslint-disable-next-line no-unused-vars, no-restricted-globals
  var moveTo = new MoveTo();

  // When clicked, move focus to the target element
  if (a11ySkipLink) {
    a11ySkipLink.addEventListener('click', function() {
      a11ySkipLinkTarget.setAttribute('tabindex', '-1');
      a11ySkipLinkTarget.focus();
      moveTo.move(a11ySkipLinkTarget);
    });
  }
};

export default initA11ySkipLink;
