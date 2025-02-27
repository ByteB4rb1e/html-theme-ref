import isOutOfViewport from './is-out-of-viewport';

// Check for submenu overflow
function checkForSubmenuOverflow(items: NodeListOf<Element>): void {
  // If items not found, bail
  if (!items) {
    console.log('Warning: No items for sub-menus found.');
    return;
  }

  Array.prototype.forEach.call(items, (li: Element) => {
    // Find sub menus
    const subMenusUnderMenuItem = li.querySelectorAll('.sub-menu');

    // Loop through sub menus
    Array.prototype.forEach.call(subMenusUnderMenuItem, (subMenu: Element) => {
      // Assert the type to HTMLElement
      const subMenuElement = subMenu as HTMLElement;

      // First let's check if submenu exists
      if (typeof subMenuElement !== 'undefined') {
        // Check if the sub menu is out of viewport or not
        const isOut = isOutOfViewport(subMenuElement);

        // At least one side of the element is out of viewport
        if (isOut.right) {
          subMenuElement.classList.add('is-out-of-viewport');
        }
      }
    });
  });
}

export default checkForSubmenuOverflow;
