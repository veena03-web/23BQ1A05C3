const express = require("express");
const axios = require("axios");

const logger = require("../logging_middleware/logger");

const app = express();

app.use(logger);

const PORT = 5000;

const TOKEN = "YOUR_BEARER_TOKEN";


function selectVehicles(vehicles, maxHours) {

    let selected = [];

    let usedHours = 0;

    vehicles.sort((a, b) => b.score - a.score);

    for (const vehicle of vehicles) {

        if (usedHours + vehicle.estimatedRepairTime <= maxHours) {

            selected.push(vehicle);

            usedHours += vehicle.estimatedRepairTime;

        }

    }

    return {
        selectedVehicles: selected,
        totalHours: usedHours
    };

}


app.get("/schedule", async (req, res) => {

    try {

        const depotResponse = await axios.get(
            "http://4.224.186.213/evaluation-service/depots",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        const vehicleResponse = await axios.get(
            "http://4.224.186.213/evaluation-service/vehicles",
            {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2ZWVuYXJhamFzcmVlbHVra2FAZ21haWwuY29tIiwiZXhwIjoxNzgwNjQxNjE5LCJpYXQiOjE3ODA2NDA3MTksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0Y2I3OWNjYy05MzNhLTQ0OTQtYThjZi1mMDJhOTRjZGEzOWQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJsdWtrYSB2ZWVuYSByYWphc3JpIiwic3ViIjoiOWVlNjRmODEtYTUwMi00ZWVjLWEyOWMtMmNlNzYyYThiZDgxIn0sImVtYWlsIjoidmVlbmFyYWphc3JlZWx1a2thQGdtYWlsLmNvbSIsIm5hbWUiOiJsdWtrYSB2ZWVuYSByYWphc3JpIiwicm9sbE5vIjoiMjNicTFhMDVjMyIsImFjY2Vzc0NvZGUiOiJRUWRFWXkiLCJjbGllbnRJRCI6IjllZTY0ZjgxLWE1MDItNGVlYy1hMjljLTJjZTc2MmE4YmQ4MSIsImNsaWVudFNlY3JldCI6Inl1RXBQcHFwZUVBWXBqV0IifQ.2HARpM8Gf_wlpe3hUZqzgkkbpes-t7NZ2yrHR1ssluk`
                }
            }
        );

        const depots = depotResponse.data.depots;
        const vehicles = vehicleResponse.data.vehicles;

        let result = [];

        for (const depot of depots) {

            const selectedData = selectVehicles(
                vehicles,
                depot.MechanicHours
            );

            result.push({
                depotId: depot.ID,
                availableHours: depot.MechanicHours,
                selectedVehicles: selectedData.selectedVehicles,
                usedHours: selectedData.totalHours
            });

        }

        res.status(200).json({
            success: true,
            data: result
        });

    }

    catch (error) {

        process.stdout.write(
            "Failed to fetch depot or vehicle data\n"
        );

        res.status(500).json({
            success: false,
            message: "Unable to process vehicle scheduling"
        });

    }

});


app.listen(PORT, () => {

    process.stdout.write(
        `Vehicle Scheduler running on port ${PORT}\n`
    );

});