const Child = props => (<div id='2' {...props}>child</div>)

function App(props) {
  return (
    <div id='1' {...props}>
      <Child foo='foo' />
    </div>
  )
}

export default App
