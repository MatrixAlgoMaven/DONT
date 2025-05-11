document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const medicationForm = document.getElementById('medication-form');
    const symptomForm = document.getElementById('symptom-form');
    const recordForm = document.getElementById('record-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const addRecordBtn = document.getElementById('add-record-btn');
    const saveRecordBtn = document.getElementById('save-record-btn');
    
    // Modal instances
    const recordModal = new bootstrap.Modal(document.getElementById('recordModal'));
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    
    // Sample data (to be replaced with actual API calls)
    let medications = [];
    let symptoms = [];
    let healthRecords = [];
    
    // Initialize the app
    initApp();
    
    // Event Listeners
    medicationForm.addEventListener('submit', addMedication);
    symptomForm.addEventListener('submit', checkSymptom);
    addRecordBtn.addEventListener('click', () => recordModal.show());
    saveRecordBtn.addEventListener('click', addHealthRecord);
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Check if user is logged in (simulated)
    document.querySelectorAll('[href="#login"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.show();
        });
    });
    
    // Functions
    function initApp() {
        // Load sample data
        medications = [
            { id: 1, name: 'Paracetamol', dosage: '500mg', time: '08:00', frequency: 'daily' },
            { id: 2, name: 'Vitamin D', dosage: '1000IU', time: '12:00', frequency: 'daily' }
        ];
        
        symptoms = [
            { id: 1, type: 'headache', severity: 5, date: '2025-05-10', recommendation: 'Take rest and drink water. Consider paracetamol if severe.' },
            { id: 2, type: 'cold', severity: 3, date: '2025-05-08', recommendation: 'Drink warm fluids and take vitamin C.' }
        ];
        
        healthRecords = [
            { id: 1, type: 'blood-pressure', value: '120/80', notes: 'Normal reading', date: '2025-05-10' },
            { id: 2, type: 'weight', value: '68kg', notes: 'Monthly check', date: '2025-05-01' }
        ];
        
        renderMedications();
        renderSymptoms();
        renderHealthRecords();
        
        // Check for notifications
        checkNotifications();
    }
    
    function addMedication(e) {
        e.preventDefault();
        
        const name = document.getElementById('med-name').value;
        const dosage = document.getElementById('med-dosage').value;
        const time = document.getElementById('med-time').value;
        const frequency = document.getElementById('med-frequency').value;
        
        const newMedication = {
            id: medications.length + 1,
            name,
            dosage,
            time,
            frequency
        };
        
        medications.push(newMedication);
        renderMedications();
        
        // Clear form
        medicationForm.reset();
        
        // Show success message
        alert('Medication reminder added successfully!');
        
        // In a real app, you would make an API call here
        // fetch('/api/medications', { method: 'POST', body: JSON.stringify(newMedication) })
    }
    
    function renderMedications() {
        const medicationsList = document.getElementById('medications');
        medicationsList.innerHTML = '';
        
        if (medications.length === 0) {
            medicationsList.innerHTML = '<li class="list-group-item text-muted">No medications added yet</li>';
            return;
        }
        
        medications.forEach(med => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                <div>
                    <strong>${med.name}</strong> (${med.dosage})
                    <div class="text-muted small">${med.frequency} at ${med.time}</div>
                </div>
                <button class="btn btn-sm btn-outline-danger" data-id="${med.id}">Delete</button>
            `;
            medicationsList.appendChild(li);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('#medications .btn-outline-danger').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteMedication(id);
            });
        });
    }
    
    function deleteMedication(id) {
        medications = medications.filter(med => med.id !== id);
        renderMedications();
    }
    
    function checkSymptom(e) {
        e.preventDefault();
        
        const type = document.getElementById('symptom-type').value;
        const severity = parseInt(document.getElementById('symptom-severity').value);
        
        if (!type || isNaN(severity)) {
            alert('Please fill all fields');
            return;
        }
        
        // Get recommendation
        const recommendation = getRecommendation(type, severity);
        
        // Add to symptoms history
        const newSymptom = {
            id: symptoms.length + 1,
            type,
            severity,
            date: new Date().toISOString().split('T')[0],
            recommendation
        };
        
        symptoms.push(newSymptom);
        renderSymptoms();
        
        // Show recommendation
        const resultDiv = document.getElementById('symptom-result');
        document.getElementById('recommendation-text').textContent = recommendation;
        resultDiv.classList.remove('d-none');
        
        // Clear form
        symptomForm.reset();
    }
    
    function getRecommendation(type, severity) {
        const recommendations = {
            headache: {
                low: 'Drink water and rest in a quiet place.',
                medium: 'Take a break from screens, drink water, and consider a pain reliever.',
                high: 'Take a pain reliever and rest in a dark room. Consult a doctor if persistent.'
            },
            cold: {
                low: 'Drink warm fluids and get plenty of rest.',
                medium: 'Use a humidifier, drink warm fluids, and consider over-the-counter cold medicine.',
                high: 'Rest, stay hydrated, and consider seeing a doctor if symptoms worsen.'
            },
            fever: {
                low: 'Rest and drink fluids. Monitor temperature.',
                medium: 'Take fever-reducing medication, rest, and monitor symptoms.',
                high: 'Seek medical attention if fever is above 39°C or persists for more than 3 days.'
            },
            nausea: {
                low: 'Sip ginger tea or clear fluids. Avoid strong smells.',
                medium: 'Rest, sip clear fluids, and consider anti-nausea medication.',
                high: 'Seek medical attention if accompanied by severe pain or vomiting.'
            },
            dizziness: {
                low: 'Sit or lie down until it passes. Drink water.',
                medium: 'Rest, avoid sudden movements, and hydrate.',
                high: 'Seek medical attention if accompanied by chest pain or fainting.'
            }
        };
        
        let severityLevel;
        if (severity <= 3) severityLevel = 'low';
        else if (severity <= 7) severityLevel = 'medium';
        else severityLevel = 'high';
        
        return recommendations[type]?.[severityLevel] || 'Consult a healthcare professional for advice.';
    }
    
    function renderSymptoms() {
        const symptomsList = document.getElementById('symptoms-list');
        symptomsList.innerHTML = '';
        
        if (symptoms.length === 0) {
            symptomsList.innerHTML = '<li class="list-group-item text-muted">No symptoms recorded yet</li>';
            return;
        }
        
        symptoms.forEach(symptom => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            
            let severityClass;
            if (symptom.severity <= 3) severityClass = 'severity-low';
            else if (symptom.severity <= 7) severityClass = 'severity-medium';
            else severityClass = 'severity-high';
            
            li.innerHTML = `
                <div>
                    <strong>${symptom.type.charAt(0).toUpperCase() + symptom.type.slice(1)}</strong>
                    <span class="${severityClass}">Severity: ${symptom.severity}/10</span>
                    <div class="text-muted small">${symptom.date}</div>
                </div>
                <button class="btn btn-sm btn-outline-info" data-id="${symptom.id}">View</button>
            `;
            symptomsList.appendChild(li);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('#symptoms-list .btn-outline-info').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                viewSymptomDetails(id);
            });
        });
    }
    
    function viewSymptomDetails(id) {
        const symptom = symptoms.find(s => s.id === id);
        if (symptom) {
            document.getElementById('recommendation-text').textContent = symptom.recommendation;
            document.getElementById('symptom-result').classList.remove('d-none');
        }
    }
    
    function addHealthRecord() {
        const type = document.getElementById('record-type').value;
        const value = document.getElementById('record-value').value;
        const notes = document.getElementById('record-notes').value;
        
        if (!type || !value) {
            alert('Please fill required fields');
            return;
        }
        
        const newRecord = {
            id: healthRecords.length + 1,
            type,
            value,
            notes,
            date: new Date().toISOString().split('T')[0]
        };
        
        healthRecords.push(newRecord);
        renderHealthRecords();
        
        // Clear form and hide modal
        recordForm.reset();
        recordModal.hide();
    }
    
    function renderHealthRecords() {
        const recordsTable = document.getElementById('health-records-table');
        recordsTable.innerHTML = '';
        
        if (healthRecords.length === 0) {
            recordsTable.innerHTML = '<tr><td colspan="4" class="text-muted text-center">No health records yet</td></tr>';
            return;
        }
        
        healthRecords.forEach(record => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${record.date}</td>
                <td>${formatRecordType(record.type)}</td>
                <td>${record.value}</td>
                <td>${record.notes || '-'}</td>
            `;
            recordsTable.appendChild(tr);
        });
    }
    
    function formatRecordType(type) {
        const types = {
            'blood-pressure': 'Blood Pressure',
            'blood-sugar': 'Blood Sugar',
            'weight': 'Weight',
            'temperature': 'Temperature',
            'other': 'Other'
        };
        return types[type] || type;
    }
    
    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simulate login (in real app, would call API)
        console.log('Login attempt with:', email, password);
        alert('Login functionality will be implemented with backend API');
        loginModal.hide();
    }
    
    function handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }
        
        // Simulate registration (in real app, would call API)
        console.log('Registration attempt with:', name, email, password);
        alert('Registration functionality will be implemented with backend API');
        
        // Switch to login tab
        const authTabs = new bootstrap.Tab(document.querySelector('#authTabs .nav-link'));
        authTabs.show();
        
        // Clear form
        registerForm.reset();
    }
    
    function checkNotifications() {
        // Check for upcoming medication reminders
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
        
        medications.forEach(med => {
            if (med.time === currentTime) {
                showNotification(`Time to take ${med.name} (${med.dosage})`);
            }
        });
    }
    
    function showNotification(message) {
        // Check if browser supports notifications
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }
        
        // Check if notification permissions have been granted
        if (Notification.permission === "granted") {
            new Notification("PrescripEase Reminder", { body: message });
        } else if (Notification.permission !== "denied") {
            // Request permission
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("PrescripEase Reminder", { body: message });
                }
            });
        }
    }
    
    // Simulate checking for notifications every minute
    setInterval(checkNotifications, 60000);
});