import { useState } from 'hookuspocus/src/use_state'
// import { useEffect } from 'hookuspocus/src/use_effect'

function Child(props){ 
  const { count } = props

  const [v, setV] = useState('foo')

  const click = e => {
    setV(v === 'foo' ? 'bar': 'foo')
  }

  return (
    <div>
      <button onClick={click}>test : {v}</button>
      <div id='2'>Current count is: {count}</div>
    </div>
  )
}

function App(props) {

  const { todo } = props

  let [count, setCount] = useState(0)

  const click = e => {
    count += 1
    setCount(count)
  }

  return (
    <div>
      <button onClick={click}>
        {todo}: {count}
      </button>
      <p>me</p>
      <Child count={count}/>
    </div>
  )
}

export default App
