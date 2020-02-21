import { useState } from 'hookuspocus/src/use_state'
import { pocus } from 'hookuspocus/src/core'

let i = 0

let isBtn

function App(props) {

  const { todo } = props

  const [foobar, setFoobar] = useState('foo')

  console.log(`called ${foobar}`)
  const click = e => {
    // console.log(foobar, index % 2 === 0)
    setFoobar(foobar === 'foo' ? 'bar' : 'foo')
  }

  isBtn = document.getElementById('btn')
  console.log(isBtn)

  if(!isBtn) {
    const btn = document.createElement('button')
    btn.onclick = click
    btn.id = 'btn'
    document.body.appendChild(btn)
  }




}

pocus([{ todo: 'f'}], App)
// isBtn && isBtn.click()
pocus([{ todo: 'f'}], App)
// App.click()
pocus([{ todo: 'f'}], App)

export default function() {} // App
