const express = require("express");
const app = express();
const port = 3000;
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const path = require("path");

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection",(socket)=>{
    console.log("connected");

    socket.on("disconnect", ()=>{
        io.emit("user-disconnected",socket.id);
        console.log(`user ${socket.id} disconnected`)
    })

    socket.on("send-location", (data)=>{
        console.log(socket.id);
        io.emit("recieve-location",{id:socket.id,...data});
    })
})

app.get("/",(req,res)=>{
    res.render("index");
})


server.listen(port,()=>{
console.log(`Server is listening to ${port}`)
});