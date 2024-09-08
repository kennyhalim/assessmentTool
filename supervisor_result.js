document.addEventListener('DOMContentLoaded', function() {
    const responseActionDiv = document.getElementById('responseAction');
    const riskLevelElement = document.getElementById('riskLevel');
    const responseTextElement = document.getElementById('responseText');
    let workerAssessmentId;
    let employeeName;
    let employeeId;

    // Get worker_assessment_id, employee_name, and employee_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    workerAssessmentId = urlParams.get('worker_assessment_id');
    employeeName = urlParams.get('employee_name');
    employeeId = urlParams.get('employee_id');
    const score = parseInt(urlParams.get('score'));

    function getResponseAction(score) {
        if (score <= 6) {
            return {
                risk: "Low",
                text: "Worker can continue normal work activities with regular supervisor monitoring, worker can use individual fatigue control measures as required. Normal supervision occurs.",
                color: "#d4edda" 
            };
        } else if (score <= 18) {
            return {
                risk: "Moderate",
                text: "Supervisor must discuss and document what work needs to be performed and any necessary additional fatigue control measures required on FLRA. They must also detail how they will ensure the worker to be able to safely complete required work tasks (i.e. additional supervision, co-worker assistance, etc.). Fatigue countermeasures must be in compliance with the Required Fatigue Controls and the FRMS.",
                color: "#fff3cd" 
            };
        } else {
            return {
                risk: "High",
                text: "Workers should not perform any safety sensitive tasks until required countermeasures have been put in place. Supervisor must identify and document on FLRA what work needs to be performed and what specific fatigue control measures are being used to ensure worker safety. Fatigue countermeasures must be in compliance with the Required Fatigue Controls. The worker should not drive home at the end of shift unless they have slept at least 90 minutes and are deemed safe to drive.",
                color: "#f8d7da"
            };
        }
    }

    const response = getResponseAction(score);
    
    riskLevelElement.textContent = response.risk;
    responseTextElement.textContent = response.text;
    responseActionDiv.style.backgroundColor = response.color;
});