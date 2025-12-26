import { useState } from 'react';
import './Reports.css';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });
  const [reportType, setReportType] = useState('invoices');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'invoices', label: 'Sales Invoices', icon: '📄' },
    { value: 'deliveryChallan', label: 'Delivery Challans', icon: '📋' },
    { value: 'purchaseOrders', label: 'Purchase Orders', icon: '🛒' },
    { value: 'salesOrders', label: 'Sales Orders', icon: '📝' },
    { value: 'weightBridge', label: 'Weight Bridge Reports', icon: '⚖️' },
    { value: 'cashBook', label: 'Cash Book', icon: '💰' },
    { value: 'customerStatement', label: 'Customer Statements', icon: '👥' },
    { value: 'aggregates', label: 'Aggregates Report', icon: '📦' },
  ];

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDownload = async (format) => {
    setLoading(true);
    try {
      // Simulate download - In production, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sanitize filename components
      const sanitizedReportType = reportType.replace(/[^a-zA-Z0-9_-]/g, '_');
      const sanitizedFrom = dateRange.from ? dateRange.from.replace(/[^0-9-]/g, '') : 'all';
      const sanitizedTo = dateRange.to ? dateRange.to.replace(/[^0-9-]/g, '') : 'today';
      const sanitizedFormat = ['pdf', 'xlsx', 'csv'].includes(format) ? format : 'pdf';
      
      const fileName = `${sanitizedReportType}_${sanitizedFrom}_to_${sanitizedTo}.${sanitizedFormat}`;
      alert(`Downloading ${fileName}\n\nNote: This is a demo. In production, this would download the actual report.`);
      
      // In production, you would call the API like this:
      // const response = await apiService.post('/reports/download', {
      //   reportType,
      //   dateRange,
      //   format,
      // }, { responseType: 'blob' });
      // 
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', fileName);
      // document.body.appendChild(link);
      // link.click();
      // link.parentNode.removeChild(link);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Failed to download report: ${errorMessage}\n\nPlease try again or contact support if the problem persists.`);
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    alert('Preview functionality would open the report in a new window/modal.\n\nThis is a demo implementation.');
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>📊 Reports & Downloads</h1>
        <p>Generate and download various reports for your business</p>
      </div>

      <div className="reports-content">
        <div className="report-selection-section">
          <h2>Select Report Type</h2>
          <div className="report-types-grid">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                className={`report-type-card ${reportType === type.value ? 'active' : ''}`}
                onClick={() => setReportType(type.value)}
              >
                <span className="report-icon">{type.icon}</span>
                <span className="report-label">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="report-filters-section">
          <h2>Filter Options</h2>
          <div className="filters-form">
            <div className="filter-group">
              <label htmlFor="dateFrom">From Date</label>
              <input
                type="date"
                id="dateFrom"
                value={dateRange.from}
                onChange={(e) => handleDateChange('from', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="dateTo">To Date</label>
              <input
                type="date"
                id="dateTo"
                value={dateRange.to}
                onChange={(e) => handleDateChange('to', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="report-actions-section">
          <h2>Download Options</h2>
          <div className="action-buttons">
            <button
              className="action-button preview-button"
              onClick={handlePreview}
              disabled={loading}
            >
              <span className="button-icon">👁️</span>
              Preview Report
            </button>
            <button
              className="action-button download-button"
              onClick={() => handleDownload('pdf')}
              disabled={loading}
            >
              <span className="button-icon">📥</span>
              {loading ? 'Downloading...' : 'Download PDF'}
            </button>
            <button
              className="action-button download-button excel"
              onClick={() => handleDownload('xlsx')}
              disabled={loading}
            >
              <span className="button-icon">📊</span>
              {loading ? 'Downloading...' : 'Download Excel'}
            </button>
            <button
              className="action-button download-button csv"
              onClick={() => handleDownload('csv')}
              disabled={loading}
            >
              <span className="button-icon">📄</span>
              {loading ? 'Downloading...' : 'Download CSV'}
            </button>
          </div>
        </div>

        <div className="report-info-section">
          <div className="info-card">
            <h3>ℹ️ Report Information</h3>
            <ul>
              <li>Reports are generated based on the selected date range</li>
              <li>Leave dates empty to generate reports for all available data</li>
              <li>PDF format is recommended for printing and archiving</li>
              <li>Excel and CSV formats are suitable for data analysis</li>
              <li>Large reports may take a few moments to generate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
