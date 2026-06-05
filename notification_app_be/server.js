const express = require("express");

const logger = require("../logging_middleware/logger");

const app = express();

app.use(express.json());

app.use(logger);

let notifications = [
    {
        id: 1,
        type: "Placement",
        message: "Google Hiring Drive",
        isRead: false,
        createdAt: new Date()
    },
    {
        id: 2,
        type: "Result",
        message: "Mid Exam Results Published",
        isRead: false,
        createdAt: new Date()
    }
];


// Get all notifications
app.get("/notifications", (req, res) => {

    res.status(200).json({
        success: true,
        notifications: notifications
    });

});


// Create notification
app.post("/notifications", (req, res) => {

    const { id, type, message } = req.body;

    const newNotification = {
        id,
        type,
        message,
        isRead: false,
        createdAt: new Date()
    };

    notifications.push(newNotification);

    res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: newNotification
    });

});


// Mark notification as read
app.put("/notifications/:id/read", (req, res) => {

    const id = parseInt(req.params.id);

    const notification = notifications.find(
        notification => notification.id === id
    );

    if (!notification) {

        return res.status(404).json({
            success: false,
            message: "Notification not found"
        });

    }

    notification.isRead = true;

    res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification
    });

});


// Delete notification
app.delete("/notifications/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const existingNotification = notifications.find(
        notification => notification.id === id
    );

    if (!existingNotification) {

        return res.status(404).json({
            success: false,
            message: "Notification not found"
        });

    }

    notifications = notifications.filter(
        notification => notification.id !== id
    );

    res.status(200).json({
        success: true,
        message: "Notification deleted successfully"
    });

});


app.listen(3000, () => {

    process.stdout.write("Server running on port 3000\n");

});