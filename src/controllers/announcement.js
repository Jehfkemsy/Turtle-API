import Announcement from "../models/announcement";

import httpResponse from "../utils/httpResponses";

import moment from 'moment';

const {CHANNEL_ID} = process.env;

const create = async (req, res) => {
  const { challenge, event } = req.body;
  if(!challenge && event && event.channel === CHANNEL_ID) {
    try {
      const time = moment().format('h:mm a');
      const announcement = await Announcement.create({ message: event.text, time });
      req.io.emit('announcement', announcement);
    } catch (e) {
      throw e;
    }
  } else {
    console.log("Wrong channel");
    console.log(event.channel, event.text);
  }
  httpResponse.successResponse(res, { challenge });
};

const read = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    httpResponse.successResponse(res, announcements);
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

export default { create, read };
