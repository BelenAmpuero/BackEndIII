const ROLES = {
    ADMIN: "admin",
    USER: "user",
    DELIVERY: 'delivery'
};

const ORDER_STATUS = {
    PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const DELIVERY_STATUS = {
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const ORDER_PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
};


module.exports = {
  ROLES,
  ORDER_STATUS,
  DELIVERY_STATUS,
  ORDER_PRIORITY
};