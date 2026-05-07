import { useQuery } from '@tanstack/react-query';
import { getMyContent } from '@/services/content.service';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutDashboard, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </div>
);

const StatSkeleton = () => (
  <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
    <Skeleton className="w-12 h-12 rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-7 w-10" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['myContent'],
    queryFn: getMyContent,
  });

  const contents = data?.data || data?.contents || [];
  const total = contents.length;
  const pending = contents.filter((c) => c.status === 'pending').length;
  const approved = contents.filter((c) => c.status === 'approved').length;
  const rejected = contents.filter((c) => c.status === 'rejected').length;

  const stats = [
    { label: 'Total Uploaded', value: total, icon: FileText, color: 'bg-blue-500' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-amber-500' },
    { label: 'Approved', value: approved, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Rejected', value: rejected, icon: XCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          Teacher Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your uploaded content
        </p>
      </div>

      {/* Stats */}
      {isError ? (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
          Failed to load dashboard data. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />)
            : stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-1">Quick Actions</h2>
        <p className="text-sm text-muted-foreground mb-4">Get started quickly</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/teacher/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Upload New Content
          </Link>
          <Link
            to="/teacher/content"
            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            View My Content
          </Link>
        </div>
      </div>
    </div>
  );
}
