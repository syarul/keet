import { useState } from 'hookuspocus/src/use_state'
// import { useEffect } from 'hookuspocus/src/use_effect'

function Child(props){ 
  const { foobar } = props

  let [count, setCount] = useState(1)

  const click = e => {
    count++
    setCount(count)
  }

  return (
    <div>
      <button onClick={click}>count : {count}</button>
      <div id='2'>Current state is: {foobar}</div>
    </div>
  )
}

function App(props) {

  const { todo } = props

  let [foobar, setFoobar] = useState(5)

  const click = e => {
    foobar++
    setFoobar(foobar)
  }

  return (
    <div>
      <button onClick={click}>
        count: {foobar}
      </button>
      <p>sub hook</p>
      <Child foobar={foobar}/>
    </div>
  )
}

export default App
