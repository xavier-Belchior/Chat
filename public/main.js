const socket = io()
const clientesTotal = document.getElementById("clients-total")

const messageContainer = document.getElementById("message-container")
const nameInput = document.getElementById("name-input")
const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input")

const messageAudio = new Audio("/music.mp3")

messageForm.addEventListener("submit", (event) => {
  event.preventDefault()
  sendMessage()
})
socket.on("clients-total", (data) => {
  clientesTotal.innerText = `Total clients : ${data}`
})
/*function to send message and one object:data where i put all the my data of the chat*/
function sendMessage() {
  if (messageInput.value === "") return
  console.log(messageInput.value)
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  }
  socket.emit("message", data)
  addMessage(true, data)
  messageInput.value = ""
}
/*Take all of the message sending in chat, if one client send message all the clients reseiving */
socket.on("chat-message", (data) => {
  // console.log(data)
  messageAudio.play()
  addMessage(false, data)
})

/*adding message if is true, and i create element */
function addMessage(isOwnMessage, data) {
  clearFeedback()
  const element = `
   <li class="${isOwnMessage ? "message-left" : "message-right"} ">
          <p class="message">
            ${data.message}
            <span>${data.name} ◽ ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>
  `
  messageContainer.innerHTML += element
  scrollBottom()
}
function scrollBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}
/*when will be with focus this will apeard this text*/
messageInput.addEventListener("focus", (event) => {
  socket.emit("feedback", {
    feedback: `✍🏻 ${nameInput.value}is typing a message`,
  })
})
/*when of the user will be typing will appear this text*/
messageInput.addEventListener("keypress", (event) => {
  socket.emit("feedback", {
    feedback: `✍🏻 ${nameInput.value} is typing a message`,
  })
})
/*when will not be with focus,will desipear the text*/
messageInput.addEventListener("blur", (event) => {
  socket.emit("feedback", {
    feedback: "",
  })
})

/*create element feedback to puch in my html*/
socket.on("feedback", (data) => {
  clearFeedback()
  const element = `
     <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `
  messageContainer.innerHTML += element
})
function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element)
  })
}
