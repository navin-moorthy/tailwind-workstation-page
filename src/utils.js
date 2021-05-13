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

export function hasClass(element, className) {
  return element.classList.contains(className);
}

export function addClass(element, className) {
  if (!hasClass(element, className)) {
    element.classList.add(className);
  }
}

export function addClasses(element, classNames) {
  element.classList.add(...classNames);
}

export function removeClass(element, className) {
  element.classList.remove(className);
}

export function removeClasses(element, classNames) {
  element.classList.remove(...classNames);
}

// Transition Enter / Transition Leave Animation
// https://sebastiandedeyne.com/javascript-framework-diet/enter-leave-transitions/
function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

function afterTransition(element) {
  return new Promise((resolve) => {
    const duration =
      Number(getComputedStyle(element).transitionDuration.replace('s', '')) *
      1000;

    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export const enterTransition = async (element, classes) => {
  const { enterClass, enterStartClass, enterEndClass } = classes;
  removeClass(element, 'hidden');

  addClasses(element, enterClass);
  addClasses(element, enterStartClass);

  await nextFrame();

  removeClasses(element, enterStartClass);
  addClasses(element, enterEndClass);

  await afterTransition(element);

  removeClasses(element, enterEndClass);
  removeClasses(element, enterClass);
};

export async function leaveTransition(element, classes) {
  const { leaveClass, leaveStartClass, leaveEndClass } = classes;

  addClasses(element, leaveClass);
  addClasses(element, leaveStartClass);

  await nextFrame();

  removeClasses(element, leaveStartClass);
  addClasses(element, leaveEndClass);

  await afterTransition(element);

  removeClasses(element, leaveEndClass);
  removeClasses(element, leaveClass);
  addClass(element, 'hidden');
}

/**
 * @description Key code constants
 */
export const keyCode = {
  BACKSPACE: 8,
  TAB: 9,
  RETURN: 13,
  SHIFT: 16,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46,
};

export function isFocusable(element) {
  if (element.tabIndex < 0) {
    return false;
  }

  if (element.disabled) {
    return false;
  }

  switch (element.nodeName) {
    case 'A':
      return !!element.href && element.rel !== 'ignore';

    case 'INPUT':
      return element.type !== 'hidden';

    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true;

    default:
      return false;
  }
}

export function remove(item) {
  if (item.remove && typeof item.remove === 'function') {
    return item.remove();
  }

  if (
    item.parentNode &&
    item.parentNode.removeChild &&
    typeof item.parentNode.removeChild === 'function'
  ) {
    return item.parentNode.removeChild(item);
  }

  return false;
}

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

// export function bindMethods(object, ...methodNames) {
//   methodNames.forEach((method) => {
//     // eslint-disable-next-line no-param-reassign
//     object[method] = object[method].bind(object);
//   });
// }
