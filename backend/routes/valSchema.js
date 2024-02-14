const { checkSchema } = require('express-validator');

const orderValidationSchema = {

  orderItems: {
    isArray: {
      errorMessage: 'Order items must be an array',
    },
  },
  'orderItems.*.name': {
    isString: {
      errorMessage: 'Invalid name in order item',
    },
    exists: {
      errorMessage: 'Name is required in order item',
    },
  },
  'orderItems.*.image': {
    isString: {
      errorMessage: 'Invalid image in order item',
    },
    exists: {
      errorMessage: 'Image is required in order item',
    },
  },
  'orderItems.*.qty': {
    isInt: {
      errorMessage: 'Invalid quantity in order item',
    },
    exists: {
      errorMessage: 'Quantity is required in order item',
    },
    escape: true
  },
  'orderItems.*.price': {
    isFloat: {
      errorMessage: 'Invalid price in order item',
    },
    exists: {
      errorMessage: 'Price is required in order item',
    },
  },
  shippingAddress: {
    isObject: {
      errorMessage: 'Shipping address must be an object',
    },
    nestedObject: {
      options: {
        noUnknown: true,
      },
      errorMessage: 'Invalid shipping address format',
      custom: {
        options: (value) => {
          const addressSchema = {
            address: {
              isString: true,
              errorMessage: 'Invalid address format',
            },
            city: {
              isString: true,
              errorMessage: 'Invalid city format',
            },
            postalCode: {
              isString: true,
              errorMessage: 'Invalid postal code format',
            },
            country: {
              isString: true,
              errorMessage: 'Invalid country format',
            },
          };

          return checkSchema(addressSchema)(value);
        },
      },
    },
  },
  paymentMethod: {
    isString: {
      errorMessage: 'Invalid payment method',
    },
    exists: {
      errorMessage: 'Payment method is required',
    },
  },
  'paymentResult.id': {
    isString: {
      errorMessage: 'Invalid payment result ID',
    },
  },
  'paymentResult.status': {
    isString: {
      errorMessage: 'Invalid payment result status',
    },
  },
  'paymentResult.update_time': {
    isString: {
      errorMessage: 'Invalid payment result update time',
    },
  },
  'paymentResult.email_address': {
    isString: {
      errorMessage: 'Invalid payment result email address',
    },
  },
  itemsPrice: {
    isFloat: {
      errorMessage: 'Invalid items price',
    },
    exists: {
      errorMessage: 'Items price is required',
    },
  },
  taxPrice: {
    isFloat: {
      errorMessage: 'Invalid tax price',
    },
    exists: {
      errorMessage: 'Tax price is required',
    },
  },
  shippingPrice: {
    isFloat: {
      errorMessage: 'Invalid shipping price',
    },
    exists: {
      errorMessage: 'Shipping price is required',
    },
  },
  totalPrice: {
    isFloat: {
      errorMessage: 'Invalid total price',
    },
    exists: {
      errorMessage: 'Total price is required',
    },
  },
  isPaid: {
    isBoolean: {
      errorMessage: 'Invalid isPaid value',
    },
    exists: {
      errorMessage: 'isPaid is required',
    },
  },
  paidAt: {
    isISO8601: {
      errorMessage: 'Invalid paidAt date',
    },
  },
  isDelivered: {
    isBoolean: {
      errorMessage: 'Invalid isDelivered value',
    },
    exists: {
      errorMessage: 'isDelivered is required',
    },
  },
  deliveredAt: {
    isISO8601: {
      errorMessage: 'Invalid deliveredAt date',
    },
  },
};

module.exports = orderValidationSchema;
