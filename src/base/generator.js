import diff from '../patcher/diff'

let timer = {}

const batch = function (fn, delay) {
  const i = this.guid
  timer[i] = timer[i] || null
  clearTimeout(timer[i])
  timer[i] = setTimeout(fn.bind(this), delay)
}

export default function () {
  batch.call(this, diff, 1)
}
