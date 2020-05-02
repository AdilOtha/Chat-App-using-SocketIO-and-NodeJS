const socket = io()

//elements
const $button = document.querySelector('button')
const $locationBtn = document.querySelector('#locationBtn')
const $msgInput = document.querySelector('input')
const $messages = document.querySelector('#messages')

//templates
const msgTemplate = document.getElementById('msgs-template').innerHTML
const locTemplate = document.querySelector('#locationMsgs-template').innerHTML
const sbtemplate = document.getElementById('sidebar-template').innerHTML

//parsing query string
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

//autoscroll method
const autoscroll =()=>{
    //calculating height of every new msg dynamically
    const $newMsg=$messages.lastElementChild
    const newMsgStyles=getComputedStyle($newMsg)
    const newMsgMargin=parseInt(newMsgStyles.marginBottom)
    // console.log($newMsg)
    // console.log(newMsgStyles)
    // console.log(newMsgStyles.marginBottom)
    const newMsgHeight= $newMsg.offsetHeight+newMsgMargin

    //visible height
    const visibleHeight=$messages.offsetHeight

    //total height of msgs container
    const containerHeight = $messages.scrollHeight

    //height from bottom of scrollbar to the top or how far have I scrolled
    //scrollTop gives height from the top most position to top of scroll bar
    //as scrollBottom is not available
    const scrollOffset = $messages.scrollTop + visibleHeight
    //console.log(scrollOffset)//gives float value so convert to int by Math.ceil

    //checking or scroll length before every new msg has arrived
    //if scrolled at the bottom then change scroll height
    if(Math.ceil(scrollOffset)>=(containerHeight-newMsgHeight)){
        //changing our current scroll length to new total height of container
        //console.log("******")
        $messages.scrollTop=$messages.scrollHeight
    }
}

socket.on('message', (msg) => {
    console.log(msg)
    //compile html
    const html = Mustache.render(msgTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format("h:mm a")
    })
    //add html to $messages
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMsg', (msg) => {
    console.log(msg)
    const html = Mustache.render(locTemplate, {
        username: msg.username,
        message: msg.url,
        createdAt: moment(msg.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()

    //disable button after form submit
    $button.setAttribute('disabled', 'disabled')

    let msg = e.target.elements.inputMsg.value;

    socket.emit('sendMessage', msg, (serverMsg) => {
        //enable button after ack
        $button.removeAttribute('disabled')
        $msgInput.value = ""
        $msgInput.focus()
        console.log(">>Message Delivered<<", serverMsg)
    })
})

$locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("Your Browser does not support Geolocation!")
    }

    $locationBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $locationBtn.removeAttribute('disabled')
            console.log(">>Location Sent<<")
        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href="/"
    }
})

socket.on('roomData',({room,users})=>{
    const html= Mustache.render(sbtemplate,{
        room,
        users
    })
    document.querySelector(".chat__sidebar").innerHTML=html
})