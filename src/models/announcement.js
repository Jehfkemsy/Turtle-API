import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    message: {type: String, required: true}
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;