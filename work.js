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

// Per-section run-log identity: id prefix, plural noun for the section header,
// and the channel color the section's ids/accents use.
const SECTION_META = [
    { prefix: 'run', noun: 'runs', color: 'var(--ch1)' },
    { prefix: 'exp', noun: 'experiments', color: 'var(--ch2)' }
];
const FALLBACK_META = { prefix: 'log', noun: 'entries', color: 'var(--ch3)' };

function buildTagChips(tags) {
    const wrap = document.createElement('div');
    wrap.className = 'run_tags';
    tags.forEach((tagText) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tagText;
        wrap.appendChild(tag);
    });
    return wrap;
}

function buildRunRow(item, id, openByDefault) {
    const row = document.createElement('details');
    row.className = 'run_row';
    if (openByDefault) row.open = true;

    const summary = document.createElement('summary');

    const runId = document.createElement('span');
    runId.className = 'run_id';
    runId.textContent = id;

    const main = document.createElement('div');
    main.className = 'run_main';

    const title = document.createElement('h3');
    title.className = 'run_title';
    title.textContent = item.title;
    main.appendChild(title);

    const previewTags = (item.tags || []).slice(0, 3);
    if (previewTags.length) {
        const preview = buildTagChips(previewTags);
        const extra = (item.tags || []).length - previewTags.length;
        if (extra > 0) {
            const more = document.createElement('span');
            more.className = 'tag';
            more.textContent = `+${extra}`;
            preview.appendChild(more);
        }
        main.appendChild(preview);
    }

    const date = document.createElement('span');
    date.className = 'run_date';
    date.textContent = item.date;

    const toggle = document.createElement('span');
    toggle.className = 'run_toggle';
    toggle.setAttribute('aria-hidden', 'true');
    toggle.textContent = '+';

    summary.appendChild(runId);
    summary.appendChild(main);
    summary.appendChild(date);
    summary.appendChild(toggle);
    row.appendChild(summary);

    const body = document.createElement('div');
    body.className = 'run_body';

    const description = document.createElement('p');
    description.className = 'run_desc';
    description.textContent = item.description;
    body.appendChild(description);

    if ((item.tags || []).length) {
        body.appendChild(buildTagChips(item.tags));
    }

    if (item.link) {
        const link = document.createElement('a');
        link.className = 'run_link';
        link.href = item.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'view repo →';
        body.appendChild(link);
    }

    row.appendChild(body);
    return row;
}

function renderStatsLine(sections) {
    const statsElement = document.getElementById('work-stats');
    if (!statsElement) return;

    const counts = sections.map((section, index) => {
        const meta = SECTION_META[index] || FALLBACK_META;
        return `${meta.noun}: ${section.items.length}`;
    });

    const years = sections
        .flatMap((section) => section.items)
        .flatMap((item) => String(item.date || '').match(/\d{4}/g) || [])
        .map(Number);

    if (years.length) {
        counts.push(`span: ${Math.min(...years)}–${Math.max(...years)}`);
    }

    statsElement.textContent = counts.join(' · ');
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

        const validSections = data.sections.filter(
            (section) => section && Array.isArray(section.items)
        );

        renderStatsLine(validSections);

        validSections.forEach((section, sectionIndex) => {
            const meta = SECTION_META[sectionIndex] || FALLBACK_META;

            const sectionWrapper = document.createElement('section');
            sectionWrapper.className = 'log_section';
            sectionWrapper.style.setProperty('--sec-ch', meta.color);

            const heading = document.createElement('h2');
            heading.className = 'log_head';
            heading.textContent = `# ${section.title.toLowerCase()} — ${section.items.length} ${meta.noun}`;
            sectionWrapper.appendChild(heading);

            const list = document.createElement('div');
            list.className = 'log_list';

            // Newest entries sit at the top of the data, so ids count down —
            // a run history with the latest run first, pre-expanded.
            section.items.forEach((item, itemIndex) => {
                const id = `${meta.prefix}-${String(section.items.length - itemIndex).padStart(2, '0')}`;
                const openByDefault = sectionIndex === 0 && itemIndex === 0;
                list.appendChild(buildRunRow(item, id, openByDefault));
            });

            sectionWrapper.appendChild(list);
            sectionsContainer.appendChild(sectionWrapper);
        });
    } catch (error) {
        const message = document.createElement('p');
        message.className = 'log_error';
        message.textContent = 'Unable to load work content.';
        sectionsContainer.textContent = '';
        sectionsContainer.appendChild(message);
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', loadWorkContent);
