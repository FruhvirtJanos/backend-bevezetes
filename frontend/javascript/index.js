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
    hely.textContent = "";
    if (tomb.length != 0) {
        for (let i = 0; i < tomb.length; i++) {
            hely.textContent += tomb[i] + " ";
        }
    } 
}

const modalMegjelenit = (title, test) => {
    document.getElementById('modal-cim').textContent = title;
    document.getElementById('modal-test').textContent = test;

    const modal_id = document.getElementById('my-modal');
    const modal = new bootstrap.Modal(modal_id);
    modal.show();
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await getMethod("/api/akasztofa/kezdes");
        document.getElementById('szo').textContent = response.word;
        document.getElementById('akasztofa-img').src = response.kepek;

        document.getElementById('ujJatekButton').addEventListener('click', async () => {
            try {
                postFetch("api/akasztofa/ujjatek");
                location.reload();
            }
            catch (error) {
                console.log(error);
            }
        });

        document.getElementById('tippBtn').addEventListener('click', async () =>{
            try {
                const tipp = document.getElementById('tippInput').value;
                const fetch_response = await postFetch("/api/akasztofa/tipp", {
                    tipp: tipp
                });

                karakterFrissites(fetch_response.hasznalt);
                
                let status = fetch_response.status;

                if (status == "win") {
                    document.getElementById('szo').textContent = fetch_response.response;
                    modalMegjelenit("Győztél", "Grat");
                }
                else if (status == "loose") {
                    document.getElementById('akasztofa-img').src = fetch_response.kepek;
                    modalMegjelenit("Vesztettél", "Béna");
                }
                else if (status == "correct") {
                    document.getElementById('szo').textContent = fetch_response.response;   
                }
                else {
                    document.getElementById('akasztofa-img').src = fetch_response.kepek;
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
