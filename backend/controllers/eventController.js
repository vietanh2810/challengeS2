// eventController.js

const { SessionEvent, CustomEvent } = require('../models/mongoDb');
const db = require("../models");
const Company = db.companies;
const conversionFunnel = db.conversionFunnel;


const createEvent = async (eventName, eventData, sessionEventSaveFn = SessionEvent.prototype.save, customEventSaveFn = CustomEvent.prototype.save) => {
  if (eventName === 'session_event') {
    const sessionEvent = new SessionEvent(eventData);

    try {
      const savedEvent = await sessionEventSaveFn.call(sessionEvent);
      console.log('SessionEvent saved:', savedEvent);
    } catch (error) {
      console.error('Error saving SessionEvent:', error);
    }
  } else if (eventName === 'custom_event') {
    const customEvent = new CustomEvent(eventData);

    try {
      const savedEvent = await customEventSaveFn.call(customEvent);
      console.log('CustomEvent saved:', savedEvent);
    } catch (error) {
      console.error('Error saving CustomEvent:', error);
    }
  } else {
    console.error('Unknown event type:', eventName);
  }
};



const getEventTypes = async (req, res) => {

  console.log(req.user)

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
    .then((eventTypes) => {
      return res.status(200).json(eventTypes);
    })
    .catch((error) => {
      console.error('Error fetching eventTypes:', error);
      return res.status(500).json({ error: "Internal server error" });
    });
};

const getAllUrl = async (res,req) => {

  console.log(req.user)

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
  .distinct('url')
  .then((urls) => {
    res.status(200).json(urls);
  })
  .catch((error) => {
    res.status(500).json({ error: "Internal server error" });
  });
}

const getNbOfEventsByDate = async (appId, eventType, tagId, start, end) => {
  const altAppId = appId || 'test'; // Use a default value if appId is not provided

  return Promise.resolve(CustomEvent.find({
    app_id: altAppId,
    event_types: eventType,
    tag_id: tagId,
    tdate: {
      $gte: new Date(start),
      $lt: new Date(end),
    },
  }))
    .then((events) => {
      return events.length;
    });
};


const getCustomEventsByDate = async (conversionFunnelId, visitorId, tag_id) => {
  const convFunnel = await conversionFunnel.findOne({ where: { id: conversionFunnelId } });

  if (!convFunnel) {
      return 0;
  }

  const tagList = convFunnel.tagList;

  console.log(tagList)

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
        _id: 0, 
        location: '$_id.location',
        screen_resolution: '$_id.screen_resolution',
        count: 1,
      },
    },
  ])
  .then((heatmapData) => {
    console.log(heatmapData);
    return heatmapData;
  });    
}

const getGrapheByDate = (start, end, eventType, tagId, graphType, step, stepType, appId) => {
  const altTagId = tagId === null ? 'core-docs-tags' : tagId;

  let groupByStep = {};
  if (stepType === 'hour') {
    groupByStep = { $mod: [{ $toLong: { $toDate: '$tdate' } }, 1000 * 60 * 60 * step] };
  } else if (stepType === 'day') {
    groupByStep = { $mod: [{ $toLong: { $toDate: '$tdate' } }, 1000 * 60 * 60 * 24 * step] };
  } else if (stepType === 'week') {
    groupByStep = { $subtract: [{ $toLong: { $toDate: '$tdate' } }, { $mod: [{ $toLong: { $toDate: '$tdate' } }, 1000 * 60 * 60 * 24 * 7] }] };
  } else if (stepType === 'month') {
    groupByStep = { $subtract: [{ $toLong: { $toDate: '$tdate' } }, { $mod: [{ $toLong: { $toDate: '$tdate' } }, 1000 * 60 * 60 * 24 * 30] }] };
  } 

  if (graphType === 'all_time') {
    if (eventType === 'new_visitor') {
      return CustomEvent.aggregate([
        {
          $match: {
            event_types: eventType,
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
      ])
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
      ])
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
      ])
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
      ])
        .then((graphData) => {
          return graphData;
        });
    }
  }
}




module.exports = {
  createEvent,
  getEventTypes,
  getAllUrl,
  getNbOfEventsByDate,
  getCustomEventsByDate,
  getHeatMapByDate,
  getGrapheByDate,
};
