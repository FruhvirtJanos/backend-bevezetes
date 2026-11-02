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
        callback(null, Date.now() + '-' + file.originalname);
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


//*POST végpont létrehozása

router.post('/data', (request, response) => {
    const data = request.body;
    console.log(data);
    
    response.status(200).json({
        receivedData: data        
    });
}); 

// akasztófa bigyó

const szavak = ["dando", "bigyo", "post", "hosszu szo szokozokkel", "lo", "dando meleg", "még több szó", "krisztián eszik" ];
let szo = szavak[Math.floor(Math.random() * szavak.length)];
let eletekSzama = 9;
let tippeltKarakterek = [];
let publicSzo = [];
let status = "";

const ujJatek = () => {
    eletekSzama = 9;
    tippeltKarakterek = [];
    publicSzo = [];
    status = "";
    szo = szavak[Math.floor(Math.random() * szavak.length)];

    szoAtvaltas();
}

const tippEllenorzes = (tipp) => {
    let valasz = "";
    if (szo.includes(tipp) && !tippeltKarakterek.includes(tipp)) {
        status = "correct";
        tippeltKarakterek.push(tipp);
        for (let i = 0; i < szo.length; i++) {
            if (tipp == szo[i]) {
                publicSzo[i] = szo[i];
            }
        }

        valasz = publicSzo;
        
        
        if (stringConvert(publicSzo) == szo) {
            status = "win";            
        }
    }
    else {
        if (!tippeltKarakterek.includes(tipp)) {
            tippeltKarakterek.push(tipp);
            status = "nincs";
            eletekSzama--;
            if (eletekSzama == 0) {
                status = "loose";
            }
        }
    }

    console.log(valasz);

    return valasz;
}

const akasztofaAllas = () => {
    let current = "";
    switch (eletekSzama) {
        case 8: current = "../img/8.png";
        break;
        case 7: current = "../img/7.png";
        break;
        case 6: current = "../img/6.png";
        break;
        case 5: current = "../img/5.png";
        break;
        case 4: current = "../img/4.png";
        break;
        case 3: current = "../img/3.png";
        break;
        case 2: current = "../img/2.png";
        break;
        case 1: current = "../img/1.png";
        break;
        case 0: current = "../img/0.png";
        break;
        default: current = "../img/kezdes.png";
    }

    return current;
}

const stringConvert = (tomb) => {
    let valasz = "";

    for(let i = 0; i < tomb.length; i++) {
        valasz += tomb[i];
    }

    return valasz
} 

const szoAtvaltas = () => {
    if (szo.split(' ') != 0) {
        for (let i = 0; i < szo.length; i++) {
            if (szo[i] != ' ') {
                publicSzo.push('_');
            }
            else {
                publicSzo.push(' ');
            }
        }
    }
    else {
        for (let i = 0; i < szo.length; i++) {
            publicSzo.push('_');
        }
    }
}

szoAtvaltas();
console.log(szo, publicSzo);


router.get('/akasztofa/kezdes', async (request, response) => {
    try {
        response.status(200).json({
            word: stringConvert(publicSzo),
            kepek: akasztofaAllas(),
            hasznalt: tippeltKarakterek
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

router.post('/akasztofa/tipp', (request, response) => {    
    let tipp = request.body.tipp;
    let valasz = tippEllenorzes(tipp.toLowerCase());    
    response.status(200).json({
        response: stringConvert(valasz),
        status: status,
        hasznalt: tippeltKarakterek, 
        kepek: akasztofaAllas()
    });
});

router.post('/akasztofa/ujjatek', (request, response) => {
    ujJatek();

    response.status(200).json({
        status: "siker"
    });
});

router.post('/akasztofa/szotorles', (request, response) => {    
    szavak.splice(szavak.indexOf(request.body.word), 1);
    
    response.status(200).json({
        response: szavak
    });
});

router.post('/akasztofa/szohozzaadas', (request, response) => {    
    szavak.push(request.body.word);
    
    response.status(200).json({
        response: szavak
    });
});

router.get('/akasztofa/szavak', async (request, response) => {
    try {
        response.status(200).json({
            response: szavak
        });
    }
    catch(error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});


module.exports = router;
