document.addEventListener('DOMContentLoaded', function() {
    console.log('type_racer script initialized');
    const easyTexts = [
        "The cat sat on the mat.",
        "A quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore."
    ];

    const mediumTexts = [
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "A journey of a thousand miles begins with a single step."
    ];

    const hardTexts = [
        "It was the best of times, it was the worst of times.",
        "In the beginning God created the heavens and the earth.",
        "The only thing we have to fear is fear itself."
    ];

    const difficultySelect = document.getElementById('difficulty');
    const sampleTextDiv = document.getElementById('sample-text');
    const levelSpan = document.getElementById('level');
    const wpmSpan = document.getElementById('wpm');
    let currentSampleText = '';

    function getRandomText(textArray) {
        const randomIndex = Math.floor(Math.random() * textArray.length);
        return textArray[randomIndex];
    }

    function updateSampleText() {
        let selectedDifficulty = difficultySelect.value;
        let selectedText;

        if (selectedDifficulty === 'easy') {
            selectedText = getRandomText(easyTexts);
        } else if (selectedDifficulty === 'medium') {
            selectedText = getRandomText(mediumTexts);
        } else if (selectedDifficulty === 'hard') {
            selectedText = getRandomText(hardTexts);
        }

        sampleTextDiv.textContent = selectedText;
        currentSampleText = selectedText;
        // update displayed difficulty level (capitalize first letter)
        levelSpan.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
    }

    difficultySelect.addEventListener('change', updateSampleText);

    // Initialize with a random text from the default difficulty level
    updateSampleText();

    // --- Timing and controls ---
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const retryBtn = document.getElementById('retry-btn');
    const userInput = document.getElementById('user-input');
    const timeSpan = document.getElementById('time');

    let startTime = null;
    let endTime = null;
    let elapsedTime = 0;

    function updateTimeDisplay(seconds) {
        // Display time rounded to two decimal places
        timeSpan.textContent = seconds.toFixed(2);
    }

    function normalizeWord(word) {
        // remove leading/trailing punctuation and convert to lowercase
        return word.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '').toLowerCase();
    }

    function countCorrectWords(sample, typed) {
        if (!sample) return 0;
        const sampleWords = sample.split(/\s+/);
        const typedWords = typed.split(/\s+/);
        let correct = 0;
        for (let i = 0; i < sampleWords.length; i++) {
            const s = normalizeWord(sampleWords[i] || '');
            const t = normalizeWord(typedWords[i] || '');
            if (s && s === t) correct++;
        }
        return correct;
    }

    function calculateWPM(correctWords, seconds) {
        if (!seconds || seconds <= 0) return 0;
        const minutes = seconds / 60;
        return Math.round(correctWords / minutes);
    }

    function setInitialButtonState() {
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    function startTest() {
        startTime = performance.now();
        startBtn.disabled = true; // disable start once test begins
        stopBtn.disabled = false;
        userInput.value = '';
        userInput.focus();
    }

    function stopTest() {
        if (!startTime) return; // ignore if test wasn't started
        endTime = performance.now();
        elapsedTime = (endTime - startTime) / 1000; // seconds
        updateTimeDisplay(elapsedTime);
        // calculate correct words and WPM
        const typed = userInput.value.trim();
        const correctWords = countCorrectWords(currentSampleText, typed);
        const wpm = calculateWPM(correctWords, elapsedTime);
        wpmSpan.textContent = wpm;
        // ensure displayed difficulty is current
        const selectedDifficulty = difficultySelect.value;
        levelSpan.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
        stopBtn.disabled = true; // disable stop once test has ended
        // allow starting a new test
        startBtn.disabled = false;
        // clear startTime to mark test as ended
        startTime = null;
    }

    function retryTest() {
        startTime = null;
        endTime = null;
        elapsedTime = 0;
        userInput.value = '';
        updateTimeDisplay(0);
        wpmSpan.textContent = '0';
        setInitialButtonState();
    }

    // Wire up controls
    startBtn.addEventListener('click', startTest);
    stopBtn.addEventListener('click', stopTest);
    retryBtn.addEventListener('click', retryTest);

    // Ensure initial state
    updateTimeDisplay(0);
    wpmSpan.textContent = '0';
    setInitialButtonState();
});