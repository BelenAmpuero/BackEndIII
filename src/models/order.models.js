const { Schema, model } = require ('mongoose');
const { ORDER_STATUS, ORDER_PRIORITY } = require("../utils/constants");

const orderSchema = new Schema ({

user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
},

items: {
    type: [
        {
            product: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    validate: {
        validator: items => items.length > 0,
        message: "El pedido debe tener al menos un producto."
    }
},


total: {
    type: Number,
    required: true,
    min: 0
},

deliveryAddress: {
    type: String,
    required: true
},

status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
},

priority: {
    type: String,
    enum: Object.values(ORDER_PRIORITY),
    default: ORDER_PRIORITY.LOW
}
},
{
      timestamps: true
   });

   module.exports = model("Order", orderSchema);