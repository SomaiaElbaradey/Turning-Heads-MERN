const moongose = require('mongoose');

module.export = function(req, res, next) {
    if(!moongose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send("invalid Id");
    next();
}