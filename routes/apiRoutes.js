var db = require("../models");



module.exports = function (app) {
  // Get all departments
  app.get("/api/department", function (req, res) {
    db.Department.findAll({}).then(function (dbDepartment) {
      res.json(dbDepartment);
    });
  });

  app.get("/api/department/:id", function (req, res) {
    // Find one Author with the id in req.params.id and return them to the user with res.json
    db.Department.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbDepartment) {
      res.json(dbDepartment);
    });
  });

  app.post("/api/createpost", function (req, res) {
    // Create a post with the data available to us in req.body
    console.log(req.body);
    db.Item.create(req.body).then(function (dbItem) {
      res.json(dbItem);

    });

  });

}
})
})
}

