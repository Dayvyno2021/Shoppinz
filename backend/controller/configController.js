import asyncHandler from "../middleware.js/asyncHandler.js";
import { validationResult, matchedData } from "express-validator";

//Desc: Get payment key
//Route: /api/config/:payment
//Access: Private
export const paymentKey = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    const { payment } = data;
    if (payment.toLowerCase() === 'paypal') {
      return res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
    } else if (payment.toLowerCase() === 'paystack') {
      return res.send({ clientId: process.env.PAYSTACK_TEST_KEY });
    } else if (payment.toLowerCase() === 'fincra') {
      return res.send({ clientId: process.env.FINCRA_KEY });
    } else {
      res.status(404);
      throw new Error('No payment gatway selected');
    }
  } else {
    res.status(401)
    throw new Error('Invalid inputs');
  }
})