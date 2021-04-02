/**
 * QuerySelector
 * https://sebastiandedeyne.com/javascript-framework-diet/selecting-elements-part-1/
 */
export function $(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * QuerySelector
 * https://sebastiandedeyne.com/javascript-framework-diet/selecting-elements-part-1/
 */
export function $$(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}

/**
 * EventDelegation Listener
 * https://sebastiandedeyne.com/javascript-framework-diet/event-delegation/
 */
export function listen(type, selector, callback) {
  document.addEventListener(type, (event) => {
    const target = event.target.closest(selector);

    if (target) {
      callback(event, target);
    }
  });
}

/**
 * @description Key code constants
 */
// export const keyCode = {
//   BACKSPACE: 8,
//   TAB: 9,
//   RETURN: 13,
//   SHIFT: 16,
//   ESC: 27,
//   SPACE: 32,
//   PAGE_UP: 33,
//   PAGE_DOWN: 34,
//   END: 35,
//   HOME: 36,
//   LEFT: 37,
//   UP: 38,
//   RIGHT: 39,
//   DOWN: 40,
//   DELETE: 46,
// };

// export function matches(element, selector) {
//   return element.matches(selector);
// }

// export function remove(item) {
//   if (item.remove && typeof item.remove === 'function') {
//     return item.remove();
//   }

//   if (item.parentNode && item.parentNode.removeChild && typeof item.parentNode.removeChild === 'function') {
//     return item.parentNode.removeChild(item);
//   }

//   return false;
// }

// export function isFocusable(element) {
//   if (element.tabIndex < 0) {
//     return false;
//   }

//   if (element.disabled) {
//     return false;
//   }

//   switch (element.nodeName) {
//     case 'A':
//       return !!element.href && element.rel !== 'ignore';

//     case 'INPUT':
//       return element.type !== 'hidden';

//     case 'BUTTON':
//     case 'SELECT':
//     case 'TEXTAREA':
//       return true;

//     default:
//       return false;
//   }
// }

// export function getAncestorBySelector(element, selector) {
//   if (!matches(element, `${selector} ${element.tagName}`)) {
//     // Element is not inside an element that matches selector
//     return null;
//   }

//   // Move up the DOM tree until a parent matching the selector is found
//   let currentNode = element;
//   let ancestor = null;
//   while (ancestor === null) {
//     if (matches(currentNode.parentNode, selector)) {
//       ancestor = currentNode.parentNode;
//     } else {
//       currentNode = currentNode.parentNode;
//     }
//   }

//   return ancestor;
// }

// export function hasClass(element, className) {
//   return element.classList.contains(className);
// }

// export function addClass(element, className) {
//   if (!hasClass(element, className)) {
//     element.classlist.addClass(className);
//   }
// }

// export function removeClass(element, className) {
//   element.classList.removeClass(className);
// }

// export function bindMethods(object, ...methodNames) {
//   methodNames.forEach((method) => {
//     // eslint-disable-next-line no-param-reassign
//     object[method] = object[method].bind(object);
//   });
// }
