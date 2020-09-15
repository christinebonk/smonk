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

        //Create object
        var {
            name,
            allergies,
            attending,
            party
        } = req.body;
        if (party) { party = party.split(',') }


        try {
            //Check if party already exists
            let guests = await Guests.findOne({ name: name });
            if (guests) {
                //Update party
                mongoose.set('useFindAndModify', false);
                guests = await Guests.findOneAndUpdate({ name: name }, { $set: { allergies, attending, party } }, { new: true });
                return res.json(guests);
            }

            //Create new party
            guests = new Guests({ name, allergies, attending, party });
            await guests.save();
            res.json(guests);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

// @route 	GET api/guests
// @desc 	Get all guests
// @access 	Public

router.get('/', async (req, res) => {
    try {
        const guests = await Guests.find().populate('guests');
        res.json(guests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route 	GET api/guests/party/:name
// @desc 	Get profile by name
// @access 	Public
router.get('/party/:name', async (req, res) => {
	//Clean Name
	var name = req.params.name; 
	name = name.replace("+", " ");

    try {
        const guests = await Guests.findOne({ name: name }).exec();
        if(!guests) return res.status(400).json({msg: 'Guest not found '})
        res.json(guests);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
        	res.status(400).json({msg: 'Guest not found '});
        }
        res.status(500).send('Server Error')
    }
});

// @route 	DELETE api/guests/party/:name
// @desc 	Delete profile
// @access 	Public

router.delete('/party/:name', async (req,res) => {
	//Clean Name
	var name = req.params.name; 
	name = name.replace("+", " ");

	try {
		const guests = await Guests.findOneAndRemove({name: name});
		res.json({msg: 'Guest Deleted'});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error')
	}
})

module.exports = router;