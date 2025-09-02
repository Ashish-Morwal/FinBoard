export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const num = parseFloat(value);
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  } catch (error) {
    // Fallback for invalid currency codes
    return `$${num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    })}`;
  }
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const num = parseFloat(value);
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const num = parseFloat(value);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Never';

  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return `${diffSecs}s ago`;
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';

  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const abbreviateNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const num = parseFloat(value);
  
  if (Math.abs(num) >= 1e12) {
    return (num / 1e12).toFixed(1) + 'T';
  } else if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  } else if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  } else {
    return num.toFixed(2);
  }
};
