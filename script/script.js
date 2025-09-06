// Global variables to store user data
let userData = {
    basicInfo: {},
    skills: [],
    certificates: [],
    projects: []
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    updateProgress();
    generateSuggestions();
    
    // Set up form submission
    document.getElementById('basicInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveBasicInfo();
    });

    // Set up photo upload
    document.getElementById('photoUpload').addEventListener('change', function(e) {
        handlePhotoUpload(e);
    });

    // Set up enter key for skill input
    document.getElementById('skillInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    });
});

// Load user data from memory
function loadUserData() {
    const saved = JSON.parse(sessionStorage.getItem('skillsyncData') || '{}');
    userData = {
        basicInfo: saved.basicInfo || {},
        skills: saved.skills || [],
        certificates: saved.certificates || [],
        projects: saved.projects || []
    };
    
    // Populate form fields
    if (userData.basicInfo.fullName) {
        document.getElementById('fullName').value = userData.basicInfo.fullName;
        document.getElementById('profileName').textContent = userData.basicInfo.fullName;
    }
    
    if (userData.basicInfo.email) {
        document.getElementById('email').value = userData.basicInfo.email;
    }
    
    if (userData.basicInfo.phone) {
        document.getElementById('phone').value = userData.basicInfo.phone;
    }
    
    if (userData.basicInfo.location) {
        document.getElementById('location').value = userData.basicInfo.location;
    }
    
    if (userData.basicInfo.careerGoal) {
        document.getElementById('careerGoal').value = userData.basicInfo.careerGoal;
        document.getElementById('profileGoal').textContent = userData.basicInfo.careerGoal;
    }
    
    if (userData.basicInfo.education) {
        document.getElementById('education').value = userData.basicInfo.education;
    }
    
    if (userData.basicInfo.photo) {
        document.getElementById('profilePhoto').src = userData.basicInfo.photo;
    }
    
    // Display skills, certificates, and projects
    displaySkills();
    displayCertificates();
    displayProjects();
    updateStats();
}

// Save user data to memory
function saveUserData() {
    sessionStorage.setItem('skillsyncData', JSON.stringify(userData));
}

// Save basic info
function saveBasicInfo() {
    userData.basicInfo = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        careerGoal: document.getElementById('careerGoal').value,
        education: document.getElementById('education').value,
        photo: userData.basicInfo.photo || null
    };
    
    // Update display
    document.getElementById('profileName').textContent = userData.basicInfo.fullName || 'Your Name';
    document.getElementById('profileGoal').textContent = userData.basicInfo.careerGoal || 'Your Career Goal';
    
    saveUserData();
    updateProgress();
    generateSuggestions();
    
    // Show success message
    showToast('Basic information saved successfully!', 'success');
}

// Handle photo upload
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userData.basicInfo.photo = e.target.result;
            document.getElementById('profilePhoto').src = e.target.result;
            saveUserData();
        };
        reader.readAsDataURL(file);
    }
}

// Add skill
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skill = skillInput.value.trim();
    
    if (skill && !userData.skills.includes(skill)) {
        userData.skills.push(skill);
        skillInput.value = '';
        displaySkills();
        updateStats();
        updateProgress();
        generateSuggestions();
        saveUserData();
        showToast('Skill added successfully!', 'success');
    }
}

// Remove skill
function removeSkill(skill) {
    userData.skills = userData.skills.filter(s => s !== skill);
    displaySkills();
    updateStats();
    updateProgress();
    generateSuggestions();
    saveUserData();
}

// Display skills
function displaySkills() {
    const skillsList = document.getElementById('skillsList');
    
    if (userData.skills.length === 0) {
        skillsList.innerHTML = '<span class="text-muted">No skills added yet</span>';
        return;
    }
    
    skillsList.innerHTML = userData.skills.map(skill => 
        `<span class="skill-tag">
            ${skill}
            <button class="btn btn-sm ms-2" onclick="removeSkill('${skill}')" style="background:none;border:none;color:white;padding:0;">
                <i class="fas fa-times"></i>
            </button>
        </span>`
    ).join('');
}

// Add certificate
function addCertificate() {
    const name = document.getElementById('certName').value.trim();
    const issuer = document.getElementById('certIssuer').value.trim();
    const date = document.getElementById('certDate').value;
    
    if (name && issuer && date) {
        userData.certificates.push({ name, issuer, date });
        
        // Clear inputs
        document.getElementById('certName').value = '';
        document.getElementById('certIssuer').value = '';
        document.getElementById('certDate').value = '';
        
        displayCertificates();
        updateStats();
        updateProgress();
        generateSuggestions();
        saveUserData();
        showToast('Certificate added successfully!', 'success');
    }
}

// Remove certificate
function removeCertificate(index) {
    userData.certificates.splice(index, 1);
    displayCertificates();
    updateStats();
    updateProgress();
    generateSuggestions();
    saveUserData();
}

// Display certificates
function displayCertificates() {
    const certsList = document.getElementById('certificatesList');
    
    if (userData.certificates.length === 0) {
        certsList.innerHTML = '<p class="text-muted">No certificates added yet</p>';
        return;
    }
    
    certsList.innerHTML = userData.certificates.map((cert, index) => 
        `<div class="certificate-item">
            <button class="remove-btn" onclick="removeCertificate(${index})">
                <i class="fas fa-times"></i>
            </button>
            <h6>${cert.name}</h6>
            <p class="mb-1"><strong>Issued by:</strong> ${cert.issuer}</p>
            <p class="mb-0"><strong>Date:</strong> ${new Date(cert.date).toLocaleDateString()}</p>
        </div>`
    ).join('');
}

// Add project
function addProject() {
    const name = document.getElementById('projectName').value.trim();
    const tech = document.getElementById('projectTech').value.trim();
    const desc = document.getElementById('projectDesc').value.trim();
    const url = document.getElementById('projectUrl').value.trim();
    
    if (name && tech && desc) {
        userData.projects.push({ name, tech, desc, url });
        
        // Clear inputs
        document.getElementById('projectName').value = '';
        document.getElementById('projectTech').value = '';
        document.getElementById('projectDesc').value = '';
        document.getElementById('projectUrl').value = '';
        
        displayProjects();
        updateStats();
        updateProgress();
        generateSuggestions();
        saveUserData();
        showToast('Project added successfully!', 'success');
    }
}

// Remove project
function removeProject(index) {
    userData.projects.splice(index, 1);
    displayProjects();
    updateStats();
    updateProgress();
    generateSuggestions();
    saveUserData();
}

// Display projects
function displayProjects() {
    const projectsList = document.getElementById('projectsList');
    
    if (userData.projects.length === 0) {
        projectsList.innerHTML = '<p class="text-muted">No projects added yet</p>';
        return;
    }
    
    projectsList.innerHTML = userData.projects.map((project, index) => 
        `<div class="project-item">
            <button class="remove-btn" onclick="removeProject(${index})">
                <i class="fas fa-times"></i>
            </button>
            <h6>${project.name}</h6>
            <p class="mb-1"><strong>Technologies:</strong> ${project.tech}</p>
            <p class="mb-1">${project.desc}</p>
            ${project.url ? `<p class="mb-0"><strong>URL:</strong> <a href="${project.url}" target="_blank">${project.url}</a></p>` : ''}
        </div>`
    ).join('');
}

// Update statistics
function updateStats() {
    document.getElementById('skillCount').textContent = userData.skills.length;
    document.getElementById('certCount').textContent = userData.certificates.length;
    document.getElementById('projectCount').textContent = userData.projects.length;
}

// Update progress
function updateProgress() {
    const fields = [
        userData.basicInfo.fullName,
        userData.basicInfo.email,
        userData.basicInfo.careerGoal,
        userData.basicInfo.education,
        userData.skills.length > 0,
        userData.certificates.length > 0,
        userData.projects.length > 0
    ];
    
    const completed = fields.filter(field => field).length;
    const progress = Math.round((completed / fields.length) * 100);
    
    // Update progress ring
    const circle = document.getElementById('progressCircle');
    const text = document.getElementById('progressText');
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (progress / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    text.textContent = `${progress}%`;
}

// Generate smart suggestions
function generateSuggestions() {
    const suggestions = [];
    
    if (!userData.basicInfo.fullName) {
        suggestions.push('Complete your basic information to get started');
    }
    
    if (userData.skills.length < 5) {
        suggestions.push('Add more skills to improve your profile strength');
    }
    
    if (userData.certificates.length === 0) {
        suggestions.push('Add certificates to showcase your expertise');
    }
    
    if (userData.projects.length < 2) {
        suggestions.push('Add projects to demonstrate your practical experience');
    }
    
    if (userData.basicInfo.careerGoal === 'Frontend Developer' && !userData.skills.some(s => s.toLowerCase().includes('react'))) {
        suggestions.push('Consider adding React to your skills for frontend development');
    }
    
    if (userData.basicInfo.careerGoal === 'Backend Developer' && !userData.skills.some(s => s.toLowerCase().includes('node') || s.toLowerCase().includes('python'))) {
        suggestions.push('Add backend technologies like Node.js or Python to your skills');
    }
    
    if (userData.skills.length > 0 && userData.projects.length === 0) {
        suggestions.push('Create projects to showcase your skills in action');
    }
    
    if (suggestions.length === 0) {
        suggestions.push('Great job! Your profile looks complete. Consider adding more projects or skills to stand out.');
    }
    
    const container = document.getElementById('suggestionsContainer');
    container.innerHTML = suggestions.map(suggestion => 
        `<div class="suggestion-item">
            <i class="fas fa-lightbulb me-2"></i>
            ${suggestion}
        </div>`
    ).join('');
}

// Generate PDF Resume
async function generatePDF() {
    // Collect user data
    const name = document.getElementById('fullName').value || document.getElementById('profileName').textContent;
    const email = document.getElementById('email').value || '';
    const phone = document.getElementById('phone').value || '';
    const location = document.getElementById('location').value || '';
    const goal = document.getElementById('careerGoal').value || document.getElementById('profileGoal').textContent;
    const education = document.getElementById('education').value || '';
    
    // Skills
    const skills = Array.from(document.querySelectorAll('#skillsList .badge')).map(b => b.textContent).join(', ');
    // Certificates
    const certs = Array.from(document.querySelectorAll('#certificatesList .card')).map(card => card.innerText).join('\n\n');
    // Projects
    const projects = Array.from(document.querySelectorAll('#projectsList .card')).map(card => card.innerText).join('\n\n');

    // AI Enhancement (simple template, for real AI use an API)
    const aiSummary = `Driven and optimistic ${goal || 'professional'} with skills in ${skills}. Passionate about continuous learning and delivering impactful projects.`;

    // Create PDF content
    const doc = new window.jspdf.jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(name, 10, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Email: ${email}`, 10, 30);
    doc.text(`Phone: ${phone}`, 10, 37);
    doc.text(`Location: ${location}`, 10, 44);
    doc.text(`Career Goal: ${goal}`, 10, 51);
    doc.text(`Education: ${education}`, 10, 58);

    doc.setFont('helvetica', 'bold');
    doc.text('AI Enhanced Summary:', 10, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(aiSummary, 180), 10, 78);

    doc.setFont('helvetica', 'bold');
    doc.text('Skills:', 10, 95);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(skills, 180), 10, 103);

    doc.setFont('helvetica', 'bold');
    doc.text('Certificates:', 10, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(certs, 180), 10, 128);

    doc.setFont('helvetica', 'bold');
    doc.text('Projects:', 10, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(projects, 180), 10, 158);

    doc.save(`${name.replace(/\s+/g, '_')}_Resume.pdf`);
}

// Show portfolio
function showPortfolio() {
    document.getElementById('dashboard').classList.add('d-none');
    document.getElementById('portfolio').classList.remove('d-none');
    generatePortfolioContent();
}

// Show dashboard
function showDashboard() {
    document.getElementById('portfolio').classList.add('d-none');
    document.getElementById('dashboard').classList.remove('d-none');
}

// Generate portfolio content
function generatePortfolioContent() {
    const container = document.getElementById('portfolioContent');
    
    container.innerHTML = `
        <div class="text-center mb-4">
            <img src="${userData.basicInfo.photo || 'https://via.placeholder.com/150x150/6366f1/ffffff?text=Photo'}" 
                 alt="Profile Photo" class="profile-photo mb-3" style="width: 150px; height: 150px;">
            <h2>${userData.basicInfo.fullName || 'Your Name'}</h2>
            <h5 class="text-muted">${userData.basicInfo.careerGoal || 'Career Goal'}</h5>
            <p class="text-muted">${userData.basicInfo.location || 'Location'}</p>
            
            <div class="row justify-content-center mt-4">
                <div class="col-md-8">
                    <div class="row">
                        <div class="col-4">
                            <div class="stat-card">
                                <div class="stat-number">${userData.skills.length}</div>
                                <div class="stat-label">Skills</div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="stat-card">
                                <div class="stat-number">${userData.certificates.length}</div>
                                <div class="stat-label">Certificates</div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="stat-card">
                                <div class="stat-number">${userData.projects.length}</div>
                                <div class="stat-label">Projects</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        ${userData.basicInfo.education ? `
        <div class="mb-4">
            <h4><i class="fas fa-graduation-cap me-2"></i>Education</h4>
            <p>${userData.basicInfo.education}</p>
        </div>
        ` : ''}
        
        ${userData.skills.length > 0 ? `
        <div class="mb-4">
            <h4><i class="fas fa-cogs me-2"></i>Skills</h4>
            <div class="d-flex flex-wrap">
                ${userData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        ${userData.certificates.length > 0 ? `
        <div class="mb-4">
            <h4><i class="fas fa-certificate me-2"></i>Certificates</h4>
            ${userData.certificates.map(cert => `
                <div class="certificate-item">
                    <h6>${cert.name}</h6>
                    <p class="mb-1"><strong>Issued by:</strong> ${cert.issuer}</p>
                    <p class="mb-0"><strong>Date:</strong> ${new Date(cert.date).toLocaleDateString()}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${userData.projects.length > 0 ? `
        <div class="mb-4">
            <h4><i class="fas fa-project-diagram me-2"></i>Projects</h4>
            ${userData.projects.map(project => `
                <div class="project-item">
                    <h6>${project.name}</h6>
                    <p class="mb-1"><strong>Technologies:</strong> ${project.tech}</p>
                    <p class="mb-1">${project.desc}</p>
                    ${project.url ? `<p class="mb-0"><strong>URL:</strong> <a href="${project.url}" target="_blank">${project.url}</a></p>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="text-center mt-4">
            <p class="text-muted">Contact: ${userData.basicInfo.email || 'your.email@example.com'} | ${userData.basicInfo.phone || 'Phone Number'}</p>
        </div>
    `;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Create toast container
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}

// Show sample skills if none added
function showSampleSkills() {
    const skillsList = document.getElementById('skillsList');
    if (skillsList && skillsList.children.length === 1) {
        skillsList.innerHTML = `
            <span class="badge">JavaScript</span>
            <span class="badge">Python</span>
            <span class="badge">React</span>
            <span class="badge">UI/UX Design</span>
        `;
    }
}

// Show sample certificates if none added
function showSampleCertificates() {
    const certList = document.getElementById('certificatesList');
    if (certList && certList.children.length === 1) {
        certList.innerHTML = `
            <div class="card mb-2 p-2">
                <strong>Google Data Analytics</strong> <br>
                <span class="text-muted">Coursera · 2024-01-15</span>
            </div>
            <div class="card mb-2 p-2">
                <strong>Responsive Web Design</strong> <br>
                <span class="text-muted">freeCodeCamp · 2023-08-10</span>
            </div>
        `;
    }
}

// Show sample projects if none added
function showSampleProjects() {
    const projList = document.getElementById('projectsList');
    if (projList && projList.children.length === 1) {
        projList.innerHTML = `
            <div class="card mb-2 p-2">
                <strong>Portfolio Website</strong> <br>
                <span class="text-muted">React, CSS, Netlify</span><br>
                <span>A personal portfolio to showcase my work and skills.</span>
            </div>
            <div class="card mb-2 p-2">
                <strong>Task Manager App</strong> <br>
                <span class="text-muted">Node.js, Express, MongoDB</span><br>
                <span>Helps users manage daily tasks efficiently.</span>
            </div>
        `;
    }
}

// Show optimistic suggestions
function showOptimisticSuggestions() {
    const suggestions = document.getElementById('suggestionsContainer');
    if (suggestions) {
        suggestions.innerHTML = `
            <div class="suggestion-item">
                <i class="fas fa-info-circle me-2"></i>
                Keep going! Every skill you add brings you closer to your dream job.
            </div>
            <div class="suggestion-item">
                <i class="fas fa-lightbulb me-2"></i>
                Tip: Showcase your best projects and certificates to stand out!
            </div>
            <div class="suggestion-item">
                <i class="fas fa-quote-left me-2"></i>
                "The future belongs to those who believe in the beauty of their dreams." – Eleanor Roosevelt
            </div>
        `;
    }
}

// Animate progress ring
function setProgress(percent) {
    const circle = document.getElementById('progressCircle');
    const text = document.getElementById('progressText');
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    if (circle) {
        circle.style.strokeDasharray = `${circumference - offset} ${circumference}`;
    }
    if (text) {
        text.textContent = percent + '%';
    }
}

// On page load, show sample data and optimistic UI
window.addEventListener('DOMContentLoaded', () => {
    showSampleSkills();
    showSampleCertificates();
    showSampleProjects();
    showOptimisticSuggestions();
    setProgress(65); // Example: 65% profile completion
});
