import { useState } from "react";
import type { WarningLevel } from "../../types";

interface WarningBannerProps {
  level: WarningLevel;
  title: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const STYLES = {
  emergency: {
    container: "border-red-500 bg-red-50",
    icon: "text-red-600",
    title: "text-red-800",
    message: "text-red-700",
  },
  caution: {
    container: "border-amber-400 bg-amber-50",
    icon: "text-amber-600",
    title: "text-amber-800",
    message: "text-amber-700",
  },
  info: {
    container: "border-blue-400 bg-blue-50",
    icon: "text-blue-600",
    title: "text-blue-800",
    message: "text-blue-700",
  },
};

function Icon({ level, className }: { level: WarningLevel; className: string }) {
  if (level === "emergency") {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    );
  }
  if (level === "caution") {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0L21.303 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

export function WarningBanner({ level, title, message, dismissible, onDismiss }: WarningBannerProps) {
  const [visible, setVisible] = useState(true);
  const s = STYLES[level];

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className={`flex items-start gap-3 rounded-xl border-l-4 p-4 ${s.container}`} role="alert">
      <Icon level={level} className={`mt-0.5 h-5 w-5 flex-shrink-0 ${s.icon}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${s.title}`}>{title}</p>
        <p className={`mt-0.5 text-sm ${s.message}`}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 text-lg leading-none ${s.icon} opacity-60 hover:opacity-100`}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
