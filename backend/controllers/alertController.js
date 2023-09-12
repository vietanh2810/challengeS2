const db = require("../models");
const nodemailer = require("nodemailer");

const Alert = db.alerts;
const Company = db.companies;
const { CustomEvent } = require('../models/mongoDb');
const app = require("../server");
const getAllAlerts = async (req, res) => {
    try {
        const { dataValues } = req.user;

        const role = dataValues.role;

        let alerts = null;

        console.log(Alert)

        if (role === "admin") {
            // If the user is an admin, return all alerts
            alerts = await Alert.findAll();
        } else {
            // If the user is not an admin, return alerts associated with the user's ID
            const userId = dataValues.id;
            alerts = await Alert.findAll({ where: { userId } });
        }
        return res.status(200).json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const checkAlerts = async (eventName, eventData) => {
    try {
        const { app_id } = eventData;
        const company = await Company.findOne(
            { where: { appId: app_id } }
        );
        const userId = company.userId;

        const alerts = await Alert.findAll({ where: { userId } }); // find all alerts associated with the user's ID
        if (alerts.length === 0) return;
        alerts.forEach(async (alert) => {
            console.log(alert.id + " " + JSON.stringify(alert) + "\n");
            if (alert.conversionId !== null) {
            } else {
                const { event_type, value, value_type, notif_method, last_alert_date, time_scale, tag_id } = alert;
                const startDate = getStartDate(time_scale);
                let count = 0;
                if (tag_id) {
                    await CustomEvent.find({
                        app_id: app_id,
                        event_types: event_type,
                        tag_id: tag_id,
                        tdate: {
                            $gte: startDate,
                        },
                    }).then((events) => {
                        console.log(events)
                        count = events.length;
                    });
                } else {
                    await CustomEvent.find({
                        app_id: app_id,
                        event_types: event_type,
                        tdate: {
                            $gte: startDate,
                        },
                    }).then((events) => {
                        console.log(events)
                        count = events.length;
                    });
                }
                if (count >= value && value_type === "number") {
                    const data = {
                        "app_id": app_id,
                        "event_type": event_type,
                        "value": value,
                        "value_type": value_type,
                        "message": "Hi there, you have reached the alert of " + value + " " + event_type + " events in the last " + time_scale + ".",
                    }
                    if (notif_method === "email") {
                        // send email
                    } else {
                        sendHttpAlert(alert.url, data);
                        // send http
                    }
                    alert.last_alert_date = new Date();
                    alert.save();
                }
            }
        });
    } catch (error) {
        return;
    }
}

const sendHttpAlert = (url, data) => {
    try {
        console.log("send http" + url + " " + data)   
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: data,
            url,
        };
        axios(options);
    } catch (error) {
        return;
    }
}

const sendMailAlert = async (mail, data) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "vutony@seznam.cz",
                pass: "Test1234test",
            }
        });

        // setup email data with unicode symbols
        const mailOptions = {
            from: 'Trio Challange <vutony@seznam.cz>', // sender address
            to: mail, // list of receivers
            subject: 'Alert KPI', // Subject line
            text: data.message, // plain text body
        };

        // send mail with defined transport object
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const getStartDate = (time_scale) => {
    const date = new Date();
    switch (time_scale) {
        case "day":
            date.setDate(date.getDate() - 1);
            break;
        case "week":
            date.setDate(date.getDate() - 7);
            break;
        case "month":
            date.setMonth(date.getMonth() - 1);
            break;
    }
    return date;
}

const createAlert = async (req, res) => {
    try {
        const { event_type, time_scale, value, value_type, notif_method, last_alert_date, tag_id, conversionId, mail, url } = req.body;
        const { dataValues } = req.user;
        const userId = dataValues.id;

        let alert = null;

        if (tag_id === undefined || tag_id === null || tag_id === "") {
            if (conversionId === undefined || conversionId === null || conversionId === "") {
                if (notif_method === "http") {
                    alert = await Alert.create({
                        event_type: event_type,
                        value: value,
                        value_type: value_type,
                        notif_method: notif_method,
                        last_alert_date: last_alert_date,
                        time_scale: time_scale,
                        userId: userId,
                        url: url,
                    });
                } else {
                    alert = await Alert.create({
                        event_type: event_type,
                        value: value,
                        value_type: value_type,
                        notif_method: notif_method,
                        last_alert_date: last_alert_date,
                        time_scale: time_scale,
                        userId: userId,
                        mail: mail
                    });
                }
            } else {
                if (notif_method === "http") {
                    alert = await Alert.create({
                        event_type: event_type,
                        value: value,
                        value_type: value_type,
                        notif_method: notif_method,
                        last_alert_date: last_alert_date,
                        time_scale: time_scale,
                        userId: userId,
                        conversionId: conversionId,
                        url: url,
                    });
                } else {
                    alert = await Alert.create({
                        event_type: event_type,
                        value: value,
                        value_type: value_type,
                        notif_method: notif_method,
                        last_alert_date: last_alert_date,
                        time_scale: time_scale,
                        userId: userId,
                        conversionId: conversionId,
                        mail: mail
                    });
                }

            }
        } else {
            if (notif_method === "http") {
                alert = await Alert.create({
                    event_type: event_type,
                    value: value,
                    value_type: value_type,
                    notif_method: notif_method,
                    last_alert_date: last_alert_date,
                    time_scale: time_scale,
                    userId: userId,
                    tag_id: tag_id,
                    url: url,
                });
            } else {
                alert = await Alert.create({
                    event_type: event_type,
                    value: value,
                    value_type: value_type,
                    notif_method: notif_method,
                    last_alert_date: last_alert_date,
                    time_scale: time_scale,
                    userId: userId,
                    tag_id: tag_id,
                    mail: mail
                });
            }
        }
        return res.status(201).json(alert);
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500)//.send('Internal Server Error');
    }
};

const createDefaultAlerts = async (eventType, tag_id, value, value_type, time_scale, notif_method, userId,url, mail) => {
    try {
        if (tag_id === undefined || tag_id === null || tag_id === "") {
            if (notif_method === "http") {
                await Alert.create({
                    event_type: eventType,
                    value: value,
                    value_type: value_type,
                    notif_method: notif_method,
                    last_alert_date: new Date(),
                    time_scale: time_scale,
                    userId: userId,
                    url: url,
                });
            } else {
                await Alert.create({
                    event_type: eventType,
                    value: value,
                    value_type: value_type,
                    notif_method: notif_method,
                    last_alert_date: new Date(),
                    time_scale: time_scale,
                    userId: userId,
                    mail: mail
                });
            }
        } else {
            if (notif_method === "http") {
                await Alert.create({
                    event_type: eventType,
                    value: value,
                    value_type: value_type,
                    notif_method: notif_method,
                    last_alert_date: new Date(),
                    time_scale: time_scale,
                    userId: userId,
                    tag_id: tag_id,
                    url: url,
                });
            } else {
                await Alert.create({
                    event_type: eventType,
                    value: value,
                    value_type: value_type,
                    notif_method: notif_method,
                    last_alert_date: new Date(),
                    time_scale: time_scale,
                    userId: userId,
                    tag_id: tag_id,
                    mail: mail
                });
            }
        }
    }
    catch (error) {
        console.error('Error during create default alert:', error);
        return
    }
}


const updateAlert = async (req, res) => {
    try {
        const id = req.params.id;
        const { event_type, time_scale, value, value_type, notif_method, last_alert_date } = req.body;

        const alert = await Alert.update(
            {
                event_type: event_type,
                value: value,
                value_type: value_type,
                notif_method: notif_method,
                last_alert_date: last_alert_date,
                time_scale: time_scale,
                tag_id: tag_id,
                conversionId: conversionId,
            }, {
            where: { id: id },
            returning: true,
        });

        if (!alert) {
            return res.sendStatus(404);
        } else return res.status(200).json(alert);
    } catch (error) {
        console.error('Error during edit:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getAllAlerts,
    createAlert,
    sendMailAlert,
    updateAlert,
    checkAlerts,
    createDefaultAlerts
}