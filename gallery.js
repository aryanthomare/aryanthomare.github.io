// The carousel shows every image in assets/gallery/, discovered at runtime.
//
// GitHub Pages serves no directory listing, so the folder is read through the
// GitHub contents API for the deployed repo: drop an image into
// assets/gallery/, commit it, and it appears with no code change. When that
// call can't be made (rate limit, offline, or a file not committed yet) the
// listing falls back to the committed manifest.json, which
// tools/gallery_manifest.py regenerates.

const GALLERY_DIR = 'assets/gallery';
const GALLERY_LISTING_URL = 'https://api.github.com/repos/aryanthomare/aryanthomare.github.io/contents/assets/gallery?ref=master';
const GALLERY_MANIFEST_URL = `${GALLERY_DIR}/manifest.json`;
const IMAGE_FILE = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

function shuffleArray(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Filenames hold spaces, parentheses and '=' (the vector field renders), so
// each one is encoded before it becomes a URL.
function toImagePaths(filenames) {
    return filenames
        .filter(name => IMAGE_FILE.test(name))
        .map(name => `${GALLERY_DIR}/${encodeURIComponent(name)}`);
}

async function listFromGithub() {
    const response = await fetch(GALLERY_LISTING_URL, {
        headers: { 'Accept': 'application/vnd.github+json' }
    });
    if (!response.ok) {
        throw new Error(`GitHub listing returned ${response.status}`);
    }
    const entries = await response.json();
    return toImagePaths(entries.filter(entry => entry.type === 'file').map(entry => entry.name));
}

async function listFromManifest() {
    const response = await fetch(GALLERY_MANIFEST_URL, { cache: 'no-cache' });
    if (!response.ok) {
        throw new Error(`manifest.json returned ${response.status}`);
    }
    return toImagePaths(await response.json());
}

async function loadGallery() {
    try {
        const fromGithub = await listFromGithub();
        if (fromGithub.length) {
            return fromGithub;
        }
        console.warn('GitHub listed no images in assets/gallery; falling back to manifest.json');
    } catch (error) {
        console.warn('Could not list assets/gallery from GitHub; falling back to manifest.json', error);
    }
    return listFromManifest();
}

const images = [];
let currentIndex = 0;

const imageElement = document.getElementById('carousel-image');
const nextbutton = document.getElementById('arrow_right');
const prevbutton = document.getElementById('arrow_left');
const frameCounterElement = document.getElementById('frame-counter');

function renderFrame() {
    imageElement.src = images[currentIndex];
    frameCounterElement.textContent = `frame ${currentIndex + 1} / ${images.length}`;
}

nextbutton.addEventListener('click', () => {
    if (!images.length) return;
    currentIndex = (currentIndex + 1) % images.length;
    renderFrame();
});

prevbutton.addEventListener('click', () => {
    if (!images.length) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    renderFrame();
});

frameCounterElement.textContent = 'loading renders';

loadGallery()
    .then(paths => {
        if (!paths.length) {
            throw new Error('no images found in assets/gallery');
        }
        images.push(...paths);
        shuffleArray(images);
        currentIndex = 0;
        renderFrame();
    })
    .catch(error => {
        console.error('Could not load the gallery', error);
        frameCounterElement.textContent = 'no renders found';
    });
