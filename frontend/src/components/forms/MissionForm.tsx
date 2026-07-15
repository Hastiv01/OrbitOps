import React from 'react';
import { z } from 'zod';
import { useFormValidation } from "../../hooks";
import { Button, Input, Select, TextArea, Card } from '../common/index';
import { Mission, satellites, payloads } from '../../data/mockData';

// ==================== FORM VALIDATION SCHEMA ====================
export const missionValidationSchema = z.object({
  name: z.string().min(3, 'Mission name must be at least 3 characters'),
  missionId: z.string().min(1, 'Mission ID is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  type: z.enum(['Earth Observation', 'Communication', 'Navigation', 'Scientific']),
  satellite: z.string().min(1, 'Satellite is required'),
  orbit: z.string().min(1, 'Orbit is required'),
  payload: z.array(z.string()).min(1, 'At least one payload is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  objective: z.string().min(10, 'Objective must be at least 10 characters'),
  status: z.enum(['Planning', 'Scheduled', 'Active', 'Completed', 'Failed', 'Paused']),
  notes: z.string().optional(),
});

export type MissionFormData = z.infer<typeof missionValidationSchema>;

interface MissionFormProps {
  initialData?: Mission;
  onSubmit: (data: MissionFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitButtonLabel?: string;
}

export const MissionForm: React.FC<MissionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonLabel = 'Create Mission',
}) => {
  const initialValues: MissionFormData = initialData
    ? {
        name: initialData.name,
        missionId: initialData.missionId,
        priority: initialData.priority,
        type: initialData.type,
        satellite: initialData.satellite,
        orbit: initialData.orbit,
        payload: initialData.payload,
        startTime: initialData.startTime.slice(0, 16), // Convert to datetime-local format
        endTime: initialData.endTime.slice(0, 16),
        objective: initialData.objective,
        status: initialData.status,
        notes: initialData.notes,
      }
    : {
        name: '',
        missionId: `MIS-${Date.now()}`,
        priority: 'Medium',
        type: 'Earth Observation',
        satellite: '',
        orbit: 'LEO',
        payload: [],
        startTime: '',
        endTime: '',
        objective: '',
        status: 'Planning',
        notes: '',
      };

  const { values, errors, touched, handleChange, handleBlur, validate, reset } = useFormValidation(
    initialValues,
    missionValidationSchema
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
      reset();
    }
  };

  const handlePayloadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    handleChange({ ...e, target: { ...e.target, name: 'payload', value: selected } } as any);
  };

  const orbits = ['LEO', 'MEO', 'GEO', 'SSO', 'Elliptical'];
  const selectedSatellite = satellites.find((s) => s.name === values.satellite);
  const orbitsForSatellite = selectedSatellite ? [selectedSatellite.orbit] : orbits;

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name and Mission ID */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Mission Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : undefined}
            placeholder="Enter mission name"
          />
          <Input
            label="Mission ID"
            name="missionId"
            value={values.missionId}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
            placeholder="Auto-generated"
          />
        </div>

        {/* Row 2: Priority and Type */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.priority ? errors.priority : undefined}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Critical', label: 'Critical' },
            ]}
          />
          <Select
            label="Mission Type"
            name="type"
            value={values.type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.type ? errors.type : undefined}
            options={[
              { value: 'Earth Observation', label: 'Earth Observation' },
              { value: 'Communication', label: 'Communication' },
              { value: 'Navigation', label: 'Navigation' },
              { value: 'Scientific', label: 'Scientific' },
            ]}
          />
        </div>

        {/* Row 3: Satellite and Orbit */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Satellite"
            name="satellite"
            value={values.satellite}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.satellite ? errors.satellite : undefined}
            options={satellites.map((s) => ({ value: s.name, label: `${s.name} (${s.orbit})` }))}
          />
          <Select
            label="Orbit"
            name="orbit"
            value={values.orbit}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.orbit ? errors.orbit : undefined}
            options={orbitsForSatellite.map((o) => ({ value: o, label: o }))}
          />
        </div>

        {/* Row 4: Payload */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 print:text-slate-800 mb-2">Payloads</label>
          <select
            multiple
            name="payload"
            value={values.payload}
            onChange={handlePayloadChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white print:text-black transition focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
          >
            {payloads.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.type})
              </option>
            ))}
          </select>
          {touched.payload && errors.payload && <p className="mt-1 text-xs text-red-400">{errors.payload}</p>}
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">Hold Ctrl/Cmd to select multiple payloads</p>
        </div>

        {/* Row 5: Start and End Time */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Start Time"
            type="datetime-local"
            name="startTime"
            value={values.startTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.startTime ? errors.startTime : undefined}
          />
          <Input
            label="End Time"
            type="datetime-local"
            name="endTime"
            value={values.endTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.endTime ? errors.endTime : undefined}
          />
        </div>

        {/* Duration (Read-only) */}
        {values.startTime && values.endTime && (
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">
              Estimated Duration:{' '}
              <span className="font-semibold text-slate-900 dark:text-white print:text-black">
                {Math.round(
                  (new Date(values.endTime).getTime() - new Date(values.startTime).getTime()) / (1000 * 60)
                )}{' '}
                minutes
              </span>
            </p>
          </div>
        )}

        {/* Row 6: Objective */}
        <TextArea
          label="Mission Objective"
          name="objective"
          value={values.objective}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.objective ? errors.objective : undefined}
          placeholder="Describe the mission objective..."
          rows={4}
        />

        {/* Row 7: Status and Notes */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.status ? errors.status : undefined}
            options={[
              { value: 'Planning', label: 'Planning' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Active', label: 'Active' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Failed', label: 'Failed' },
              { value: 'Paused', label: 'Paused' },
            ]}
          />
          <TextArea
            label="Notes"
            name="notes"
            value={values.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Additional notes (optional)"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t border-slate-200 dark:border-slate-700 print:border-slate-300 pt-6">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {submitButtonLabel}
          </Button>
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

// ==================== CONSTRAINT FORM ====================
import { OptimizationConstraints } from '../../hooks';

export const constraintValidationSchema = z.object({
  batteryThreshold: z.number().min(0).max(100),
  maxPayloadUsage: z.number().min(1),
  memoryLimit: z.number().min(1),
  communicationPriority: z.enum(['High', 'Medium', 'Low']),
  powerBudget: z.number().min(1),
  missionPriorityWeight: z.number().min(0).max(100),
});

interface ConstraintFormProps {
  initialData: OptimizationConstraints;
  onSubmit: (data: OptimizationConstraints) => void;
  isLoading?: boolean;
}

export const ConstraintForm: React.FC<ConstraintFormProps> = ({ initialData, onSubmit, isLoading = false }) => {
  const { values, errors, touched, handleChange, handleBlur, validate, reset } = useFormValidation(
    initialData,
    constraintValidationSchema
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values as OptimizationConstraints);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Battery Threshold (%)"
            type="number"
            name="batteryThreshold"
            value={values.batteryThreshold}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.batteryThreshold ? errors.batteryThreshold : undefined}
            min="0"
            max="100"
          />
          <Input
            label="Max Payload Usage"
            type="number"
            name="maxPayloadUsage"
            value={values.maxPayloadUsage}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.maxPayloadUsage ? errors.maxPayloadUsage : undefined}
            min="1"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Memory Limit (MB)"
            type="number"
            name="memoryLimit"
            value={values.memoryLimit}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.memoryLimit ? errors.memoryLimit : undefined}
            min="1"
          />
          <Select
            label="Communication Priority"
            name="communicationPriority"
            value={values.communicationPriority}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.communicationPriority ? errors.communicationPriority : undefined}
            options={[
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Power Budget (W)"
            type="number"
            name="powerBudget"
            value={values.powerBudget}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.powerBudget ? errors.powerBudget : undefined}
            min="1"
          />
          <Input
            label="Mission Priority Weight (%)"
            type="number"
            name="missionPriorityWeight"
            value={values.missionPriorityWeight}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.missionPriorityWeight ? errors.missionPriorityWeight : undefined}
            min="0"
            max="100"
          />
        </div>

        <div className="flex gap-3 border-t border-slate-200 dark:border-slate-700 print:border-slate-300 pt-6">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save Constraints
          </Button>
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
};
