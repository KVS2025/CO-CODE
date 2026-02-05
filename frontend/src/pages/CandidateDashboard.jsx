import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Eye,
  Bookmark,
  BookmarkCheck,
  Users,
  Calendar,
  AlertCircle,
  X,
  Bell,
  User,
  Award,
  Building2,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Edit2,
  Download,
  Send,
  File,
  ExternalLink,
  Home,
  Trash2
} from 'lucide-react';
import dataService from '../services/DataService';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [savedJobs, setSavedJobs] = useState([2, 5]);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to false for login view

  // Mock candidate profile data
  const [candidateProfile, setCandidateProfile] = useState({
    name: 'Jessica Martinez',
    email: 'jessica.martinez@email.com',
    phone: '+1 (555) 987-6543',
    location: 'Delhi',
    linkedin: 'linkedin.com/in/jessicamartinez',
    github: 'github.com/jessicadev',
    portfolio: 'jessicamartinez.dev',
    skills: ['React', 'Node.js', 'Python', 'MongoDB', 'AWS'],
    experience: '5 years',
    education: 'B.S. Computer Science, Stanford University',
    resumeUploaded: true,
    resumeName: 'Jessica_Martinez_Resume.pdf',
    resumeDate: '2024-01-15'
  });

  // Mock job listings - now loaded from DataService
  const [jobListings, setJobListings] = useState([]);

  // Load job listings from DataService
  useEffect(() => {
    // Initial load
    setJobListings(dataService.getVacancies());

    // Subscribe to updates
    const unsubscribe = dataService.subscribe('vacancies', () => {
      setJobListings(dataService.getVacancies());
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Mock application data - now loaded from DataService
  const [myApplications, setMyApplications] = useState([]);

  // Load applications from DataService
  useEffect(() => {
    // Initial load
    const allApplications = dataService.getApplications();
    // Filter to show only applications from this candidate
    const candidateApplications = allApplications.filter(
      app => app.candidateName === candidateProfile.name
    );
    setMyApplications(candidateApplications);

    // Subscribe to updates
    const unsubscribe = dataService.subscribe('applications', () => {
      const allApps = dataService.getApplications();
      const candidateApps = allApps.filter(
        app => app.candidateName === candidateProfile.name
      );
      setMyApplications(candidateApps);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [candidateProfile.name]);

  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    whyInterested: '',
    expectedSalary: '',
    availableStartDate: '',
    willingToRelocate: 'no',
    portfolioUrl: '',
    references: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    resume: null,
    coverLetter: null,
    portfolio: null
  });

  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
      'Interview Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
      'Not Selected': 'bg-red-50 text-red-700 border-red-200',
      'Offer Extended': 'bg-green-50 text-green-700 border-green-200',
      'Withdrawn': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    if (status === 'Under Review') return <Clock className="w-4 h-4" />;
    if (status === 'Interview Scheduled') return <Calendar className="w-4 h-4" />;
    if (status === 'Not Selected') return <XCircle className="w-4 h-4" />;
    if (status === 'Offer Extended') return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || job.department === filterDepartment;
    const matchesLocation = filterLocation === 'all' || job.location.includes(filterLocation);
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const savedJobsList = jobListings.filter(job => savedJobs.includes(job.id));

  const departments = ['all', ...new Set(jobListings.map(j => j.department))];
  const locations = ['all', 'Remote', 'Noida', 'Delhi', 'Bangalore', 'Hyderabad'];

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const submitApplication = () => {
    if (!applicationForm.coverLetter || !applicationForm.whyInterested) {
      alert('Please fill in all required fields');
      return;
    }

    // Add to applications via DataService
    const newApplication = {
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      department: selectedJob.department,
      candidateName: candidateProfile.name,
      candidateEmail: candidateProfile.email,
      candidatePhone: candidateProfile.phone,
      coverLetter: applicationForm.coverLetter,
      whyInterested: applicationForm.whyInterested,
      expectedSalary: applicationForm.expectedSalary,
      availableStartDate: applicationForm.availableStartDate,
      willingToRelocate: applicationForm.willingToRelocate,
      portfolioUrl: applicationForm.portfolioUrl
    };

    dataService.addApplication(newApplication);

    alert(`Application submitted successfully for ${selectedJob.title}! HR will review your application.`);
    setShowApplicationModal(false);
    setApplicationForm({
      coverLetter: '',
      whyInterested: '',
      expectedSalary: '',
      availableStartDate: '',
      willingToRelocate: 'no',
      portfolioUrl: '',
      references: ''
    });
    setActiveTab('applications');
  };

  const withdrawApplication = (appId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      dataService.updateApplication(appId, { status: 'Withdrawn' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">TechCorp Careers</h1>
                <p className="text-xs sm:text-sm text-slate-500">Find your dream job</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                <User className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900 hidden sm:inline">{candidateProfile.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { id: 'browse', label: 'Browse Jobs', icon: Search },
              { id: 'applications', label: 'My Applications', icon: FileText },
              { id: 'saved', label: 'Saved Jobs', icon: BookmarkCheck },
              { id: 'profile', label: 'My Profile', icon: User }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all duration-200 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                    ? 'border-slate-900 text-slate-900 bg-slate-50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'applications' && myApplications.length > 0 && (
                    <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">
                      {myApplications.length}
                    </span>
                  )}
                  {tab.id === 'saved' && savedJobs.length > 0 && (
                    <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full">
                      {savedJobs.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* BROWSE JOBS TAB */}
        {activeTab === 'browse' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-6 sm:p-8 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Discover Your Next Opportunity</h2>
              <p className="text-slate-200 mb-4">Join our team and work on cutting-edge projects</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Competitive Salaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Remote Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Great Benefits</span>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by job title, keyword, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Building2 className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white appearance-none cursor-pointer"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white appearance-none cursor-pointer"
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>
                        {loc === 'all' ? 'All Locations' : loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                <span className="font-semibold text-slate-900">{filteredJobs.length}</span> jobs found
              </p>
            </div>

            {/* Job Listings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-slate-700 mb-1">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="w-5 h-5 text-slate-900" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-700">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">{job.level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">{job.applicants} applicants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">{job.posted}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-200">
                    <AlertCircle className="w-4 h-4" />
                    <span>Application deadline: {job.deadline}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApply(job)}
                      className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Apply Now
                    </button>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No jobs found</p>
                <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* MY APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">My Applications</h2>
              <p className="text-slate-600 mt-1">Track your job application progress</p>
            </div>

            {/* Application Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{myApplications.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Under Review</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
                      {myApplications.filter(a => a.status === 'Under Review').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Interviews</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
                      {myApplications.filter(a => a.status === 'Interview Scheduled').length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Not Selected</p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
                      {myApplications.filter(a => a.status === 'Not Selected').length}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-200" />
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {myApplications.map(app => {
                const job = jobListings.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{app.jobTitle}</h3>
                        <p className="text-sm text-slate-600">{app.company} • {app.department}</p>
                        <p className="text-xs text-slate-500 mt-1">Applied on {app.appliedDate}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 w-fit ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </div>

                    {/* Progress Stages */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Stage: {app.stage}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {['Application Review', 'Phone Screening', 'Technical Interview', 'Final Interview', 'Offer'].map((stage, idx) => {
                          const stages = ['Application Review', 'Phone Screening', 'Technical Interview', 'Final Interview', 'Offer'];
                          const currentIdx = stages.indexOf(app.stage);
                          return (
                            <div key={stage} className="flex-1">
                              <div className={`h-2 rounded-full transition-all ${idx <= currentIdx && app.status !== 'Not Selected' && app.status !== 'Withdrawn'
                                ? 'bg-slate-900'
                                : 'bg-slate-200'
                                }`}></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {app.interviewDate && (
                      <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">
                          Interview: {app.interviewDate}
                        </span>
                      </div>
                    )}

                    {/* 🎉 OFFER EXTENDED - Special Display */}
                    {app.status === 'Offer Extended' && app.feedback && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg mb-4 animate-pulse-slow">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-green-900 mb-2">🎉 Congratulations! Offer Extended</h4>
                            <p className="text-sm text-green-800 mb-3">{app.feedback}</p>
                            <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                              <p className="text-xs font-semibold text-green-900 mb-1">Next Steps:</p>
                              <ul className="text-xs text-green-800 space-y-1">
                                <li>• Review the offer details carefully</li>
                                <li>• Contact HR if you have any questions</li>
                                <li>• Respond to the offer at your earliest convenience</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {app.feedback && app.status !== 'Offer Extended' && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4">
                        <p className="text-sm font-medium text-slate-700 mb-1">Recruiter Feedback:</p>
                        <p className="text-sm text-slate-600">{app.feedback}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {app.status !== 'Not Selected' && app.status !== 'Withdrawn' && (
                        <button
                          onClick={() => withdrawApplication(app.id)}
                          className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {myApplications.length === 0 && (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No applications yet</p>
                <p className="text-slate-500 text-sm mb-4">Start applying to jobs to see them here</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        )}

        {/* SAVED JOBS TAB */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Saved Jobs</h2>
              <p className="text-slate-600 mt-1">{savedJobsList.length} jobs saved for later</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {savedJobsList.map(job => (
                <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <BookmarkCheck className="w-5 h-5 text-slate-900" />
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-700">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">{job.posted}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApply(job)}
                      className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                      Apply Now
                    </button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {savedJobsList.length === 0 && (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No saved jobs yet</p>
                <p className="text-slate-500 text-sm mb-4">Save jobs to easily find them later</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        )}

        {/* MY PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">My Profile</h2>
              <p className="text-slate-600 mt-1">Manage your candidate information</p>
            </div>

            {/* Profile Overview */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {candidateProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{candidateProfile.name}</h3>
                      <p className="text-slate-600">{candidateProfile.experience} of experience</p>
                      <p className="text-sm text-slate-500">{candidateProfile.location}</p>
                    </div>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm flex items-center gap-2 w-fit">
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>{candidateProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{candidateProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Award className="w-4 h-4" />
                      <span>{candidateProfile.education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{candidateProfile.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Professional Links</h3>
                <button className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <a href={`https://${candidateProfile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700 flex-1">{candidateProfile.linkedin}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
                <a href={`https://${candidateProfile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <Github className="w-5 h-5 text-slate-700" />
                  <span className="text-sm font-medium text-slate-700 flex-1">{candidateProfile.github}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
                <a href={`https://${candidateProfile.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <Globe className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-700 flex-1">{candidateProfile.portfolio}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Skills</h3>
                <button className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidateProfile.skills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Resume / CV</h3>
                <button className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  Update
                </button>
              </div>
              {candidateProfile.resumeUploaded ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <File className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">{candidateProfile.resumeName}</p>
                      <p className="text-sm text-green-700">Uploaded on {candidateProfile.resumeDate}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-green-700" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Upload your resume</p>
                  <p className="text-xs text-slate-500">PDF, DOC, or DOCX (Max 5MB)</p>
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Change Password</span>
                  <Edit2 className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Email Notifications</span>
                  <Edit2 className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full text-left px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  <span className="text-sm font-medium">Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between rounded-t-xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Apply for Position</h2>
                <p className="text-sm text-slate-600">{selectedJob.title} at TechCorp Inc.</p>
              </div>
              <button onClick={() => setShowApplicationModal(false)} className="text-slate-600 hover:text-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Candidate Info (Pre-filled) */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Your Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-600">Name</p>
                    <p className="font-medium text-slate-900">{candidateProfile.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Email</p>
                    <p className="font-medium text-slate-900">{candidateProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Phone</p>
                    <p className="font-medium text-slate-900">{candidateProfile.phone}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Location</p>
                    <p className="font-medium text-slate-900">{candidateProfile.location}</p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="6"
                  placeholder="Introduce yourself and explain why you're interested in this position..."
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              {/* Why Interested */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Why are you interested in this role? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="What excites you about this opportunity?"
                  value={applicationForm.whyInterested}
                  onChange={(e) => setApplicationForm({ ...applicationForm, whyInterested: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              {/* Expected Salary & Start Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., $120,000"
                    value={applicationForm.expectedSalary}
                    onChange={(e) => setApplicationForm({ ...applicationForm, expectedSalary: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Available Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={applicationForm.availableStartDate}
                    onChange={(e) => setApplicationForm({ ...applicationForm, availableStartDate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  />
                </div>
              </div>

              {/* Relocation */}
              {selectedJob.location !== 'Remote' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Willing to relocate to {selectedJob.location}?
                  </label>
                  <select
                    value={applicationForm.willingToRelocate}
                    onChange={(e) => setApplicationForm({ ...applicationForm, willingToRelocate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                    <option value="maybe">Open to Discussion</option>
                  </select>
                </div>
              )}

              {/* Portfolio URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Portfolio / Website (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={applicationForm.portfolioUrl}
                  onChange={(e) => setApplicationForm({ ...applicationForm, portfolioUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resume / CV <span className="text-red-500">*</span>
                </label>
                {candidateProfile.resumeUploaded ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900 text-sm">{candidateProfile.resumeName}</p>
                        <p className="text-xs text-green-700">Will be submitted with application</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-900">Upload your resume</p>
                    <p className="text-xs text-slate-500">PDF, DOC, or DOCX (Max 5MB)</p>
                  </div>
                )}
              </div>

              {/* Additional Documents */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Upload supporting documents</p>
                  <p className="text-xs text-slate-500">Cover letter, certifications, portfolio samples, etc.</p>
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <input type="checkbox" className="mt-1" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Consent to process application</p>
                  <p className="text-blue-700">I consent to TechCorp Inc. processing my personal data for recruitment purposes and understand that my information will be stored securely.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50 rounded-b-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={submitApplication}
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Application
                </button>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && !showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between rounded-t-xl">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedJob.title}</h2>
                <p className="text-sm text-slate-600">{selectedJob.department} • {selectedJob.location}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-600 hover:text-slate-900 ml-4">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Job Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Salary</p>
                  <p className="font-semibold text-slate-900">{selectedJob.salary}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Type</p>
                  <p className="font-semibold text-slate-900">{selectedJob.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Level</p>
                  <p className="font-semibold text-slate-900">{selectedJob.level}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Openings</p>
                  <p className="font-semibold text-slate-900">{selectedJob.openings}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">About the Role</h3>
                <p className="text-slate-600 text-sm">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedJob.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.benefits.map((benefit, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50 rounded-b-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowApplicationModal(true);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Apply for this Position
                </button>
                <button
                  onClick={() => toggleSaveJob(selectedJob.id)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium flex items-center gap-2"
                >
                  {savedJobs.includes(selectedJob.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CandidateDashboard;