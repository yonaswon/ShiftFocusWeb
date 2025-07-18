const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
)

export default Skeleton