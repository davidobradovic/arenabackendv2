
// models/Chat.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true },
    attachments: [{
        type: { type: String },
        url: String,
        name: String,
        size: Number
    }],
    timestamp: { type: Date, default: Date.now },
    isSystemMessage: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false }
});

const chatSchema = new mongoose.Schema({
    vin: { type: String, required: true, index: true },
    vozilo: { type: String, required: false },
    subject: { type: String, required: true },
    participants: [{
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        role: {
            type: String,
            enum: ['prodavac', 'admin', 'korisnik', 'serviser'],
            required: true
        }
    }],
    messages: [messageSchema],
    status: {
        type: String,
        enum: ['active', 'closed', 'archived'],
        default: 'active',
        index: true
    },
    lastMessageAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    closedAt: { type: Date }
});

// Compound index za brže pretrage
chatSchema.index({ vin: 1, status: 1 });
chatSchema.index({ 'participants.userId': 1, status: 1 });
chatSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);