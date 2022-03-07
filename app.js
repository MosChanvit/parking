let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mysql = require("mysql");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection to mysql database
let dbCon = mysql.createConnection({
    host: "host.docker.internal",
    user: "root",
    password: "1234",
    database: "parking",
});
dbCon.connect();

// homepage route
app.get("/", (req, res) => {
    return res.send({
        error: false,
        message: "Welcome to PARKING",
    });
});

// Get type_car
app.get("/type_car", (req, res) => {
    dbCon.query("SELECT * FROM type_car", (error, results, fields) => {
        if (error) throw error;

        let message = "";
        if (results === undefined || results.length == 0) {
            message = "record table is empty";
        } else {
            message = "Successfully get all type_car";
        }
        return res.send({ error: false, data: results, message: message });
    });
});

//  add  new type_car
app.post("/type_car", (req, res) => {
    let size = req.body.size;
    let count = req.body.count;

    // validation
    if (!size || !count) {
        return res.status(400).send({
            error: true,
            message: "Please provide type_car size and count.",
        });
    } else {
        dbCon.query(
            "SELECT * FROM type_car WHERE size = ? ",
            size,
            (error, results, fields) => {
                if (results === undefined || results.length == 0) {
                    dbCon.query(
                        "INSERT INTO type_car (size, count) VALUES(?, ?)",
                        [size, count],
                        (error, results, fields) => {
                            if (error) throw error;
                            return res.send({
                                error: false,
                                data: results,
                                message: "type_car successfully added",
                            });
                        }
                    );
                } else {
                    dbCon.query(
                        "UPDATE type_car SET count = ? WHERE size = ?",
                        [count, size],
                        (error, results, fields) => {
                            if (error) throw error;
                            return res.send({
                                error: false,
                                data: results,
                                message: "type_car successfully Update",
                            });
                        }
                    );
                }
            }
        );
    }
});

// // add new car_in
app.post("/car_in", (req, res) => {
    let size = req.body.size;
    let license_plate = req.body.license_plate;

    // validation
    if (!size || !license_plate) {
        return res.status(400).send({
            error: true,
            message: "Please provide type_car size and slot.",
        });
    } else {
        // var sizeCount;
        dbCon.query(
            "SELECT record.*,type_car.count AS count_limit, (SELECT MIN(slot) FROM record WHERE size = ? AND status = false ) AS slot_off_min , (SELECT Max(slot) FROM record WHERE size = ?  ) AS slot_max  FROM `record` left JOIN type_car ON type_car.size = record.size  WHERE record.size = ? AND record.status = true ;",
            [size, size, size],
            (error, results, fields) => {
                if (error) throw error;
                if (results.length == 0) {
                    dbCon.query(
                        "INSERT INTO `record`(`size`, `slot`, `license_plate`, `status`) VALUES (?,?,?,true)",
                        [size, 1, license_plate],
                        (error, results, fields) => {
                            if (error) throw error;
                            return res.send({
                                error: false,
                                // data: results,
                                message: "You get parking slot =>  " + size + 1,
                            });
                        }
                    );
                } else if (results.length >= results[0].count_limit) {
                    if (error) throw error;
                    return res.send.status(400)({
                        error: true,
                        // data: results,
                        message: "Parking Size " + size + " fully ",
                    });
                } else {
                    if (
                        results[0].slot_off_min == undefined ||
                        results[0].slot_off_min == "NULL"
                    ) {
                        console.log(results[0].slot_max + 1);

                        dbCon.query(
                            "INSERT INTO `record`(`size`, `slot`, `license_plate`, `status`) VALUES (?,?,?,true)",
                            [size, results[0].slot_max + 1, license_plate],
                            (error, results, fields) => {
                                if (error) throw error;
                                return res.send({
                                    error: false,
                                    // data: results,
                                    message:
                                        "You get parking slot =>  " +
                                        size +
                                        results[0].slot_max +
                                        1,
                                });
                            }
                        );
                    } else {
                        console.log(results[0].slot_off_min);

                        dbCon.query(
                            "UPDATE record SET license_plate = ? , status = true , time = CURRENT_TIMESTAMP WHERE size = ? AND slot = ?",
                            [license_plate, size, results[0].slot_off_min],
                            (error, results, fields) => {
                                if (error) throw error;
                                return res.send({
                                    error: false,
                                    data: results,
                                    message:
                                        "You get parking slot =>  " +
                                        size +
                                        results[0].slot_off_min,
                                });
                            }
                        );
                    }
                }
            }
        );
    }
});

// car_out
app.post("/car_out", (req, res) => {
    let slot = req.body.slot;
    let license_plate = req.body.license_plate;

    // validation
    if (!slot || !license_plate) {
        return res.status(400).send({
            error: true,
            message: "Please provide type_car license_plate and slot.",
        });
    } else {
        // var sizeCount;
        dbCon.query(
            "SELECT * ,CONCAT(size, slot) AS slot  FROM `record` WHERE CONCAT(size, slot) = ? AND license_plate = ?  AND status = true",
            [slot, license_plate],
            (error, results, fields) => {
                if (error) throw error;
                if (results.length == 0) {
                    return res.status(400).send({
                        error: true,
                        message: "No slot ",
                    });
                } else {
                    dbCon.query(
                        "UPDATE record SET license_plate = '' , status = false  WHERE CONCAT(size, slot) = ? AND license_plate = ? ",
                        [slot, license_plate],
                        (error, results, fields) => {
                            if (error) throw error;
                            return res.send({
                                error: false,
                                // data: results,
                                message:
                                    "You  leave the slot " +
                                    slot +
                                    " successfully ",
                            });
                        }
                    );
                }
            }
        );
    }
});

// Get  all slot
app.get("/slot/:slot", (req, res) => {
    let slot = req.params.slot;

    if (!slot) {
        return res
            .status(400)
            .send({ error: true, message: "Please provide book slot" });
    } else {
        dbCon.query(
            "SELECT CONCAT(size, slot) AS slot ,license_plate,TIME  FROM `record` WHERE CONCAT(size, slot) = ? ",
            slot,
            (error, results, fields) => {
                if (error) throw error;

                let message = "";
                if (results === undefined || results.length == 0) {
                    message = "record table is empty";
                } else {
                    message = "Successfully get slot " + slot;
                }
                return res.send({
                    error: false,
                    data: results[0],
                    message: message,
                });
            }
        );
    }
});

// get license_plate_by_size by size
app.get("/license_plate_by_size/:size", (req, res) => {
    let size = req.params.size;

    if (!size) {
        return res
            .status(400)
            .send({ error: true, message: "Please provide  size" });
    } else {
        dbCon.query(
            // "SELECT GROUP_CONCAT(license_plate ORDER BY slot ) AS license_plate_all  FROM `record` WHERE  status = true AND size = ?;",
            "SELECT license_plate   FROM `record` WHERE  status = true AND size = ? ORDER BY slot;",

            size,
            (error, results, fields) => {
                if (error) throw error;

                let message = "";
                if (results.length <= 0) {
                    message = "record table is empty";
                    return res.status(400).send({
                        error: true,
                        // data: results[0].license_plate_all,
                        message: message,
                    });
                } else {
                    message = "Successfully get license_plate_all ";
                    return res.send({
                        error: false,
                        data: results,
                        message: message,
                    });
                }
            }
        );
    }
});

// get slot by size

app.get("/slot_by_size/:size", (req, res) => {
    let size = req.params.size;

    if (!size) {
        return res
            .status(400)
            .send({ error: true, message: "Please provide book size" });
    } else {
        dbCon.query(
            // "SELECT GROUP_CONCAT(CONCAT(size, slot) ORDER BY slot ) AS slot_all  FROM `record` WHERE  status = true AND size = ?;",
            "SELECT CONCAT(size, slot) AS slot  FROM `record` WHERE  status = true AND size = ? ORDER BY slot; ",

            size,
            (error, results, fields) => {
                if (error) throw error;

                let message = "";
                if (results.length <= 0) {
                    message = "record table is empty";
                    return res.status(400).send({
                        error: true,
                        // data: results[0].slot_all,
                        message: message,
                    });
                } else {
                    message = "Successfully get slot_all by size " + size;
                    return res.send({
                        error: false,
                        data: results,
                        message: message,
                    });
                }
            }
        );
    }
});

app.listen(3000, () => {
    console.log("App is running on port 3000");
});

module.exports = app;
