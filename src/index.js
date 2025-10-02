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
const Task = require("./models/TaskSchema")
const { Expo } = require('expo-server-sdk');
const vehicleOrderScheme = require("./routes/VehicleOrderRoutes")
const orderedVehiclesRoutes = require("./routes/OrderedVehicleRoutes")
const expo = new Expo();



async function sendNotification(expoToken, message) {
  try {
    await expo.sendPushNotificationsAsync([
      {
        to: expoToken,
        sound: 'default',
        title: 'Arena Podsjetnik',
        body: message
      }
    ]);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

async function sendNotificationDueDate(expoToken, message) {
  try {
    await expo.sendPushNotificationsAsync([
      {
        to: expoToken,
        sound: 'default',
        title: 'ArenaTeams',
        body: message
      }
    ]);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

async function checkAndSendReminders() {
  const currentTime = new Date();
  const tasks = await Task.find({ reminder: { $lte: currentTime } }).populate('users');
  tasks.forEach(async task => {
    // Provjera da li je vrijeme podsjetnika isto kao ili manje od trenutnog vremena,
    // i da li je razlika između trenutnog vremena i vremena podsjetnika manja ili jednaka jednoj minuti
    if (task.reminder.getTime() <= currentTime.getTime() && (currentTime.getTime() - task.reminder.getTime()) <= 60000) {
      await sendNotification(task.user.pushNotification, `Podsjetnik za zadatak: ${task.title}`);
      // Označavanje zadatka kao poslanog
      task.reminder = null; // Postavljamo reminder na null kako bismo označili da je poslan
      await task.save();
    }
  });
}

async function checkAndSendRemindersDueDate() {
  const currentTime = new Date();
  const tasks = await Task.find({ $or: [{ dueDate: { $lte: currentTime } }, { dueDate: currentTime }] }).populate('users');
  tasks.forEach(async task => {
    if (task.dueDate.getTime() <= currentTime.getTime()) {
      // await sendNotificationDueDate(task.user.pushNotification, `Isteklo vam je vrijeme za izradu zadatka: ${task.title}`);
      task.dueDate = null; // Set reminder to null to mark it as sent
      await task.save();
    }
  });
}




mongoose.connect('mongodb+srv://davidobradovic:davidobr003@arenamotorsbackend.qpuhemf.mongodb.net/?retryWrites=true&w=majority', {
    dbName: 'arenabackend',
}).then(() => {
    console.log('Connected to database');
    setInterval(() => {
       checkAndSendReminders();
       checkAndSendRemindersDueDate();
    }, 60000);
  })
  .catch(err => console.error('Error connecting to database:', err));

app.use('/zapisnici/', zapisnikRoute)
app.use('/procjene/', procjenaRoute)
app.use('/zadaci/', taskRoute)
app.use('/korisnici/', korisnikRoute)
app.use('/authentication/', authRoute)
app.use('/administration/', adminRoute)
app.use('/vozilo-u-pripremi/', voziloUpripremiRoute)
app.use('/chats', messagesRoute)

// novo
app.use('/api/vehicle-orders/', vehicleOrderScheme)
app.use('/api/ordered-vehicles', orderedVehiclesRoutes);



server.listen(3001, () => {
    console.log('Server je pokrenut na portu: 3001')
})