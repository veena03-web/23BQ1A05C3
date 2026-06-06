const express = require("express");
const axios = require("axios");

const logger = require("../logging_middleware/logger");

const app = express();

const PORT = 4000;

app.use(logger);


function getPriority(type) {

    if (type === "Placement") {
        return 3;
    }

    else if (type === "Result") {
        return 2;
    }

    else {
        return 1;
    }

}


app.get("/top-notifications", async (req, res) => {

    let notifications = [];

    try {

       const response = await axios.get(
    "http://4.224.186.213/evaluation-service/notifications",
    {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2ZWVuYXJhamFzcmVlbHVra2FAZ21haWwuY29tIiwiZXhwIjoxNzgwNjQxNjE5LCJpYXQiOjE3ODA2NDA3MTksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0Y2I3OWNjYy05MzNhLTQ0OTQtYThjZi1mMDJhOTRjZGEzOWQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJsdWtrYSB2ZWVuYSByYWphc3JpIiwic3ViIjoiOWVlNjRmODEtYTUwMi00ZWVjLWEyOWMtMmNlNzYyYThiZDgxIn0sImVtYWlsIjoidmVlbmFyYWphc3JlZWx1a2thQGdtYWlsLmNvbSIsIm5hbWUiOiJsdWtrYSB2ZWVuYSByYWphc3JpIiwicm9sbE5vIjoiMjNicTFhMDVjMyIsImFjY2Vzc0NvZGUiOiJRUWRFWXkiLCJjbGllbnRJRCI6IjllZTY0ZjgxLWE1MDItNGVlYy1hMjljLTJjZTc2MmE4YmQ4MSIsImNsaWVudFNlY3JldCI6Inl1RXBQcHFwZUVBWXBqV0IifQ.2HARpM8Gf_wlpe3hUZqzgkkbpes-t7NZ2yrHR1ssluk"
        }
    }
);

        notifications = response.data.notifications || response.data;

    }

    catch (error) {

        process.stdout.write(
            "External API failed. Using mock data.\n"
        );

        notifications = [
            {
                id: 1,
                type: "Placement",
                message: "Google Hiring Drive",
                isRead: false,
                createdAt: "2026-06-05T10:00:00"
            },
            {
                id: 2,
                type: "Result",
                message: "Semester Results Published",
                isRead: false,
                createdAt: "2026-06-05T09:00:00"
            },
            {
                id: 3,
                type: "Event",
                message: "Hackathon Registration",
                isRead: false,
                createdAt: "2026-06-04T08:00:00"
            }
        ];

    }


    notifications = notifications.filter(
        notification => notification.isRead === false
    );


    notifications.sort((a, b) => {

        const priorityDifference =
            getPriority(b.type) - getPriority(a.type);

        if (priorityDifference !== 0) {
            return priorityDifference;
        }

        return new Date(b.createdAt) - new Date(a.createdAt);

    });


    const topNotifications = notifications.slice(0, 10);


    res.status(200).json({
        success: true,
        total: topNotifications.length,
        data: topNotifications
    });

});


app.listen(PORT, () => {

    process.stdout.write(
        `Question3 server running on port ${PORT}\n`
    );

});