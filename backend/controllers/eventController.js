// eventController.js

const { SessionEvent, CustomEvent } = require('../models/mongoDb');
const db = require("../models");
const Company = db.companies;
const conversionFunnel = db.conversionFunnel;


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


const getEventTypes = async (req, res) => {

  const { dataValues } = req.user;
  const userId = dataValues.id;

  const tmpCompany = await Company.findOne({ where: { userId: userId } });
  let appId = null;
  if (tmpCompany) {
    appId = tmpCompany.appId;
  } else {
    appId = 'test';
  }

  return CustomEvent.find({ app_id: appId })
    .distinct('event_types')
    .exec()
    .then((eventTypes) => {
      return res.status(200).json(eventTypes);
    })
    .catch((error) => {
      console.error('Error fetching eventTypes:', error);
      return res.status(500).send('Internal Server Error');
    });
};

const getNbOfEventsByDate = (appId, eventType, tagId, start, end) => {

  const altAppId = appId === undefined ? 'test' : appId;
  const altTagId = tagId === null ? 'core-docs-tags' : tagId;

  if (eventType === 'new_visitor') {
    return CustomEvent.find({
      app_id: altAppId,
      event_types: eventType,
      tdate: {
        $gte: new Date(start),
        $lt: new Date(end),
      },
    })
      .exec()
      .then((events) => {
        return events.length;
    });    
  }

  // Get the events from the database
  return CustomEvent.find({
    app_id: altAppId,
    event_types: eventType,
    tag_id: altTagId,
    tdate: {
      $gte: new Date(start),
      $lt: new Date(end),
    },
  })
    .exec()
    .then((events) => {
      return events.length;
  });    
}

const getCustomEventsByDate = async (conversionFunnelId, visitorId, tag_id) => {
  const convFunnel = await conversionFunnel.findOne({ where: { id: conversionFunnelId } });

  if (!convFunnel) {
    return 0;
  }

  const tagList = convFunnel.tagList;

  const customEvents = await CustomEvent.findAll({
    where: {
      visitor_id: visitorId,
      tag_id: tag_id,
    },
    order: [['tdate', 'ASC']],
  });

  let tagIndex = 0;
  let count = 0;

  for (const event of customEvents) {
    if (event.event_types === tagList[tagIndex]) {
      tagIndex++;
      if (tagIndex === tagList.length) {
        count++;
        tagIndex = 0;
      }
    }
  }

  return count;
};

const getHeatMapByDate = (appUrl, start, end) => {
  const tmpUrl = appUrl === undefined ? 'http://localhost:8081/' : appUrl;

  // Get the events from the database and perform aggregation
  return CustomEvent.aggregate([
    {
      $match: {
        url: tmpUrl,
        tdate: {
          $gte: new Date(start),
          $lt: new Date(end),
        },
      },
    },
    {
      $group: {
        _id: {
          location: '$location',
          screen_resolution: '$screen_resolution',
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0, // Exclude the default _id field from the result
        location: '$_id.location',
        screen_resolution: '$_id.screen_resolution',
        count: 1,
      },
    },
  ]).exec()
  .then((heatmapData) => {
    console.log(heatmapData);
    return heatmapData;
  });    
}

const getGrapheByDate = (start, end, eventType, tagId, graphType, step, stepType, appId) => {
  console.log('start', start);
  console.log('end', end);
  console.log('eventType', eventType);
  console.log('tagId', tagId);
  console.log('graphType', graphType);
  console.log('step', step);
  console.log('stepType', stepType);
  console.log('appId', appId);
  const altTagId = tagId === null ? 'core-docs-tags' : tagId;

  let groupByStep = {};
  if (stepType === 'minute') {
    groupByStep = { $mod: [{ $toLong: { $toDate: '$tdate' } }, 1000 * 60 * step] };
  } else if (stepType === 'hour') {
    groupByStep = { $mod: [{ $toLong: { $toDate: '$tdate' } }, 1000 * 60 * 60 * step] };
  } else if (stepType === 'day') {
    groupByStep = { $mod: [{ $toLong: { $toDate: '$tdate' } }, 1000 * 60 * 60 * 24 * step] };
  } else if (stepType === 'week') {
    // Calculate the start of the week by subtracting the day of the week from the timestamp
    groupByStep = { $subtract: [{ $toLong: { $toDate: '$tdate' } }, { $mod: [{ $toLong: { $toDate: '$tdate' } }, 1000 * 60 * 60 * 24 * 7] }] };
  }

  // Get the events from the database and perform aggregation
  if (graphType === 'all_time') {
    if (eventType === 'new_visitor') {
      return CustomEvent.aggregate([
        {
          $match: {
            app_id: appId,
            tdate: {
              $gte: new Date(start),
              $lt: new Date(end),
            },
          },
        },
        {
          $count: 'count',
        },
      ]).exec()
      .then((graphData) => {
        return graphData.length > 0 ? graphData[0].count : 0;
      });
    } else {
      return CustomEvent.aggregate([
        {
          $match: {
            tag_id: altTagId,
            event_types: eventType,
            tdate: {
              $gte: new Date(start),
              $lt: new Date(end),
            },
          },
        },
        {
          $count: 'count',
        },
      ]).exec()
      .then((graphData) => {
        return graphData.length > 0 ? graphData[0].count : 0;
      });
    }
  }
  else {
    if (eventType === 'new_visitor') {
      return CustomEvent.aggregate([
        {
          $match: {
            app_id: appId,
            tdate: {
              $gte: new Date(start),
              $lt: new Date(end),
            },
          },
        },
        {
          $group: {
            _id: {
              $toDate: {
                $subtract: [
                  { $toLong: { $toDate: '$tdate' } },
                  groupByStep,
                ],
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            tdate: '$_id',
            count: 1,
          },
        },
      ]).exec()
        .then((graphData) => {
          return graphData;
        });
    } else {
      return CustomEvent.aggregate([
        {
          $match: {
            tag_id: altTagId,
            event_types: eventType,
            tdate: {
              $gte: new Date(start),
              $lt: new Date(end),
            },
          },
        },
        {
          $group: {
            _id: {
              $toDate: {
                $subtract: [
                  { $toLong: { $toDate: '$tdate' } },
                  groupByStep,
                ],
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            tdate: '$_id',
            count: 1,
          },
        },
      ]).exec()
        .then((graphData) => {
          return graphData;
        });
    }
  }
}




module.exports = {
  createEvent,
  getEventTypes,
  getNbOfEventsByDate,
  getCustomEventsByDate,
  getHeatMapByDate,
  getGrapheByDate
};
