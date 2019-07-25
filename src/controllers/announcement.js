import Announcement from "../models/announcement";

import httpResponse from "../utils/httpResponses";

import moment from 'moment';
import logger from "../utils/logger";

// const {CHANNEL_ID} = process.env;

// const create = async (req, res) => {
//   const { challenge, event } = req.body;
//   if(!challenge && event && event.channel === CHANNEL_ID) {
//     const verify = await Announcement.find({message_id: event.client_msg_id});
//     if(verify.client_msg_id !== event.client_msg_id) {
//       try{
//         const time = moment().tz('America/New_York').format('h:mma');
//         const announce = await Announcement.create({ message_id: event.client_msg_id, message: event.text, time });
//         req.io.emit('announcement', announce);
//       } catch( e) {
//         httpResponse.failureResponse(res, { e });
//       }
//     } 
//   } else {
//     console.log(event.channel, event.text);
//   }
//   if(challenge)
//   {
//     httpResponse.successResponse(res, { challenge });
//   }
    
// };

// const read = async (req, res) => {
//   try {
//     const announcements = await Announcement.find();
//     console.log({announcements});
//     httpResponse.successResponse(res, announcements);
//   } catch (e) {
//     httpResponse.failureResponse(res, e);
//   }
// };

const create = async(req, res) => 
{
  try
  {
    const {title, category, body, sentTime, author} = req.body

    fields = 
    {
      title,
      category,
      body,
      sentTime,
      author
    }

    const announcement = await Announcement.create(fields)

    httpResponse.successResponse(res, "success")
  }catch(e)
  {
    logger.info(e)
    httpResponse.failureResponse(res, e)
  }
}

const read = async (req, res) =>
{
  try
  {
    const {title} = req.body

    const announcement = await Announcement.findOne({title})

    httpResponse.successResponse(res, announcement)
  }catch(e)
  {
    logger.info(e)
    httpResponse.failureResponse(res, e)
  }

}

const announce = async (req, res) =>
{
  try
  {
    const {title} = req.body

    const sentTime = new Date();
    announcement = await Announcement.findOneAndUpdate({title}, {
      sentTime
    }, {new: true}) 
    
    req.io.emit("announcement",announcement)

    httpResponse.successResponse(res, "success")
  }catch(e)
  {
    logger.info(e)
    httpResponse.failureResponse(res, e)
  }
}

const update = async (req, res) =>
{
  try
  {
    const {title, category, body, sentTime, author} = req.body

    announcement = Announcement.findOneAndUpdate({title}, 
      {
        category,
        body,
        sentTime,
        author
      }, {new: true})

    httpResponse.successResponse(res, announcement)  
  }catch(e)
  {
    logger.info(e)
    httpResponse.failureResponse(res, e)
  }
}

const remove = async (req, res) =>
{
  try
  {
    const {title} = req.body

    const announcement = await Announcement.findOneAndDelete({title})

    httpResponse.successResponse(res,"success")
  }catch(e)
  {
    logger.info(e)
    httpResponse.failureResponse(res, e)
  }

}

export default { create, read, announce, update, remove};
