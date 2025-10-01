const mongoose = require('mongoose');
const User = require('./models/UserSchema')


const { server, io, app } = require('./socket/socket.js');

// routes
const zapisnikRoute = require('./routes/ZapisnikRouter')
const procjenaRoute = require('./routes/ProcjenaRouter')
const taskRoute = require('./routes/TaskRouter')
const korisnikRoute = require('./routes/UserRouter')
const authRoute = require('./routes/AuthenticationRouter')
const adminRoute = require('./routes/AdministratorRoutes')
const voziloUpripremiRoute = require('./routes/ProcesiNaVoziluRoutes')
const messagesRoute = require('./routes/MessagesRoutes')


mongoose.connect('mongodb+srv://davidobradovic:davidobr003@arenamotorsbackend.qpuhemf.mongodb.net/?retryWrites=true&w=majority', {
    dbName: 'arenabackend',
})

app.use('/zapisnici/', zapisnikRoute)
app.use('/procjene/', procjenaRoute)
app.use('/zadaci/', taskRoute)
app.use('/korisnici/', korisnikRoute)
app.use('/authentication/', authRoute)
app.use('/administration/', adminRoute)
app.use('/vozilo-u-pripremi/', voziloUpripremiRoute)
app.use('/chats', messagesRoute)



server.listen(3001, () => {
    console.log('Server je pokrenut na portu: 3001')
})