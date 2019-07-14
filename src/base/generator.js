import keet from '../'

let timer = null

const batch = (fn, delay) => {
    clearTimeout(timer)
    timer = setTimeout(fn, delay)
}

export default async() => batch(keet.pub.bind(keet, 'event-hooks'), 1)