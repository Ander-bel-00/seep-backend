const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars').create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
});
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');
const { sequelize, testConnection } = require('./config/database');
require('dotenv').config();

const models = require('./models');

const app = express();

testConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

app.use(cors(corsOptions));

app.engine('hbs', exphbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', routes());

const port = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.sync({ force: false });
        console.log('Database synchronized');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();
