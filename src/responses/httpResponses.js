const successResponse = (res, data) =>
  res.status(200).send({ success: true, data: data });

const failureResponse = (res, data, code = 400) =>
  res.status(code).send({ success: false, error: data });

const emptyResponse = res => res.status(204).send();

export default { successResponse, failureResponse, emptyResponse };
