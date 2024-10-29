import { useState, useEffect } from 'react';
import { FileText, ChartBar, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AnalyticsView = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalRecords: 0,
    underInvestigation: 0,
    resolved: 0,
    records: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      
      // Process the raw records into analytics metrics
      const metrics = processAnalytics(data.records);
      setAnalyticsData(metrics);
    } catch (err) {
      toast.error('Error loading analytics', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const processAnalytics = (records) => {
    const totalRecords = records.length;
    const underInvestigation = records.filter(record => 
      record.status.toLowerCase() === 'under investigation'
    ).length;
    const resolved = records.filter(record => 
      record.status.toLowerCase() === 'resolved'
    ).length;

    return {
      totalRecords,
      underInvestigation,
      resolved,
      records
    };
  };

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Total Records</h3>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-4">{analyticsData.totalRecords}</p>
          <p className="text-sm text-gray-500 mt-2">All time records</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Under Investigation</h3>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold mt-4">{analyticsData.underInvestigation}</p>
          <p className="text-sm text-gray-500 mt-2">Active cases</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Resolved</h3>
            <ChartBar className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-4">{analyticsData.resolved}</p>
          <p className="text-sm text-gray-500 mt-2">Completed cases</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Resolution Rate</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Resolution Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  {analyticsData.totalRecords ? 
                    `${Math.round((analyticsData.resolved / analyticsData.totalRecords) * 100)}%` 
                    : '0%'}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
              <div 
                style={{ 
                  width: `${analyticsData.totalRecords ? 
                    (analyticsData.resolved / analyticsData.totalRecords) * 100 
                    : 0}%` 
                }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;