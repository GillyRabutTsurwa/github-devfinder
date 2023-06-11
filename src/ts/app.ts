import { Profile } from "./interfaces/profile";

const DOM = (function () {
    const elements = {
        input: document.querySelector(".search-input") as HTMLInputElement,
        para: document.querySelector(".test") as HTMLParagraphElement,
    };
    return elements;
})();

async function fetchData<T>(name: string): Promise<T> {
    try {
        const response = await fetch(`https://api.github.com/users/${name}`);
        if (!response.ok) {
            throw new Error("Trouble Finding Resuluts");
        }
        // const data = response.json() as Promise<T>; // je peux utiliser ceci dont la valeur est une promesse avec notre data
        const data = (await response.json()) as T; // ou celui ci qui contient notre data diréctement
        console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
}

DOM.input.addEventListener("keyup", async function (e: KeyboardEvent) {
    // found keyboard event solution thanks to this: https://stackoverflow.com/questions/54986667/why-isnt-the-key-property-recognised-as-part-of-the-event-type-in-typescript
    if (e.key === "Enter") {
        // and fixed e.target solution thanks to this: https://stackoverflow.com/questions/44321326/property-value-does-not-exist-on-type-eventtarget-in-typescript
        const inputValue = (e.target as HTMLInputElement).value;
        console.log(inputValue);
        let x = await fetchData<Profile>(inputValue);
        DOM.para.textContent = x.bio;
    }
});

async function init() {
    await fetchData<Profile>("GillyRabutTsurwa").then((value) => console.log(value));
}

window.addEventListener("DOMContentLoaded", init);
