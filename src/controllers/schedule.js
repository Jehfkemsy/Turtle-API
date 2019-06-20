import Schedule from "../models/schedule";
import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

const create = async (req, res) => 
{
    try{
        const {title, description, host, logo, category} = req.body;

        const date = new Date();

        const fields = {
            title: title,
            description: description,
            host: host,
            logo: logo,
            category: category,
            startTime: date,
            endTime: date
            };

        const schedule = await Schedule.create(fields);
    }catch(e)
    {
        console.log(e)
        logger.info({e});
        httpResponse.failureResponse(res, e);
    }
}

const read = async (req, res) =>
{
    try
    {
        const schedule = await Schedule.find({});

        return httpResponse.successResponse(res, schedule);
    }catch(e)
    {
        console.log(e)
        logger.info({e});
        httpResponse.failureResponse(res, e); 
    }
}

const update = async (req, res) =>
{
    try
    {
        const {title, description, host, logo, category} = req.body;

        const schedule = await Schedule.findOneAndUpdate({title: title}, 
            {
                title: title,
                description: description,
                host: host,
                logo: logo,
                category: category
            });
        httpResponse.successResponse(res, schedule);
    }catch(e)
    {
        console.log(e)
        logger.info({e});
        httpResponse.failureResponse(res, e); 
    }
}

const remove = async (req, res) => 
{
    try
    {
        const title = req.body;

        const schedule = await Schedule.findOneAndDelete({title: title});

        httpResponse.successResponse(res,schedule);
    }catch(e)
    {
        console.log(e)
        logger.info({e});
        httpResponse.failureResponse(res, e);  
    }
}

export default {remove, update, read, create};