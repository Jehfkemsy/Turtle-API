import Announcement from "../models/announcement";

import httpResponse from "../utils/httpResponses";

import moment from 'moment';

const {CHANNEL_ID} = process.env;

const create = async (req, res) => {
  const { challenge, event } = req.body;
  const time = moment().format('h:mma');
  if(!challenge && event && event.channel === CHANNEL_ID) {
    const verify = await Announcement.find({message_id: event.client_msg_id});
    if(verify.client_msg_id !== event.client_msg_id) {
      try{
        const announce = await Announcement.create({ message_id: event.client_msg_id, message: event.text, time });
        req.io.emit('announcement', announce);
      } catch( e) {
        httpResponse.failureResponse(res, { e });
      }
    } 
  } else {
    console.log(event.channel, event.text);
  }
  if(challenge)
  {
    httpResponse.successResponse(res, { challenge });
  }
    
};

const read = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    console.log({announcements});
    httpResponse.successResponse(res, announcements);
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

export default { create, read };
