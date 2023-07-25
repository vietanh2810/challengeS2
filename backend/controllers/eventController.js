// eventController.js

const { SessionEvent, CustomEvent } = require('../models/mongoDb');

const createEvent = (eventName, eventData) => {
  if (eventName === 'session_event') {
    // Create a new SessionEvent document
    const sessionEvent = new SessionEvent(eventData);

    // Save the sessionEvent to the database
    sessionEvent.save()
      .then((savedEvent) => {
        console.log('SessionEvent saved:', savedEvent);
      })
      .catch((error) => {
        console.error('Error saving SessionEvent:', error);
      });
  } else if (eventName === 'custom_event') {
    // Create a new CustomEvent document
    const customEvent = new CustomEvent(eventData);

    // Save the customEvent to the database
    customEvent.save()
      .then((savedEvent) => {
        console.log('CustomEvent saved:', savedEvent);
      })
      .catch((error) => {
        console.error('Error saving CustomEvent:', error);
      });
  } else {
    console.error('Unknown event type:', eventName);
  }
};

module.exports = {
  createEvent,
};
