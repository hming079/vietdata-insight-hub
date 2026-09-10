import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel, PageHeader, Delta, Dot, StatusPill } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  recentActivity,
  systemHealth,
  queryVolume,
  dataSources,
  documents,
} from "@/lib/mock-data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Database,
  FileText,
  Terminal,
  CheckCircle2,
  MessagesSquare,
  Upload,
  Plus,
  ArrowUpRight,
  Activity,
  ShieldAlert,
  Library,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "Overview — Data Assistant" },
      {
        name: "description",
        content:
          "Tổng quan hệ thống trợ lý dữ liệu: nguồn dữ liệu, tài liệu, lượng truy vấn và tình trạng vận hành.",
      },
      { property: "og:title", content: "Overview — Data Assistant" },
      {
        property: "og:description",
        content: "Tổng quan nguồn dữ liệu, tài liệu, truy vấn và sức khoẻ hệ thống.",
      },
    ],
  }),
  component: OverviewPage,
});

const stats = [
  { label: "Nguồn dữ liệu", sub: "Total data sources", value: "4", icon: Database, delta: 0, note: "3 đang kết nối · 1 lỗi" },
  { label: "Tài liệu tri thức", sub: "Total documents", value: "6", icon: FileText, delta: 20, note: "4 sẵn sàng · 1 đang xử lý" },
  { label: "Truy vấn 30 ngày", sub: "Total queries", value: "3,482", icon: Terminal, delta: 14.2, note: "2,410 SQL · 1,072 RAG" },
  { label: "Tỷ lệ thành công", sub: "Query success rate", value: "96.4%", icon: CheckCircle2, delta: 1.8, note: "126 truy vấn thất bại" },
];

const quickActions = [
  { to: "/text-to-sql", label: "Ask Data", vi: "Đặt câu hỏi về dữ liệu", icon: MessagesSquare },
  { to: "/document-qa", label: "Query Documents", vi: "Hỏi đáp tài liệu nội bộ", icon: FileText },
  { to: "/data-sources", label: "Add Data Source", vi: "Kết nối cơ sở dữ liệu", icon: Plus },
  { to: "/knowledge-base", label: "Upload Document", vi: "Tải tài liệu lên kho", icon: Upload },
] as const;

const kindIcon = {
  sql: Terminal,
  rag: FileText,
  admin: ShieldAlert,
  kb: Library,
  error: ShieldAlert,
};

function OverviewPage() {
  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Tổng quan hệ thống"
        subtitle="Cập nhật lúc 09/09/2026 14:55 · Dữ liệu 30 ngày gần nhất"
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/audit-log">
                <Activity className="size-4" /> Nhật ký hệ thống
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/text-to-sql">
                <MessagesSquare className="size-4" /> Đặt câu hỏi
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-medium text-muted-foreground">{s.label}</p>
                <p className="text-[11px] text-muted-foreground/70">{s.sub}</p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted">
                <s.icon className="size-4 text-primary" />
              </div>
            </div>
            <p className="mt-3 font-display text-2xl font-semibold text-numeric">{s.value}</p>
            <div className="mt-2 flex items-center gap-2">
              {s.delta !== 0 && <Delta value={s.delta} />}
              <span className="text-xs text-muted-foreground">{s.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Lượng truy vấn theo ngày"
          description="Text-to-SQL so với Document Q&A (7 ngày gần nhất)"
          actions={
            <span className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-chart-1" /> SQL
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-chart-2" /> RAG
              </span>
            </span>
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queryVolume} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} />
                <RTooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="sql" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rag" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="System Health" description="Tình trạng các thành phần dịch vụ">
          <ul className="space-y-4">
            {systemHealth.map((h) => (
              <li key={h.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Dot status={h.state} />
                    {h.name}
                  </span>
                  <span className="text-numeric text-xs text-muted-foreground">{h.value}%</span>
                </div>
                <Progress value={h.value} className="mt-2 h-1.5" />
                <p className="mt-1.5 text-xs text-muted-foreground">{h.status}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Hoạt động gần đây"
          description="Recent activity"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/audit-log">
                Xem tất cả <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          }
          bodyClassName="divide-y divide-border"
        >
          {recentActivity.map((a) => {
            const Icon = kindIcon[a.kind];
            return (
              <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                <span
                  className={
                    a.kind === "error"
                      ? "mt-0.5 flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
                      : "mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                  }
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{a.user}</span>{" "}
                    <span className="text-muted-foreground">{a.text}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-muted-foreground">
                    <Clock className="size-3" /> {a.time}
                  </p>
                </div>
              </div>
            );
          })}
        </Panel>

        <div className="space-y-5">
          <Panel title="Quick actions" description="Thao tác nhanh">
            <div className="grid gap-2">
              {quickActions.map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <a.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[13px] font-medium">{a.label}</span>
                    <span className="block truncate text-[11.5px] text-muted-foreground">
                      {a.vi}
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Trạng thái kết nối" description="Data sources & knowledge base">
            <ul className="space-y-2.5 text-sm">
              {dataSources.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    {d.name}
                    <span className="ml-1.5 text-xs text-muted-foreground">{d.engine}</span>
                  </span>
                  <StatusPill
                    status={
                      d.status === "Connected"
                        ? "success"
                        : d.status === "Syncing"
                          ? "processing"
                          : "error"
                    }
                  >
                    {d.status}
                  </StatusPill>
                </li>
              ))}
              <li className="flex items-center justify-between gap-2 border-t border-border pt-2.5">
                <span className="text-muted-foreground">Tài liệu đã lập chỉ mục</span>
                <span className="text-numeric font-medium">
                  {documents.filter((d) => d.status === "ready").length}/{documents.length}
                </span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
