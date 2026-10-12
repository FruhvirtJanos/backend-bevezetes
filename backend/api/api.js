const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

//*router.get => Ez hoz létre egy GET végpontot
//*Első paraméter: Az útvonal
//*Második paraméter: Callback függvény => request, response
    //? request -> Az érkező kérés tartalma
    //? response -> Az általunk adott válasz

router.get('/brunokiraly', (request, response) => {
    console.log(request);
    response.status(200).json({
        status: 'success',
        message: 'A Brúnó király!'
    })
});

//*Paraméter kezelése

router.get('/pokay/:valami/:valami2', (request, response) => {
    const valami = request.params.valami;   //*A paraméter mindig a : utáni részt jelöli
    const valami2 = request.params.valami2; 

    response.status(200).json( {
        status: 'success',
        valami: valami,
        valami2: valami2
    });
})

//*POST végpont létrehozása

router.post('/data', (request, response) => {
    const data = request.body;  //*A request.body tartalmazza a küldött POST adatok törzsét (body-ját)
    console.log(data);
    
    response.status(200).json({
        receivedData: data        
    });
}); 

module.exports = router;
