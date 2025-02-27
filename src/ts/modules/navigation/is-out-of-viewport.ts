// Check if an element is out of the viewport
// eslint-disable-next-line func-names
const isOutOfViewport = function (elem: HTMLElement): { top: boolean; left: boolean; bottom: boolean; right: boolean; any: boolean } {
  // Get element's bounding
  const bounding = elem.getBoundingClientRect();

  // Check if it's out of the viewport on each side
  const out: { top: boolean; left: boolean; bottom: boolean; right: boolean; any: boolean } = {
    top: bounding.top < 0,
    left: bounding.left < 0,
    bottom: bounding.bottom >= (document.documentElement.clientHeight || document.body.clientHeight),
    right: bounding.right >= (document.documentElement.clientWidth || document.body.clientWidth),
    any: false
  };

  out.any = out.top || out.left || out.bottom || out.right;

  return out;
};

export default isOutOfViewport;
