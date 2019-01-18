
const validateToken = (req, res, next) => {
    console.log(req.headers);
    // const {x-access-token} = req.headers;
    next();
}

export default token;