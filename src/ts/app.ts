import { Profile } from "./interfaces/profile";

const DOM = (function () {
    const elements = {
        input: document.querySelector(".search-input") as HTMLInputElement,
    };
    return elements;
})();

async function fetchData<T>(name: string): Promise<T> {
    try {
        const response = await fetch(`https://api.github.com/users/${name}`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        // const data = response.json() as T;
        const data = (await response.json()) as T;
        console.log(data);
        return data;
    } catch (error) {
        throw new Error("error");
    }
}

DOM.input.addEventListener("keyup", async function (e: KeyboardEvent) {
    // found keyboard event solution thanks to this: https://stackoverflow.com/questions/54986667/why-isnt-the-key-property-recognised-as-part-of-the-event-type-in-typescript
    if (e.key === "Enter") {
        // and fixed e.target solution thanks to this: https://stackoverflow.com/questions/44321326/property-value-does-not-exist-on-type-eventtarget-in-typescript
        const inputValue = (e.target as HTMLInputElement).value;
        console.log(inputValue);
        await fetchData<Profile>(inputValue);
    }
});

async function init() {
    await fetchData<Profile>("GillyRabutTsurwa");
}

window.addEventListener("DOMContentLoaded", init);
