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
            data: JSON.stringify(data)
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

const listBetoltes = (response) => {
    const div = document.getElementById("gombokList")
    div.replaceChildren();
    for (let i = 0; i < response.response.length; i++) {
        let szoDiv = document.createElement('div');
        let szo = document.createElement('h6')
        szo.textContent = response.response[i];

        let torolGomb = document.createElement('input');
        torolGomb.type = "button";
        torolGomb.value = "törlés";
        torolGomb.classList = "btn btn-danger"
        torolGomb.addEventListener('click', async () =>{
            gombTavolitas(response.response[i]);
        });

        szoDiv.appendChild(szo);
        szoDiv.appendChild(torolGomb);
        div.appendChild(szoDiv);
    }
}

const gombTavolitas = async (szo) => {
    try{
        const fetch_response = await postFetch("api/akasztofa/szotorles", {
            word: szo
        });
        console.log(fetch_response.response);

        const div = document.getElementById("gombokList")
        div.replaceChildren();
        for (let i = 0; i < fetch_response.response.length; i++) {
            let szoDiv = document.createElement('div');
            let szo = document.createElement('h6')
            szo.textContent = fetch_response.response[i];

            let torolGomb = document.createElement('input');
            torolGomb.type = "button";
            torolGomb.value = "törlés";
            torolGomb.classList = "btn btn-danger"
            torolGomb.addEventListener('click', async () =>{
                gombTavolitas(fetch_response.response[i]);
            });

            szoDiv.appendChild(szo);
            szoDiv.appendChild(torolGomb);
            div.appendChild(szoDiv);
        }

    }
    catch(error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await getMethod('api/akasztofa/szavak');

        listBetoltes(response);
    }
    catch(error) {
        console.log(error);
    }
});