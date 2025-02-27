
declare const air_light_screenReaderText: {
    expand_for: string,
};

// Add proper link labels for screen readers
function a11yAddDropdownToggleLabels(items: NodeListOf<Element>) {
  items.forEach(function(li) {
    // If .dropdown-class does not exist then do nothing
    var dropdown = li.querySelector('.dropdown') as HTMLElement;
    if (!dropdown) {
      return;
    }

    // Get the dropdown-button
    var dropdownButton = li.querySelector('.dropdown-toggle') as HTMLElement;

    // Get the link text that is children of this item
    var linkText = dropdown.innerText;

    // Add the aria-label to the dropdown button
    dropdownButton.setAttribute('aria-label', air_light_screenReaderText.expand_for + ' ' + linkText);
  });
}

export default a11yAddDropdownToggleLabels;
