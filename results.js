document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const checkedQuestions = params.get('checked').split(',').map(Number);

    let title = '';
    let countermeasures = [];
    let severityClass = '';

    if (checkedQuestions.some(q => q >= 1 && q <= 3) && !checkedQuestions.some(q => q >= 4 && q <= 6)) {
        title = "Maintain Alertness & Safety";
        severityClass = 'alert-safe';
        countermeasures = [
            "Select the appropriate operational countermeasures strategies to ensure you get through the shift alert and safely."
        ];
    } else if (checkedQuestions.includes(4) && !checkedQuestions.includes(5) && !checkedQuestions.includes(6)) {
        title = "Ensure you have a safe commute home.";
        severityClass = 'alert-mild';
        countermeasures = [
            "To avoid sleep debt the next day, ensure you get a minimum of 7-9 hours of sleep."
        ];
    } else if (checkedQuestions.includes(5) && !checkedQuestions.includes(6)) {
        title = "Consult with a co-worker/supervisor";
        severityClass = 'alert-moderate';
        countermeasures = [
            "Before continuing with work to see what can be done to reduce your risk and improve health and safety."
        ];
    } else if (checkedQuestions.includes(6)) {
        title = "Immediately inform your supervisor to determine appropriate strategies.";
        severityClass = 'alert-severe';
        countermeasures = [
            "It is important to recognize that many of these symptoms can be alleviated with a sufficient rest and recovery break which would then allow for a safe continuance of duties."
        ];
    }

    document.getElementById('resultTitle').textContent = title;
    const countermeasuresList = document.getElementById('countermeasures');
    countermeasures.forEach(measure => {
        const li = document.createElement('li');
        li.textContent = measure;
        countermeasuresList.appendChild(li);
    });

    document.querySelector('.question-container').classList.add(severityClass);
});