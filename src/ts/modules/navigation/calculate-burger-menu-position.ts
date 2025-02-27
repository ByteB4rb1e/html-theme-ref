// Calculate burger menu position
function calculateBurgerMenuPosition() {
  // If nav-toggle, site-header or main-menu not found, bail
  if (!document.getElementById('nav-toggle') || !document.querySelector('.site-header') || !document.getElementById('menu-items-wrapper')) {
    // eslint-disable-next-line no-console
    console.log('Warning: No nav-toggle or site-header found.');

    return;
  }

  // Set viewport
  var viewportWidth = document.documentElement.clientWidth || document.body.clientWidth;

  // Get --width-max-mobile from CSS
  var widthMaxMobile = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--width-max-mobile'), 10);

  // Get the height of .site-header and #nav-toggle
  // Calculate the top position of the toggle to be exactly in the center vertically
  var siteHeader = document.querySelector('.site-header') as HTMLElement;
  var siteHeaderHeight = siteHeader.offsetHeight;

  // Set navigation position from top if on mobile
  if (viewportWidth <= widthMaxMobile) {
    var menuItemsWrapper = document.getElementById('menu-items-wrapper') as HTMLElement;
    menuItemsWrapper.style.top = siteHeaderHeight + 'px';
    menuItemsWrapper.style.height = 'calc(100vh - ' + siteHeaderHeight + 'px)';

    // If there is air-notification element(s), calculate top and height of menu-items-wrapper
    if (document.querySelector('.air-notification')) {
      // Get air-notification element(s)
      var airNotifications = document.querySelectorAll('.air-notification') as NodeListOf<HTMLElement>;

      // Get the height of air-notification(s)
      var airNotificationsHeight = 0;
      airNotifications.forEach(function(airNotification) {
        airNotificationsHeight = airNotification.offsetHeight + airNotificationsHeight;
      });

      // Set the height and top of menu-items-wrapper
      menuItemsWrapper.style.height = 'calc(100vh - ' + (siteHeaderHeight + airNotificationsHeight) + 'px)';
      menuItemsWrapper.style.top = (siteHeaderHeight + airNotificationsHeight) + 'px';

      // When air-notification is closed, recalculate the height of menu-items-wrapper
      airNotifications.forEach(function(airNotification) {
        var button = airNotification.querySelector('button') as HTMLElement;
        var currentNotificationHeight = airNotification.offsetHeight;
        if (button) {
          button.addEventListener('click', function() {
            airNotificationsHeight -= currentNotificationHeight;
            menuItemsWrapper.style.height = 'calc(100vh - ' + (siteHeaderHeight + airNotificationsHeight) + 'px)';
            menuItemsWrapper.style.top = (siteHeaderHeight + airNotificationsHeight) + 'px';
          });
        }
      });
    }
  } else {
    var menuItemsWrapper = document.getElementById('menu-items-wrapper') as HTMLElement;
    menuItemsWrapper.style.top = '0';
    menuItemsWrapper.style.height = 'auto';
  }
}

export default calculateBurgerMenuPosition;
