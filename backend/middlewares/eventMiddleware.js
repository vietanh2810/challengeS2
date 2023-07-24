// middleware/eventMiddleware.js

// Example middleware function for WebSocket handling
exports.validateWebSocketData = (eventData, ws, next) => {
    // Perform validation or preprocessing on the incoming WebSocket data
    // For example, check if the data is valid and authorized
    // If the data is valid, call next() to proceed to the controller
    // If the data is invalid or unauthorized, close the WebSocket connection or take appropriate actions
    next();
};

  // Add more middleware functions as needed
