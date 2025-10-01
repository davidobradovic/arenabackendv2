const express = require('express')
const app = express()
const cors = require('cors');
const http = require('http')
const { Server } = require("socket.io")
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.json())
app.use(cors());
const nodemailer = require("nodemailer");
const Korisnik = require("../models/UserSchema")
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

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
<a href="https://panel.arenabackend.org" class="webbutton" >POGLEDAJTE ZADATAK</a>
</div>

</body>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

io.on("connection", (socket) => {
    console.log(`User connect: ${socket.id}`)
async function sendPushNotificationToAllUsers(notification) {
    try {
        // Find all users
            const users = await Korisnik.find({
                role: "administrator"
            });

        // Iterate over each user
        for (const user of users) {
            const pushToken = user.pushNotification;

            // Check if it's an Expo push token
            if (Expo.isExpoPushToken(pushToken)) {
                // Construct the Expo push notification
                let expoNotification = {
                    to: pushToken,
                    ...notification
                };

                await expo.sendPushNotificationsAsync([expoNotification]);
            } else {
                // Send the notification using FCM
                await fetch('https://fcm.googleapis.com/fcm/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `key=AAAAOROma9I:APA91bFuJfV-kNwskSv9gzfWWwIOe5Z8mG_VWQOvsYW8ngWO6Kx0ZC80_ZyOwETYJVoqXU7DWRfbwJJPam_SlT6w5lu_hZ_zokpa4pCA7clCcHSb6YUhYLMh_6uivdOg7f5DvL78LFcf`, // Replace <FCM-SERVER-KEY> with your actual FCM server key
                    },
                    body: JSON.stringify({
                        to: pushToken,
                        priority: 'high',
                        notification: {
                            title: notification.title,
                            body: notification.body
                        },
                        data: {
                            experienceId: '@dakilimaster/ArenaTeams',
                            scopeKey: '@dakilimaster/ArenaTeams'
                        },
                    }),
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
}

    // Event listeners
    socket.on('dodaniKorisnici', (msg) => {
        io.emit('dodaniKorisnici', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'Novi korisnik dodan',
            body: 'Novi korisnik je dodan u sistem.'
        });
    });

    socket.on('prihvacenaProcjena', (msg) => {
        console.log(msg);
        io.emit('prihvacenaProcjena', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'Procjena prihvaćena',
            body: 'Vaša procjena je prihvaćena.'
        });
    });

    socket.on('odbijenaProcjena', (msg) => {
        console.log(msg);
        io.emit('odbijenaProcjena', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'Procjena odbijena',
            body: 'Vaša procjena je odbijena.'
        });
    });

    socket.on('novaProcjena', (msg) => {
        console.log(msg);
        io.emit('novaProcjena', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'Nova procjena',
            body: 'Nova procjena je dodana.'
        });
    });

    socket.on('finishedTask', (msg) => {
        console.log(msg);
        io.emit('finishedTask', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'ArenaTeams - Zadatak završen',
            body: msg
        });
    });

    socket.on('kreiranNoviZapisnik', (msg) => {
        console.log(msg);
        io.emit('kreiranNoviZapisnik', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'Novi zapisnik kreiran',
            body: 'Novi zapisnik je kreiran.'
        });
    });

    socket.on('kreiranNoviZapisnik', (msg) => {
        console.log(msg);
        io.emit('kreiranNoviZapisnik', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'Novi zapisnik kreiran',
            body: 'Novi zapisnik je kreiran.'
        });
    });

    socket.on('arzuriranaProcjena', (msg) => {
        console.log(msg);
        io.emit('arzuriranaProcjena', msg);
    });

    socket.on('novoObavjestenje', (msg) => {
        console.log(msg);
        io.emit('novoObavjestenje', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'Arena Obavjestenje',
            body: `Obavjest: ${msg}`
        });
    });

    socket.on('dodatPosjetnik', (msg) => {
        console.log(msg);
        io.emit('dodatPosjetnik', msg);
    });

    socket.on('obrisanZadatak', (msg) => {
        console.log(msg);
        io.emit('obrisanZadatak', msg);
    });


    socket.on('arzuriranZadatak', (msg) => {
        console.log(msg);
        io.emit('arzuriranZadatak', msg);
    });


    socket.on('dodatRokZadatka', (msg) => {
        console.log(msg);
        io.emit('dodatRokZadatka', msg);
    });

    socket.on('pocniteSaIspunjavanjem', async (msg) => {
        try {
            const userId = msg.toString();
            const user = await Korisnik.findById(msg.toString());

            if (!user) {
                console.error(`User with ID ${msg} not found`);
                return;
            }

            console.log(user);

            const pushToken = user.pushNotification;

            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Invalid Expo push token for user ${userId}`);
                return;
            }

            // Construct the push notification message
            const notification = {
                to: pushToken,
                sound: 'default',
                title: 'ArenaTeams',
                body: 'Administrator Vas je upozorio da krenete sa ispunjavanjem zadataka!',
                data: { /* Any additional data you want to send */ },
            };

            // Send the push notification
            await expo.sendPushNotificationsAsync([notification]);

            console.log('Notifikacija poslata');

            // Emit the event after the asynchronous operations are done
            io.emit('pocniteSaIspunjavanjem', msg);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('kreiranoPoliranje', (msg) => {
        console.log(msg);
        io.emit('kreiranoPoliranje', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'Arena Obavjestenje',
            body: `Dodato je novo poliranje`
        });
    });


    socket.on('kreiranServis', (msg) => {
        console.log(msg);
        io.emit('kreiranServis', msg);
        sendPushNotificationToAllUsers({
            sound: 'default',
            title: 'Arena Obavjestenje',
            body: `Kreiran servis za vozilo: ${msg}`
        });
    });

    
socket.on('zatraziOnlineProvjeru', async (msg) => {
    try {
        const user = await Korisnik.findOne({
            email: "info@arenamotors.ba"
        });

        if (!user) {
            console.error(`User with email "david@arenamotors.ba" not found`);
            return;
        }

        console.log(user);

        const pushToken = user.pushNotification;

        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Invalid Expo push token for user ${user._id}`);
            return;
        }

        // Construct the push notification message
        const notification = {
            to: pushToken,
            sound: 'default',
            title: 'ArenaTeams',
            body: `Zatražena je online provjera za vozilo: ${msg}!`,
            data: { /* Any additional data you want to send */ },
        };

        // Send the push notification
        await expo.sendPushNotificationsAsync([notification]);

        console.log('Notifikacija poslata');

        // Emit the event after the asynchronous operations are done
        io.emit('zatraziOnlineProvjeru', msg);
    } catch (error) {
        console.error(error);
    }
});


    socket.on('kreiranZadatak', async (msg) => {
        try {
            const userId = msg.toString();
            const user = await Korisnik.findById(msg.toString());

            if (!user) {
                console.error(`User with ID ${msg} not found`);
                return;
            }

            const pushToken = user.pushNotification;

            // Check if it's an Expo push token
            if (Expo.isExpoPushToken(pushToken)) {
                // Construct the Expo push notification
                let notification = {
                    to: pushToken,
                    sound: 'default',
                    title: 'Dobili ste novi zadatak',
                    body: 'Dobili ste novi zadatak. Molim Vas da ga obavite na vrijeme!',
                    data: { anyData: 'you want to send with the notification' }, // optional data payload
                };

                // Send the Expo push notification
                await expo.sendPushNotificationsAsync([notification]);
            } else {
                // Send the notification using FCM
                await fetch('https://fcm.googleapis.com/fcm/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `key=AAAAOROma9I:APA91bFuJfV-kNwskSv9gzfWWwIOe5Z8mG_VWQOvsYW8ngWO6Kx0ZC80_ZyOwETYJVoqXU7DWRfbwJJPam_SlT6w5lu_hZ_zokpa4pCA7clCcHSb6YUhYLMh_6uivdOg7f5DvL78LFcf`, // Replace <FCM-SERVER-KEY> with your actual FCM server key
                    },
                    body: JSON.stringify({
                        to: pushToken,
                        priority: 'high',
                        data: {
                            experienceId: '@dakilimaster/ArenaTeams',
                            scopeKey: '@dakilimaster/ArenaTeams',
                            title: "Dobili ste novi zadatak",
                            message: 'Dobili ste novi zadatak. Molim Vas da ga obavite na vrijeme!',
                        },
                    }),
                });
                console.log('Notifikacija poslata');
            }

            // Emit the event after the asynchronous operations are done
            io.emit('kreiranZadatak', msg);
        } catch (error) {
            console.error(error);
        }
    });
})
module.exports = { server, io, app }