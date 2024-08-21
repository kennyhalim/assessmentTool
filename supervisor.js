// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('fatigueForm');
//     const totalScoreElement = document.getElementById('totalScore');

//     function calculateTotalScore() {
//         let total = 0;
//         const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
//         checkboxes.forEach(checkbox => {
//             total += parseInt(checkbox.value);
//         });
//         return total;
//     }

//     function updateTotalScore() {
//         const total = calculateTotalScore();
//         totalScoreElement.textContent = total + '/30';
//     }

//     form.addEventListener('change', function(event) {
//         if (event.target.type === 'checkbox') {
//             const name = event.target.name;
//             const checkboxes = form.querySelectorAll(`input[name="${name}"]`);
//             checkboxes.forEach(cb => {
//                 if (cb !== event.target) {
//                     cb.checked = false;
//                 }
//             });
//             updateTotalScore();
//         }
//     });

//     form.addEventListener('submit', function(event) {
//         event.preventDefault();
//         const totalScore = calculateTotalScore();
//         window.location.href = `supervisor_result.html?score=${totalScore}`;
//     });

//     updateTotalScore();
// });

// document.addEventListener('DOMContentLoaded', function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const workerAssessmentId = urlParams.get('worker_assessment_id');
//     if (workerAssessmentId) {
//         document.getElementById('workerAssessmentId').textContent = workerAssessmentId;
//     } else {
//         document.getElementById('workerAssessmentId').textContent = 'Not provided';
//     }
// });
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fatigueForm');
    const totalScoreElement = document.getElementById('totalScore');
    let workerAssessmentId;
    let employeeId;

    // Mapping of employee IDs to names
    const employeeMapping = {
        '333': 'Jane Doe',
        '334': 'Lloyd Worth',
        '335': 'Bob Jones',
        '336': 'Testy Tester'
        // Add more mappings as needed
    };

    // Get worker_assessment_id and employee_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Retrieve worker_assessment_id from the URL
    workerAssessmentId = urlParams.get('worker_assessment_id');
    console.log("Worker Assessment ID:", workerAssessmentId);
    
    // Retrieve employee_id from the URL
    employeeId = urlParams.get('employee_id');

    // Display the worker_assessment_id on the page
    if (workerAssessmentId) {
        document.getElementById('workerAssessmentId').textContent = workerAssessmentId;
    } else {
        document.getElementById('workerAssessmentId').textContent = 'Not provided';
    }

    // Display the employee_id and extract the name to display on the page
    if (employeeId) {
        // Set the employee ID on the page
        document.getElementById('employeeId').textContent = employeeId;

        // Use the mapping to find the employee name
        const employeeName = employeeMapping[employeeId]; // Look up the name using the ID
        if (employeeName) {
            document.getElementById('employeeName').textContent = employeeName;
        } else {
            document.getElementById('employeeName').textContent = 'Name not found';
        }
    } else {
        // Fallback if employeeId is not found or not provided
        document.getElementById('employeeId').textContent = 'Not provided';
        document.getElementById('employeeName').textContent = 'Not provided';
    }

    // Function to calculate the total score based on the selected checkboxes
    function calculateTotalScore() {
        let total = 0;
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            total += parseInt(checkbox.value);
        });
        return total;
    }

    // Update the total score displayed on the page whenever checkboxes change
    function updateTotalScore() {
        const total = calculateTotalScore();
        totalScoreElement.textContent = total + '/30';
    }

    // Event listener to handle checkbox changes and update the total score
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

    // Event listener for form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const totalScore = calculateTotalScore(); // Calculate the total score
    
        // Create the JSON object to send to the server
        const jsonBody = {
            employee_id: employeeId, // Include the employee_id retrieved from the URL
            worker_assessment_id: workerAssessmentId, // Include the worker_assessment_id retrieved from the URL
            question_one_answer: getQuestionAnswer('q1'),
            question_two_answer: getQuestionAnswer('q2'),
            question_three_answer: getQuestionAnswer('q3'),
            question_four_answer: getQuestionAnswer('q4'),
            question_five_answer: getQuestionAnswer('q5'),
            question_six_answer: getQuestionAnswer('q6')
        };
    
        try {
            // Send the data to the server using a POST request
            const response = await fetch('https://nk3h4xboqd.execute-api.us-east-2.amazonaws.com/v1/assessment/registerSupervisorAssessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonBody) // Convert the jsonBody object to a JSON string
            });
    
            if (!response.ok) { // Check if the response was not successful
                throw new Error(`HTTP error! status: ${response.status}`); // Throw an error with the status
            }
    
            const data = await response.json(); // Parse the JSON response
            console.log('API Response:', data);
    
            // Parse the response body to get the new_supervisor_assessment_id
            const responseBody = JSON.parse(data.body);
            const newSupervisorAssessmentId = responseBody.new_supervisor_assessment_id;
    
            // Redirect to the result page after successful API call, including the new ID
            window.location.href = `supervisor_result.html?score=${totalScore}&supervisor_assessment_id=${newSupervisorAssessmentId}`;
    
        } catch (error) { // If an error occurs during the fetch process
            console.error('Error:', error); // Log the error
            alert('An error occurred while submitting the assessment. Please try again.'); // Alert the user about the error
        }
    });

    // Function to get the answer to a specific question based on its name
    function getQuestionAnswer(questionName) {
        const checkedBox = form.querySelector(`input[name="${questionName}"]:checked`);
        return checkedBox ? parseInt(checkedBox.value) : 0;
    }

    // Initialize the total score display when the page loads
    updateTotalScore();
});
