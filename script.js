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
        await sendEmail(supervisorUrl, selectedEmployeeName, checkedQuestions);

        window.location.href = `results.html?checked=${checkedQuestions.join(',')}&employee_name=${encodeURIComponent(selectedEmployeeName)}&employee_id=${selectedEmployeeId}`;

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the assessment. Please try again.');
    }

    return false;
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    let hour = now.getHours();
    const minute = String(now.getMinutes()).padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    hour = String(hour).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;
}

async function sendEmail(supervisorUrl, selectedEmployeeName, checkedQuestions) {
    let severity;
    if (checkedQuestions.some(q => q >= 1 && q <= 3) && !checkedQuestions.some(q => q >= 4 && q <= 6)) {
        severity = "Mildly";
    } else if (checkedQuestions.includes(4) && !checkedQuestions.includes(5) && !checkedQuestions.includes(6)) {
        severity = "Mildly to Moderately";
    } else if (checkedQuestions.includes(5) && !checkedQuestions.includes(6)) {
        severity = "Moderately to Severely";
    } else if (checkedQuestions.includes(6)) {
        severity = "Severely";
    }
    
    const emailTo = 'kenny@tenvos.com';
    //const emailTo = 'janelle.smiley-wiens@novachem.com';
    const uniqueId = getCurrentDateTime();
    const emailSubject = `An employee might be fatigued (${uniqueId})`;
    //const emailBody = `A new worker assessment has been submitted. Please review it at: ${supervisorUrl}`;
    //const emailNewBody = `Dear Supervisor,<br><br> ${selectedEmployeeName} has submitted a Fatigue Assessment Form. <br><br> Please review it at: ${supervisorUrl}`;
    const emailNewBody = `
        <!DOCTYPE html>
        <html>
        <body>
            <p>Dear Janelle,</p>
            <p>${selectedEmployeeName} might be experiencing fatigue and has filled out the Fatigue Assessment Form. They self-report as being ${severity} fatigued.</p>
            <p>Please take a moment to discuss it with the employee and fill out this form: <a href="${supervisorUrl}">https://assessment.tenvos.com/supervisor.html</a> </p>
            <p>Thank you, </p>
            <p>Tenvos AI Team</p>
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
            Subject: emailSubject,
            Body: emailNewBody
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}