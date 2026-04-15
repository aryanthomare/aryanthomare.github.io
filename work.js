async function loadWorkContent() {
    const sectionsContainer = document.getElementById('work-sections');

    if (!sectionsContainer) {
        return;
    }

    try {
        const response = await fetch('work-data.json', { cache: 'no-cache' });

        if (!response.ok) {
            throw new Error(`Unable to fetch work-data.json: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.sections)) {
            throw new Error('Work data is missing or invalid.');
        }

        document.title = data.pageTitle || document.title;

        data.sections.forEach((section) => {
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

                item.tags.forEach((tagText) => {
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