const express = require("express")
const router = express.Router();

const path = require('path');
const Task = require("../models/TaskSchema")
const Korisnik = require("../models/UserSchema");
const Notifikacija = require("../models/NotificationsScheme")
const Sektor = require("../models/SektorSchema")
const { server, io } = require('../socket/socket');
const VoziloScheme = require("../models/VoziloScheme");

const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2
const multer = require('multer');
const TaskImages = require("../models/TaskImages");
const TaskFile = require("../models/TaskFileSchema");

cloudinary.config({
    cloud_name: 'dxo3z5off',
    api_key: '928131617372864',
    api_secret: '_IsnFVhqA43Bcpy2SKl7x8t60Bk'
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads')); // Ensure correct path
    },
    filename: function (req, file, cb) {
        cb(null, `${uuidv4()}-${file.originalname}`); // Use the original file name
    }
});

const upload = multer({ storage: storage });

router.get('/svi-zadaci', async (req, res) => {
    try {

        const user = await Task.find().populate('files');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/zadatak/:zadId', async (req, res) => {
    try {
	const { zadId } = req.params; 

        const user = await Task.findById(zadId).populate('files');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/app-postavi-zadatak/:sektor/:creator', upload.single('file'), async (req, res) => {
    try {
        const { title, description, taskJob, taskWorker, importantLever, users } = req.body;
        const { sektor, creator } = req.params;

        const usersToBeLinked = await Korisnik.find({
            '_id': { $in: users }
        });

        const validUserIds = usersToBeLinked.map(user => user._id);

        if (!validUserIds || validUserIds.length === 0) {
            return res.status(404).json({ error: 'Users not found' });
        }

        const task = new Task({
            title,
            description,
            users: validUserIds,
            sektor,
            taskJob,
            taskWorker,
            importantLever,
            creator
        });

        if (req.file) {
            const taskFile = new TaskFile({
                filename: req.file.filename,
                path: req.file.path,
                task: task._id
            });

            await taskFile.save();
            task.files = [taskFile._id]; // Assuming you have a field `files` in your Task model
        }

        await task.save();

        // Remaining code for notifications and saving users...

        res.status(201).json({ task });

    } catch (error) {
        console.error('Error creating tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.put('/app-edit-task/:taskId/:sektorId', async (req, res) => {
    try {
        const { title, description, importantLever, users } = req.body;
        const { taskId, sektorId } = req.params;

        console.log(req.params);
        console.log(req.body);

        const zadatak = await Task.findById(taskId);

        if (!zadatak) {
            return res.status(404).json({ error: 'Zadatak not found' });
        }

        // Update task fields
        zadatak.title = title;
        zadatak.description = description;
        zadatak.users = users; // Assuming users is an array of user IDs
        zadatak.sektor = sektorId;
        zadatak.importantLever = importantLever;

        // Assuming io is defined somewhere in your code
        io.emit('arzuriranZadatak', `${zadatak.title} has been updated`);

        await zadatak.save();

        // Assuming you want to return updated task with populated users field
        const updatedTask = await Task.findById(taskId).populate('users');

        res.status(200).json(updatedTask);

    } catch (error) {
        console.error('Error editing task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/postavi-zadatak-za-vozilo/:userId/:sektor/:voziloId', async (req, res) => {
    try {
        // Extract task details from the request body
        const { title, description, status } = req.body;
        const { userId, sektor, voziloId } = req.params;

        const user = await Korisnik.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const task = new Task({
            title,
            description,
            user: userId, // Assign the user's ObjectId to the task's user field
            status,
            sektor,
            vozilo: voziloId
        });

        if (!task) {
            return res.status(400).json({ error: 'GRESKA PRILIKOM KREIRANJA ZADATKA' });
        }

        const vozilo = await VoziloScheme.findById(voziloId);

        const notifikacija = new Notifikacija({
            title: `Dobili ste novi zadatak: ${title}`,
            description: description,
            user: userId,
        })

        user.tasks.push(task._id);
        user.notifications.push(notifikacija._id);
        vozilo.tasks.push(task._id);

        await user.save();
        await task.save();
        await vozilo.save();
        await notifikacija.save();

        io.emit('zadatak', { message: `Dobili ste novi zadatak`, user: userId });

        res.status(201).json(task);

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/zavrsi-zadatak/:zadatakId/:finishedById', async (req, res) => {
    try {
        const { zadatakId, finishedById } = req.params;

        const zadatak = await Task.findById(zadatakId);

        if (!zadatak) {
            return res.status(404).json({ error: 'Zadatak not found' });
        }

        zadatak.status = 'Završeno';
        zadatak.endedAt = new Date();
        zadatak.finishedBy = finishedById; // Assigning the finishedById to the finishedBy field

        await zadatak.save();

        io.emit('zadatak', { message: `Zadatak završen`, user: zadatak.user });

        res.status(201).json(zadatak);

    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/postavi-podsjetnik/:zadatakId', async (req, res) => {
  try {
	const { zadatakId } = req.params;
    	const { reminder } = req.body;

        const zadatak = await Task.findById(zadatakId);

        if (!zadatak) {
            return res.status(404).json({ error: 'Zadatak not found' });
        }

	zadatak.reminder = new Date(reminder);


	await zadatak.save();
        io.emit('dodatPosjetnik', { message: `Dodat posjetnik na zadatak`, user: zadatak.user });


    	res.json({ message: 'Uspijesno ste postavili podsjetnik' });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/postavi-rok-zadatka/:zadatakId', async (req, res) => {
  try {
	const { zadatakId } = req.params;
    	const { dueDate } = req.body;

        const zadatak = await Task.findById(zadatakId);

        if (!zadatak) {
            return res.status(404).json({ error: 'Zadatak not found' });
        }

	zadatak.dueDate = new Date(dueDate);


	await zadatak.save();
        io.emit('dodatRokZadatka', { message: `Dodat rok zadatka`, user: zadatak.user });


    	res.json({ message: 'Uspijesno ste postavili podsjetnik' });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/obrisi-zadatak/:zadatakId', async (req, res) => {
    try {

        const { zadatakId } = req.params;

        const zadatak = await Task.deleteOne({
            _id: zadatakId
        })

        if (!zadatak) {
            return res.status(404).json({ error: 'Zadatak not found' });
        }
        
        res.status(201).json(zadatak);

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})




module.exports = router
