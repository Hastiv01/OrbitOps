import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiDownload, FiHelpCircle, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { Button } from './index';

export interface Breadcrumb {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  onRefresh?: () => void;
  onExport?: () => void;
  lastUpdated?: Date;
  isLoading?: boolean;
  tooltip?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs = [],
  onRefresh,
  onExport,
  lastUpdated,
  isLoading = false,
  tooltip,
  actions,
}) => {
  return (
    <div className="space-y-3">
      {breadcrumbs.length > 0 && (
        <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-400">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={`${crumb.label}-${i}`}>
              {i > 0 && <FiChevronRight className="text-xs" />}
              {crumb.to ? (
                <Link to={crumb.to} className="transition hover:text-sky-300">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-300">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
            {tooltip && (
              <span title={tooltip} className="text-slate-400">
                <FiInfo />
              </span>
            )}
          </div>
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          {lastUpdated && (
            <p className="mt-1 text-xs text-slate-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRefresh && (
            <Button
              variant="secondary"
              size="sm"
              icon={<FiRefreshCw className={isLoading ? 'animate-spin' : ''} />}
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh data"
            >
              Refresh
            </Button>
          )}
          {onExport && (
            <Button variant="secondary" size="sm" icon={<FiDownload />} onClick={onExport} title="Export data">
              Export
            </Button>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
};

export const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  tooltip?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, tooltip, action, children, className = '' }) => (
  <div className={`rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl ${className}`}>
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-white">{title}</p>
          {tooltip && (
            <span title={tooltip} className="text-slate-400">
              <FiHelpCircle className="text-sm" />
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);
