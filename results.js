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
            "Increase hydration",
            "Avoid sugary drinks & snacks",
            "Eat high protein, low carbs (e.g., energy bar/nuts/yogurt/peanut butter = LOW GLYCEMIC FOODS)",
            "Try stimulating aromas (e.g., spearmint gum/peppermint tea/citrus fruits/eucalyptus oil)"
        ];
    } else if (checkedQuestions.includes(4) && !checkedQuestions.includes(5) && !checkedQuestions.includes(6)) {
        title = "Mild to Moderate";
        severityClass = 'alert-mild';
        countermeasures = [
            "Strategic use of caffeine to increase alertness",
            "Increase interaction with co-workers",
            "Increase physical activity (walk/gym/stationary bike)",
            "Use of light exposure/therapy to reduce short term circadian misalignment (where available)"
        ];
    } else if (checkedQuestions.includes(5) && !checkedQuestions.includes(6)) {
        title = "Moderate to Severe";
        severityClass = 'alert-moderate';
        countermeasures = [
            "Increase check-in frequency when working alone",
            "Utilize safety/process checklists to minimize errors",
            "Defer to a second opinion / ask coworker to double check your work",
            "Consider alternatives to driving home",
            "Delay decision-making where appropriate"
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