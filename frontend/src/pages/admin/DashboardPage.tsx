import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  MessageSquare,
  CheckCircle,
  Bell,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getDashboardStats } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

const STATUS_VARIANT = {
  New: "warning",
  Contacted: "success",
  Closed: "secondary",
} as const;

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) return <PageLoader />;

  const stats = [
    {
      label: "Total Properties",
      value: data?.totalProperties ?? 0,
      icon: Building2,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Active Listings",
      value: data?.activeProperties ?? 0,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "+5%",
      trendUp: true,
    },
    {
      label: "Total Inquiries",
      value: data?.totalInquiries ?? 0,
      icon: MessageSquare,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+23%",
      trendUp: true,
    },
    {
      label: "New Inquiries",
      value: data?.newInquiries ?? 0,
      icon: Bell,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      trend: "This week",
      trendUp: null,
    },
  ];

  const chartData = [
    { month: "Oct", inquiries: 8 },
    { month: "Nov", inquiries: 14 },
    { month: "Dec", inquiries: 11 },
    { month: "Jan", inquiries: 19 },
    { month: "Feb", inquiries: 23 },
    { month: "Mar", inquiries: data?.totalInquiries ?? 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal">Dashboard</h1>
        <p className="text-sm text-muted-400 mt-0.5">
          Welcome back, {/* user name could go here */}here's what's happening.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(
          ({ label, value, icon: Icon, iconBg, iconColor, trend, trendUp }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-muted-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-xl p-3 ${iconBg}`}>
                  <Icon className={iconColor} size={20} />
                </div>
                {trendUp !== null && (
                  <span
                    className={`flex items-center gap-0.5 text-xs font-semibold ${
                      trendUp ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    <TrendingUp size={11} />
                    {trend}
                  </span>
                )}
                {trendUp === null && (
                  <span className="text-xs text-muted-400">{trend}</span>
                )}
              </div>
              <p className="mt-4 text-3xl font-extrabold text-charcoal">
                {value}
              </p>
              <p className="text-sm text-muted-400 mt-0.5">{label}</p>
            </div>
          ),
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-muted-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-charcoal">Inquiry Trends</h2>
              <p className="text-xs text-muted-400 mt-0.5">Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f5f4f0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9e9b93" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9e9b93" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e8e6e0",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}
                cursor={{ fill: "#faf9f6" }}
              />
              <Bar dataKey="inquiries" fill="#d97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Inquiries */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-muted-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-charcoal">Recent Inquiries</h2>
            <Link
              to="/admin/inquiries"
              className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700"
            >
              View all <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recentInquiries?.slice(0, 5).map((inq) => (
              <div
                key={inq.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold shrink-0">
                  {inq.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal truncate">
                    {inq.name}
                  </p>
                  <p className="text-xs text-muted-400 truncate">
                    {inq.propertyTitle}
                  </p>
                  <p className="text-xs text-muted-400 mt-0.5">
                    {formatDate(inq.createdAt)}
                  </p>
                </div>
                <Badge
                  variant={
                    STATUS_VARIANT[inq.status as keyof typeof STATUS_VARIANT] ??
                    "secondary"
                  }
                >
                  {inq.status}
                </Badge>
              </div>
            ))}
            {(!data?.recentInquiries || data.recentInquiries.length === 0) && (
              <p className="text-sm text-muted-400 text-center py-6">
                No recent inquiries.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
