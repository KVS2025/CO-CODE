import React, { useState } from 'react';
import { ChevronRight, Upload, FileCheck, CheckCircle, Clock, Users, FileText, Search, Plus, Edit2, Trash2, Eye, Download, AlertCircle, X } from 'lucide-react';

const RecruitmentSystem = () => {
  const [activeTab, setActiveTab] = useState('hiring');
  const [showVacancyForm, setShowVacancyForm] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state for new vacancy
  const [newVacancy, setNewVacancy] = useState({
    title: '',
    department: '',
    level: '',
    positions: ''
  });

  // Mock data
  const [vacancies, setVacancies] = useState([
    { id: 1, title: 'Senior React Developer', department: 'Engineering', posted: '2024-01-15', applications: 24, status: 'Open' },
    { id: 2, title: 'Product Manager', department: 'Product', posted: '2024-01-10', applications: 18, status: 'Open' },
    { id: 3, title: 'UX Designer', department: 'Design', posted: '2024-01-05', applications: 12, status: 'Closed' },
  ]);

  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Sarah Chen', position: 'Senior React Developer', stage: 'Technical Interview', score: 8.5, appliedDate: '2024-01-20', status: 'In Progress' },
    { id: 2, name: 'James Wilson', position: 'Senior React Developer', stage: 'HR Interview', score: 7.8, appliedDate: '2024-01-18', status: 'In Progress' },
    { id: 3, name: 'Emma Rodriguez', position: 'Product Manager', stage: 'Shortlisted', score: 8.2, appliedDate: '2024-01-21', status: 'Pending' },
    { id: 4, name: 'Michael Park', position: 'UX Designer', stage: 'Offer Extended', score: 9.0, appliedDate: '2024-01-16', status: 'Offer Extended' },
  ]);

  const [documents] = useState([
    { id: 1, candidateName: 'Michael Park', position: 'UX Designer', status: 'Pending', uploadedDocs: 3, requiredDocs: 5, lastUpdated: '2024-01-22' },
    { id: 2, candidateName: 'Sarah Chen', position: 'Senior React Developer', status: 'In Review', uploadedDocs: 4, requiredDocs: 5, lastUpdated: '2024-01-21' },
  ]);

  // ✅ FIXED: Handle adding new vacancy
  const handleAddVacancy = () => {
    if (newVacancy.title && newVacancy.department) {
      const vacancy = {
        id: vacancies.length + 1,
        title: newVacancy.title,
        department: newVacancy.department,
        posted: new Date().toISOString().split('T')[0],
        applications: 0,
        status: 'Open'
      };
      setVacancies([...vacancies, vacancy]);
      
      // Reset form
      setNewVacancy({
        title: '',
        department: '',
        level: '',
        positions: ''
      });
      setShowVacancyForm(false);
      alert('Vacancy added successfully!');
    } else {
      alert('Please fill in title and department');
    }
  };

  const handleDeleteVacancy = (id) => setVacancies(vacancies.filter(v => v.id !== id));
  const handleDeleteCandidate = (id) => setCandidates(candidates.filter(c => c.id !== id));

  const getStageColor = (stage) => {
    const colors = {
      'Shortlisted': 'bg-blue-50 text-blue-700 border-blue-200',
      'Technical Interview': 'bg-purple-50 text-purple-700 border-purple-200',
      'HR Interview': 'bg-orange-50 text-orange-700 border-orange-200',
      'Offer Extended': 'bg-green-50 text-green-700 border-green-200',
    };
    return colors[stage] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    if (status === 'In Progress') return <Clock className="w-4 h-4" />;
    if (status === 'Pending') return <AlertCircle className="w-4 h-4" />;
    if (status === 'Offer Extended') return <CheckCircle className="w-4 h-4" />;
    return null;
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">TalentFlow</h1>
                <p className="text-sm text-slate-500">Recruitment Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0">
            {[
              { id: 'hiring', label: 'Hiring & Vacancies', icon: FileText },
              { id: 'candidates', label: 'Candidates', icon: Users },
              { id: 'documents', label: 'Document Verification', icon: FileCheck },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-200 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-slate-900 text-slate-900 bg-slate-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* HIRING & VACANCY MANAGEMENT */}
        {activeTab === 'hiring' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Job Vacancies</h2>
                <p className="text-slate-600 mt-1">Manage and track open positions</p>
              </div>
              <button
                onClick={() => setShowVacancyForm(!showVacancyForm)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Vacancy
              </button>
            </div>

            {/* ✅ FIXED: Vacancy Form - Now Shows/Hides Properly */}
            {showVacancyForm && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 animate-slideDown">
                <h3 className="text-lg font-semibold text-slate-900">Create New Vacancy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Job Title" 
                    value={newVacancy.title}
                    onChange={(e) => setNewVacancy({...newVacancy, title: e.target.value})}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  />
                  <input 
                    type="text" 
                    placeholder="Department" 
                    value={newVacancy.department}
                    onChange={(e) => setNewVacancy({...newVacancy, department: e.target.value})}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  />
                  <select 
                    value={newVacancy.level}
                    onChange={(e) => setNewVacancy({...newVacancy, level: e.target.value})}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Select Level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                  </select>
                  <input 
                    type="number" 
                    placeholder="Number of Positions" 
                    value={newVacancy.positions}
                    onChange={(e) => setNewVacancy({...newVacancy, positions: e.target.value})}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  />
                </div>
                <textarea 
                  placeholder="Job Description" 
                  rows="4" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                ></textarea>
                <div className="flex gap-3">
                  <button 
                    onClick={handleAddVacancy}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                  >
                    Create Vacancy
                  </button>
                  <button 
                    onClick={() => {
                      setShowVacancyForm(false);
                      setNewVacancy({title: '', department: '', level: '', positions: ''});
                    }}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Vacancies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vacancies.map(vacancy => (
                <div key={vacancy.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">{vacancy.title}</h3>
                      <p className="text-sm text-slate-600">{vacancy.department}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vacancy.status === 'Open' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {vacancy.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-slate-600">
                    <p>Posted: {vacancy.posted}</p>
                    <p className="font-medium text-slate-900">{vacancy.applications} applications</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                      <Eye className="w-4 h-4 inline mr-2" />View
                    </button>
                    <button className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteVacancy(vacancy.id)} className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANDIDATES & PIPELINE */}
        {activeTab === 'candidates' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Candidate Pipeline</h2>
              <p className="text-slate-600 mt-1">Track candidates through hiring stages</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Position</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Stage</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Score</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Applied</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredCandidates.map(candidate => (
                      <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{candidate.name}</td>
                        <td className="px-6 py-4 text-slate-600">{candidate.position}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(candidate.stage)}`}>
                            {candidate.stage}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-900" style={{ width: `${candidate.score * 10}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-slate-900">{candidate.score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{candidate.appliedDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            {getStatusIcon(candidate.status)}
                            <span className="text-sm">{candidate.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setSelectedCandidate(candidate); setShowOfferModal(true); }}
                              className="px-3 py-1 text-xs border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                            >
                              Offer
                            </button>
                            <button onClick={() => handleDeleteCandidate(candidate.id)} className="px-3 py-1 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT VERIFICATION */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Document Verification</h2>
              <p className="text-slate-600 mt-1">Manage and validate employee documents</p>
            </div>

            <div className="grid gap-4">
              {documents.map(doc => (
                <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{doc.candidateName}</h3>
                      <p className="text-sm text-slate-600">{doc.position}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      doc.status === 'In Review' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  {/* Document Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Documents Uploaded</span>
                      <span className="text-sm font-semibold text-slate-900">{doc.uploadedDocs}/{doc.requiredDocs}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-slate-900 to-slate-700" style={{ width: `${(doc.uploadedDocs / doc.requiredDocs) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: 'ID Proof', uploaded: true },
                      { name: 'Address Proof', uploaded: true },
                      { name: 'Educational Certificate', uploaded: true },
                      { name: 'Experience Certificate', uploaded: true },
                      { name: 'Medical Report', uploaded: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          item.uploaded ? 'bg-green-100 border-green-300' : 'border-slate-300'
                        }`}>
                          {item.uploaded && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button 
                      onClick={() => { setSelectedCandidate(doc); setShowDocModal(true); }}
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Documents
                    </button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mt-3">Last updated: {doc.lastUpdated}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Offer Letter Modal */}
      {showOfferModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Generate Offer Letter</h2>
              <button onClick={() => setShowOfferModal(false)} className="text-slate-600 hover:text-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Candidate Name</label>
                <input type="text" defaultValue={selectedCandidate.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                <input type="text" defaultValue={selectedCandidate.position} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                  <input type="text" placeholder="$X,XXX/month" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Terms & Conditions</label>
                <textarea rows="4" placeholder="Enter terms and conditions..." className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate & Send
                </button>
                <button onClick={() => setShowOfferModal(false)} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Upload Documents</h2>
              <button onClick={() => setShowDocModal(false)} className="text-slate-600 hover:text-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm">Upload required documents for {selectedCandidate.candidateName}</p>
              
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900">Drag and drop files here</p>
                <p className="text-xs text-slate-500">or click to browse</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Required Documents:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {['ID Proof', 'Address Proof', 'Educational Certificate', 'Experience Certificate', 'Medical Report'].map(doc => (
                    <label key={doc} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-slate-700">{doc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">
                  Upload
                </button>
                <button onClick={() => setShowDocModal(false)} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Cancel
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
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RecruitmentSystem;