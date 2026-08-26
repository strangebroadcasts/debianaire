// The Debianaire package manager fridge poetry app

// How many package names to add?
const WORD_CHOICES = 50;

// How many of the package names should also be dictionary terms?
const DICTIONARY_WORD_RATIO = 0.66;

// How many wildcards to add?
const EXTRA_WILDCARDS = 5;

// Extra symbols to add.
const EXTRA_SYMBOLS = ["-s", "-s", "-s", "-s", "-s", ",", ",", ",", ",", ",", ",", ".", ".", "."];

// Add a rotation transform to each magnet?
const ROTATE_MAGNETS = true;

// The SplitMix32 PRNG implemented by bryc, 2017
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
function splitmix32(a) {
    return function () {
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0); // / 4294967296;
    }
}

// Set up Sortable for both regions
var packageContainer = document.getElementById('packageContainer');
var packageSortable = Sortable.create(
    packageContainer,
    {
        group: 'shared',
        animation: 150
    }
);
var poemContainer = document.getElementById('poemContainer');
var poemSortable = Sortable.create(
    poemContainer,
    {
        group: 'shared',
        animation: 150
    }
);

// Seed the PRNG, 
let today = new Date(Date.now());
document.getElementById("dateTitle").textContent = "Your poem for " + today.toLocaleDateString();

// Make the seed today's date
let todaySeed = today.getDate() * 1000000 + today.getMonth() * 10000 + today.getFullYear();
let prng = splitmix32((todaySeed) >>> 0);

for (let i = 0; i < WORD_CHOICES; i++) {
    let word = "";
    let lookInDictionary = (prng() / 4294967296) < DICTIONARY_WORD_RATIO;
    let wordChoice = prng();
    // if we're using a dictionary word, look in words/dictionary.js
    // otherwise, look in words/poetry.js
    if (lookInDictionary) {
        word = DICTIONARY[wordChoice % DICTIONARY.length];
    } else {
        word = MAGNETS[wordChoice % DICTIONARY.length];
    }

    const newChip = document.createElement("div");
    newChip.textContent = word;

    packageContainer.appendChild(newChip);
}

for (let i = 0; i < EXTRA_WILDCARDS; i++) {
    const newChip = document.createElement("div");
    newChip.className = "wildcard";
    const newInput = document.createElement("input");
    newInput.placeholder = "Wildcard";
    newChip.appendChild(newInput);
    packageContainer.appendChild(newChip);
}


for (let i = 0; i < EXTRA_SYMBOLS.length; i++) {
    const newChip = document.createElement("div");
    newChip.className = "punctuation";
    newChip.textContent = EXTRA_SYMBOLS[i];
    packageContainer.appendChild(newChip);
}

if (ROTATE_MAGNETS) {
    for (let i = 0; i < packageContainer.children.length; i++) {
        packageContainer.children[i].setAttribute("style", "rotate: " + (Math.random() * 2.0 - 1.0).toString() + "deg");
    }
}

function getPoemAsPlaintext() {
    // Add a little header to advertise the project.
    let plaintextPoem = "Debianaire " + today.toLocaleDateString() + ": ";

    // Look up each element in the poemContainer Sortable:
    for (let i = 0; i < poemContainer.children.length; i++) {
        const child = poemContainer.children[i];
        let content = child.textContent;

        // If this is a wildcard, read the text from the child <input> element.
        if (child.className == "wildcard") {
            content = child.children[0].value;
        }
        // Assume extra symbols are punctuation or suffixes,
        // and trim the whitespace before adding the content. 
        else if (child.className == "punctuation") {
            plaintextPoem = plaintextPoem.trimEnd();
            if (content == "-s") {
                content = "s";
            }
        }
        // Otherwise, just add the contents.
        plaintextPoem += content + " ";
    }
    return plaintextPoem;
}

// Assume Clipboard API is available,
async function copyToClipboard() {
    try {
        let poem = getPoemAsPlaintext();
        await navigator.clipboard.writeText(poem);
        window.alert(poem + "\n\n Copied to the clipboard.");
    } catch (error) {
        console.error(error.message);
        window.alert("Could not copy poem to clipboard.");
    }

}
const clipboardBtn = document.getElementById("clipboardBtn");
clipboardBtn.addEventListener("click", () => copyToClipboard());

// Use Bluesky's intent link to share the poem: https://bsky.network/docs/intent-links/
// Make it their problem if the user exceeds the 300 character length.
function shareOnBsky() {
    const params = new URLSearchParams();
    params.append("text", getPoemAsPlaintext());
    window.open("https://bsky.app/intent/compose?" + params.toString(), "bluesky");

}
const bskyBtn = document.getElementById("bskyBtn");
bskyBtn.addEventListener("click", () => shareOnBsky());