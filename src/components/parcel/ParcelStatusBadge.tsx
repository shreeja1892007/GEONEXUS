import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, Clock } from 'lucide-react';

export type StatusVariant = 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'pending';

interface ParcelStatusBadgeProps {
  variant: StatusVariant;
  label: string;
  icon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VARIANT_MAP: Record<
  StatusVariant,
  { bg: string; text: string; border: string; Icon: React.ElementType }
> = {
  success: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    Icon: CheckCircle2,
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    Icon: AlertTriangle,
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    Icon: XCircle,
  },
  neutral: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    Icon: MinusCircle,
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    Icon: CheckCircle2,
  },
  pending: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    Icon: Clock,
  },
};

const SIZE_MAP: Record<'sm' | 'md' | 'lg', { px: string; text: string; iconSize: string }> = {
  sm: { px: 'px-2 py-0.5', text: 'text-[10px]', iconSize: 'w-3 h-3' },
  md: { px: 'px-2.5 py-1', text: 'text-xs', iconSize: 'w-3.5 h-3.5' },
  lg: { px: 'px-3 py-1.5', text: 'text-sm', iconSize: 'w-4 h-4' },
};

export const ParcelStatusBadge: React.FC<ParcelStatusBadgeProps> = ({
  variant,
  label,
  icon = true,
  size = 'md',
  className = '',
}) => {
  const { bg, text, border, Icon } = VARIANT_MAP[variant];
  const { px, text: textSize, iconSize } = SIZE_MAP[size];

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${bg} ${text} ${border} ${px} ${textSize} ${className}`}
    >
      {icon && <Icon className={iconSize} />}
      {label}
    </span>
  );
};

/** Map common parcel status strings to badge variants */
export function getRoRStatusVariant(status: string): StatusVariant {
  if (status === 'Linked') return 'success';
  if (status === 'Pending') return 'pending';
  if (status === 'Disputed') return 'error';
  return 'neutral';
}

export function getRegistrationStatusVariant(status: string): StatusVariant {
  if (status === 'Registered') return 'success';
  if (status === 'Pending Verification') return 'pending';
  return 'neutral';
}

export function getEncumbranceStatusVariant(status: string): StatusVariant {
  if (status === 'Clear') return 'success';
  if (status === 'Mortgage Exists') return 'warning';
  if (status === 'Leasehold') return 'info';
  if (status === 'Lien Active') return 'error';
  return 'neutral';
}

export function getTaxStatusVariant(status: string): StatusVariant {
  if (status === 'Paid') return 'success';
  if (status === 'Pending') return 'warning';
  if (status === 'Exempted') return 'info';
  return 'neutral';
}

export function getDisputeStatusVariant(status: string): StatusVariant {
  if (status === 'None') return 'success';
  if (status === 'Case Pending') return 'error';
  if (status === 'Under Arbitration') return 'warning';
  return 'neutral';
}

export function getBuildingStatusVariant(status: string): StatusVariant {
  if (status === 'Approved') return 'success';
  if (status === 'In Review') return 'pending';
  if (status === 'Not Applicable') return 'neutral';
  if (status === 'Restricted') return 'error';
  return 'neutral';
}
