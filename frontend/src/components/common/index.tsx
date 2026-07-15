import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { Toast } from '../../hooks';

// ==================== TOAST/NOTIFICATION ====================
export const NotificationContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({
  toasts,
  removeToast,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 print:hidden">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 100 }}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-emerald-500/90'
                : toast.type === 'error'
                  ? 'bg-red-500/90'
                  : toast.type === 'warning'
                    ? 'bg-amber-500/90'
                    : 'bg-sky-500/90'
            }`}
          >
            {toast.type === 'success' && <FiCheckCircle className="text-lg" />}
            {toast.type === 'error' && <FiAlertCircle className="text-lg" />}
            {toast.type === 'warning' && <FiAlertCircle className="text-lg" />}
            {toast.type === 'info' && <FiInfo className="text-lg" />}

            <span className="text-sm font-medium">{toast.message}</span>

            <button onClick={() => removeToast(toast.id)} className="ml-auto">
              <FiX className="text-lg" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ==================== MODAL ====================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm print:hidden"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={`fixed right-1/4 top-10 z-50 w-full -translate-x-1/2 mx-4 ${sizeClasses[size]} print:hidden`}
          >
            <div className="flex max-h-[85vh] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
              <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== BUTTONS ====================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-sky-500 hover:bg-sky-600 text-white',
  secondary: 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border dark:border-white/20',
  danger: 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-300 border dark:border-red-500/30',
  success: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-300 border dark:border-emerald-500/30',
  ghost: 'text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 dark:text-white',
};

const sizeButtonClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`print:hidden flex items-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeButtonClasses[size]} ${props.className || ''}`}
    >
      {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : icon}
      {children}
    </button>
  );
};

// ==================== INPUT FIELD ====================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, icon, ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          {...props}
          className={`w-full rounded-lg border bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:outline-none dark:bg-white/5 dark:text-white dark:placeholder-slate-500 ${
            icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-white/10'
          } focus:ring-1 ${props.className || ''}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      {helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};

// ==================== SELECT ====================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <select
        {...props}
        className={`w-full rounded-lg border bg-white px-4 py-2 text-slate-900 transition focus:outline-none dark:bg-slate-900 dark:text-white ${
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-white/10'
        } focus:ring-1 ${props.className || ''}`}
      >
        <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

// ==================== TEXTAREA ====================
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <textarea
        {...props}
        className={`w-full resize-none rounded-lg border bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:outline-none dark:bg-white/5 dark:text-white dark:placeholder-slate-500 ${
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-white/10'
        } focus:ring-1 ${props.className || ''}`}
      />
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

// ==================== CARD ====================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl transition dark:border-white/10 dark:bg-white/5 dark:shadow-glow print:border-slate-300 print:shadow-none ${
        hover ? 'hover:border-sky-500/50 dark:hover:bg-white/10 hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// ==================== BADGE ====================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

const badgeVariants = {
  default: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30 print:border-slate-300 print:text-black print:bg-white',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 print:border-slate-300 print:text-black print:bg-white',
  danger: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30 print:border-slate-300 print:text-black print:bg-white',
  warning: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 print:border-slate-300 print:text-black print:bg-white',
  info: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30 print:border-slate-300 print:text-black print:bg-white',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ==================== LOADING STATES ====================
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <div className={`animate-spin rounded-full border-4 border-slate-300 border-t-sky-500 dark:border-white/20 dark:border-t-sky-400 ${sizeMap[size]}`} />;
};

export const SkeletonLoader: React.FC<{ count?: number; className?: string }> = ({ count = 1, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-3 rounded-lg bg-slate-100 p-4 dark:bg-white/5">
          <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
          <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-white/10" />
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5 print:border-slate-300 print:bg-white">
      {icon && <div className="mb-4 text-4xl text-slate-400">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{title}</h3>
      {description && <p className="mb-6 text-slate-500 dark:text-slate-400 print:text-black">{description}</p>}
      {action && <div className="print:hidden">{action}</div>}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title = 'Error', message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-12 text-center dark:border-red-500/20 dark:bg-red-500/10">
      <FiAlertCircle className="mb-4 text-4xl text-red-500 dark:text-red-400" />
      <h3 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-300">{title}</h3>
      <p className="mb-6 text-red-600 dark:text-red-200">{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry} className="print:hidden">
          Retry
        </Button>
      )}
    </div>
  );
};

// ==================== PROGRESS BAR ====================
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className = '', showLabel = true }) => {
  const percentage = (value / max) * 100;
  const color =
    percentage < 30 ? 'bg-red-500' : percentage < 60 ? 'bg-amber-500' : percentage < 80 ? 'bg-sky-500' : 'bg-emerald-500';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10 print:border print:border-slate-300">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className={`h-full ${color}`} />
      </div>
      {showLabel && <p className="text-xs text-slate-600 dark:text-slate-400 print:text-black">{Math.round(percentage)}%</p>}
    </div>
  );
};

// ==================== TABS ====================
interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  defaultTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id || '');

  return (
    <div>
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 print:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab.id
                ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 print:mt-0">
        {/* During print, we might want to show all tabs if it's a report, but for now we'll stick to the active one to match WYSIWYG */}
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// ==================== STAT CARD ====================
interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; direction: 'up' | 'down' };
  icon?: React.ReactNode;
}

export { PageHeader, SectionCard } from './PageHeader';
export type { PageHeaderProps, Breadcrumb } from './PageHeader';
export { Table, DataTable } from './Table';
export type { TableColumn } from './Table';

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit = '', trend, icon }) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 print:text-black">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">{value}</p>
            {unit && <p className="text-sm text-slate-500 dark:text-slate-400 print:text-black">{unit}</p>}
          </div>
          {trend && (
            <p
              className={`mt-2 text-xs font-medium ${
                trend.direction === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-3xl text-sky-500 dark:text-sky-400">{icon}</div>}
      </div>
    </Card>
  );
};