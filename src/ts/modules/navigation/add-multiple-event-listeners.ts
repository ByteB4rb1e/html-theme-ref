// Event listener helper function
function addMultipleEventListeners(
    element: HTMLElement | null,
    events: string[],
    handler: EventListenerOrEventListenerObject
) {
  if (element) {

    events.forEach(function(e) {
      element.addEventListener(e, handler);
    });
  }
}

export default addMultipleEventListeners;
