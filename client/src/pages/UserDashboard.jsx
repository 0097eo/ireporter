import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, FileText, LogOut, Edit, Trash2, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('records');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const checkTokenAndLogout = (response) => {
    if (response.status === 401) {
      toast.error('Session expired. Please login again.');
      logout();
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!user?.token) {
      logout();
      return;
    }
    fetchUserRecords();
    fetchUserProfile();
  }, [user]);

  const fetchUserRecords = async () => {
    try {
      const response = await fetch('/api/user_records', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!checkTokenAndLogout(response)) return;
      if (!response.ok) throw new Error('Failed to fetch records');
      
      const data = await response.json();
      setRecords(data.records);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to fetch records');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('api/profile', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setPhoneNumber(data.phone_number || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone_number: phoneNumber })
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setUpdateMessage(data.message);
      toast.success('Profile updated successfully');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    if (!editingRecord || !user?.token) return;

    try {
      const response = await fetch(`/api/records/${editingRecord.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editingRecord.title,
          description: editingRecord.description,
          location: editingRecord.location,
          record_type: editingRecord.record_type
        })
      });

      if (!checkTokenAndLogout(response)) return;
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update record');
      }
      
      await fetchUserRecords(); // Refresh records after update
      setIsEditModalOpen(false);
      setEditingRecord(null);
      toast.success('Record updated successfully');
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error(error.message || 'Failed to update record');
    }
  };

  const handleDeleteRecord = async () => {
    if (!deleteRecord || !user?.token) return;

    try {
      const response = await fetch(`/api/records/${deleteRecord.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!checkTokenAndLogout(response)) return;
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete record');
      }

      await fetchUserRecords(); // Refresh records after deletion
      setIsDeleteDialogOpen(false);
      setDeleteRecord(null);
      toast.success('Record deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error(error.message || 'Failed to delete record');
    }
  };

  const EditModal = () => (
    isEditModalOpen && editingRecord && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Record</h2>
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingRecord(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleUpdateRecord} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editingRecord.title}
                onChange={(e) => setEditingRecord((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editingRecord.description}
                onChange={(e) => setEditingRecord((prev) => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={editingRecord.location}
                onChange={(e) => setEditingRecord((prev) => ({ ...prev, location: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={editingRecord.record_type}
                onChange={(e) => setEditingRecord((prev) => ({ ...prev, record_type: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="intervention">Intervention</option>
                <option value="red-flag">Red Flag</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingRecord(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  const DeleteDialog = () => (
    isDeleteDialogOpen && deleteRecord && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p className="mb-6">Are you sure you want to delete "{deleteRecord.title}"?</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteRecord(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteRecord}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );

  const RecordsView = () => (
    <div className="space-y-4">
      {records.length === 0 ? (
        <p className="text-gray-500">No records found</p>
      ) : (
        <div className="grid gap-4">
          {records.map(record => (
            <div key={record.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{record.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingRecord(record);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit record"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteRecord(record);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{record.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-gray-500">
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        record.status === 'draft' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      <span className="font-medium">Type:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        record.record_type === 'red-flag'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {record.record_type}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      <span className="font-medium">Location:</span>
                      <span className="ml-2">{record.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ProfileView = () => (
    <div className="space-y-4">
      {profile && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <p className="font-medium">{profile.username}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-medium">{profile.email}</p>
            </div>
            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
              >
                Update Profile
              </button>
            </form>
            {updateMessage && (
              <div className="mt-2 text-sm text-green-600">{updateMessage}</div>
            )}
          </div>
        </div>
      )}
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
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Hello, {profile ? profile.username : 'User'}</h1>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab('records')}
            className={`flex items-center w-full px-4 py-2 text-left ${
              activeTab === 'records' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            My Records
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center w-full px-4 py-2 text-left ${
              activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            Profile
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

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'records' ? (
          <>
            <RecordsView />
            <EditModal />
            <DeleteDialog />
          </>
        ) : (
          <ProfileView />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;