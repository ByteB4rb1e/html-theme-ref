// Assuming previousElementHeight is defined elsewhere in your application
declare const previousElementHeight: number;

// Calculate mobile nav-toggle height
function calculateDropdownToggleHeight(): void {
  // If .dropdown-toggle not found, bail
  if (!document.querySelectorAll('.dropdown-toggle')) {
    // eslint-disable-next-line no-console
    console.log('Warning: No dropdown-toggles found.');
    return;
  }

  // Find all .dropdown-toggle elements on mobile
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Loop through dropdown toggles
  Array.prototype.forEach.call(dropdownToggles, (dropdownToggle: Element) => {
    // Get the height of previous element
    const previousElement = dropdownToggle.previousElementSibling as HTMLElement;
    if (previousElement) {
      // eslint-disable-next-line no-param-reassign
      dropdownToggle.setAttribute('style', `height: ${previousElementHeight}px`);
    }
  });
}

export default calculateDropdownToggleHeight;
