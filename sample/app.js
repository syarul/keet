let data = [{
  id: 0,
  index: 'home',
  url: '/home',
  data: {
    title: 'The homepage',
    desc: 'Welcome to our spectacular web page with nothing special here.',
    link: 'Contact us'
  }
}, {
  id: 1,
  index: 'about',
  url: '/about',
  data: {
    title: 'Read more about us',
    desc: 'This is the page where we describe ourselves.',
    link: 'Contact us'
  }
}, {
  id: 2,
  index: 'resource',
  url: '/resource',
  data: {
    title: 'Resources',
    desc: 'For more info visit <a href="https://github.com/syarul/Keet">https://github.com/syarul/Keet</a>',
    link: 'Contact us'
  }
}, {
  id: 3,
  index: 'noroute',
  url: '/noroute',
  data: {
    title: '404 Page does not exist',
    desc: 'This is the landing page when route is not found.',
    link: 'Contact us'
  }
}]
let _data = data.map(x => x)
_data.pop()

const keet = () => new Keet(true)
const tag = keet().tag // helper function, write element without writing brackets
const cat = keet().cat // helper function to concat string, function() { return [].slice.call(arguments).join('') }

const model = {}  //object container for the all the components

const component = ['app', 'menu', 'view', 'container']

component.map(c => model[c] = keet())

model.app
  .link('app', cat(tag('img', null, {src: './res/k.jpg'}), tag('h1', 'Keet.js'), '{{model.menu}}{{model.view}}'))
  .set({
    'css-text-align': 'center',
    'css-margin-top': '20px'
  })

model.menu.template('ul', 'menu')
  .array(
    _data,
    tag(
      'li',
      tag(
        'a',
        '{{index}}', 
        {
          href: '#{{url}}',
          onclick: 'updateView({{id}})'
        }
      ),
      null, {
        padding: '0 10px 0 10px'
      }
    )
  )
  .set({
    'css-list-style-type': 'none',
    'css-display': 'inline-flex',
    'css-cursor': 'pointer',
    'css-margin': 0,
    'css-padding': 0
  })

model.view
  .template('div', 'view')
  .set({
    value: '{{model.container}}',
    'css-padding-top': '20px'
  })

model.app.compose()

const isHomePage = window.location.href.match('#')
const url = window.location.href.split('#')[1]
const idx = data.map(d => d.url).indexOf(url)
const redirect = isHomePage ? idx : 0

// show data base on url, if it does not found the hashbang return to homepage else return 404 page
model.container
  .register('model.view')
  .set(getData(redirect))

function getData(index){
  let d = index === -1 ? data[3].data : data[index].data
  let str = `<div>
              <h2>${d.title}</h2>
              <p>${d.desc}</p>
              <i><a href="mailto:hottincup@gmail.com">${d.link}</a></i>
            </div>`
  return str
}

// update page on user clicking menu link
function updateView(index){
  model.container.set(getData(index))
}

// // if user click back/foward, update the page as well
window.onpopstate = () => {
  let url = document.location.href.split('#')[1]
  let idx = data.map(x => x.url).indexOf(url)
  model.container.set(getData(idx))
}