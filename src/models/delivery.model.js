const { Schema, model } = require("mongoose");
const { DELIVERY_STATUS } = require("../utils/constants");

const deliverySchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    deliveryPerson: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      required: true
    },

    status: {
      type: String,
      enum: Object.values(DELIVERY_STATUS),
      default: DELIVERY_STATUS.ASSIGNED
    },

    assignedAt: {
      type: Date,
      default: Date.now
    },

    deliveredAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Delivery", deliverySchema);