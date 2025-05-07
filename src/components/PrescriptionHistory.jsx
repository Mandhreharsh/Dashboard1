import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { FaFilePdf, FaEnvelope, FaUser, FaCalendarAlt, FaTrash, FaCheckSquare, FaSquare, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import prescriptionIcon from "../images/prescriptionIcon.png";

const apiClient = axios.create({
  baseURL: "http://localhost:7000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const PrescriptionHistory = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  const [sendingIds, setSendingIds] = useState({});
  const [downloadingIds, setDownloadingIds] = useState({});
  const [deletingIds, setDeletingIds] = useState({});

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchPrescriptions = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/prescriptions/history", {
        params: {
          page: pageNum,
          limit: itemsPerPage,
          search: debouncedSearchTerm
        }
      });

      if (response.data && Array.isArray(response.data.prescriptions)) {
        setPrescriptions(response.data.prescriptions.filter(p => p && p._id));
        setTotalCount(response.data.totalCount || response.data.prescriptions.length);
        setPage(pageNum);
      } else {
        console.error("Invalid prescription data received:", response.data);
        setPrescriptions([]);
        setError("Received invalid data format from server");
      }
    } catch (err) {
      console.error("Error fetching prescription history:", err);
      setError("Failed to load prescription history: " + (err.response?.data?.message || err.message));
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchPrescriptions(1);
  }, [fetchPrescriptions]);

  useEffect(() => {
    setSelectedItems({});
    setSelectAll(false);
  }, [prescriptions]);

  const handleResend = useCallback(async (id) => {
    if (!id) {
      alert("Error: Missing prescription ID");
      return;
    }

    try {
      setSendingIds(prev => ({ ...prev, [id]: true }));

      const response = await apiClient.post(`/prescriptions/resend/${id}`);
      alert(response.data.message || "Prescription resent successfully!");
    } catch (err) {
      console.error("Error resending prescription:", err);
      alert("Failed to resend prescription: " + (err.response?.data?.message || err.message));
    } finally {
      setSendingIds(prev => ({ ...prev, [id]: false }));
    }
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  }, []);

  const downloadPDF = useCallback(async (id, patientName) => {
    if (!id) {
      alert("Error: Missing prescription ID");
      return;
    }

    try {

      setDownloadingIds(prev => ({ ...prev, [id]: true }));

      const response = await apiClient.get(`/prescriptions/download/${id}`, {
        responseType: 'blob'
      });


      const url = window.URL.createObjectURL(new Blob([response.data]));


      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Prescription_${patientName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();


      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading prescription:", err);
      alert("Failed to download prescription: " + (err.response?.data?.message || err.message));
    } finally {
      setDownloadingIds(prev => ({ ...prev, [id]: false }));
    }
  }, []);

  const handleDelete = useCallback(async (id, patientName) => {
    if (!id) {
      alert("Error: Missing prescription ID");
      return;
    }


    if (!window.confirm(`Are you sure you want to delete ${patientName}'s prescription?`)) {
      return;
    }

    try {

      setDeletingIds(prev => ({ ...prev, [id]: true }));

      const response = await apiClient.delete(`/prescriptions/delete/${id}`);
      alert(response.data.message || "Prescription deleted successfully!");


      fetchPrescriptions(page);
    } catch (err) {
      console.error("Error deleting prescription:", err);
      alert("Failed to delete prescription: " + (err.response?.data?.message || err.message));
    } finally {

      setDeletingIds(prev => ({ ...prev, [id]: false }));
    }
  }, [fetchPrescriptions, page]);


  const toggleSelectAll = useCallback(() => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedItems = {};
    if (newSelectAll) {

      prescriptions.forEach(prescription => {
        if (prescription._id) {
          newSelectedItems[prescription._id] = true;
        }
      });
    }
    setSelectedItems(newSelectedItems);
  }, [selectAll, prescriptions]);


  const toggleSelectItem = useCallback((id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);


  const deleteSelected = useCallback(async () => {
    const selectedIds = Object.keys(selectedItems).filter(id => selectedItems[id]);

    if (selectedIds.length === 0) {
      alert("Please select at least one prescription to delete");
      return;
    }


    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected prescription(s)?`)) {
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {

      const results = await Promise.all(
        selectedIds.map(id =>
          apiClient.delete(`/prescriptions/delete/${id}`)
            .then(() => ({ success: true, id }))
            .catch(err => ({ success: false, id, error: err }))
        )
      );

      results.forEach(result => {
        if (result.success) successCount++;
        else failCount++;
      });

      if (successCount > 0 && failCount === 0) {
        alert(`Successfully deleted ${successCount} prescription(s)`);
      } else if (successCount > 0 && failCount > 0) {
        alert(`Deleted ${successCount} prescription(s), but failed to delete ${failCount}`);
      } else {
        alert("Failed to delete any prescriptions");
      }

      setSelectedItems({});
      setSelectAll(false);
      fetchPrescriptions(page);
    } catch (err) {
      console.error("Error during bulk delete:", err);
      alert("An error occurred during deletion");
    } finally {
      setLoading(false);
    }
  }, [selectedItems, fetchPrescriptions, page]);

  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalCount);

    return {
      totalPages,
      startItem: totalCount === 0 ? 0 : startItem,
      endItem
    };
  }, [totalCount, page, itemsPerPage]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages) {
      fetchPrescriptions(newPage);
    }
  }, [fetchPrescriptions, paginationInfo.totalPages]);

  const selectedCount = useMemo(() =>
    Object.values(selectedItems).filter(Boolean).length,
    [selectedItems]);

  const LoadingIndicator = () => (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2 text-sm md:text-base text-gray-600">Loading prescriptions...</p>
    </div>
  );

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      <div className="container-header flex flex-row items-center gap-3 p-4 md:p-6">
        <img className="h-[30px] w-[30px]" src={prescriptionIcon} alt="Prescription Icon" />
        <h1 className="font-semibold text-lg md:text-xl">Prescription History</h1>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg shadow-xl mx-2 md:mx-4 mb-4">
        <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by patient, doctor or date..."
              className="w-full p-2 pl-9 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {selectedCount > 0 && (
              <button
                onClick={deleteSelected}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs md:text-sm flex items-center"
                disabled={loading}
              >
                <FaTrash className="mr-1" />
                Delete Selected ({selectedCount})
              </button>
            )}
          </div>
        </div>


        <div className="flex-1 overflow-auto p-2 md:p-4">
          {loading && prescriptions.length === 0 ? (
            <LoadingIndicator />
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p className="text-sm md:text-base">{error}</p>
              <button
                onClick={() => fetchPrescriptions(1)}
                className="mt-4 bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-sm md:text-base text-gray-600">No prescriptions found{searchTerm ? " matching your search" : ""}.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto relative">
                {loading && <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                  <LoadingIndicator />
                </div>}
                <table className="min-w-full bg-white rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-600 w-10">
                        <div
                          className="cursor-pointer flex items-center justify-center"
                          onClick={toggleSelectAll}
                          title={selectAll ? "Deselect all" : "Select all"}
                        >
                          {selectAll ? (
                            <FaCheckSquare className="text-blue-500" />
                          ) : (
                            <FaSquare className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-600">Patient</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-600 hidden sm:table-cell">Doctor</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-600 hidden md:table-cell">Email</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {prescriptions.map((prescription) => (
                      <tr key={prescription._id} className={`hover:bg-gray-50 ${selectedItems[prescription._id] ? 'bg-blue-50' : ''}`}>
                        <td className="px-2 md:px-4 py-2 md:py-4 text-center">
                          <div
                            className="cursor-pointer flex items-center justify-center"
                            onClick={() => toggleSelectItem(prescription._id)}
                          >
                            {selectedItems[prescription._id] ? (
                              <FaCheckSquare className="text-blue-500" />
                            ) : (
                              <FaSquare className="text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUser className="text-gray-400 mr-1 md:mr-2 hidden xs:inline" />
                            <span className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[100px] md:max-w-[200px]">
                              {prescription.patientName || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className="text-xs md:text-sm text-gray-600 truncate max-w-[100px] md:max-w-[200px] block">
                            {prescription.doctorName || 'N/A'}
                          </span>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="flex items-center">
                            <FaEnvelope className="text-gray-400 mr-1 md:mr-2" />
                            <span className="text-xs md:text-sm text-gray-600 truncate max-w-[150px] lg:max-w-[250px]">
                              {prescription.patientEmail || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-1 md:mr-2 hidden xs:inline" />
                            <span className="text-xs md:text-sm text-gray-600">
                              {prescription.prescriptionDate ? formatDate(prescription.prescriptionDate) :
                                prescription.createdAt ? formatDate(prescription.createdAt) : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-1 md:space-x-2">
                            <button
                              onClick={() => downloadPDF(prescription._id, prescription.patientName || 'Unknown')}
                              className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-2 md:px-3 rounded text-xs md:text-sm flex items-center"
                              title="View Prescription"
                              disabled={downloadingIds[prescription._id]}
                            >
                              {downloadingIds[prescription._id] ? (
                                <>
                                  <div className="animate-spin h-3 w-3 border-2 border-white rounded-full border-t-transparent mr-1"></div>
                                  <span className="hidden xs:inline">Loading...</span>
                                </>
                              ) : (
                                <>
                                  <FaFilePdf className="mr-1" />
                                  <span className="hidden xs:inline">View</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleResend(prescription._id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 md:px-3 rounded text-xs md:text-sm flex items-center"
                              title="Resend Prescription"
                              disabled={sendingIds[prescription._id]}
                            >
                              {sendingIds[prescription._id] ? (
                                <>
                                  <div className="animate-spin h-3 w-3 border-2 border-white rounded-full border-t-transparent mr-1"></div>
                                  <span className="hidden xs:inline">Sending...</span>
                                </>
                              ) : (
                                <>
                                  <FaEnvelope className="mr-1" />
                                  <span className="hidden xs:inline">Resend</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(prescription._id, prescription.patientName || 'Unknown')}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 md:px-3 rounded text-xs md:text-sm flex items-center"
                              title="Delete Prescription"
                              disabled={deletingIds[prescription._id]}
                            >
                              {deletingIds[prescription._id] ? (
                                <>
                                  <div className="animate-spin h-3 w-3 border-2 border-white rounded-full border-t-transparent mr-1"></div>
                                  <span className="hidden xs:inline">Deleting...</span>
                                </>
                              ) : (
                                <>
                                  <FaTrash className="mr-1" />
                                  <span className="hidden xs:inline">Delete</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <div>
                  Showing {paginationInfo.startItem} to {paginationInfo.endItem} of {totalCount} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className={`p-1 rounded ${page === 1 ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-100'}`}
                    title="Previous page"
                  >
                    <FaChevronLeft />
                  </button>
                  <span>{page} of {paginationInfo.totalPages || 1}</span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= paginationInfo.totalPages || loading}
                    className={`p-1 rounded ${page >= paginationInfo.totalPages ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-100'}`}
                    title="Next page"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default React.memo(PrescriptionHistory); 