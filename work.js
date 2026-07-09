// Work data lives in Cloud Firestore (document site/work), fetched through the
// Firestore REST API so the page does not need the Firebase JS SDK. The local
// work-data.json is kept as a fallback if Firestore is unreachable.

const WORK_DOC_PATH = 'site/work';

function decodeFirestoreValue(value) {
    if ('stringValue' in value) return value.stringValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return value.doubleValue;
    if ('booleanValue' in value) return value.booleanValue;
    if ('nullValue' in value) return null;
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeFirestoreValue);
    if ('mapValue' in value) return decodeFirestoreFields(value.mapValue.fields);
    return null;
}

function decodeFirestoreFields(fields) {
    const result = {};
    Object.entries(fields || {}).forEach(([key, value]) => {
        result[key] = decodeFirestoreValue(value);
    });
    return result;
}

async function fetchWorkDataFromFirestore() {
    const config = window.FIREBASE_CONFIG;

    if (!config || !config.projectId || config.projectId.startsWith('YOUR_')) {
        throw new Error('Firebase is not configured. Fill in firebase-config.js.');
    }

    const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${WORK_DOC_PATH}?key=${config.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Unable to fetch work data from Firestore: ${response.status}`);
    }

    const doc = await response.json();
    return decodeFirestoreFields(doc.fields);
}

async function fetchWorkDataFallback() {
    const response = await fetch('work-data.json', { cache: 'no-cache' });

    if (!response.ok) {
        throw new Error(`Unable to fetch work-data.json: ${response.status}`);
    }

    return response.json();
}

async function loadWorkData() {
    try {
        return await fetchWorkDataFromFirestore();
    } catch (firestoreError) {
        console.warn('Falling back to local work-data.json:', firestoreError);
        return fetchWorkDataFallback();
    }
}

async function loadWorkContent() {
    const sectionsContainer = document.getElementById('work-sections');

    if (!sectionsContainer) {
        return;
    }

    try {
        const rawData = await loadWorkData();

        // Support common wrappers so small schema changes do not break the page.
        const dataCandidates = [
            rawData,
            rawData?.data,
            rawData?.default,
            rawData?.workData,
            rawData?.WORK_DATA,
            window.WORK_DATA
        ];

        const data = dataCandidates.find(
            (candidate) => candidate && Array.isArray(candidate.sections)
        );

        if (!data) {
            const topLevelKeys = rawData && typeof rawData === 'object' ? Object.keys(rawData).join(', ') : String(rawData);
            throw new Error(`Work data is missing or invalid. Expected an object with a sections array. Received keys: ${topLevelKeys}`);
        }

        document.title = data.pageTitle || document.title;
        sectionsContainer.textContent = '';

        data.sections.forEach((section) => {
            if (!section || !Array.isArray(section.items)) {
                return;
            }

            const sectionWrapper = document.createElement('section');

            const subtitleWrapper = document.createElement('div');
            subtitleWrapper.className = 'subtitle_div';

            const subtitle = document.createElement('h2');
            subtitle.className = 'subtitle';
            subtitle.textContent = section.title;

            subtitleWrapper.appendChild(subtitle);
            sectionWrapper.appendChild(subtitleWrapper);

            section.items.forEach((item) => {
                const itemElement = item.link ? document.createElement('a') : document.createElement('div');

                itemElement.className = 'experience-item';

                if (item.link) {
                    itemElement.href = item.link;
                    itemElement.target = '_blank';
                    itemElement.rel = 'noopener noreferrer';
                    itemElement.classList.add('experience-item-link');
                }

                const header = document.createElement('div');
                header.className = 'exp-header';

                const title = document.createElement('h3');
                title.className = 'exp-title';
                title.textContent = item.title;

                const date = document.createElement('span');
                date.className = 'exp-date';
                date.textContent = item.date;

                header.appendChild(title);
                header.appendChild(date);

                const description = document.createElement('p');
                description.className = 'exp-description';
                description.textContent = item.description;

                const tags = document.createElement('div');
                tags.className = 'tags';

                (item.tags || []).forEach((tagText) => {
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.textContent = tagText;
                    tags.appendChild(tag);
                });

                const divider = document.createElement('div');
                divider.className = 'divider';

                itemElement.appendChild(header);
                itemElement.appendChild(description);
                itemElement.appendChild(tags);
                itemElement.appendChild(divider);

                sectionWrapper.appendChild(itemElement);
            });

            sectionsContainer.appendChild(sectionWrapper);
        });
    } catch (error) {
        sectionsContainer.textContent = 'Unable to load work content.';
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', loadWorkContent);
