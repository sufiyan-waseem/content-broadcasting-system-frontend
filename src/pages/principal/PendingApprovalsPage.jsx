import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingContent } from '@/services/content.service';
import { approveContent, rejectContent } from '@/services/approval.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { CheckCircle, XCircle, ImageIcon, Clock, FileText } from 'lucide-react';

const BASE_URL = 'https://content-broadcasting-system-tr6b.onrender.com';

const CardSkeleton = () => (
  <div className="bg-card border border-border rounded-xl p-4 space-y-3">
    <div className="flex gap-3">
      <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default function PendingApprovalsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rejectDialog, setRejectDialog] = useState({ open: false, contentId: null });
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pendingContent'],
    queryFn: getPendingContent,
    refetchInterval: 15000,
  });

  const contents = data?.data || data?.contents || [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['pendingContent'] });
    queryClient.invalidateQueries({ queryKey: ['allContent'] });
  };

  const approveMutation = useMutation({
    mutationFn: approveContent,
    onSuccess: () => {
      toast({ title: 'Approved!', description: 'Content has been approved successfully.' });
      invalidate();
    },
    onError: (err) => toast({ variant: 'destructive', title: 'Failed', description: err.response?.data?.message || 'Could not approve.' }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectContent(id, reason),
    onSuccess: () => {
      toast({ title: 'Rejected', description: 'Content has been rejected.' });
      setRejectDialog({ open: false, contentId: null });
      setReason('');
      invalidate();
    },
    onError: (err) => toast({ variant: 'destructive', title: 'Failed', description: err.response?.data?.message || 'Could not reject.' }),
  });

  const handleReject = () => {
    if (!reason.trim()) { setReasonError('Rejection reason is required.'); return; }
    setReasonError('');
    rejectMutation.mutate({ id: rejectDialog.contentId, reason: reason.trim() });
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="w-6 h-6" /> Pending Approvals
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve or reject uploaded content</p>
      </div>

      {isError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
          Failed to load pending content.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : contents.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-medium text-foreground">All caught up!</h3>
          <p className="text-sm text-muted-foreground mt-1">No pending content to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contents.map((content) => (
            <div key={content.id || content._id} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Image */}
                <div className="w-full sm:w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  {content.fileUrl || content.filePath ? (
                    <img
                      src={content.fileUrl || `${BASE_URL}/${content.filePath}`}
                      alt={content.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{content.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{content.subject}</p>
                  {content.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{content.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>👤 {content.teacher?.name || content.teacher?.email || 'Teacher'}</span>
                    <span>📅 {formatDate(content.startTime)}</span>
                    <span>⏱ {formatDate(content.endTime)}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(content.id || content._id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRejectDialog({ open: true, contentId: content.id || content._id })}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="w-3 h-3 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(o) => { if (!o) { setRejectDialog({ open: false, contentId: null }); setReason(''); setReasonError(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" /> Reject Content
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-sm text-muted-foreground">Please provide a reason for rejection. This will be visible to the teacher.</p>
            <Textarea
              placeholder="e.g. Content is not relevant to the curriculum..."
              value={reason}
              onChange={(e) => { setReason(e.target.value); if (reasonError) setReasonError(''); }}
              rows={3}
              className={reasonError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {reasonError && <p className="text-xs text-destructive">{reasonError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectDialog({ open: false, contentId: null }); setReason(''); setReasonError(''); }}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={rejectMutation.isPending} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
