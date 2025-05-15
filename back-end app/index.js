require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes'); 
const servHombreRoutes = require('./routes/servHombreRoutes'); 
const servMujerRoutes =  require('./routes/servMujerRoutes');
const servNiñosRoutes = require('./routes/servNiñosRoutes')

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../frontend-app')));

app.use('/', authRoutes); 
app.use('/servHombre', servHombreRoutes);
app.use('/servMujer', servMujerRoutes);
app.use('/servNino', servNiñosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
