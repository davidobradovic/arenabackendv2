const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Korisnik = require("../models/UserSchema");
const Sektor = require('../models/SektorSchema');
const Task = require('../models/TaskSchema')
const User = require('../models/UserSchema');
const Procjena = require('../models/ProcjenaSchema')
const { server, io } = require("../socket/socket");
const Message = require('../models/MessageScheme');
const Channel = require('../models/ChannelScheme');
const { v4: uuidv4 } = require('uuid');

router.get('/channels/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Query to find channels where userId is in the members array
        const response = await Channel.find({
            members: userId
        }).populate('messages');

        // Optionally, check if response is empty and handle accordingly
        if (response.length === 0) {
            return res.status(404).send("No channels found for the user.");
        }

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// router.get("/check-channel/:senderId/:receiverId", async (req, res) => {
//     try {
//         const { senderId, receiverId } = req.params;

//         // Check if a channel already exists between the sender and receiver
//         const existingChannel = await Channel.findOne({
//             members: {
//                 $all: [senderId, receiverId],
//             },
//         });

//         if (existingChannel) {
//             // If a channel exists, return the channel details
//             res.status(200).json({ message: 'Channel already exists', channel: existingChannel._id });
//         } else {
//             // If a channel doesn't exist, return an empty response
//             res.status(200).json({ message: 'Channel does not exist', channel: null });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// router.post("/create-channel/:senderId/:receiverId", async (req, res) => {
//     try {
//         const { senderId, receiverId } = req.params;

//         // Create a new channel
//         const newChannel = new Channel({
//             name: uuidv4().toString(), // Use provided name or generate a UUID
//         });

//         // Connect the sender to the channel
//         const sender = await Korisnik.findById(senderId);
//         const reciever = await Korisnik.findById(receiverId);
//         newChannel.members.push(sender);

//         // Connect the receiver (if available) to the channel
//         if (receiverId) {
//             const receiver = await Korisnik.findById(receiverId);
//             newChannel.members.push(receiver);
//         }

//         await newChannel.save();

//         // Connect the channel to the users
//         sender.channels.push(newChannel);
//         reciever.channels.push(newChannel);
//         if (receiverId) {
//             const receiver = await Korisnik.findById(receiverId);
//             receiver.channels.push(newChannel);
//             await receiver.save();
//         }

//         await sender.save();

//         res.status(200).json({ message: 'Kreiran novi kanal', channel: newChannel });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });




// router.post('/send-message/:receiverID/:senderID', async (req, res) => {
//     try {
//         const { content } = req.body;
//         const { receiverID, senderID } = req.params;

//         // Find the channel based on sender and receiver
//         const channel = await Channel.findOne({
//             members: { $all: [senderID, receiverID] },
//         });

//         if (!channel) {
//             return res.status(404).json({ message: 'Channel not found' });
//         }

//         // Create a new message
//         const newMessage = new Message({
//             content,
//             sender: senderID,
//             channel: channel._id,
//         });

//         await newMessage.save();

//         // Update the channel with the new message
//         await Channel.findByIdAndUpdate(
//             channel._id,
//             { $push: { messages: newMessage._id } },
//             { new: true }
//         );

//         res.status(200).json({ message: 'Message sent successfully', messageId: newMessage._id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });


module.exports = router;