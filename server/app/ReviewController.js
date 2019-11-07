const Review = require('./ReviewModel.js');

exports.create = (req, res) => {
  console.log('body = ', req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Review content cannot be empty"
    });
  }

  const review = new Review({
    id: req.body.id,
    content: req.body.content,
    reviewee: req.body.reviewee,
    reviewer: req.body.reviewer
  });

  review.save()
  .then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message
    });
  });
}

// Retrieve all reviews from the database
exports.findAll = (req, res) => {
  Review.find()
  .then(reviews => {
    res.send(reviews);
  }).catch(err => {
    res.status(500).send({
      message: err.message
    });
  })
};

exports.findOne = (req, res) => {
  Review.findById(req.params.reviewId)
  .then(review => {
    if (!review) {
      return res.status(404).send({
        message: "Review " + req.params.reviewId + " not found."
      });  
    }
    res.send(review);
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "Review " + req.params.reviewId + " not found."
      }); 
    }
    return res.status(500).send({
      message: "Error retreiving " + req.params.reviewId
    });
  })
};

// Find reviews of a reviewee that needs a feedback
exports.findReviews = (req, res) => {
  console.log(req.params);
  Review.find({ reviewee: req.params.employeeId})
  .then(reviews => {
    console.log('reviews: ', reviews);
    res.send(reviews);
  }).catch(err => {
    res.status(500).send({
      message: err.message
    });
  });
}

// Find reviews of a reviewee that needs a feedback
exports.findNoFeedbackReviews = (req, res) => {
  console.log(req.params);
  Review.find({ reviewee: req.params.employeeId, feedback: null })
  .then(reviews => {
    console.log('reviews: ', reviews);
    res.send(reviews);
  }).catch(err => {
    res.status(500).send({
      message: err.message
    });
  });
}

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Not allow empty content."
    });
  }

  Review.findByIdAndUpdate(req.params.reviewId, {
    id: req.body.id,
    content: req.body.content,
    feedback: req.body.feedback
  }, {new: true})
  .then(review => {
    if (!review) {
      return res.status(404).send({
        message: "Review " + req.params.reviewId + " not found."
      });
    }
    res.send(review);
  }).catch(err => {
    if(err.kind === 'ObjectId') {
      return res.status(404).send({
          message: "Review " + req.params.reviewId + " not found."
      });                
    }
    return res.status(500).send({
        message: "Error retreiving " + req.params.reviewId
    });
  });
};

// Deleting a review
exports.delete = (req, res) => {
  console.log('params = ', req.params);
  Review.findByIdAndRemove(req.params.reviewId)
  .then(review => {
    if (!review) {
      return res.status(404).send({
        message: "Employee " + req.params.reviewId + " not found."
      });
    }
    res.send({message: "Employee deleted successfully!"});
  }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
        message: "Employee " + req.params.reviewId + " not found."
      });               
    }
    return res.status(500).send({
        message: "Error retreiving " + req.params.reviewId
    });
  });
};