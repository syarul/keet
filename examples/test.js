// import { fidibus, pocus, useEffect } from "hookuspocus"
import { setState, useState } from '../src-bare/walk'

// const Child = props => (<div id='2' {...props}>child</div>)

function withHooks() {
  const [count, setCount] = useState(0);
  console.log(`function called ${count} times`);
  setCount(count + 1);
  return 'foo' + count
}

// pocus(withHooks); // function called 0 times
// pocus(withHooks); // function called 1 times
// let f =  pocus(withHooks); // function called 2 times
// console.log(f)

function App(props) {

  let count = useState(0)

  const click = e => {
    count += 1
    console.log(count)
    setState(count)
  }

  return (
    <button onClick={click}>
      count: {count}
    </button>
  )
}

/*const App = fidibus((props) => {
  const [count, setCount] = useState(0);
  console.log(`${props} #${count}!`);
  setCount(count + 1);

  // let count = 1

  const click = e => {
    // count += 1
    console.log(count)
    setCount(count + 1)
    setState(null)
  }

  return (
    <div onClick={click}>
      count: {count}
    </div>
  )

})*/

export default App
