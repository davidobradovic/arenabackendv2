const express = require('express')
const app = express()
const cors = require('cors');
const http = require('http')
const { Server } = require("socket.io")
app.use(express.json())
app.use(cors());
const nodemailer = require("nodemailer");
const Korisnik = require("../models/UserSchema")

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const transporter = nodemailer.createTransport({
    host: "mail.arenamotors.ba",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: "notifikacije@arenamotors.ba",
        pass: "NotifikacijeMail.123",
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});

async function zadatakaMail(mail) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Notifikacije ArenaMotors" <notifikacijearenamotors@gmail.com>', // sender address
        to: mail, // list of receivers
        subject: "Dobili ste novi zadatak", // Subject line
        text: "Dobili ste novi zadatak na ArenaMotors aplikaicji", // plain text body
        html: `<body>
<style>
    .container {
        width: 100vw;
        background-color: #fff;
        color: black;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .webbutton {
        margin-top: 50px;
        padding: 15px;
        background-color: #C93030;
        border: none;
        outline: none;
        color: 'white';
        border-radius: 5px;
    }
</style>

<div class="container">
<h3>Dobili ste novi zadatak</h3>
<p>Pogledajte zadataka</p>
<a href="http://localhost:3000" class="webbutton" >POGLEDAJTE ZADATAK</a>
</div>

</body>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

io.on("connection", (socket) => {
    console.log(`User connect: ${socket.id}`)
    socket.on('dodaniKorisnici', (msg) => {
        io.emit('dodaniKorisnici', msg);
    })
    socket.on('prihvacenaProcjena', (msg) => {
        console.log(msg)
        io.emit('prihvacenaProcjena', msg);
    })
    socket.on('odbijenaProcjena', (msg) => {
        console.log(msg)
        io.emit('odbijenaProcjena', msg);
    })
    socket.on('poslataPoruka', (msg) => {
        console.log(msg)
    })
    socket.on('novaProcjena', (msg) => {
        console.log(msg)
        io.emit('novaProcjena', msg);
    })
    socket.on('finishedTask', (msg) => {
        console.log(msg)
        io.emit('finishedTask', msg);
    })
    socket.on('kreiranNoviZapisnik', (msg) => {
        console.log(msg)
        io.emit('kreiranNoviZapisnik', msg);
    })
    
    // socket.on('kreiranZadatak', (msg) => {
    //     const user = Korisnik.findById(msg.toString());
    //     console.log(user)
    //     zadatakaMail(user.email).catch(console.error);
    //     io.emit('kreiranZadatak', msg);
    // })
    socket.on('kreiranZadatak', async (msg) => {
        try {
            const user = await Korisnik.findById(msg.toString());

            if (!user) {
                console.error(`User with ID ${msg} not found`);
                return;
            }

            // Assuming zadatakaMail is an asynchronous function, handle it with await
            await zadatakaMail(user.email);

            // Emit the event after the asynchronous operations are done
            io.emit('kreiranZadatak', msg);
        } catch (error) {
            console.error(error);
        }
    });

})
module.exports = { server, io, app } 