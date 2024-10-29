import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, Edit, X, ChartBar, AlertCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnalyticsView from '../components/Analytics';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('records');
  const [editingRecord, setEditingRecord] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statusComment, setStatusComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recordType, setRecordType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchQuery, recordType]);

  
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        per_page: 10,
        q: searchQuery,
        type: recordType
      });

      const response = await fetch(`api/records?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }

      const data = await response.json();
      setRecords(data.records);
      setTotalPages(data.pages);
    } catch (err) {
      setError(`Failed to load records + ${err}`);
      toast.error('Error loading records', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (recordId, newStatus) => {
    try {
      const response = await fetch(`api/records/${recordId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          comment: statusComment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Status updated successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setIsEditModalOpen(false);
      fetchRecords();
    } catch (error) {
      toast.error(`Failed to update status: ${error}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  const StatusUpdateModal = () => (
    isEditModalOpen && editingRecord && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Update Record Status</h2>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleStatusUpdate(editingRecord.id, e.target.status.value);
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue={editingRecord.status}
              >
                <option value="under investigation">Under Investigation</option>
                <option value="rejected">Rejected</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
                placeholder="Add a comment about this status change..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  const CustomAlert = ({ message }) => {
    if (!message) {
      return null;
    }

    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>
          </div>
        </div>
      </div>
    );
  };

  const RecordsView = () => (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setCurrentPage(1);
              }
            }}
            className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => setCurrentPage(1)}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <FileText className="h-5 w-5" />
          </button>
        </div>
        <div className="relative min-w-[200px]">
          <select
            value={recordType}
            onChange={(e) => {
              setRecordType(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="red-flag">Red Flag</option>
            <option value="intervention">Intervention</option>
          </select>
        </div>
      </div>

      {error && <CustomAlert message={error} />}

      <div className="grid gap-4">
        {records.map(record => (
          <div key={record.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{record.title}</h3>
                <p className="text-gray-600 mt-2">{record.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-500">
                  <span>Type: {record.record_type}</span>
                  <span>Location: {record.location}</span>
                  <span>Status: {record.status}</span>
                  <span>Created: {new Date(record.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingRecord(record);
                  setStatusComment('');
                  setIsEditModalOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md disabled:opacity-50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md disabled:opacity-50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
      
      <StatusUpdateModal />
    </div>
  );

  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-50"
      />
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab('records')}
            className={`flex items-center w-full px-4 py-2 text-left ${
              activeTab === 'records' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Records
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center w-full px-4 py-2 text-left ${
              activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ChartBar className="w-5 h-5 mr-2" />
            Analytics
          </button>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </nav>
      </div>
      <main className="flex-grow p-6 overflow-y-auto">
        {activeTab === 'records' && <RecordsView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>
    </div>
  );
};

export default AdminDashboard;