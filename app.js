// Criando nossa api, para ouver comunicação entre servidor
const express = require("express")
/*executando o express um framework*/
const path = require("path")
const { Socket } = require("socket.io")
const app = express()
// criando a nossa porta
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`Server on port${PORT}`))
const io = require("socket.io")(server)
/*pegando todos os meus arquivos estaticos da pasta public para rodar no meu server*/
app.use(express.static(path.join(__dirname, "public")))
/*Criado uma variavel onde ira imcorporar todos os socket.id ou total de clientes*/
const socketsConnected = new Set()

/*connecting socket.io on aplication*/
io.on("connection", onConnection)
function onConnection(socket) {
  console.log(socket.id)
  socketsConnected.add(socket.id)

  /*Number total of the clients*/
  io.emit("clients-total", socketsConnected.size)
  /*Delete all socket id desconneted*/
  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id)
    socketsConnected.delete(socket.id)
    io.emit("clients-total", socketsConnected.size)
  })
  /*when one client send one message less heself*/
  socket.on("message", (data) => {
    console.log(data)
    /*this code send message in all clients less he*/
    socket.broadcast.emit("chat-message", data)
  })

  /*when the user will be typing will appear one text/  and this code i puch to my or send to my chat or clients */
  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data)
  })
}
