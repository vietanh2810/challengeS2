// eventController.js

const { SessionEvent, CustomEvent } = require('../models/mongoDb');
const db = require("../models");
const dateFns = require('date-fns');
const Company = db.companies;
const conversionFunnel = db.conversionFunnel;


const createEvent = async (eventName, eventData, sessionEventSaveFn = SessionEvent.prototype.save, customEventSaveFn = CustomEvent.prototype.save) => {
  if (eventName === 'session_event') {
    const sessionEvent = new SessionEvent(eventData);

    try {
      const savedEvent = await sessionEventSaveFn.call(sessionEvent);
    } catch (error) {
      console.error('Error saving SessionEvent:', error);
    }
  } else if (eventName === 'custom_event') {
    const customEvent = new CustomEvent(eventData);

    try {
      const savedEvent = await customEventSaveFn.call(customEvent);
    } catch (error) {
      console.error('Error saving CustomEvent:', error);
    }
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
    .then((eventTypes) => {
      res.status(200).json(eventTypes);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

const getAllUrl = async (res,req) => {

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

  if (tagId === null) {
    return Promise.resolve(CustomEvent.find({
      app_id: altAppId,
      event_types: eventType,
      tdate: {
        $gte: new Date(start),
        $lt: new Date(end),
      },
    }))
      .then((events) => {
        return events.length;
      });
  }

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

const getGrapheByDateBis = (start, end, eventType, tagId, graphType, step, stepType, appId) => {
  const altTagId = tagId === null ? 'core-docs-tags' : tagId;

  let incrementFn;
  if (stepType === 'hour') {
    incrementFn = date => new Date(date.setHours(date.getHours() + step));
  } else if (stepType === 'day') {
    incrementFn = date => new Date(date.setDate(date.getDate() + step));
  } else if (stepType === 'week') {
    incrementFn = date => new Date(date.setDate(date.getDate() + 7 * step));
  } else if (stepType === 'month') {
    incrementFn = date => new Date(date.setMonth(date.getMonth() + step));
  }

  if (graphType === 'all_time') {
    if (eventType === 'new_visitor') {
      return CustomEvent.find({event_types: eventType, app_id: appId})
        .then(data => data.length);
    } else {
      return CustomEvent.find({tag_id: altTagId, event_types: eventType})
        .then(data => data.length);
    }
  } else {
    let findQuery = {
      event_types: eventType,
      tdate: {
        $gte: new Date(start),
        $lt: new Date(end)
      }
    };

    if (eventType === 'new_visitor') {
      findQuery.app_id = appId;
    } else {
      findQuery.tag_id = altTagId;
    }

    return CustomEvent.find(findQuery).then(data => {
      const graphData = initializeGraph(new Date(start), new Date(end), step, stepType);
      
      for (let doc of data) {
        let date = new Date(doc.tdate);
      
        if (stepType === 'hour') {
          date.setHours(Math.floor(date.getHours() / step) * step, 0, 0, 0); // round down to the nearest interval
        } else if (stepType === 'day') {
          date.setHours(0, 0, 0, 0); // set to the beginning of the day
          date.setDate(Math.floor(date.getDate() / step) * step + 1); // round up to the nearest interval
          date.setDate(date.getDate() - 1); // subtract one day to get the start of the interval
        } else if (stepType === 'week') {
          date.setHours(0, 0, 0, 0); // set to the beginning of the day
          const dayOfWeek = date.getDay(); // get the day of the week (0 = Sunday, 1 = Monday, etc.)
          const daysToAdd = (step - dayOfWeek + 7) % 7; // calculate the number of days to add to reach the next interval
          date.setDate(date.getDate() + daysToAdd); // set the date to the start of the next interval
        } else if (stepType === 'month') {
          date.setHours(0, 0, 0, 0); // set to the beginning of the day
          date.setMonth(Math.floor(date.getMonth() / step) * step); // round down to the nearest interval
        }
      
        const dateInMillis = date.getTime();
    
      
        // Find the corresponding time span in the graphData and update its count
        for (const graphItem of graphData) {
          if (graphItem.startDate.getTime() <= dateInMillis && graphItem.endDate.getTime() > dateInMillis) {
            graphItem.count += 1;
            break; // Exit the loop once the match is found
          }
        }
      }      
      const newArray = graphData.map(({ startDate, endDate, count }) => ({
        tdate: `${formatDate(startDate,stepType)}`,
        count: count
      }));

      console.log()
  
      return newArray;
    });
  }
};

function formatDate(dateStr,stepType) {
  const date = new Date(dateStr);
  switch (stepType) {
    case 'hour':
      const formattedHour = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        hour12: true
      });
      return formattedHour;
    case 'day':
      const formattedDay = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      });
      return formattedDay;
    case 'week':
      const weekNumber = getWeekNumber(date);
      const weekSuffix = weekNumber === 1 ? "st" : weekNumber === 2 ? "nd" : weekNumber === 3 ? "rd" : "th";
      return `${weekNumber}${weekSuffix} week`;
    case 'month':
      const formattedMonth = date.toLocaleString("en-US", {
        month: "short"
      });
      return formattedMonth;
    default:
      break;
  }
}

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const daysPassed = (date - firstDayOfYear) / 86400000;
  return Math.ceil((firstDayOfYear.getDay() + daysPassed + 1) / 7);
}

const initializeGraph = (startDate, endDate, interval, intervalType) => {
  const graphData = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    graphData.push({
      startDate: new Date(currentDate),
      endDate: new Date(currentDate.getTime() + interval * getTimeUnitInMillis(intervalType)),
      count: 0,
    });
    currentDate = new Date(currentDate.getTime() + interval * getTimeUnitInMillis(intervalType));
  }

  return graphData;
};

const getTimeUnitInMillis = (intervalType) => {
  const timeUnits = {
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2592000000, // Roughly 30 days (ignoring daylight saving time differences)
  };

  return timeUnits[intervalType] || 3600000; // Default to hour if intervalType is not recognized
};




module.exports = {  
  createEvent,
  getEventTypes,
  getAllUrl,
  getNbOfEventsByDate,
  getCustomEventsByDate,
  getHeatMapByDate,
  getGrapheByDate,
  getGrapheByDateBis
};
