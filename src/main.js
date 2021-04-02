import './index.css';

import {
  $,
  $$,
  addClass,
  addClasses,
  enterTransition,
  hasClass,
  isFocusable,
  keyCode,
  leaveTransition,
  listen,
  remove,
  removeClass,
} from './utils';

const leaveTransitionClasses = {
  leaveClass: ['duration-150', 'ease-out'],
  leaveStartClass: ['opacity-100', 'scale-100'],
  leaveEndClass: ['opacity-0', 'scale-95'],
};

const enterTransitionClasses = {
  enterClass: ['duration-150', 'ease-out'],
  enterStartClass: ['opacity-0', 'scale-95'],
  enterEndClass: ['opacity-100', 'scale-100'],
};

//  Modals can open modals. Keep track of them with this array.
const openDialogList = [];

/*
 * When util functions move focus around, set this true so the focus listener
 * can ignore the events.
 */
let ignoreUtilFocusChanges = false;

/**
 * @returns {object} the last opened dialog (the current dialog)
 */
const getCurrentDialog = () => {
  if (!openDialogList && openDialogList.length === 0) return null;

  return openDialogList[openDialogList.length - 1];
};

const closeCurrentDialog = () => {
  const currentDialog = getCurrentDialog();

  if (currentDialog) {
    return true;
  }

  return false;
};

const handleEscape = (event) => {
  const key = event.which || event.keyCode;

  if (key === keyCode.ESC && closeCurrentDialog()) {
    event.stopPropagation();
  }
};

document.addEventListener('keyup', handleEscape);

const checkHasDialogRole = (node) => {
  const validRoles = ['dialog', 'alertdialog'];
  const dialogNodeRole = node.getAttribute('role') || '';

  return dialogNodeRole
    .trim()
    .split(/\s+/g)
    .some((token) => validRoles.some((role) => token === role));
};

const createDiv = () => document.createElement('div');

const clearDialog = (dialogNode) => {
  [...$$('input', dialogNode)].forEach((input) => {
    input.value = '';
  });
};

const attemptFocus = (element) => {
  if (!isFocusable(element)) return false;
  ignoreUtilFocusChanges = true;

  try {
    element.focus();
  } catch {
    // continue regardless of error
  }

  ignoreUtilFocusChanges = false;

  return document.activeElement === element;
};

/**
 * @description Set focus on descendant nodes until the first focusable element is
 *       found.
 * @param element
 *          DOM node for which to find the first focusable descendant.
 * @returns {boolean}
 *  true if a focusable element is found and focus is set.
 */
const focusFirstDescendant = (element) => {
  for (let i = 0; i < element.childNodes.length; i += 1) {
    const child = element.childNodes[i];

    if (attemptFocus(child) || focusFirstDescendant(child)) return true;
  }

  return false;
};

/**
 * @description Find the last descendant node that is focusable.
 * @param element
 *          DOM node for which to find the last focusable descendant.
 * @returns {boolean}
 *  true if a focusable element is found and focus is set.
 */
const focusLastDescendant = (element) => {
  for (let i = element.childNodes.length - 1; i >= 0; i -= 1) {
    const child = element.childNodes[i];

    if (attemptFocus(child) || focusLastDescendant(child)) return true;
  }

  return false;
};

const trapFocus = (event) => {
  if (ignoreUtilFocusChanges) return;
  const currentDialog = getCurrentDialog();

  if (currentDialog.contains(event.target)) {
    currentDialog.lastFocus = event.target;
  } else {
    focusFirstDescendant(currentDialog);
    if (currentDialog.lastFocus === document.activeElement) {
      focusLastDescendant(currentDialog);
    }
    currentDialog.lastFocus = document.activeElement;
  }
};

/**
 * @class
 * @description Dialog object providing modal focus management.
 * @see https://w3c.github.io/aria-practices/examples/dialog-modal/js/dialog.js
 *
 * Assumptions: The element serving as the dialog container is present in the
 * DOM and hidden. The dialog container has role='dialog'.
 *
 * @param dialogId
 *          The ID of the element serving as the dialog container.
 *
 * @param focusAfterClosed
 *          Either the DOM node or the ID of the DOM node to focus when the
 *          dialog closes.
 *
 * @param focusFirst
 *          Optional parameter containing either the DOM node or the ID of the
 *          DOM node to focus when the dialog opens. If not specified, the
 *          first focusable element in the dialog will receive focus.
 */
const openDialog = (dialogId, focusAfterClosed, focusFirst) => {
  const dialogNode = $(`#${dialogId}`);

  if (dialogNode == null) {
    console.error(`No element found with id: ${dialogId} `);
    return;
  }

  if (focusAfterClosed == null) {
    console.error(`No element found to focus on close`);
    return;
  }
  dialogNode.focusAfterClosed = focusAfterClosed;

  const isDialog = checkHasDialogRole(dialogNode);

  if (!isDialog) {
    console.error('openDialog() requires a DOM element with ARIA role of dialog or alertdialog.');
    return;
  }

  // Wrap in an individual backdrop element if one doesn't exist
  // Native <dialog> elements use the ::backdrop pseudo-element, which
  // works similarly.
  const dialogBackdropClass = `${dialogId}-backdrop`;

  if (hasClass(dialogNode.parentNode, dialogBackdropClass)) {
    dialogNode.dialogBackdropNode = dialogNode.parentNode;
  } else {
    dialogNode.dialogBackdropNode = createDiv();
    addClasses(dialogNode.dialogBackdropNode, [
      dialogBackdropClass,
      'hidden',
      'fixed',
      'overflow-y-auto',
      'inset-0',
      'bg-black',
      'bg-opacity-20',
    ]);
    dialogNode.parentNode.insertBefore(dialogNode.dialogBackdropNode, dialogNode);
    dialogNode.dialogBackdropNode.appendChild(dialogNode);
  }

  enterTransition(dialogNode.dialogBackdropNode, enterTransitionClasses);
  enterTransition(dialogNode, enterTransitionClasses);

  // Disable scroll on the body element
  addClass(document.body, 'overflow-hidden');

  // Bracket the dialog node with two invisible, focusable nodes.
  // While this dialog is open, we use these to make sure that focus never
  // leaves the document even if dialogNode is the first or last node.
  const prevDiv = createDiv();
  dialogNode.prevNode = dialogNode.parentNode.insertBefore(prevDiv, dialogNode);
  dialogNode.prevNode.tabIndex = 0;
  const postDiv = createDiv();
  dialogNode.postNode = dialogNode.parentNode.insertBefore(postDiv, dialogNode.nextSibling);
  dialogNode.postNode.tabIndex = 0;

  dialogNode.addFocusListener = () => document.addEventListener('focus', trapFocus, true);
  dialogNode.removeFocusListener = () => document.removeEventListener('focus', trapFocus, true);

  if (openDialogList.length > 0) {
    getCurrentDialog().removeFocusListener();
  }

  dialogNode.addFocusListener();
  openDialogList.push(dialogNode);
  clearDialog(dialogNode);

  if (focusFirst) {
    focusFirst.focus();
  } else {
    focusFirstDescendant(dialogNode);
  }

  dialogNode.lastFocus = document.activeElement;
};

/**
 * Open the dialog
 */
listen('click', '#dialog-button', (e, button) => {
  const buttonId = button.getAttribute('id');

  if (buttonId == null) {
    console.error(`No element found with ${buttonId} to open a dialog`);
    return;
  }

  const [dialogId] = buttonId.split('-');
  openDialog(dialogId, button);
});

/**
 * Open the dialog 2
 */
listen('click', '#dialog2-button', (e, button) => {
  const buttonId = button.getAttribute('id');

  if (buttonId == null) {
    console.error(`No element found with ${buttonId} to open a dialog`);
    return;
  }

  const [dialogId] = buttonId.split('-');
  openDialog(dialogId, button);
});

/**
 * @description
 *  Hides the current top dialog,
 *  removes listeners of the top dialog,
 *  restore listeners of a parent dialog if one was open under the one that just closed,
 *  and sets focus on the element specified for focusAfterClosed.
 */
const closeDialog = (dialogNode) => {
  openDialogList.pop();
  dialogNode.removeFocusListener();
  remove(dialogNode.prevNode);
  remove(dialogNode.postNode);

  leaveTransition(dialogNode.dialogBackdropNode, leaveTransitionClasses);
  leaveTransition(dialogNode, leaveTransitionClasses);

  dialogNode.focusAfterClosed.focus();

  if (openDialogList.length > 0) {
    getCurrentDialog().addFocusListener();
  } else {
    // Enable scroll on the body element
    removeClass(document.body, 'overflow-hidden');
  }
};

/**
 * Close the dialog
 */
listen('click', '#dialog-close-button', (e, button) => {
  const topDialog = getCurrentDialog();

  if (topDialog.contains(button)) {
    closeDialog(topDialog);
  }
});

/**
 * @description
 *  Hides the current dialog and replaces it with another.
 *
 * @param newDialogId
 *  ID of the dialog that will replace the currently open top dialog.
 * @param newFocusAfterClosed
 *  Optional ID or DOM node specifying where to place focus when the new dialog closes.
 *  If not specified, focus will be placed on the element specified by the dialog being replaced.
 * @param newFocusFirst
 *  Optional ID or DOM node specifying where to place focus in the new dialog when it opens.
 *  If not specified, the first focusable element will receive focus.
 */
const replaceDialog = (newDialogId, newFocusAfterClosed, newFocusFirst) => {
  const topDialog = getCurrentDialog();
  topDialog.removeFocusListener();
  topDialog.removeFocusListener();
  remove(topDialog.prevNode);
  remove(topDialog.postNode);

  leaveTransition(topDialog.dialogBackdropNode, leaveTransitionClasses);
  leaveTransition(topDialog, leaveTransitionClasses);

  const focusAfterClosed = newFocusAfterClosed || topDialog.focusAfterClosed;
  openDialogList.pop();
  openDialog(newDialogId, focusAfterClosed, newFocusFirst);
};

/**
 * Replace the dialog
 */
listen('click', '#dialog1-button', (e, button) => {
  const buttonId = button.getAttribute('id');

  if (buttonId == null) {
    console.error(`No element found with ${buttonId} to open a dialog`);
    return;
  }

  const [dialogId] = buttonId.split('-');
  replaceDialog(dialogId, button);
});
