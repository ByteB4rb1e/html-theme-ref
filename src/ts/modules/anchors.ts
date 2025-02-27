/* eslint-disable no-param-reassign, no-undef */
import MoveTo = require('moveto');

const initAnchors = (): void => {
  const easeFunctions = {
    easeInQuad: function (t: number, b: number, c: number, d: number): number {
      t /= d; return c * t * t + b;
    },
    easeOutQuad: function (t: number, b: number, c: number, d: number): number {
      t /= d; return -c * t * (t - 2) + b;
    }
  };

  const moveTo = new MoveTo({}, easeFunctions);

  // Get all links that have only the hash as href and is not back to top link
  const triggers = document.querySelectorAll('a[href*="#"]:not([href="#"]):not(#top)') as NodeListOf<HTMLAnchorElement>;

  for (let i = 0; i < triggers.length; i++) {
    // Move to target smoothly
    moveTo.registerTrigger(triggers[i] as HTMLElement);
    const target = document.getElementById(triggers[i].hash.substring(1));

    if (triggers[i].classList.contains('nav-link')) {
      document.body.classList.remove('js-nav-active');
    }

    triggers[i].addEventListener('click', () => {
      if (triggers[i].classList.contains('nav-link')) {
        document.body.classList.remove('js-nav-active');
      }

      if (target) {
        // Needs delay for smooth moveTo scroll
        setTimeout(() => {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }, 500);
      }
    });
  }
};

export default initAnchors;

