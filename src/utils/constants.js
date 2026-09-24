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

const DOCUMENT_TYPES = {
  USER_DOCUMENT: 'user_document',
  DRIVER_LICENSE: 'driver_license',
  DELIVERY_PROOF: 'delivery_proof'
};

const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

module.exports = {
  ROLES,
  ORDER_STATUS,
  DELIVERY_STATUS,
  ORDER_PRIORITY,
  DOCUMENT_TYPES,
  PAGINATION
};