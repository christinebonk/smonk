const express = require('express');
const router = express.Router();
const config = require('config');

const Guests = require('../../models/Guests.js');

// @route 	POST api/guests
// @desc 	Invite Guest
// @access 	Public 

router.post('/',

    async (req, res) => {
    	//TODO: Add validation to ensure proper data from request
        const {
        	name,
        	allergies,
        	attending
        } = req.body;

        try {
        	//TODO: Check if party already exists
            // let guests = await Guests.findOne({ guests: req._id });
            // if (guests) {
            //     return res.status(400).json({
            //         errors: [{ msg: "Guest already exists" }]
            //     });
            // }

            //Create new party
            guests = new Guests({name, allergies, attending});
            await guests.save();
            res.json(guests);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;