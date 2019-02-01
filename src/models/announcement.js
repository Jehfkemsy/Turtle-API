import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    message_id: {type: String, required: true, unique: true},
    message: {type: String, required: true},
    time: {type: String, required:true}
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;