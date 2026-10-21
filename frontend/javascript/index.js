// const { getMaxListeners } = require("node:cluster");
// const { get } = require("node:http");

const postFetch = async (url, data) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error("Hiba: " + response.status);
        }
        return await response.json();
    }
    catch(error) {
        throw new Error(error);
    }
}

const getMethod = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Hiba: " + response.status);
        }
        return response.json();
    }
    catch(error) {
        throw new Error("Hiba: " + error);
    }
}

const karakterFrissites = (tomb) => {
    let hely = document.getElementById('hasznalt-karakterek');
    let l = "";
    for (let i = 0; i < tomb.length; i++) {
        l += tomb[i] + " ";
    }

    hely.textContent = l;
}



document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await getMethod("/api/akasztofa/kezdes");
        document.getElementById('szo').textContent = response.word;
        document.getElementById('akasztofa-img').src = response.eletek;

        document.getElementById('tippBtn').addEventListener('click', async () =>{
            try {
                const tipp = document.getElementById('tippInput').value;
                const fetch_response = await postFetch("/api/akasztofa/tipp", {
                    tipp: tipp
                });

                karakterFrissites(fetch_response.hasznalt);
                if (fetch_response.response == "nincs") {
                    document.getElementById('akasztofa-img').src = fetch_response.eletek;
                }
                else {
                    if (fetch_response.response == "win") {
                        alert("win");
                    }
                    else {
                        document.getElementById('szo').textContent = fetch_response.response;
                    }
                } 

            }       
            catch(error) {
                console.log(error);
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
