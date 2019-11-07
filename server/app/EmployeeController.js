const Employee = require('./EmployeeModel.js');

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Employee content cannot be empty"
    });
  }

  const employee = new Employee({
    id: req.body.id,
    name: req.body.name,
  });

  employee.save()
  .then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message
    });
  });
};

// Retrieve all employees from the database
exports.findAll = (req, res) => {
  Employee.find()
  .then(employees => {
    res.send(employees);
  }).catch(err => {
    res.status(500).send({
      message: err.message
    });
  })
};

exports.findOne = (req, res) => {
  console.log('params: ', req.params);
  Employee.findById(req.params.employeeId)
  .then(employee => {
    if (!employee) {
      return res.status(404).send({
        message: "Employee " + req.params.employeeId + " not found."
      });  
    }
    res.send(employee);
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "Employee " + req.params.employeeId + " not found."
      }); 
    }
    return res.status(500).send({
      message: "Error retreiving " + req.params.employeeId
    });
  })
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Not allow empty content."
    });
  }

  Employee.findByIdAndUpdate(req.params.employeeId, {
    id: req.body.id,
    name: req.body.name
  }, {new: true})
  .then(employee => {
    if (!employee) {
      return res.status(404).send({
        message: "Employee " + req.params.employeeId + " not found."
      });
    }
    res.send(employee);
  }).catch(err => {
    if(err.kind === 'ObjectId') {
      return res.status(404).send({
          message: "Employee " + req.params.employeeId + " not found."
      });                
    }
    return res.status(500).send({
        message: "Error retreiving " + req.params.employeeId
    });
  });
};

// Deleting an employee
exports.delete = (req, res) => {
  console.log('params = ', req.params);
  Employee.findByIdAndRemove(req.params.employeeId)
  .then(employee => {
    if (!employee) {
      return res.status(404).send({
        message: "Employee " + req.params.employeeId + " not found."
      });
    }
    res.send({message: "Employee deleted successfully!"});
  }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
        message: "Employee " + req.params.employeeId + " not found."
      });               
    }
    return res.status(500).send({
        message: "Error retreiving " + req.params.employeeId
    });
  });
};


