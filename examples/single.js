import { useState } from 'hookuspocus/src/use_state'
import { pocus } from 'hookuspocus/src/core'
import { onStateChanged } from 'hookuspocus/src/on'

let i = 0

function App(props) {
  const { todo } = props
  const [foobar, setFoobar] = useState('foo')
  i++
  console.log(`${todo} ${i} times! state is ${foobar}`)
  const click = e => {
    setFoobar(foobar === 'foo' ? 'bar' : 'foo')
  }

  return (
    <div>
      <button onClick={click}>
        {todo}: {foobar}
      </button>
    </div>
  )
}
// let out 
// onStateChanged(context => {
//   out = pocus([{ todo: 'click after'}], App)
// })
// out = pocus([{ todo: 'click init'}], App)
// out.children[0].attributes.onClick()
// out.children[0].attributes.onClick()
// out.children[0].attributes.onClick()

export default App
