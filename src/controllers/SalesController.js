// // // controllers/salesController.js
// // const ZapisnikPrimopredaja = require('../models/ZapisnikSchema');
// // const Tasks = require('../models/TaskSchema');
// // const ProcjenaVozla = require('../models/ProcjenaSchema');
// // const Chat = require('../models/Chat');
// // const Korisnici = require('../models/UserSchema');

// // class SalesController {
// //     // Pretraga vozila po zadnjim ciframa VIN-a (sasija)
// //     async searchVehicleByVin(req, res) {
// //         try {
// //             const { vinPart } = req.params;

// //             if (!vinPart || vinPart.length < 4 || vinPart.length > 5) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'VIN dio mora biti 4 ili 5 cifara'
// //                 });
// //             }

// //             const vinRegex = new RegExp(vinPart, 'i');  // Ukloni $ sa kraja

// //             const [zapisnici, tasks, procjene] = await Promise.all([
// //                 ZapisnikPrimopredaja.find({ sasija: vinRegex })
// //                     .populate('createdBy', 'ime prezime email')
// //                     .lean(),
// //                 Tasks.find({
// //                     $or: [
// //                         { title: vinRegex },
// //                         { description: vinRegex }
// //                     ]
// //                 })
// //                     .populate('creator', 'ime prezime')
// //                     .populate('users', 'ime prezime')
// //                     .populate('sektor', 'naziv')
// //                     .lean(),
// //                 ProcjenaVozla.find({ sasija: vinRegex }).lean()
// //             ]);

// //             const vehicleMap = new Map();

// //             zapisnici.forEach(item => {
// //                 const vin = item.sasija;
// //                 if (!vehicleMap.has(vin)) {
// //                     vehicleMap.set(vin, {
// //                         vin,
// //                         vozilo: item.vozilo,
// //                         osnovniPodaci: {
// //                             vozilo: item.vozilo,
// //                             kilometraza: item.kilometraza,
// //                             godiste: item.godiste,
// //                             boja: item.boja,
// //                             gorivo: item.gorivo,
// //                             mjenjac: item.mjenjac
// //                         },
// //                         zapisnici: [],
// //                         tasks: [],
// //                         procjene: []
// //                     });
// //                 }
// //                 vehicleMap.get(vin).zapisnici.push(item);
// //             });

// //             tasks.forEach(task => {
// //                 // Pronađi vozilo koje već postoji u map po regexu
// //                 const matchedVehicleVin = Array.from(vehicleMap.keys()).find(vinKey => task.title?.includes(vinKey) || task.description?.includes(vinKey));

// //                 if (matchedVehicleVin) {
// //                     // Spoji task u postojeći objekt
// //                     vehicleMap.get(matchedVehicleVin).tasks.push(task);
// //                 } else {
// //                     // Ako ne postoji, kreiraj novi (ne bi trebalo često biti potrebno)
// //                     const vinFromTitle = task.title?.match(vinRegex)?.[0] || 'Nepoznato';
// //                     if (!vehicleMap.has(vinFromTitle)) {
// //                         vehicleMap.set(vinFromTitle, {
// //                             vin: vinFromTitle,
// //                             vozilo: 'Nepoznato',
// //                             zapisnici: [],
// //                             tasks: [],
// //                             procjene: []
// //                         });
// //                     }
// //                     vehicleMap.get(vinFromTitle).tasks.push(task);
// //                 }
// //             });


// //             procjene.forEach(procjena => {
// //                 const vin = procjena.sasija;
// //                 if (!vehicleMap.has(vin)) {
// //                     vehicleMap.set(vin, {
// //                         vin,
// //                         vozilo: procjena.vozilo,
// //                         osnovniPodaci: {
// //                             vozilo: procjena.vozilo,
// //                             kilometraza: procjena.kilometraza,
// //                             godiste: procjena.godiste
// //                         },
// //                         zapisnici: [],
// //                         tasks: [],
// //                         procjene: []
// //                     });
// //                 }
// //                 vehicleMap.get(vin).procjene.push(procjena);
// //             });

// //             const results = Array.from(vehicleMap.values());

// //             if (results.length === 0) {
// //                 return res.status(404).json({
// //                     success: false,
// //                     message: 'Nije pronađeno vozilo sa unesenim VIN-om'
// //                 });
// //             }

// //             // Dodavanje statistike INLINE bez pozivanja metode
// //             // const enrichedResults = results.map(vehicle => {
// //             //     const dates = [];

// //             //     if (vehicle.zapisnici && vehicle.zapisnici.length > 0) {
// //             //         dates.push(...vehicle.zapisnici.map(z => new Date(z.createdAt)));
// //             //     }
// //             //     if (vehicle.tasks && vehicle.tasks.length > 0) {
// //             //         dates.push(...vehicle.tasks.map(t => new Date(t.createdAt)));
// //             //     }
// //             //     if (vehicle.procjene && vehicle.procjene.length > 0) {
// //             //         dates.push(...vehicle.procjene.map(p => new Date(p.createdAt)));
// //             //     }

// //             //     const zadnjaAktivnost = dates.length > 0 ? new Date(Math.max(...dates)) : null;

// //             //     return {
// //             //         ...vehicle,
// //             //         statistika: {
// //             //             ukupnoTaskova: vehicle.tasks.length,
// //             //             aktivniTaskovi: vehicle.tasks.filter(t => t.status !== 'Završeno').length,
// //             //             zavrseniTaskovi: vehicle.tasks.filter(t => t.status === 'Završeno').length,
// //             //             ukupnoZapisnika: vehicle.zapisnici.length,
// //             //             ukupnoProcjena: vehicle.procjene.length,
// //             //             zadnjaAktivnost
// //             //         }
// //             //     };
// //             // });

// //             const enrichedResults = Array.from(vehicleMap.values()).map(vehicle => {
// //                 const dates = [];

// //                 if (vehicle.zapisnici && vehicle.zapisnici.length > 0) {
// //                     dates.push(...vehicle.zapisnici.map(z => new Date(z.createdAt)));
// //                 }
// //                 if (vehicle.tasks && vehicle.tasks.length > 0) {
// //                     dates.push(...vehicle.tasks.map(t => new Date(t.createdAt)));
// //                 }
// //                 if (vehicle.procjene && vehicle.procjene.length > 0) {
// //                     dates.push(...vehicle.procjene.map(p => new Date(p.createdAt)));
// //                 }

// //                 const zadnjaAktivnost = dates.length > 0 ? new Date(Math.max(...dates)) : null;

// //                 // Odabir naziva vozila (najčešći ili prvi non-empty)
// //                 const vozilaNazivi = [
// //                     ...vehicle.zapisnici.map(z => z.vozilo),
// //                     ...vehicle.tasks.map(t => t.vozilo).filter(Boolean),
// //                     ...vehicle.procjene.map(p => p.vozilo).filter(Boolean)
// //                 ];
// //                 const voziloFinal = vozilaNazivi.find(v => v) || 'Nepoznato';

// //                 return {
// //                     vin: vehicle.vin,
// //                     vozilo: voziloFinal,
// //                     osnovniPodaci: {
// //                         vozilo: voziloFinal,
// //                         kilometraza: vehicle.osnovniPodaci?.kilometraza || null,
// //                         godiste: vehicle.osnovniPodaci?.godiste || null,
// //                         boja: vehicle.osnovniPodaci?.boja || null,
// //                         gorivo: vehicle.osnovniPodaci?.gorivo || null,
// //                         mjenjac: vehicle.osnovniPodaci?.mjenjac || null
// //                     },
// //                     zapisnici: vehicle.zapisnici,
// //                     tasks: vehicle.tasks,
// //                     procjene: vehicle.procjene,
// //                     statistika: {
// //                         ukupnoTaskova: vehicle.tasks.length,
// //                         aktivniTaskovi: vehicle.tasks.filter(t => t.status !== 'Završeno').length,
// //                         zavrseniTaskovi: vehicle.tasks.filter(t => t.status === 'Završeno').length,
// //                         ukupnoZapisnika: vehicle.zapisnici.length,
// //                         ukupnoProcjena: vehicle.procjene.length,
// //                         zadnjaAktivnost
// //                     }
// //                 };
// //             });


// //             res.json({
// //                 success: true,
// //                 count: enrichedResults.length,
// //                 data: enrichedResults
// //             });

// //         } catch (error) {
// //             console.error('Greška pri pretrazi vozila:', error);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Greška pri pretrazi vozila',
// //                 error: error.message
// //             });
// //         }
// //     }
// //     // Helper za pronalaženje zadnje aktivnosti
// //     getLatestActivity(vehicle) {
// //         const dates = [];

// //         if (vehicle.zapisnici.length > 0) {
// //             dates.push(...vehicle.zapisnici.map(z => new Date(z.createdAt)));
// //         }
// //         if (vehicle.tasks.length > 0) {
// //             dates.push(...vehicle.tasks.map(t => new Date(t.createdAt)));
// //         }
// //         if (vehicle.procjene.length > 0) {
// //             dates.push(...vehicle.procjene.map(p => new Date(p.createdAt)));
// //         }

// //         return dates.length > 0 ? new Date(Math.max(...dates)) : null;
// //     }

// //     // Kreiranje chata sa Ognjenom
// //     async createChatWithOgnjen(req, res) {
// //         try {
// //             const { vin, userId, vozilo, subject } = req.body;

// //             if (!vin || !userId) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'VIN i userId su obavezni'
// //                 });
// //             }

// //             // Preuzimanje korisničkih podataka
// //             const user = await Korisnici.findById(userId).select('ime prezime email');
// //             if (!user) {
// //                 return res.status(404).json({
// //                     success: false,
// //                     message: 'Korisnik nije pronađen'
// //                 });
// //             }

// //             const userName = `${user.ime} ${user.prezime}`;

// //             // Provjera da li već postoji aktivan chat za ovo vozilo i korisnika
// //             let chat = await Chat.findOne({
// //                 vin,
// //                 'participants.userId': userId,
// //                 status: 'active'
// //             });

// //             if (chat) {
// //                 return res.json({
// //                     success: true,
// //                     message: 'Chat već postoji',
// //                     data: chat
// //                 });
// //             }

// //             // Pronalaženje Ognjenovog ID-a
// //             const ognjen = await Korisnici.findOne({
// //                 $or: [
// //                     { email: 'ognjen@example.com' },
// //                     { role: 'admin' }
// //                 ]
// //             }).select('_id ime prezime');

// //             // Kreiranje novog chata
// //             chat = await Chat.create({
// //                 vin,
// //                 vozilo: vozilo || `VIN ${vin}`,
// //                 subject: subject || `Vozilo ${vozilo || vin}`,
// //                 participants: [
// //                     {
// //                         userId: userId,
// //                         userName: userName,
// //                         role: 'prodavac'
// //                     },
// //                     {
// //                         userId: ognjen ? ognjen._id.toString() : 'admin',
// //                         userName: ognjen ? `${ognjen.ime} ${ognjen.prezime}` : 'Ognjen',
// //                         role: 'admin'
// //                     }
// //                 ],
// //                 messages: [{
// //                     senderId: userId,
// //                     senderName: userName,
// //                     text: `Otvoren chat za vozilo ${vozilo || ''} (VIN: ${vin})`,
// //                     timestamp: new Date(),
// //                     isSystemMessage: true
// //                 }],
// //                 status: 'active',
// //                 createdAt: new Date(),
// //                 lastMessageAt: new Date()
// //             });

// //             res.status(201).json({
// //                 success: true,
// //                 message: 'Chat uspješno kreiran',
// //                 data: chat
// //             });

// //         } catch (error) {
// //             console.error('Greška pri kreiranju chata:', error);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Greška pri kreiranju chata',
// //                 error: error.message
// //             });
// //         }
// //     }

// //     // Preuzimanje chata po VIN-u
// //     async getChatByVin(req, res) {
// //         try {
// //             const { vin } = req.params;
// //             const { userId } = req.query;

// //             if (!userId) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'userId je obavezan'
// //                 });
// //             }

// //             const chat = await Chat.findOne({
// //                 vin,
// //                 'participants.userId': userId,
// //                 status: 'active'
// //             }).sort({ lastMessageAt: -1 });

// //             if (!chat) {
// //                 return res.status(404).json({
// //                     success: false,
// //                     message: 'Chat nije pronađen'
// //                 });
// //             }

// //             // Označavanje poruka kao pročitanih
// //             const unreadMessages = chat.messages.filter(
// //                 msg => !msg.isRead && msg.senderId !== userId
// //             );

// //             if (unreadMessages.length > 0) {
// //                 unreadMessages.forEach(msg => msg.isRead = true);
// //                 await chat.save();
// //             }

// //             res.json({
// //                 success: true,
// //                 data: chat,
// //                 unreadCount: 0
// //             });

// //         } catch (error) {
// //             console.error('Greška pri preuzimanju chata:', error);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Greška pri preuzimanju chata',
// //                 error: error.message
// //             });
// //         }
// //     }

// //     // Slanje poruke u chat
// //     async sendMessage(req, res) {
// //         try {
// //             const { chatId } = req.params;
// //             const { senderId, text, attachments } = req.body;

// //             if (!text || !senderId) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'Text i senderId su obavezni'
// //                 });
// //             }

// //             const chat = await Chat.findById(chatId);

// //             if (!chat) {
// //                 return res.status(404).json({
// //                     success: false,
// //                     message: 'Chat nije pronađen'
// //                 });
// //             }

// //             // Preuzimanje korisničkih podataka
// //             const user = await Korisnici.findById(senderId).select('ime prezime');
// //             const senderName = user ? `${user.ime} ${user.prezime}` : 'Korisnik';

// //             const newMessage = {
// //                 senderId,
// //                 senderName,
// //                 text,
// //                 attachments: attachments || [],
// //                 timestamp: new Date(),
// //                 isSystemMessage: false,
// //                 isRead: false
// //             };

// //             chat.messages.push(newMessage);
// //             chat.lastMessageAt = new Date();
// //             await chat.save();

// //             // TODO: Dodati WebSocket notifikaciju za real-time chat
// //             // TODO: Dodati push notifikaciju za Ognjenom

// //             res.json({
// //                 success: true,
// //                 message: 'Poruka uspješno poslata',
// //                 data: {
// //                     message: newMessage,
// //                     chatId: chat._id
// //                 }
// //             });

// //         } catch (error) {
// //             console.error('Greška pri slanju poruke:', error);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Greška pri slanju poruke',
// //                 error: error.message
// //             });
// //         }
// //     }

// //     // Rezervacija vozila
// //     async reserveVehicle(req, res) {
// //         try {
// //             const { vin, userId, vozilo, notes, customerName, customerPhone } = req.body;

// //             if (!vin || !userId) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'VIN i userId su obavezni'
// //                 });
// //             }

// //             const user = await Korisnici.findById(userId).select('ime prezime');
// //             const userName = user ? `${user.ime} ${user.prezime}` : 'Korisnik';

// //             // Kreiranje rezervacije kao task
// //             const reservation = await Tasks.create({
// //                 title: `Rezervacija: ${vozilo || vin}`,
// //                 description: `
// //           Vozilo: ${vozilo || 'N/A'}
// //           VIN: ${vin}
// //           Kupac: ${customerName || 'N/A'}
// //           Telefon: ${customerPhone || 'N/A'}
// //           Napomene: ${notes || 'Nema'}
// //         `.trim(),
// //                 users: [userId],
// //                 creator: userId,
// //                 status: 'Preuzeto',
// //                 taskJob: 'Rezervacija vozila',
// //                 importantLever: 3, // Visok prioritet
// //                 dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
// //                 reminder: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23h reminder
// //                 createdAt: new Date()
// //             });

// //             // Automatsko kreiranje chata sa Ognjenom
// //             const chatResult = await this.createChatHelper({
// //                 vin,
// //                 userId,
// //                 userName,
// //                 vozilo,
// //                 subject: `Rezervacija: ${vozilo || vin}`
// //             });

// //             res.status(201).json({
// //                 success: true,
// //                 message: 'Vozilo uspješno rezervisano',
// //                 data: {
// //                     reservation,
// //                     chatId: chatResult._id
// //                 }
// //             });

// //         } catch (error) {
// //             console.error('Greška pri rezervaciji vozila:', error);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Greška pri rezervaciji vozila',
// //                 error: error.message
// //             });
// //         }
// //     }

// //     // Quick Actions
// //     async executeQuickAction(req, res) {
// //         try {
// //             const { action, vin, userId, vozilo, data } = req.body;

// //             if (!action || !vin || !userId) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'Action, VIN i userId su obavezni'
// //                 });
// //             }

// //             const user = await Korisnici.findById(userId).select('ime prezime');
// //             const userName = user ? `${user.ime} ${user.prezime}` : 'Korisnik';

// //             let result;

// //             switch (action) {
// //                 case 'message':
// //                     result = await this.createChatHelper({ vin, userId, userName, vozilo });
// //                     break;

// //                 case 'reserve':
// //                     return await reserveVehicle(req, res);

// //                 case 'request_documents':
// //                     result = await requestDocuments({ vin, userId, userName, vozilo, data });
// //                     break;

// //                 case 'schedule_viewing':
// //                     result = await scheduleViewing({ vin, userId, userName, vozilo, data });
// //                     break;

// //                 case 'request_service':
// //                     result = await requestService({ vin, userId, userName, vozilo, data });
// //                     break;

// //                 default:
// //                     return res.status(400).json({
// //                         success: false,
// //                         message: 'Nepoznata akcija'
// //                     });
// //             }

// //             res.json({
// //                 success: true,
// //                 message: 'Akcija uspješno izvršena',
// //                 data: result
// //             });

// //         } catch (error) {
// //             console.error('Greška pri izvršavanju akcije:', error);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Greška pri izvršavanju akcije',
// //                 error: error.message
// //             });
// //         }
// //     }

// //     // Helper funkcije
// //     async createChatHelper({ vin, userId, userName, vozilo, subject }) {
// //         let chat = await Chat.findOne({
// //             vin,
// //             'participants.userId': userId,
// //             status: 'active'
// //         });

// //         if (!chat) {
// //             const ognjen = await Korisnici.findOne({
// //                 $or: [
// //                     { email: 'ognjen@example.com' },
// //                     { role: 'admin' }
// //                 ]
// //             }).select('_id ime prezime');

// //             chat = await Chat.create({
// //                 vin,
// //                 vozilo: vozilo || `VIN ${vin}`,
// //                 subject: subject || `Vozilo ${vozilo || vin}`,
// //                 participants: [
// //                     { userId, userName, role: 'prodavac' },
// //                     {
// //                         userId: ognjen ? ognjen._id.toString() : 'admin',
// //                         userName: ognjen ? `${ognjen.ime} ${ognjen.prezime}` : 'Ognjen',
// //                         role: 'admin'
// //                     }
// //                 ],
// //                 messages: [{
// //                     senderId: userId,
// //                     senderName: userName,
// //                     text: `Otvoren chat za vozilo ${vozilo || ''} (VIN: ${vin})`,
// //                     timestamp: new Date(),
// //                     isSystemMessage: true
// //                 }],
// //                 status: 'active',
// //                 createdAt: new Date(),
// //                 lastMessageAt: new Date()
// //             });
// //         }

// //         return chat;
// //     }

// //     async requestDocuments({ vin, userId, userName, vozilo, data }) {
// //         const task = await Tasks.create({
// //             title: `Dokumentacija: ${vozilo || vin}`,
// //             description: `
// //         VIN: ${vin}
// //         Potrebna dokumentacija: ${data?.documents || 'Standardna'}
// //         Napomena: ${data?.notes || 'Nema'}
// //       `.trim(),
// //             users: [userId],
// //             creator: userId,
// //             status: 'Preuzeto',
// //             taskJob: 'Priprema dokumentacije',
// //             importantLever: 2,
// //             createdAt: new Date()
// //         });

// //         return task;
// //     }

// //     async scheduleViewing({ vin, userId, userName, vozilo, data }) {
// //         const task = await Tasks.create({
// //             title: `Obilazak: ${vozilo || vin}`,
// //             description: `
// //         VIN: ${vin}
// //         Datum: ${data?.date || 'TBD'}
// //         Kupac: ${data?.customerName || 'N/A'}
// //         Telefon: ${data?.customerPhone || 'N/A'}
// //       `.trim(),
// //             users: [userId],
// //             creator: userId,
// //             status: 'Preuzeto',
// //             taskJob: 'Obilazak vozila',
// //             importantLever: 2,
// //             dueDate: data?.date ? new Date(data.date) : null,
// //             reminder: data?.date ? new Date(new Date(data.date).getTime() - 60 * 60 * 1000) : null,
// //             createdAt: new Date()
// //         });

// //         return task;
// //     }

// //     async requestService({ vin, userId, userName, vozilo, data }) {
// //         const task = await Tasks.create({
// //             title: `Servis: ${vozilo || vin}`,
// //             description: `
// //         VIN: ${vin}
// //         Vrsta servisa: ${data?.serviceType || 'N/A'}
// //         Hitnost: ${data?.urgency || 'Normalna'}
// //         Opis: ${data?.description || 'Nema'}
// //       `.trim(),
// //             users: [userId],
// //             creator: userId,
// //             status: 'Preuzeto',
// //             taskJob: 'Servis vozila',
// //             importantLever: data?.urgency === 'Hitno' ? 3 : 1,
// //             createdAt: new Date()
// //         });

// //         return task;
// //     }
// // }

// // module.exports = new SalesController();
// // controllers/salesController.js
// const ZapisnikPrimopredaja = require('../models/ZapisnikSchema');
// const Tasks = require('../models/TaskSchema');
// const ProcjenaVozla = require('../models/ProcjenaSchema');
// const Chat = require('../models/Chat');
// const Korisnici = require('../models/UserSchema');

// class SalesController {
//     // Pretraga vozila po zadnjim ciframa VIN-a (sasija)
//     async searchVehicleByVin(req, res) {
//         try {
//             const { vinPart } = req.params;

//             if (!vinPart || vinPart.length < 4 || vinPart.length > 5) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'VIN dio mora biti 4 ili 5 cifara'
//                 });
//             }

//             // Regex koji traži vinPart bilo gdje u stringu
//             const vinRegex = new RegExp(vinPart, 'i');

//             const [zapisnici, tasks, procjene] = await Promise.all([
//                 ZapisnikPrimopredaja.find({ sasija: vinRegex })
//                     .populate('createdBy', 'ime prezime email')
//                     .lean(),
//                 Tasks.find({
//                     $or: [
//                         { title: vinRegex },
//                         { description: vinRegex }
//                     ]
//                 })
//                     .populate('creator', 'ime prezime')
//                     .populate('users', 'ime prezime')
//                     .populate('sektor', 'naziv')
//                     .lean(),
//                 ProcjenaVozla.find({ sasija: vinRegex }).lean()
//             ]);

//             const vehicleMap = new Map();

//             // Helper funkcija za normalizaciju VIN-a
//             const normalizeVin = (vin) => {
//                 if (!vin) return null;
//                 return vin.toString().toUpperCase().trim();
//             };

//             // Proces zapisnika
//             zapisnici.forEach(item => {
//                 const vin = normalizeVin(item.sasija);
//                 if (!vin) return;

//                 if (!vehicleMap.has(vin)) {
//                     vehicleMap.set(vin, {
//                         vin,
//                         vozilo: item.vozilo,
//                         osnovniPodaci: {
//                             vozilo: item.vozilo,
//                             kilometraza: item.kilometraza,
//                             godiste: item.godiste,
//                             boja: item.boja,
//                             gorivo: item.gorivo,
//                             mjenjac: item.mjenjac
//                         },
//                         zapisnici: [],
//                         tasks: [],
//                         procjene: []
//                     });
//                 }
//                 vehicleMap.get(vin).zapisnici.push(item);
//             });

//             // Proces taskova - poboljšan matching
//             tasks.forEach(task => {
//                 let matched = false;

//                 // Prvo pokušaj pronaći pun VIN u title ili description
//                 const titleVinMatch = task.title?.match(/[A-Z0-9]{17}/i);
//                 const descVinMatch = task.description?.match(/[A-Z0-9]{17}/i);

//                 const foundFullVin = normalizeVin(titleVinMatch?.[0] || descVinMatch?.[0]);

//                 if (foundFullVin && vehicleMap.has(foundFullVin)) {
//                     vehicleMap.get(foundFullVin).tasks.push(task);
//                     matched = true;
//                 } else {
//                     // Ako nema punog VIN-a, provjeri da li title/description sadrže vinPart
//                     for (let [mapVin, vehicle] of vehicleMap.entries()) {
//                         if (mapVin.includes(vinPart.toUpperCase()) &&
//                             (task.title?.includes(vinPart) || task.description?.includes(vinPart))) {
//                             vehicle.tasks.push(task);
//                             matched = true;
//                             break;
//                         }
//                     }
//                 }

//                 // Ako nije matched ni sa jednim postojećim, kreiraj novi entry
//                 if (!matched && foundFullVin) {
//                     vehicleMap.set(foundFullVin, {
//                         vin: foundFullVin,
//                         vozilo: 'Nepoznato',
//                         osnovniPodaci: {
//                             vozilo: 'Nepoznato',
//                             kilometraza: null,
//                             godiste: null,
//                             boja: null,
//                             gorivo: null,
//                             mjenjac: null
//                         },
//                         zapisnici: [],
//                         tasks: [task],
//                         procjene: []
//                     });
//                 } else if (!matched && (task.title?.includes(vinPart) || task.description?.includes(vinPart))) {
//                     // Kreiraj entry sa vinPart kao vin
//                     const partialVin = vinPart.toUpperCase();
//                     if (!vehicleMap.has(partialVin)) {
//                         vehicleMap.set(partialVin, {
//                             vin: partialVin,
//                             vozilo: 'Nepoznato',
//                             osnovniPodaci: {
//                                 vozilo: 'Nepoznato',
//                                 kilometraza: null,
//                                 godiste: null,
//                                 boja: null,
//                                 gorivo: null,
//                                 mjenjac: null
//                             },
//                             zapisnici: [],
//                             tasks: [task],
//                             procjene: []
//                         });
//                     } else {
//                         vehicleMap.get(partialVin).tasks.push(task);
//                     }
//                 }
//             });

//             // Proces procjena
//             procjene.forEach(procjena => {
//                 const vin = normalizeVin(procjena.sasija);
//                 if (!vin) return;

//                 if (!vehicleMap.has(vin)) {
//                     vehicleMap.set(vin, {
//                         vin,
//                         vozilo: procjena.vozilo,
//                         osnovniPodaci: {
//                             vozilo: procjena.vozilo,
//                             kilometraza: procjena.kilometraza,
//                             godiste: procjena.godiste,
//                             boja: null,
//                             gorivo: null,
//                             mjenjac: null
//                         },
//                         zapisnici: [],
//                         tasks: [],
//                         procjene: []
//                     });
//                 }
//                 vehicleMap.get(vin).procjene.push(procjena);
//             });

//             const results = Array.from(vehicleMap.values());

//             if (results.length === 0) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Nije pronađeno vozilo sa unesenim VIN-om'
//                 });
//             }

//             // Obogaćivanje rezultata sa statistikom
//             const enrichedResults = results.map(vehicle => {
//                 const dates = [];

//                 if (vehicle.zapisnici && vehicle.zapisnici.length > 0) {
//                     dates.push(...vehicle.zapisnici.map(z => new Date(z.createdAt)));
//                 }
//                 if (vehicle.tasks && vehicle.tasks.length > 0) {
//                     dates.push(...vehicle.tasks.map(t => new Date(t.createdAt)));
//                 }
//                 if (vehicle.procjene && vehicle.procjene.length > 0) {
//                     dates.push(...vehicle.procjene.map(p => new Date(p.createdAt)));
//                 }

//                 const zadnjaAktivnost = dates.length > 0 ? new Date(Math.max(...dates)) : null;

//                 // Odabir najboljeg naziva vozila
//                 const vozilaNazivi = [
//                     ...vehicle.zapisnici.map(z => z.vozilo),
//                     ...vehicle.tasks.map(t => t.vozilo).filter(Boolean),
//                     ...vehicle.procjene.map(p => p.vozilo).filter(Boolean)
//                 ].filter(v => v && v !== 'Nepoznato');

//                 const voziloFinal = vozilaNazivi[0] || vehicle.vozilo || 'Nepoznato';

//                 return {
//                     vin: vehicle.vin,
//                     vozilo: voziloFinal,
//                     osnovniPodaci: {
//                         vozilo: voziloFinal,
//                         kilometraza: vehicle.osnovniPodaci?.kilometraza || null,
//                         godiste: vehicle.osnovniPodaci?.godiste || null,
//                         boja: vehicle.osnovniPodaci?.boja || null,
//                         gorivo: vehicle.osnovniPodaci?.gorivo || null,
//                         mjenjac: vehicle.osnovniPodaci?.mjenjac || null
//                     },
//                     zapisnici: vehicle.zapisnici,
//                     tasks: vehicle.tasks,
//                     procjene: vehicle.procjene,
//                     statistika: {
//                         ukupnoTaskova: vehicle.tasks.length,
//                         aktivniTaskovi: vehicle.tasks.filter(t => t.status !== 'Završeno').length,
//                         zavrseniTaskovi: vehicle.tasks.filter(t => t.status === 'Završeno').length,
//                         ukupnoZapisnika: vehicle.zapisnici.length,
//                         ukupnoProcjena: vehicle.procjene.length,
//                         zadnjaAktivnost
//                     }
//                 };
//             });

//             res.json({
//                 success: true,
//                 count: enrichedResults.length,
//                 data: enrichedResults
//             });

//         } catch (error) {
//             console.error('Greška pri pretrazi vozila:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Greška pri pretrazi vozila',
//                 error: error.message
//             });
//         }
//     }

//     // Kreiranje chata sa Ognjenom
//     async createChatWithOgnjen(req, res) {
//         try {
//             const { vin, userId, vozilo, subject } = req.body;

//             if (!vin || !userId) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'VIN i userId su obavezni'
//                 });
//             }

//             const user = await Korisnici.findById(userId).select('ime prezime email');
//             if (!user) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Korisnik nije pronađen'
//                 });
//             }

//             const userName = `${user.ime} ${user.prezime}`;

//             let chat = await Chat.findOne({
//                 vin,
//                 'participants.userId': userId,
//                 status: 'active'
//             });

//             if (chat) {
//                 return res.json({
//                     success: true,
//                     message: 'Chat već postoji',
//                     data: chat
//                 });
//             }

//             const ognjen = await Korisnici.findOne({
//                 $or: [
//                     { email: 'ognjen@example.com' },
//                     { role: 'admin' }
//                 ]
//             }).select('_id ime prezime');

//             chat = await Chat.create({
//                 vin,
//                 vozilo: vozilo || `VIN ${vin}`,
//                 subject: subject || `Vozilo ${vozilo || vin}`,
//                 participants: [
//                     {
//                         userId: userId,
//                         userName: userName,
//                         role: 'prodavac'
//                     },
//                     {
//                         userId: ognjen ? ognjen._id.toString() : 'admin',
//                         userName: ognjen ? `${ognjen.ime} ${ognjen.prezime}` : 'Ognjen',
//                         role: 'admin'
//                     }
//                 ],
//                 messages: [{
//                     senderId: userId,
//                     senderName: userName,
//                     text: `Otvoren chat za vozilo ${vozilo || ''} (VIN: ${vin})`,
//                     timestamp: new Date(),
//                     isSystemMessage: true
//                 }],
//                 status: 'active',
//                 createdAt: new Date(),
//                 lastMessageAt: new Date()
//             });

//             res.status(201).json({
//                 success: true,
//                 message: 'Chat uspješno kreiran',
//                 data: chat
//             });

//         } catch (error) {
//             console.error('Greška pri kreiranju chata:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Greška pri kreiranju chata',
//                 error: error.message
//             });
//         }
//     }

//     // Preuzimanje chata po VIN-u
//     async getChatByVin(req, res) {
//         try {
//             const { vin } = req.params;
//             const { userId } = req.query;

//             if (!userId) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'userId je obavezan'
//                 });
//             }

//             const chat = await Chat.findOne({
//                 vin,
//                 'participants.userId': userId,
//                 status: 'active'
//             }).sort({ lastMessageAt: -1 });

//             if (!chat) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Chat nije pronađen'
//                 });
//             }

//             const unreadMessages = chat.messages.filter(
//                 msg => !msg.isRead && msg.senderId !== userId
//             );

//             if (unreadMessages.length > 0) {
//                 unreadMessages.forEach(msg => msg.isRead = true);
//                 await chat.save();
//             }

//             res.json({
//                 success: true,
//                 data: chat,
//                 unreadCount: 0
//             });

//         } catch (error) {
//             console.error('Greška pri preuzimanju chata:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Greška pri preuzimanju chata',
//                 error: error.message
//             });
//         }
//     }

//     // Slanje poruke u chat
//     async sendMessage(req, res) {
//         try {
//             const { chatId } = req.params;
//             const { senderId, text, attachments } = req.body;

//             if (!text || !senderId) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Text i senderId su obavezni'
//                 });
//             }

//             const chat = await Chat.findById(chatId);

//             if (!chat) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Chat nije pronađen'
//                 });
//             }

//             const user = await Korisnici.findById(senderId).select('ime prezime');
//             const senderName = user ? `${user.ime} ${user.prezime}` : 'Korisnik';

//             const newMessage = {
//                 senderId,
//                 senderName,
//                 text,
//                 attachments: attachments || [],
//                 timestamp: new Date(),
//                 isSystemMessage: false,
//                 isRead: false
//             };

//             chat.messages.push(newMessage);
//             chat.lastMessageAt = new Date();
//             await chat.save();

//             res.json({
//                 success: true,
//                 message: 'Poruka uspješno poslata',
//                 data: {
//                     message: newMessage,
//                     chatId: chat._id
//                 }
//             });

//         } catch (error) {
//             console.error('Greška pri slanju poruke:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Greška pri slanju poruke',
//                 error: error.message
//             });
//         }
//     }

//     // Rezervacija vozila
//     async reserveVehicle(req, res) {
//         try {
//             const { vin, userId, vozilo, notes, customerName, customerPhone } = req.body;

//             if (!vin || !userId) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'VIN i userId su obavezni'
//                 });
//             }

//             const user = await Korisnici.findById(userId).select('ime prezime');
//             const userName = user ? `${user.ime} ${user.prezime}` : 'Korisnik';

//             const reservation = await Tasks.create({
//                 title: `Rezervacija: ${vozilo || vin}`,
//                 description: `
// Vozilo: ${vozilo || 'N/A'}
// VIN: ${vin}
// Kupac: ${customerName || 'N/A'}
// Telefon: ${customerPhone || 'N/A'}
// Napomene: ${notes || 'Nema'}
//         `.trim(),
//                 users: [userId],
//                 creator: userId,
//                 status: 'Preuzeto',
//                 taskJob: 'Rezervacija vozila',
//                 importantLever: 3,
//                 dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
//                 reminder: new Date(Date.now() + 23 * 60 * 60 * 1000),
//                 createdAt: new Date()
//             });

//             const chatResult = await this.createChatHelper({
//                 vin,
//                 userId,
//                 userName,
//                 vozilo,
//                 subject: `Rezervacija: ${vozilo || vin}`
//             });

//             res.status(201).json({
//                 success: true,
//                 message: 'Vozilo uspješno rezervisano',
//                 data: {
//                     reservation,
//                     chatId: chatResult._id
//                 }
//             });

//         } catch (error) {
//             console.error('Greška pri rezervaciji vozila:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Greška pri rezervaciji vozila',
//                 error: error.message
//             });
//         }
//     }

//     // Quick Actions - FIKSIRAN this context
//     async executeQuickAction(req, res) {
//         try {
//             const { action, vin, userId, vozilo, data } = req.body;

//             if (!action || !vin || !userId) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Action, VIN i userId su obavezni'
//                 });
//             }

//             const user = await Korisnici.findById(userId).select('ime prezime');
//             const userName = user ? `${user.ime} ${user.prezime}` : 'Korisnik';

//             let result;

//             // Koristimo if-else umjesto switch da sačuvamo this context
//             if (action === 'message') {
//                 result = await this.createChatHelper({ vin, userId, userName, vozilo });
//             } else if (action === 'reserve') {
//                 return await this.reserveVehicle(req, res);
//             } else if (action === 'request_documents') {
//                 result = await this.requestDocuments({ vin, userId, userName, vozilo, data });
//             } else if (action === 'schedule_viewing') {
//                 result = await this.scheduleViewing({ vin, userId, userName, vozilo, data });
//             } else if (action === 'request_service') {
//                 result = await this.requestService({ vin, userId, userName, vozilo, data });
//             } else {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Nepoznata akcija'
//                 });
//             }

//             res.json({
//                 success: true,
//                 message: 'Akcija uspješno izvršena',
//                 data: result
//             });

//         } catch (error) {
//             console.error('Greška pri izvršavanju akcije:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Greška pri izvršavanju akcije',
//                 error: error.message
//             });
//         }
//     }

//     // Helper funkcije
//     async createChatHelper({ vin, userId, userName, vozilo, subject }) {
//         let chat = await Chat.findOne({
//             vin,
//             'participants.userId': userId,
//             status: 'active'
//         });

//         if (!chat) {
//             const ognjen = await Korisnici.findOne({
//                 $or: [
//                     { email: 'ognjen@example.com' },
//                     { role: 'admin' }
//                 ]
//             }).select('_id ime prezime');

//             chat = await Chat.create({
//                 vin,
//                 vozilo: vozilo || `VIN ${vin}`,
//                 subject: subject || `Vozilo ${vozilo || vin}`,
//                 participants: [
//                     { userId, userName, role: 'prodavac' },
//                     {
//                         userId: ognjen ? ognjen._id.toString() : 'admin',
//                         userName: ognjen ? `${ognjen.ime} ${ognjen.prezime}` : 'Ognjen',
//                         role: 'admin'
//                     }
//                 ],
//                 messages: [{
//                     senderId: userId,
//                     senderName: userName,
//                     text: `Otvoren chat za vozilo ${vozilo || ''} (VIN: ${vin})`,
//                     timestamp: new Date(),
//                     isSystemMessage: true
//                 }],
//                 status: 'active',
//                 createdAt: new Date(),
//                 lastMessageAt: new Date()
//             });
//         }

//         return chat;
//     }

//     async requestDocuments({ vin, userId, userName, vozilo, data }) {
//         const task = await Tasks.create({
//             title: `Dokumentacija: ${vozilo || vin}`,
//             description: `
// VIN: ${vin}
// Potrebna dokumentacija: ${data?.documents || 'Standardna'}
// Napomena: ${data?.notes || 'Nema'}
//       `.trim(),
//             users: [userId],
//             creator: userId,
//             status: 'Preuzeto',
//             taskJob: 'Priprema dokumentacije',
//             importantLever: 2,
//             createdAt: new Date()
//         });

//         return task;
//     }

//     async scheduleViewing({ vin, userId, userName, vozilo, data }) {
//         const task = await Tasks.create({
//             title: `Obilazak: ${vozilo || vin}`,
//             description: `
// VIN: ${vin}
// Datum: ${data?.date || 'TBD'}
// Kupac: ${data?.customerName || 'N/A'}
// Telefon: ${data?.customerPhone || 'N/A'}
//       `.trim(),
//             users: [userId],
//             creator: userId,
//             status: 'Preuzeto',
//             taskJob: 'Obilazak vozila',
//             importantLever: 2,
//             dueDate: data?.date ? new Date(data.date) : null,
//             reminder: data?.date ? new Date(new Date(data.date).getTime() - 60 * 60 * 1000) : null,
//             createdAt: new Date()
//         });

//         return task;
//     }

//     async requestService({ vin, userId, userName, vozilo, data }) {
//         const task = await Tasks.create({
//             title: `Servis: ${vozilo || vin}`,
//             description: `
// VIN: ${vin}
// Vrsta servisa: ${data?.serviceType || 'N/A'}
// Hitnost: ${data?.urgency || 'Normalna'}
// Opis: ${data?.description || 'Nema'}
//       `.trim(),
//             users: [userId],
//             creator: userId,
//             status: 'Preuzeto',
//             taskJob: 'Servis vozila',
//             importantLever: data?.urgency === 'Hitno' ? 3 : 1,
//             createdAt: new Date()
//         });

//         return task;
//     }
// }

// module.exports = new SalesController();

// controllers/salesController.js
const ZapisnikPrimopredaja = require('../models/ZapisnikSchema');
const Tasks = require('../models/TaskSchema');
const ProcjenaVozla = require('../models/ProcjenaSchema');
const Chat = require('../models/Chat');
const Korisnici = require('../models/UserSchema');

class SalesController {
    // Pretraga vozila po zadnjim ciframa VIN-a (sasija)
    async searchVehicleByVin(req, res) {
        try {
            const { vinPart } = req.params;

            if (!vinPart || vinPart.length < 4 || vinPart.length > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'VIN dio mora biti 4 ili 5 cifara'
                });
            }

            // Regex koji traži vinPart bilo gdje u stringu
            const vinRegex = new RegExp(vinPart, 'i');

            const [zapisnici, tasks, procjene] = await Promise.all([
                ZapisnikPrimopredaja.find({ sasija: vinRegex })
                    .populate('createdBy', 'ime prezime email')
                    .lean(),
                Tasks.find({
                    $or: [
                        { title: vinRegex },
                        { description: vinRegex }
                    ]
                })
                    .populate('creator', 'ime prezime')
                    .populate('users', 'ime prezime')
                    .populate('sektor', 'naziv')
                    .lean(),
                ProcjenaVozla.find({ sasija: vinRegex }).lean()
            ]);

            const vehicleMap = new Map();

            // Helper funkcija za normalizaciju VIN-a
            const normalizeVin = (vin) => {
                if (!vin) return null;
                return vin.toString().toUpperCase().trim();
            };

            // Proces zapisnika
            zapisnici.forEach(item => {
                const vin = normalizeVin(item.sasija);
                if (!vin) return;

                if (!vehicleMap.has(vin)) {
                    vehicleMap.set(vin, {
                        vin,
                        vozilo: item.vozilo,
                        osnovniPodaci: {
                            vozilo: item.vozilo,
                            kilometraza: item.kilometraza,
                            godiste: item.godiste,
                            boja: item.boja,
                            gorivo: item.gorivo,
                            mjenjac: item.mjenjac
                        },
                        zapisnici: [],
                        tasks: [],
                        procjene: []
                    });
                }
                vehicleMap.get(vin).zapisnici.push(item);
            });

            // Proces taskova - poboljšan matching
            tasks.forEach(task => {
                let matched = false;

                // Prvo pokušaj pronaći pun VIN u title ili description
                const titleVinMatch = task.title?.match(/[A-Z0-9]{17}/i);
                const descVinMatch = task.description?.match(/[A-Z0-9]{17}/i);

                const foundFullVin = normalizeVin(titleVinMatch?.[0] || descVinMatch?.[0]);

                if (foundFullVin && vehicleMap.has(foundFullVin)) {
                    vehicleMap.get(foundFullVin).tasks.push(task);
                    matched = true;
                } else {
                    // Ako nema punog VIN-a, provjeri da li title/description sadrže vinPart
                    for (let [mapVin, vehicle] of vehicleMap.entries()) {
                        if (mapVin.includes(vinPart.toUpperCase()) &&
                            (task.title?.includes(vinPart) || task.description?.includes(vinPart))) {
                            vehicle.tasks.push(task);
                            matched = true;
                            break;
                        }
                    }
                }

                // Ako nije matched ni sa jednim postojećim, kreiraj novi entry
                if (!matched && foundFullVin) {
                    vehicleMap.set(foundFullVin, {
                        vin: foundFullVin,
                        vozilo: 'Nepoznato',
                        osnovniPodaci: {
                            vozilo: 'Nepoznato',
                            kilometraza: null,
                            godiste: null,
                            boja: null,
                            gorivo: null,
                            mjenjac: null
                        },
                        zapisnici: [],
                        tasks: [task],
                        procjene: []
                    });
                } else if (!matched && (task.title?.includes(vinPart) || task.description?.includes(vinPart))) {
                    // Kreiraj entry sa vinPart kao vin
                    const partialVin = vinPart.toUpperCase();
                    if (!vehicleMap.has(partialVin)) {
                        vehicleMap.set(partialVin, {
                            vin: partialVin,
                            vozilo: 'Nepoznato',
                            osnovniPodaci: {
                                vozilo: 'Nepoznato',
                                kilometraza: null,
                                godiste: null,
                                boja: null,
                                gorivo: null,
                                mjenjac: null
                            },
                            zapisnici: [],
                            tasks: [task],
                            procjene: []
                        });
                    } else {
                        vehicleMap.get(partialVin).tasks.push(task);
                    }
                }
            });

            // Proces procjena
            procjene.forEach(procjena => {
                const vin = normalizeVin(procjena.sasija);
                if (!vin) return;

                if (!vehicleMap.has(vin)) {
                    vehicleMap.set(vin, {
                        vin,
                        vozilo: procjena.vozilo,
                        osnovniPodaci: {
                            vozilo: procjena.vozilo,
                            kilometraza: procjena.kilometraza,
                            godiste: procjena.godiste,
                            boja: null,
                            gorivo: null,
                            mjenjac: null
                        },
                        zapisnici: [],
                        tasks: [],
                        procjene: []
                    });
                }
                vehicleMap.get(vin).procjene.push(procjena);
            });

            const results = Array.from(vehicleMap.values());

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Nije pronađeno vozilo sa unesenim VIN-om'
                });
            }

            // Obogaćivanje rezultata sa statistikom
            const enrichedResults = results.map(vehicle => {
                const dates = [];

                if (vehicle.zapisnici && vehicle.zapisnici.length > 0) {
                    dates.push(...vehicle.zapisnici.map(z => new Date(z.createdAt)));
                }
                if (vehicle.tasks && vehicle.tasks.length > 0) {
                    dates.push(...vehicle.tasks.map(t => new Date(t.createdAt)));
                }
                if (vehicle.procjene && vehicle.procjene.length > 0) {
                    dates.push(...vehicle.procjene.map(p => new Date(p.createdAt)));
                }

                const zadnjaAktivnost = dates.length > 0 ? new Date(Math.max(...dates)) : null;

                // Odabir najboljeg naziva vozila
                const vozilaNazivi = [
                    ...vehicle.zapisnici.map(z => z.vozilo),
                    ...vehicle.tasks.map(t => t.vozilo).filter(Boolean),
                    ...vehicle.procjene.map(p => p.vozilo).filter(Boolean)
                ].filter(v => v && v !== 'Nepoznato');

                const voziloFinal = vozilaNazivi[0] || vehicle.vozilo || 'Nepoznato';

                return {
                    vin: vehicle.vin,
                    vozilo: voziloFinal,
                    osnovniPodaci: {
                        vozilo: voziloFinal,
                        kilometraza: vehicle.osnovniPodaci?.kilometraza || null,
                        godiste: vehicle.osnovniPodaci?.godiste || null,
                        boja: vehicle.osnovniPodaci?.boja || null,
                        gorivo: vehicle.osnovniPodaci?.gorivo || null,
                        mjenjac: vehicle.osnovniPodaci?.mjenjac || null
                    },
                    zapisnici: vehicle.zapisnici,
                    tasks: vehicle.tasks,
                    procjene: vehicle.procjene,
                    statistika: {
                        ukupnoTaskova: vehicle.tasks.length,
                        aktivniTaskovi: vehicle.tasks.filter(t => t.status !== 'Završeno').length,
                        zavrseniTaskovi: vehicle.tasks.filter(t => t.status === 'Završeno').length,
                        ukupnoZapisnika: vehicle.zapisnici.length,
                        ukupnoProcjena: vehicle.procjene.length,
                        zadnjaAktivnost
                    }
                };
            });

            res.json({
                success: true,
                count: enrichedResults.length,
                data: enrichedResults
            });

        } catch (error) {
            console.error('Greška pri pretrazi vozila:', error);
            res.status(500).json({
                success: false,
                message: 'Greška pri pretrazi vozila',
                error: error.message
            });
        }
    }

    // Kreiranje chata sa Ognjenom
    async createChatWithOgnjen(req, res) {
        try {
            const { vin, userId, vozilo, subject } = req.body;

            if (!vin || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'VIN i userId su obavezni'
                });
            }

            const user = await Korisnici.findById(userId).select('ime prezime email');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Korisnik nije pronađen'
                });
            }

            const userName = `${user.ime} ${user.prezime}`;

            let chat = await Chat.findOne({
                vin,
                'participants.userId': userId,
                status: 'active'
            });

            if (chat) {
                return res.json({
                    success: true,
                    message: 'Chat već postoji',
                    data: chat
                });
            }

            const ognjen = await Korisnici.findOne({
                $or: [
                    { email: 'ognjen@example.com' },
                    { role: 'admin' }
                ]
            }).select('_id ime prezime');

            chat = await Chat.create({
                vin,
                vozilo: vozilo || `VIN ${vin}`,
                subject: subject || `Vozilo ${vozilo || vin}`,
                participants: [
                    {
                        userId: userId,
                        userName: userName,
                        role: 'prodavac'
                    },
                    {
                        userId: ognjen ? ognjen._id.toString() : 'admin',
                        userName: ognjen ? `${ognjen.ime} ${ognjen.prezime}` : 'Ognjen',
                        role: 'admin'
                    }
                ],
                messages: [{
                    senderId: userId,
                    senderName: userName,
                    text: `Otvoren chat za vozilo ${vozilo || ''} (VIN: ${vin})`,
                    timestamp: new Date(),
                    isSystemMessage: true
                }],
                status: 'active',
                createdAt: new Date(),
                lastMessageAt: new Date()
            });

            res.status(201).json({
                success: true,
                message: 'Chat uspješno kreiran',
                data: chat
            });

        } catch (error) {
            console.error('Greška pri kreiranju chata:', error);
            res.status(500).json({
                success: false,
                message: 'Greška pri kreiranju chata',
                error: error.message
            });
        }
    }

    // Preuzimanje chata po VIN-u
    async getChatByVin(req, res) {
        try {
            const { vin } = req.params;
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'userId je obavezan'
                });
            }

            const chat = await Chat.findOne({
                vin,
                'participants.userId': userId,
                status: 'active'
            }).sort({ lastMessageAt: -1 });

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat nije pronađen'
                });
            }

            const unreadMessages = chat.messages.filter(
                msg => !msg.isRead && msg.senderId !== userId
            );

            if (unreadMessages.length > 0) {
                unreadMessages.forEach(msg => msg.isRead = true);
                await chat.save();
            }

            res.json({
                success: true,
                data: chat,
                unreadCount: 0
            });

        } catch (error) {
            console.error('Greška pri preuzimanju chata:', error);
            res.status(500).json({
                success: false,
                message: 'Greška pri preuzimanju chata',
                error: error.message
            });
        }
    }

    // Slanje poruke u chat
    async sendMessage(req, res) {
        try {
            const { chatId } = req.params;
            const { senderId, text, attachments } = req.body;

            if (!text || !senderId) {
                return res.status(400).json({
                    success: false,
                    message: 'Text i senderId su obavezni'
                });
            }

            const chat = await Chat.findById(chatId);

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat nije pronađen'
                });
            }

            const user = await Korisnici.findById(senderId).select('ime prezime');
            const senderName = user ? `${user.ime} ${user.prezime}` : 'Korisnik';

            const newMessage = {
                senderId,
                senderName,
                text,
                attachments: attachments || [],
                timestamp: new Date(),
                isSystemMessage: false,
                isRead: false
            };

            chat.messages.push(newMessage);
            chat.lastMessageAt = new Date();
            await chat.save();

            res.json({
                success: true,
                message: 'Poruka uspješno poslata',
                data: {
                    message: newMessage,
                    chatId: chat._id
                }
            });

        } catch (error) {
            console.error('Greška pri slanju poruke:', error);
            res.status(500).json({
                success: false,
                message: 'Greška pri slanju poruke',
                error: error.message
            });
        }
    }

    // Rezervacija vozila
    async reserveVehicle(req, res) {
        try {
            const { vin, userId, vozilo, notes, customerName, customerPhone } = req.body;

            if (!vin || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'VIN i userId su obavezni'
                });
            }

            const user = await Korisnici.findById(userId).select('ime prezime');
            const userName = user ? `${user.ime} ${user.prezime}` : 'Korisnik';

            const reservation = await Tasks.create({
                title: `Rezervacija: ${vozilo || vin}`,
                description: `
Vozilo: ${vozilo || 'N/A'}
VIN: ${vin}
Kupac: ${customerName || 'N/A'}
Telefon: ${customerPhone || 'N/A'}
Napomene: ${notes || 'Nema'}
        `.trim(),
                users: [userId],
                creator: userId,
                status: 'Preuzeto',
                taskJob: 'Rezervacija vozila',
                importantLever: 3,
                dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                reminder: new Date(Date.now() + 23 * 60 * 60 * 1000),
                createdAt: new Date()
            });

            const chatResult = await this.createChatHelper({
                vin,
                userId,
                userName,
                vozilo,
                subject: `Rezervacija: ${vozilo || vin}`
            });

            res.status(201).json({
                success: true,
                message: 'Vozilo uspješno rezervisano',
                data: {
                    reservation,
                    chatId: chatResult._id
                }
            });

        } catch (error) {
            console.error('Greška pri rezervaciji vozila:', error);
            res.status(500).json({
                success: false,
                message: 'Greška pri rezervaciji vozila',
                error: error.message
            });
        }
    }

    // Quick Actions - FIKSIRAN this context sa arrow funkcijama
    executeQuickAction = async (req, res) => {
        try {
            const { action, vin, userId, vozilo, data } = req.body;

            if (!action || !vin || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Action, VIN i userId su obavezni'
                });
            }

            const user = await Korisnici.findById(userId).select('ime prezime');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Korisnik nije pronađen'
                });
            }

            const userName = `${user.ime} ${user.prezime}`;
            let result;
            let successMessage;

            // Koristimo if-else umjesto switch da sačuvamo this context
            if (action === 'message') {
                result = await this.createChatHelper({ vin, userId, userName, vozilo });
                successMessage = 'Chat uspješno otvoren';
            } else if (action === 'reserve') {
                // Reserve ima svoj response handling
                return await this.reserveVehicle(req, res);
            } else if (action === 'request_documents') {
                result = await this.requestDocuments({ vin, userId, userName, vozilo, data });
                successMessage = 'Zahtjev za dokumentaciju uspješno kreiran';
            } else if (action === 'schedule_viewing') {
                result = await this.scheduleViewing({ vin, userId, userName, vozilo, data });
                successMessage = 'Obilazak uspješno zakazan';
            } else if (action === 'request_service') {
                result = await this.requestService({ vin, userId, userName, vozilo, data });
                successMessage = 'Zahtjev za servis uspješno kreiran';
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Nepoznata akcija'
                });
            }

            // Standardizovan response format
            res.json({
                success: true,
                message: successMessage,
                action: action,
                data: result
            });

        } catch (error) {
            console.error('Greška pri izvršavanju akcije:', error);
            res.status(500).json({
                success: false,
                message: 'Greška pri izvršavanju akcije',
                error: error.message
            });
        }
    }

    // Helper funkcije - arrow functions da se očuva this context
    createChatHelper = async ({ vin, userId, userName, vozilo, subject }) => {
        let chat = await Chat.findOne({
            vin,
            'participants.userId': userId,
            status: 'active'
        });

        if (!chat) {
            const ognjen = await Korisnici.findOne({
                $or: [
                    { email: 'ognjen@example.com' },
                    { role: 'admin' }
                ]
            }).select('_id ime prezime');

            chat = await Chat.create({
                vin,
                vozilo: vozilo || `VIN ${vin}`,
                subject: subject || `Vozilo ${vozilo || vin}`,
                participants: [
                    { userId, userName, role: 'prodavac' },
                    {
                        userId: ognjen ? ognjen._id.toString() : 'admin',
                        userName: ognjen ? `${ognjen.ime} ${ognjen.prezime}` : 'Ognjen',
                        role: 'admin'
                    }
                ],
                messages: [{
                    senderId: userId,
                    senderName: userName,
                    text: `Otvoren chat za vozilo ${vozilo || ''} (VIN: ${vin})`,
                    timestamp: new Date(),
                    isSystemMessage: true
                }],
                status: 'active',
                createdAt: new Date(),
                lastMessageAt: new Date()
            });
        }

        return chat;
    }

    requestDocuments = async ({ vin, userId, userName, vozilo, data }) => {
        const task = await Tasks.create({
            title: `Dokumentacija: ${vozilo || vin}`,
            description: `
VIN: ${vin}
Potrebna dokumentacija: ${data?.documents || 'Standardna'}
Napomena: ${data?.notes || 'Nema'}
      `.trim(),
            users: [userId],
            creator: userId,
            status: 'Preuzeto',
            taskJob: 'Priprema dokumentacije',
            importantLever: 2,
            createdAt: new Date()
        });

        return task;
    }

    scheduleViewing = async ({ vin, userId, userName, vozilo, data }) => {
        const task = await Tasks.create({
            title: `Obilazak: ${vozilo || vin}`,
            description: `
VIN: ${vin}
Datum: ${data?.date || 'TBD'}
Kupac: ${data?.customerName || 'N/A'}
Telefon: ${data?.customerPhone || 'N/A'}
      `.trim(),
            users: [userId],
            creator: userId,
            status: 'Preuzeto',
            taskJob: 'Obilazak vozila',
            importantLever: 2,
            dueDate: data?.date ? new Date(data.date) : null,
            reminder: data?.date ? new Date(new Date(data.date).getTime() - 60 * 60 * 1000) : null,
            createdAt: new Date()
        });

        return task;
    }

    requestService = async ({ vin, userId, userName, vozilo, data }) => {
        const task = await Tasks.create({
            title: `Servis: ${vozilo || vin}`,
            description: `
VIN: ${vin}
Vrsta servisa: ${data?.serviceType || 'N/A'}
Hitnost: ${data?.urgency || 'Normalna'}
Opis: ${data?.description || 'Nema'}
      `.trim(),
            users: [userId],
            creator: userId,
            status: 'Preuzeto',
            taskJob: 'Servis vozila',
            importantLever: data?.urgency === 'Hitno' ? 3 : 1,
            createdAt: new Date()
        });

        return task;
    }
}

module.exports = new SalesController();