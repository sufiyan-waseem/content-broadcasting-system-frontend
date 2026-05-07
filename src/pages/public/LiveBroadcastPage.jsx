import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getLiveBroadcast } from '@/services/content.service';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Tv, RefreshCw, WifiOff } from 'lucide-react';

const BASE_URL = 'https://content-broadcasting-system-tr6b.onrender.com';

export default function LiveBroadcastPage() {
  const { teacherId } = useParams();

  const { data, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ['live', teacherId],
    queryFn: () => getLiveBroadcast(teacherId),
    refetchInterval: 30000,
    retry: 2,
  });

  const content = data?.data || data?.content || null;

  const getScheduleStatus = (item) => {
    if (!item) return null;
    const now = new Date();
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    if (now < start) return { label: 'Scheduled', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' };
    if (now > end) return { label: 'Expired', color: 'text-muted-foreground', bg: 'bg-muted border-border' };
    return { label: 'Live Now', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const scheduleStatus = getScheduleStatus(content);

  const formatTime = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">ContentBroadcast</p>
              <p className="text-xs text-muted-foreground">Live Broadcast</p>
            </div>
          </div>
          {dataUpdatedAt > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Auto-refreshes every 30s
            </p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-full aspect-video rounded-2xl" />
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        ) : isError ? (
          <div className="text-center py-24">
            <WifiOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Unable to load broadcast</h2>
            <p className="text-muted-foreground text-sm">Could not connect to the broadcast server. Please try again later.</p>
          </div>
        ) : !content ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Tv className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No content available</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              There is no active broadcast at this time. Check back later or the teacher may not have any scheduled content.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status badge */}
            {scheduleStatus && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${scheduleStatus.bg}`}>
                <span className={`w-2 h-2 rounded-full ${scheduleStatus.label === 'Live Now' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
                <span className={scheduleStatus.color}>{scheduleStatus.label}</span>
              </div>
            )}

            {/* Content preview */}
            <div className="w-full rounded-2xl overflow-hidden bg-muted border border-border aspect-video flex items-center justify-center">
              {content.fileUrl || content.filePath ? (
                <img
                  src={content.fileUrl || `${BASE_URL}/${content.filePath}`}
                  alt={content.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Tv className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No preview available</p>
                </div>
              )}
            </div>

            {/* Content details */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{content.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    {content.subject}
                  </span>
                </div>
              </div>
              {content.description && (
                <p className="text-muted-foreground">{content.description}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <span>📅</span>
                  <div>
                    <p className="text-xs font-medium text-foreground">Start Time</p>
                    <p>{formatTime(content.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <span>⏱</span>
                  <div>
                    <p className="text-xs font-medium text-foreground">End Time</p>
                    <p>{formatTime(content.endTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
