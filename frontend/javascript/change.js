

const getMethod = async (url) => {
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error("Hiba: " + response.status);
        }
        return response.json();
    }
    catch(error){
        throw new Error("Hiba: " + error);
    }
}

const postFetch = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error("Hiba: " + response.status);
        }
        return await response.json();
    }
    catch(error) {
        throw new Error("Hiba " + error);
    }
}

const listBetoltes = (tomb) => {                //DESIGN --> GEMINI :)
    let gombDiv = document.getElementById('gombokList');
    gombDiv.replaceChildren();

    for (let i = 0; i < tomb.length; i++){
        let card = document.createElement('div');
        card.classList = "d-flex align-items-center justify-content-between mb-2 p-2 border rounded";

        let title = document.createElement('h5');
        title.className = "mb-0";
        
        let torlesGomb = document.createElement('input');
        torlesGomb.type = 'button';
        torlesGomb.classList = "btn btn-danger";
        torlesGomb.value = "Törlés"
        torlesGomb.addEventListener('click', () => { gombTavolitas(title.innerText) });

        title.textContent = tomb[i];
        
        card.appendChild(title);
        card.appendChild(torlesGomb);

        gombDiv.appendChild(card);
    }
}

const gombTavolitas = async (szo) => {
    try {
        const fetchResponse = await postFetch('api/akasztofa/szotorles', {
            word: szo
        });

        listBetoltes(fetchResponse.response);
    }
    catch (error) {
        console.log(error);
    }
}

const ujSzo = async (szo) => {
    try {
        const fetchResponse = await postFetch('api/akasztofa/szohozzaadas', {
            word: szo
        });
        
        listBetoltes(fetchResponse.response);
    }
    catch (error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await getMethod('api/akasztofa/szavak');
        
        listBetoltes(response.response);

        document.getElementById('ujSzoButton').addEventListener('click', () => {
            let szo = document.getElementById('ujSzo').value;
            if (szo == "") {
                alert("VALAMIT IRJ BE");
            }
            else {
                ujSzo(szo);
            }
        });
    }
    catch(error) {
        console.log(error);
    }
});