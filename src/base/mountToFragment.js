import clear from './clear'

export default function (frag, base) {
  let tempDiv = document.createElement('div')
  tempDiv.innerHTML = base
  clear(tempDiv.firstChild)
  while (tempDiv.firstChild) {
    frag.appendChild(tempDiv.firstChild)
  }
}
