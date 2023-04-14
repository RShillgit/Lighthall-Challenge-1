var express = require('express');
var router = express.Router();
const State = require('../models/state');

router.get('/', function(req, res, next) {
  State.find({})
  .then(allStates => {
    res.status(200).json({success: true, allStates: allStates});
  })
  .catch(err => {
    res.status(500).json({err, success:false})
  })
});

router.post('/', (req, res) => {

  // Check if this location exists
  State.findOne({name: req.body.location})
  // Successful query
  .then(state => {
    
    // If it exists, incriment its count
    if(state) {
      State.findOneAndUpdate({name: req.body.location}, {
        clicks: req.body.clicks
      })
      // Successfully updated
      .then(() => {
        return res.status(200).json({success: true});
      })
      // Unsuccessfully updated
      .catch(err => {
        return res.status(500).json({err, success:false});
      })
    }

    // If it doesnt exist, create it
    else {
      const newState = new State({
        name: req.body.location,
        clicks: req.body.clicks
      })
      // Successfully saved
      newState.save(

        // Get all states 
        State.find({})
        // Successful query
          .then(allStates => {
            return res.status(200).json({success: true, allStates: allStates});
          })
          // Unsuccessful query
          .catch(err => {
            return res.status(500).json({err, success:false});
          })
      )
      // Unsuccessfully saved
      .catch(err => {
        return res.status(500).json({err, success:false});
      })
    }
  })
  // Unsuccessful query
  .catch(err => {
    res.status(500).json({err, success:false});
  })
})

module.exports = router;
