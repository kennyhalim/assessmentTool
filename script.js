async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    const checkedQuestions = Array.from(checkboxes)
        .map((checkbox, index) => checkbox.checked ? index + 1 : null)
        .filter(q => q !== null);

    if (checkedQuestions.length === 0) {
        alert("Please check at least one question before submitting.");
        return false;
    }

    const answers = {
        employee_id: "333",
        question_one_answer: document.getElementById('q1').checked ? 1 : 0,
        question_two_answer: document.getElementById('q2').checked ? 1 : 0,
        question_three_answer: document.getElementById('q3').checked ? 1 : 0,
        question_four_answer: document.getElementById('q4').checked ? 1 : 0,
        question_five_answer: document.getElementById('q5').checked ? 1 : 0,
        question_six_answer: document.getElementById('q6').checked ? 1 : 0
    };

    try {
        const response = await fetch('https://nk3h4xboqd.execute-api.us-east-2.amazonaws.com/v1/assessment/registerWorkerAssessment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Parse the body string to get the new_worker_assessment_id
        const body = JSON.parse(data.body);
        const newWorkerAssessmentId = body.new_worker_assessment_id;

        // Open supervisor.html in a new tab
        //window.open(`supervisor.html?worker_assessment_id=${newWorkerAssessmentId}`, '_blank');

        // Generate the supervisor URL
        const supervisorUrl = `${window.location.origin}/assessmentTool/supervisor.html?worker_assessment_id=${newWorkerAssessmentId}`;

        // Send email using SMTP.js
        await sendEmail(supervisorUrl);

        // Redirect the current page to results.html
        window.location.href = `results.html?checked=${checkedQuestions.join(',')}`;

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the assessment. Please try again.');
    }

    return false;
}

async function sendEmail(supervisorUrl) {
    const emailTo = 'tenvosai@gmail.com';
    const emailSubject = 'New Worker Assessment';
    const emailBody = `A new worker assessment has been submitted. Please review it at: ${supervisorUrl}`;

    try {
        await Email.send({
            Host: "smtp.elasticemail.com",
            Username : "tenvosai@gmail.com",
            Password : "5E2CF5757911951698CC50D55E09CA53DBD8",
            To: emailTo,
            From: "tenvosai@gmail.com",
            Subject: emailSubject,
            Body: emailBody
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}