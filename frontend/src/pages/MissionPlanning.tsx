import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiDownload, FiFilter, FiX } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { usePagination, useSorting, useExport } from '../hooks';
import { MissionForm, MissionFormData } from '../components/forms/MissionForm';
import { Modal, Button, Badge, Tabs, Card, EmptyState } from '../components/common/index';
import { Mission } from '../data/mockData';

const MissionPlanning: React.FC = () => {
  const { missions, addMission, updateMission, deleteMission, duplicateMission, addToast } = useAppContext();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  // Modal state
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<{
    priority?: string;
    status?: string;
    satellite?: string;
    type?: string;
    searchTerm?: string;
  }>({});
  const [showFilters, setShowFilters] = useState(false);

  // Sorting
  const { sortConfig, sortedItems, toggleSort } = useSorting(missions, 'name');

  // Pagination
  const { currentItems, currentPage, totalPages, goToPage, hasNextPage, hasPrevPage } = usePagination(sortedItems, 10);

  // Export
  const { exportToCSV, exportToJSON } = useExport();

  // Apply filters
  const filteredMissions = useMemo(() => {
    return sortedItems.filter((mission) => {
      if (filters.priority && mission.priority !== filters.priority) return false;
      if (filters.status && mission.status !== filters.status) return false;
      if (filters.satellite && mission.satellite !== filters.satellite) return false;
      if (filters.type && mission.type !== filters.type) return false;
      if (
        filters.searchTerm &&
        !mission.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !mission.missionId.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [sortedItems, filters]);

  // Recalculate pagination when filters change
  const paginatedMissions = useMemo(() => {
    const startIdx = (currentPage - 1) * 10;
    return filteredMissions.slice(startIdx, startIdx + 10);
  }, [filteredMissions, currentPage]);

  const handleCreateMission = (data: MissionFormData) => {
    const newMission: Mission = {
      ...data,
      id: `MIS-${Date.now()}`,
      completionPercentage: 0,
      estimatedDuration: Math.round(
        (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60)
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addMission(newMission);
    setShowForm(false);
  };

  const handleUpdateMission = (data: MissionFormData) => {
    if (editingMission) {
      updateMission(editingMission.id, {
        ...data,
        estimatedDuration: Math.round(
          (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60)
        ),
      });
      setEditingMission(null);
      setShowForm(false);
    }
  };

  const handleEditMission = (mission: Mission) => {
    setEditingMission(mission);
    setShowForm(true);
  };

  const handleDeleteMission = (mission: Mission) => {
    if (window.confirm(`Are you sure you want to delete mission "${mission.name}"?`)) {
      deleteMission(mission.id);
    }
  };

  const handleDuplicateMission = (mission: Mission) => {
    const newMission = duplicateMission(mission.id);
    if (newMission) {
      addToast(`Mission duplicated: "${newMission.name}"`, 'success');
    }
  };

  const handleViewDetails = (mission: Mission) => {
    setSelectedMission(mission);
    setShowDetailsModal(true);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredMissions, 'missions');
    addToast('Missions exported as CSV', 'success');
  };

  const handleExportJSON = () => {
    exportToJSON(filteredMissions, 'missions');
    addToast('Missions exported as JSON', 'success');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'danger';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Failed':
        return 'danger';
      case 'Active':
        return 'info';
      case 'Paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">Mission Planning</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 print:text-slate-700">Create and manage satellite missions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="md" icon={<FiFilter />} onClick={() => setShowFilters(!showFilters)}>
            Filters
          </Button>
          <Button variant="primary" size="md" icon={<FiPlus />} onClick={() => setShowForm(true)}>
            New Mission
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Total Missions</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white print:text-black">{missions.length}</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Active</p>
            <p className="mt-2 text-3xl font-bold text-sky-400">{missions.filter((m) => m.status === 'Active').length}</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">{missions.filter((m) => m.status === 'Completed').length}</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Critical</p>
            <p className="mt-2 text-3xl font-bold text-red-400">{missions.filter((m) => m.priority === 'Critical').length}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <Card className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <input
              type="text"
              placeholder="Search mission..."
              value={filters.searchTerm || ''}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white print:text-black placeholder-slate-400 dark:placeholder-slate-500 transition focus:border-sky-500 focus:outline-none"
            />
            <select
              value={filters.priority || ''}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
              className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white print:text-black transition focus:border-sky-500 focus:outline-none"
            >
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All Priorities</option>
              <option value="Low" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Low</option>
              <option value="Medium" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Medium</option>
              <option value="High" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">High</option>
              <option value="Critical" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Critical</option>
            </select>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
              className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white print:text-black transition focus:border-sky-500 focus:outline-none"
            >
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All Statuses</option>
              <option value="Planning" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Planning</option>
              <option value="Scheduled" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Scheduled</option>
              <option value="Active" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Active</option>
              <option value="Completed" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Completed</option>
              <option value="Failed" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Failed</option>
              <option value="Paused" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Paused</option>
            </select>
            <Button
              variant="ghost"
              onClick={() => setFilters({})}
              className="w-full"
            >
              <FiX /> Clear Filters
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Export Buttons */}
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" icon={<FiDownload />} onClick={handleExportCSV}>
          Export CSV
        </Button>
        <Button variant="secondary" size="sm" icon={<FiDownload />} onClick={handleExportJSON}>
          Export JSON
        </Button>
      </div>

      {/* Table */}
      {filteredMissions.length === 0 ? (
        <EmptyState
          title="No missions found"
          description="Create a new mission to get started"
          action={<Button onClick={() => setShowForm(true)}>Create Mission</Button>}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 print:text-slate-800 cursor-pointer hover:text-slate-900 dark:text-white print:text-black transition" onClick={() => toggleSort('name')}>
                    Mission Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 print:text-slate-800 cursor-pointer hover:text-slate-900 dark:text-white print:text-black transition" onClick={() => toggleSort('missionId')}>
                    ID {sortConfig.key === 'missionId' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 print:text-slate-800">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 print:text-slate-800">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 print:text-slate-800">Satellite</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 print:text-slate-800">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 print:text-slate-800">Duration</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600 dark:text-slate-300 print:text-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
                {paginatedMissions.map((mission, idx) => (
                  <motion.tr
                    key={mission.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white dark:bg-slate-800 transition"
                  >
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200 print:text-black cursor-pointer font-medium" onClick={() => handleViewDetails(mission)}>
                      {mission.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200 print:text-black">{mission.missionId}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={getPriorityColor(mission.priority) as any}>{mission.priority}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200 print:text-black">{mission.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200 print:text-black">{mission.satellite}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={getStatusColor(mission.status) as any}>{mission.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200 print:text-black">{mission.estimatedDuration} min</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(mission)} title="View details">
                          👁
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleEditMission(mission)} title="Edit">
                          <FiEdit2 />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicateMission(mission)} title="Duplicate">
                          <FiCopy />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteMission(mission)} title="Delete">
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 print:border-slate-300 px-6 py-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">
              Page {currentPage} of {Math.ceil(filteredMissions.length / 10)} ({filteredMissions.length} results)
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={!hasPrevPage} onClick={() => goToPage(currentPage - 1)}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={!hasNextPage} onClick={() => goToPage(currentPage + 1)}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingMission(null);
        }}
        title={editingMission ? 'Edit Mission' : 'Create New Mission'}
        size="xl"
      >
        <MissionForm
          initialData={editingMission || undefined}
          onSubmit={editingMission ? handleUpdateMission : handleCreateMission}
          onCancel={() => {
            setShowForm(false);
            setEditingMission(null);
          }}
          submitButtonLabel={editingMission ? 'Update Mission' : 'Create Mission'}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedMission(null);
        }}
        title={selectedMission?.name || 'Mission Details'}
        size="lg"
      >
        {selectedMission && (
          <Tabs
            tabs={[
              {
                id: 'overview',
                label: 'Overview',
                content: (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Mission ID</p>
                        <p className="mt-1 font-medium text-slate-900 dark:text-white print:text-black">{selectedMission.missionId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Status</p>
                        <p className="mt-1">
                          <Badge variant={getStatusColor(selectedMission.status) as any}>{selectedMission.status}</Badge>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Priority</p>
                        <p className="mt-1">
                          <Badge variant={getPriorityColor(selectedMission.priority) as any}>{selectedMission.priority}</Badge>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Type</p>
                        <p className="mt-1 font-medium text-slate-900 dark:text-white print:text-black">{selectedMission.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Satellite</p>
                        <p className="mt-1 font-medium text-slate-900 dark:text-white print:text-black">{selectedMission.satellite}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Orbit</p>
                        <p className="mt-1 font-medium text-slate-900 dark:text-white print:text-black">{selectedMission.orbit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Duration</p>
                        <p className="mt-1 font-medium text-slate-900 dark:text-white print:text-black">{selectedMission.estimatedDuration} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Completion</p>
                        <p className="mt-1 font-medium text-slate-900 dark:text-white print:text-black">{selectedMission.completionPercentage}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Start Time</p>
                      <p className="mt-1 font-medium text-slate-900 dark:text-white print:text-black">{new Date(selectedMission.startTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">End Time</p>
                      <p className="mt-1 font-medium text-slate-900 dark:text-white print:text-black">{new Date(selectedMission.endTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Payloads</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedMission.payload.map((p) => (
                          <Badge key={p} variant="info">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'objective',
                label: 'Objective',
                content: (
                  <div>
                    <p className="text-slate-700 dark:text-slate-200 print:text-black">{selectedMission.objective}</p>
                  </div>
                ),
              },
              {
                id: 'notes',
                label: 'Notes',
                content: (
                  <div>
                    <p className="text-slate-700 dark:text-slate-200 print:text-black">{selectedMission.notes || 'No notes'}</p>
                  </div>
                ),
              },
            ]}
            defaultTab="overview"
          />
        )}
      </Modal>
    </div>
  );
};

export default MissionPlanning;
