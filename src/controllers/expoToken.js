import httpResponse from "../utils/httpResponses";
import ExpoToken from '../models/expoToken';
import Expo from 'expo-server-sdk';

const addToken = async (req,res) => {
    const {token} = req.body;

    try{
        const exists = await ExpoToken.findOne({token});

        if(exists)
            throw('token already registered');

        const fields = {
            token
        }

       const newToken = await ExpoToken.create(fields);

        return httpResponse.successResponse(res,newToken);

    }catch(e){
        console.log(e);
        return httpResponse.failureResponse(res,e);
    }
}

const sendMsgTokens = async (req,res) => {
    const {title,body} = req.body

    try{
        let expo = new Expo();

        let messages = [];

        const allTokens = await ExpoToken.find({});

        allTokens.map(tokenObj => {
            const {token} = tokenObj;

            if (!Expo.isExpoPushToken(token)) {
                console.log(`Push token ${token} is not a valid Expo push token`);
                return;
              }

            messages.push({
                to: token,
                sound: 'default',
                title,
                body,
                data: { withSome: 'data' },
              })
            })

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];

        (async () => {
            // Send the chunks to the Expo push notification service. There are
            // different strategies you could use. A simple one is to send one chunk at a
            // time, which nicely spreads the load out over time:
            for (let chunk of chunks) {
              try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
                // NOTE: If a ticket contains an error code in ticket.details.error, you
                // must handle it appropriately. The error codes are listed in the Expo
                // documentation:
                // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
              } catch (error) {
                console.log(error);
              }
            }
        })();

          httpResponse.successResponse(res,'sent notification successfully')
    }catch(e){
      console.log(e)
      httpResponse.failureResponse(res,e);
    }
}

export default {addToken,sendMsgTokens};