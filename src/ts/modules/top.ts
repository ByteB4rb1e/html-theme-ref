/* eslint-disable max-len */
import MoveTo = require('moveto');

const backToTop = function() {
  // Back to top button
  var moveToTop = new MoveTo({
    duration: 300,
    easing: 'easeOutQuart',
  });
  var topButton = document.getElementById('top');
  var focusableElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  function trackScroll() {
    var scrolled = window.pageYOffset;
    var scrollAmount = document.documentElement.clientHeight;

    if (topButton && scrolled > scrollAmount) {
      topButton.classList.add('is-visible');
    }

    if (topButton && scrolled < scrollAmount) {
      topButton.classList.remove('is-visible');
    }
  }

  function scroll() {
    // Check if user prefers reduced motion, if so, just scroll to top
    var prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      (focusableElements[0] as HTMLElement).focus();
      return;
    }

    // Move smoothly to the first focusable element on the page
    moveToTop.move(focusableElements[0] as HTMLElement);

    // Focus too, if on keyboard
    (focusableElements[0] as HTMLElement).focus({ preventScroll: true });
  }

  if (topButton) {
    topButton.addEventListener('click', function(event) {
      // Don't add hash in the end of the url
      event.preventDefault();

      // Focus without visibility (as user is not using keyboard)
      scroll();
    });

    topButton.addEventListener('keydown', function(event) {
      // Don't propagate keydown event to click event
      event.preventDefault();

      // Scroll with focus visible
      scroll();
    });
  }

  window.addEventListener('scroll', trackScroll);
};

export default backToTop;

