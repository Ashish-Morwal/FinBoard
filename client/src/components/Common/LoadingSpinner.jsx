export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center space-x-3" data-testid="loading-spinner">
      <div className={`animate-spin border-2 border-primary border-t-transparent rounded-full ${sizeClasses[size]}`}></div>
      {text && <span className="text-muted-foreground">{text}</span>}
    </div>
  );
}
