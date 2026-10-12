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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await postFetch('/api/data', {
            name: 'Nagy Marcell',
            age: 'gender',
            gender: 'Kombájn'
        });
        console.log("Sikeres válasz: ", response);
    }
    catch(error) {
        console.log(error);
    }
});