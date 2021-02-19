import "alpinejs"

import "./index.css"
import { $id, listen } from "./utils"

// eslint-disable-next-line no-unused-vars
const openDialog = (dialogId, focusAfterClosed, focusFirst) => {
  const dialogNode = $id(dialogId)

  if (dialogNode === null) {
    console.error(`No element found with id: ${dialogId} `)
    return
  }

  // eslint-disable-next-line no-unused-vars
  const validRoles = ["dialog", "alertdialog"]

  const isDialog = dialogNode.getAttribute("role")
  console.log("%c isDialog", "color: #d90000", isDialog)
  console.log("%c focusAfterClosed", "color: #1d5673", focusAfterClosed)
}

listen("click", "button", (e, button) => {
  const buttonId = button.getAttribute("id")

  if (buttonId === null) {
    console.error("No element found with button id to open a dialog")
    return
  }

  const [dialogId] = buttonId.split("-")
  openDialog(dialogId, button)
})
