document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fatigueForm');
    const totalScoreElement = document.getElementById('totalScore');
    let workerAssessmentId;
    let employeeName;
    let employeeId;

    // Get worker_assessment_id, employee_name, and employee_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    workerAssessmentId = urlParams.get('worker_assessment_id');
    employeeName = urlParams.get('employee_name');
    employeeId = urlParams.get('employee_id');

    if (workerAssessmentId) {
        document.getElementById('workerAssessmentId').textContent = workerAssessmentId;
    } else {
        document.getElementById('workerAssessmentId').textContent = 'Not provided';
    }

    if (employeeName) {
        document.getElementById('employeeName').textContent = decodeURIComponent(employeeName);
    } else {
        document.getElementById('employeeName').textContent = 'Not provided';
    }

    function calculateTotalScore() {
        let total = 0;
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            total += parseInt(checkbox.value);
        });
        return total;
    }

    function updateTotalScore() {
        const total = calculateTotalScore();
        totalScoreElement.textContent = total + '/30';
    }

    form.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox') {
            const name = event.target.name;
            const checkboxes = form.querySelectorAll(`input[name="${name}"]`);
            checkboxes.forEach(cb => {
                if (cb !== event.target) {
                    cb.checked = false;
                }
            });
            updateTotalScore();
        }
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const totalScore = calculateTotalScore();
    
        const jsonBody = {
            employee_id: employeeId,
            worker_assessment_id: workerAssessmentId,
            question_one_answer: getQuestionAnswer('q1'),
            question_two_answer: getQuestionAnswer('q2'),
            question_three_answer: getQuestionAnswer('q3'),
            question_four_answer: getQuestionAnswer('q4'),
            question_five_answer: getQuestionAnswer('q5'),
            question_six_answer: getQuestionAnswer('q6')
        };
    
        try {
            const response = await fetch('https://nk3h4xboqd.execute-api.us-east-2.amazonaws.com/v1/assessment/registerSupervisorAssessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonBody)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('API Response:', data);
    
            // Parse the body to get the new_supervisor_assessment_id
            const responseBody = JSON.parse(data.body);
            const newSupervisorAssessmentId = responseBody.new_supervisor_assessment_id;
    
            // Redirect to the result page after successful API call, including the new ID, employee name, and employee ID
            window.location.href = `supervisor_result.html?score=${totalScore}&supervisor_assessment_id=${newSupervisorAssessmentId}&employee_name=${encodeURIComponent(employeeName)}&employee_id=${employeeId}`;
    
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the assessment. Please try again.');
        }
    });

    function getQuestionAnswer(questionName) {
        const checkedBox = form.querySelector(`input[name="${questionName}"]:checked`);
        return checkedBox ? parseInt(checkedBox.value) : 0;
    }

    updateTotalScore();
});