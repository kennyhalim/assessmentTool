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

    const selectedEmployee = document.getElementById('employeeSelect');
    const selectedEmployeeId = selectedEmployee.value;
    const selectedEmployeeName = selectedEmployee.options[selectedEmployee.selectedIndex].getAttribute('data-name');

    if (!selectedEmployeeId) {
        alert("Please select an employee before submitting.");
        return false;
    }

    const answers = {
        employee_id: selectedEmployeeId,
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

        const body = JSON.parse(data.body);
        const newWorkerAssessmentId = body.new_worker_assessment_id;

        // Open supervisor.html in a new tab
        //window.open(`supervisor.html?worker_assessment_id=${newWorkerAssessmentId}`, '_blank');

        const supervisorUrl = `${window.location.origin}/supervisor.html?worker_assessment_id=${newWorkerAssessmentId}&employee_name=${encodeURIComponent(selectedEmployeeName)}&employee_id=${selectedEmployeeId}`;
        
        // Send email using SMTP.js
        await sendEmail(supervisorUrl, selectedEmployeeName);

        window.location.href = `results.html?checked=${checkedQuestions.join(',')}&employee_name=${encodeURIComponent(selectedEmployeeName)}&employee_id=${selectedEmployeeId}`;

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the assessment. Please try again.');
    }

    return false;
}

async function sendEmail(supervisorUrl, selectedEmployeeName) {
    const emailTo = 'support@tenvos.com';
    const emailSubject = 'New Worker Assessment';
    const emailBody = `A new worker assessment has been submitted. Please review it at: ${supervisorUrl}`;
    //const emailNewBody = `Dear Supervisor,<br><br> ${selectedEmployeeName} has submitted a Fatigue Assessment Form. <br><br> Please review it at: ${supervisorUrl}`;
    const emailNewBody = `
        <!DOCTYPE html>
        <html>
        <body>
            <p>Dear Supervisor,</p>
            <br>
            <p>${selectedEmployeeName} has submitted a Fatigue Assessment Form.</p>
            <br>
            <p>Please <a href="${supervisorUrl}">click here</a> to review it.</p>
        </body>
        </html>
    `;
    try {
        await Email.send({
            Host: "smtp.elasticemail.com",
            Username : "support@tenvos.com",
            Password : "19612EBD8C55D58511BD5FC76CC000837454",
            To: emailTo,
            From: "support@tenvos.com",
            Bcc: "kenny@tenvos.com",
            Subject: emailSubject,
            Body: emailNewBody
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}