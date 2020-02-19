import { useState } from 'hookuspocus/src/use_state'

let index = 0

function App(props) {

  const { todo } = props

  const [foobar, setFoobar] = useState('foo')
  const click = e => {
    // console.log(foobar, index % 2 === 0)
    setFoobar(index % 2 === 0 ? 'bar' : 'foo')
    index++
  }

  return (
    <div>
      <button onClick={click}>
        count: {foobar}
      </button>
    </div>
  )
}

export default App
