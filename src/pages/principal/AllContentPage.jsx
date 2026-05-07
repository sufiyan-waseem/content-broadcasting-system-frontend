import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllContent } from '@/services/content.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { BookOpen, ImageIcon, Search, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';

const BASE_URL = 'https://content-broadcasting-system-tr6b.onrender.com';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  approved: { label: 'Approved', icon: CheckCircle, className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
};

const RowSkeleton = () => (
  <tr>
    <td className="p-3"><div className="flex items-center gap-3"><Skeleton className="w-10 h-10 rounded-lg" /><Skeleton className="h-4 w-32" /></div></td>
    <td className="p-3"><Skeleton className="h-4 w-20" /></td>
    <td className="p-3"><Skeleton className="h-4 w-20" /></td>
    <td className="p-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
  </tr>
);

export default function AllContentPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allContent'],
    queryFn: getAllContent,
  });

  const contents = data?.data || data?.contents || [];

  const filtered = useMemo(() => {
    return contents.filter((c) => {
      const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.subject?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [contents, search, statusFilter]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6" /> All Content
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Browse and filter all uploaded content</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
          Failed to load content.
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Content</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Teacher</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Scheduled</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <RowSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium text-foreground">No content found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((content) => {
                  const status = statusConfig[content.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={content.id || content._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                            {content.fileUrl || content.filePath ? (
                              <img src={content.fileUrl || `${BASE_URL}/${content.filePath}`} alt={content.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{content.title}</p>
                            <p className="text-xs text-muted-foreground">{content.subject}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{content.teacher?.name || content.teacher?.email || '—'}</td>
                      <td className="p-3 text-muted-foreground text-xs">{formatDate(content.startTime)}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${status.className}`}>
                          <StatusIcon className="w-3 h-3" />{status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered.length > 0 && (
          <div className="px-3 py-2 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {contents.length} items</p>
          </div>
        )}
      </div>
    </div>
  );
}
