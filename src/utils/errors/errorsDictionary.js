const ERROR_CODES = {
  // Users
  USER_NOT_FOUND: {
    status: 404,
    message: "Usuario no encontrado"
  },

  USER_ALREADY_EXISTS: {
    status: 409,
    message: "El usuario ya existe"
  },

  INVALID_USER_DATA: {
    status: 400,
    message: "Los datos del usuario no son válidos"
  },

  // Orders
  ORDER_NOT_FOUND: {
    status: 404,
    message: "Pedido no encontrado"
  },

  INVALID_ORDER_DATA: {
    status: 400,
    message: "Los datos del pedido no son válidos"
  },

  INVALID_ORDER_STATUS: {
    status: 400,
    message: "El estado del pedido no es válido"
  },

  ORDER_ALREADY_CANCELLED: {
    status: 409,
    message: "El pedido ya fue cancelado"
  },

  ORDER_CANNOT_BE_CANCELLED: {
    status: 400,
    message: "El pedido no puede cancelarse en su estado actual"
  },
  
ROUTE_NOT_FOUND: {
  status: 404,
  message: "Ruta no encontrada"
},

  // Delivery person
  DELIVERY_PERSON_NOT_FOUND: {
    status: 404,
    message: "Repartidor no encontrado"
  },

  DELIVERY_PERSON_NOT_AVAILABLE: {
    status: 409,
    message: "El repartidor no está disponible"
  },

  DELIVERY_PERSON_ALREADY_ASSIGNED: {
    status: 409,
    message: "El repartidor ya está asignado a una entrega"
  },

  INVALID_DELIVERY_PERSON: {
    status: 400,
    message: "Los datos del repartidor no son válidos"
  },

  // Delivery
  DELIVERY_NOT_FOUND: {
    status: 404,
    message: "Entrega no encontrada"
  },

  INVALID_DELIVERY_DATA: {
    status: 400,
    message: "Los datos de la entrega no son válidos"
},

  DELIVERY_ALREADY_COMPLETED: {
    status: 409,
    message: "La entrega ya fue completada"
  },

  INVALID_DELIVERY_STATUS: {
    status: 400,
    message: "El estado de la entrega no es válido"
  },

  DELIVERY_ASSIGNMENT_FAILED: {
    status: 400,
    message: "No se pudo asignar la entrega"
  },

  // Mocks
  INVALID_MOCK_QUANTITY: {
    status: 400,
    message: "La cantidad de mocks solicitada no es válida"
  },

  MOCK_GENERATION_ERROR: {
    status: 500,
    message: "Error al generar los datos de prueba"
  },

  MOCK_DATABASE_ERROR: {
    status: 500,
    message: "Error al guardar los datos de prueba"
  }
};

module.exports = ERROR_CODES;