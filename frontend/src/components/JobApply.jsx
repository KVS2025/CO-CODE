const JobApply = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Apply for Jobs</h1>

      <div className="bg-white p-6 rounded-xl border space-y-4 max-w-xl">
        <input className="w-full p-3 border rounded" placeholder="Full Name" />
        <input className="w-full p-3 border rounded" placeholder="Email" />
        <input className="w-full p-3 border rounded" placeholder="Position" />
        <input type="file" className="w-full" />

        <button className="w-full bg-slate-900 text-white p-3 rounded-lg">
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default JobApply;
