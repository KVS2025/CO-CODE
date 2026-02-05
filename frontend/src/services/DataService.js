// Shared data service for managing job vacancies and applications
class DataService {
    constructor() {
        // Initialize with localStorage or default data
        this.loadData();
        this.listeners = {
            vacancies: [],
            applications: [],
            candidates: []
        };
    }

    loadData() {
        // Load from localStorage or use default data
        const storedVacancies = localStorage.getItem('jobVacancies');
        const storedApplications = localStorage.getItem('jobApplications');
        const storedCandidates = localStorage.getItem('candidates');

        this.vacancies = storedVacancies ? JSON.parse(storedVacancies) : [
            { id: 1, title: 'Senior React Developer', department: 'Engineering', posted: '2024-01-15', applications: 0, status: 'Open', level: 'Senior', positions: 2, location: 'New York, NY', type: 'Full-time', salary: '$120k - $150k', deadline: '2024-02-20', openings: 2, description: 'We are looking for an experienced React developer to join our growing engineering team and build cutting-edge web applications.', requirements: ['5+ years of React experience', 'Strong TypeScript skills', 'Experience with modern frontend tools', 'Excellent problem-solving abilities'], responsibilities: ['Build and maintain React applications', 'Collaborate with designers and backend teams', 'Write clean, maintainable code', 'Participate in code reviews'], benefits: ['Health Insurance', 'Remote Work Options', '401k Match', 'Professional Development', 'Unlimited PTO'] },
            { id: 2, title: 'Product Manager', department: 'Product', posted: '2024-01-10', applications: 0, status: 'Open', level: 'Mid-level', positions: 1, location: 'San Francisco, CA', type: 'Full-time', salary: '$110k - $135k', deadline: '2024-02-25', openings: 1, description: 'Join our product team to drive feature development and work with cross-functional teams to deliver exceptional user experiences.', requirements: ['3+ years product management experience', 'Strong analytical skills', 'Excellent communication', 'Agile/Scrum experience'], responsibilities: ['Define product roadmap', 'Work with stakeholders', 'Analyze user feedback', 'Coordinate with engineering'], benefits: ['Health Insurance', 'Stock Options', 'Flexible Hours', 'Learning Budget'] },
            { id: 3, title: 'UX Designer', department: 'Design', posted: '2024-01-05', applications: 0, status: 'Open', level: 'Mid-level', positions: 1, location: 'Remote', type: 'Full-time', salary: '$95k - $120k', deadline: '2024-02-18', openings: 1, description: 'Create intuitive and beautiful user experiences for our flagship products used by millions of users worldwide.', requirements: ['4+ years UX design experience', 'Proficiency in Figma', 'User research skills', 'Strong portfolio required'], responsibilities: ['Design user flows and wireframes', 'Conduct user research', 'Create design systems', 'Collaborate with developers'], benefits: ['Health Insurance', 'Remote Work', 'Home Office Stipend', 'Unlimited PTO'] }
        ];

        this.applications = storedApplications ? JSON.parse(storedApplications) : [];

        this.candidates = storedCandidates ? JSON.parse(storedCandidates) : [];
    }

    saveData() {
        localStorage.setItem('jobVacancies', JSON.stringify(this.vacancies));
        localStorage.setItem('jobApplications', JSON.stringify(this.applications));
        localStorage.setItem('candidates', JSON.stringify(this.candidates));
    }

    // Vacancy Management
    getVacancies() {
        return [...this.vacancies];
    }

    addVacancy(vacancy) {
        const newVacancy = {
            ...vacancy,
            id: Date.now(),
            posted: new Date().toISOString().split('T')[0],
            applications: 0,
            status: 'Open'
        };
        this.vacancies.push(newVacancy);
        this.saveData();
        this.notifyListeners('vacancies');
        return newVacancy;
    }

    updateVacancy(id, updates) {
        const index = this.vacancies.findIndex(v => v.id === id);
        if (index !== -1) {
            this.vacancies[index] = { ...this.vacancies[index], ...updates };
            this.saveData();
            this.notifyListeners('vacancies');
            return this.vacancies[index];
        }
        return null;
    }

    deleteVacancy(id) {
        this.vacancies = this.vacancies.filter(v => v.id !== id);
        this.saveData();
        this.notifyListeners('vacancies');
    }

    // Application Management
    getApplications() {
        return [...this.applications];
    }

    addApplication(application) {
        const newApplication = {
            ...application,
            id: Date.now(),
            appliedDate: new Date().toISOString().split('T')[0],
            status: 'Under Review',
            stage: 'Application Review',
            interviewDate: null,
            feedback: null,
            company: 'TechCorp Inc.'
        };

        this.applications.push(newApplication);

        // Update vacancy application count
        const vacancy = this.vacancies.find(v => v.id === application.jobId);
        if (vacancy) {
            vacancy.applications = (vacancy.applications || 0) + 1;
        }

        // Add to candidates list for HR
        const candidateExists = this.candidates.find(c =>
            c.name === application.candidateName && c.position === application.jobTitle
        );

        if (!candidateExists) {
            const newCandidate = {
                id: Date.now() + Math.random(),
                name: application.candidateName,
                position: application.jobTitle,
                stage: 'Application Review',
                score: 0,
                appliedDate: newApplication.appliedDate,
                status: 'In Progress',
                email: application.candidateEmail,
                phone: application.candidatePhone,
                applicationId: newApplication.id
            };
            this.candidates.push(newCandidate);
        }

        this.saveData();
        this.notifyListeners('applications');
        this.notifyListeners('candidates');
        this.notifyListeners('vacancies');
        return newApplication;
    }

    updateApplication(id, updates) {
        const index = this.applications.findIndex(a => a.id === id);
        if (index !== -1) {
            this.applications[index] = { ...this.applications[index], ...updates };

            // Update corresponding candidate
            const candidate = this.candidates.find(c => c.applicationId === id);
            if (candidate) {
                candidate.stage = updates.stage || candidate.stage;
                candidate.status = updates.status || candidate.status;
            }

            this.saveData();
            this.notifyListeners('applications');
            this.notifyListeners('candidates');
            return this.applications[index];
        }
        return null;
    }

    // Candidate Management
    getCandidates() {
        return [...this.candidates];
    }

    updateCandidate(id, updates) {
        const index = this.candidates.findIndex(c => c.id === id);
        if (index !== -1) {
            this.candidates[index] = { ...this.candidates[index], ...updates };

            // Update corresponding application
            const application = this.applications.find(a => a.id === this.candidates[index].applicationId);
            if (application) {
                application.stage = updates.stage || application.stage;
                application.status = updates.status || application.status;
            }

            this.saveData();
            this.notifyListeners('candidates');
            this.notifyListeners('applications');
            return this.candidates[index];
        }
        return null;
    }

    deleteCandidate(id) {
        this.candidates = this.candidates.filter(c => c.id !== id);
        this.saveData();
        this.notifyListeners('candidates');
    }

    // Listener Management
    subscribe(type, callback) {
        if (this.listeners[type]) {
            this.listeners[type].push(callback);
        }

        // Return unsubscribe function
        return () => {
            if (this.listeners[type]) {
                this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
            }
        };
    }

    notifyListeners(type) {
        if (this.listeners[type]) {
            this.listeners[type].forEach(callback => callback());
        }
    }

    // Clear all data (for testing)
    clearAll() {
        this.vacancies = [];
        this.applications = [];
        this.candidates = [];
        this.saveData();
        this.notifyListeners('vacancies');
        this.notifyListeners('applications');
        this.notifyListeners('candidates');
    }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
