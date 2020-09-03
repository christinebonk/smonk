const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const config = require('config');

const Guests = require('../../models/Guests.js');

// @route 	POST api/guests
// @desc 	Invite Guest
// @access 	Public 

router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('attending', 'Attending indicator is required').not().isEmpty()
    ],

    async (req, res) => {
    	//Handle validation errors
    	const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var {
            name,
            allergies,
            attending,
            party
        } = req.body;

        if (party) { party = party.split(',') }


        try {
            //TODO: Check if party already exists
            // let guests = await Guests.findOne({ guests: req._id });
            // if (guests) {
            //     return res.status(400).json({
            //         errors: [{ msg: "Guest already exists" }]
            //     });
            // }

            //Create new party
            guests = new Guests({ name, allergies, attending, party });
            await guests.save();
            res.json(guests);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;