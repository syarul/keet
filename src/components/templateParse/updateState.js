export default function (state, updateStateList) {
  if (typeof updateStateList === 'function') updateStateList(state)
}
