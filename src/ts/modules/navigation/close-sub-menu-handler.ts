import closeSubMenu from './close-sub-menu';

function closeSubMenuHandler(items: NodeListOf<Element>): void {
  // Close open dropdowns when clicking outside of the menu
  const page = document.getElementById('page');
  if (page) {
    page.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as Element;

      // If the click is inside the menu, bail
      if (target.closest('.menu-items')) {
        return;
      }

      Array.prototype.forEach.call(items, (li: Element) => {
        closeSubMenu(li);
      });
    });
  }

  // Close open dropdown when pressing escape
  Array.prototype.forEach.call(items, (li: Element) => {
    (li as HTMLElement).addEventListener('keydown', (keydownEvent: KeyboardEvent) => {
      if (keydownEvent.key === 'Escape') {
        closeSubMenu(li);
      }
    });
  });

  // Close other dropdowns when opening a new one
  Array.prototype.forEach.call(items, (li: Element) => {
    // Bail if no dropdown
    if (!li || !li.classList.contains('menu-item-has-children')) {
      return;
    }

    const dropdownToggle = li.querySelector('.dropdown-toggle') as HTMLElement | null;
    const sameLevelDropdowns = li.parentNode?.querySelectorAll(':scope > .menu-item-has-children');

    // Add event listener to dropdown toggle
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', () => {
        // We want to close other dropdowns only when a new one is opened
        if (!dropdownToggle.classList.contains('toggled-on')) {
          return;
        }

        Array.prototype.forEach.call(sameLevelDropdowns, (sameLevelDropdown: Element) => {
          if (sameLevelDropdown !== li) {
            // Close all other sub-level dropdowns
            const subMenuItems = sameLevelDropdown.querySelectorAll('.menu-item');
            Array.prototype.forEach.call(subMenuItems, (subLi: Element) => {
              closeSubMenu(subLi);
            });
            // Close other same-level dropdowns
            closeSubMenu(sameLevelDropdown);
          }
        });
      });
    }
  });
}

export default closeSubMenuHandler;
