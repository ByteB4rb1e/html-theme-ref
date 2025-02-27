declare const air_light_screenReaderText: {
    expand_for: string,
};

// Add proper link labels for screen readers
function a11yAddDropdownToggleLabelsClick(items: NodeListOf<Element>) {
  items.forEach(function(li) {
    // If .dropdown-toggle does not exist then do nothing
    var dropdownToggle = li.querySelector('.dropdown-toggle');
    if (!dropdownToggle) {
      return;
    }

    // Add helper class to dropdown-toggle
    dropdownToggle.classList.add('menu-item-clickable');

    // Remove .dropdown-toggle class
    dropdownToggle.classList.remove('dropdown-toggle');

    // Get the dropdown-button
    var dropdownButton = li.querySelector('.menu-item-clickable') as HTMLElement;

    // Get the link text that is children of this item
    var linkText = dropdownButton.innerHTML;
    // Add the aria-label to the dropdown button
    // eslint-disable-next-line camelcase, no-undef
    dropdownButton.setAttribute('aria-label', air_light_screenReaderText.expand_for + ' ' + linkText);
  });
}

export default a11yAddDropdownToggleLabelsClick;
