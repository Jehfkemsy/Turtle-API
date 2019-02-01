import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    message: {type: String, required: true},
    time: {type: String}
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;