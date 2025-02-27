// Assuming air_light_screenReaderText is defined elsewhere in your application
declare const air_light_screenReaderText: { expand_for: string };

function closeSubMenu(li: Element): void {
  // If menu item is not a dropdown then do nothing
  if (!li.querySelector('.dropdown-toggle') && !li.querySelector('.sub-menu')) {
    return;
  }

  // Get the dropdown-button
  const dropdownButton = li.querySelector('.dropdown-toggle') as HTMLElement | null;

  // Get the submenu
  const subMenu = li.querySelector('.sub-menu') as HTMLElement | null;

  // If the dropdown-menu is not open, bail
  if (subMenu && !subMenu.classList.contains('toggled-on')) {
    return;
  }

  if (subMenu) {
    // Remove the open class from the dropdown-menu
    subMenu.classList.remove('toggled-on');
  }

  if (dropdownButton) {
    // Remove the open class from the dropdown-button
    dropdownButton.classList.remove('toggled-on');

    // Remove the aria-expanded attribute from the dropdown-button
    dropdownButton.setAttribute('aria-expanded', 'false');

    // Get the link text that is children of this item
    const linkText = dropdownButton.innerHTML;

    // Add the aria-label to the dropdown button
    // eslint-disable-next-line camelcase, no-undef
    dropdownButton.setAttribute('aria-label', `${air_light_screenReaderText.expand_for} ${linkText}`);
  }
}

export default closeSubMenu;
