const mongoose = require('mongoose');
const config = require('config');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGO_DB || config.get("db"),
    { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.warn("failed to connect to MongoDB")
            console.error(err);
            process.exit(1);
        }
        console.info(`connected to ${config.get("db")} successfully`);
    });