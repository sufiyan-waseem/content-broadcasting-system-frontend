import { useQuery } from '@tanstack/react-query';
import { getMyContent } from '@/services/content.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FileText, ImageIcon, Clock, CheckCircle, XCircle } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  approved: { label: 'Approved', icon: CheckCircle, className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
};

const ContentCardSkeleton = () => (
  <div className="bg-card border border-border rounded-xl p-4 space-y-3">
    <div className="flex gap-3">
      <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

const ContentCard = ({ content }) => {
  const status = statusConfig[content.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4">
        {/* Image preview */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {content.fileUrl || content.filePath ? (
            <img
              src={content.fileUrl || `https://content-broadcasting-system-tr6b.onrender.com/${content.filePath}`}
              alt={content.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div className="hidden w-full h-full items-center justify-center">
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">{content.title}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${status.className}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{content.subject}</p>
          {content.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{content.description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>📅 {formatDate(content.startTime)}</span>
            <span>⏱ {formatDate(content.endTime)}</span>
            {content.rotationDuration && <span>🔄 {content.rotationDuration} min</span>}
          </div>
          {content.status === 'rejected' && content.rejectionReason && (
            <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-xs text-destructive font-medium">Rejection Reason:</p>
              <p className="text-xs text-destructive/80 mt-0.5">{content.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MyContentPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['myContent'],
    queryFn: getMyContent,
    refetchInterval: 30000,
  });

  const contents = data?.data || data?.contents || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6" /> My Content
          </h1>
          <p className="text-muted-foreground text-sm mt-1">All your uploaded content and their approval status</p>
        </div>
        <button onClick={() => refetch()} className="text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
          Refresh
        </button>
      </div>

      {isError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
          Failed to load content. Please try refreshing.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => <ContentCardSkeleton key={i} />)}
        </div>
      ) : contents.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-foreground">No content uploaded yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Upload your first content to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contents.map((c) => <ContentCard key={c.id || c._id} content={c} />)}
        </div>
      )}
    </div>
  );
}
