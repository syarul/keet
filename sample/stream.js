// must run server for the test to work

const str = require('string-to-stream')
const Keet = require('../')
const fetchStream = require('../fetchStream')
const vpipe = require('../vpipe')

var log = console.log.bind(console)

class App extends Keet {
  constructor() {
    super()
  }

  _clickHandler(){
  	log('I\'m clicked')
  }

  componentDidMount(){
	log('mounted')
  }

}

const app = new App

const fetchObj = new fetchStream

const run = new vpipe(app)

str('./obj.json').pipe(fetchObj).pipe(run)
