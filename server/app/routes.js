module.exports = (app) => {
  const employees = require('./EmployeeController.js');

  // Create a new employee
  app.post('/employees', employees.create);

  // View all employees
  app.get('/employees', employees.findAll);

  // View single employee
  app.get('/employees/:employeeId', employees.findOne);

  app.put('/employees/:employeeId', employees.update);

  app.delete('/employees/:employeeId', employees.delete);

  const reviews = require('./ReviewController.js');

  app.post('/performanceReviews', reviews.create);

  app.get('/performanceReviews', reviews.findAll);

  app.get('/performanceReviews/:employeeId', reviews.findReviews);

  app.get('/nofeedbackreviews/:employeeId', reviews.findNoFeedbackReviews);

  app.get('performanceReviews/:reviewId', reviews.findOne);

  app.put('/employees/:employeeId/performanceReviews/:reviewId', reviews.update);

  app.delete('/performanceReviews/:reviewId', reviews.delete);
}