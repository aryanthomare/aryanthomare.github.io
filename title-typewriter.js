document.addEventListener('DOMContentLoaded', () => {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');

    typewriterElements.forEach((element) => {
        const targetText = element.getAttribute('data-typewriter') || '';
        const textNode = element.querySelector('.typewriter_text');

        if (!textNode) {
            return;
        }

        let currentIndex = 0;

        function typeNextCharacter() {
            if (currentIndex <= targetText.length) {
                textNode.textContent = targetText.slice(0, currentIndex);
                currentIndex += 1;
                window.setTimeout(typeNextCharacter, 115);
            }
        }

        typeNextCharacter();
    });
});
