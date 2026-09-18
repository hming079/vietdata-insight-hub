import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, Panel, Delta, EmptyState } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import {
  kpis,
  revenueOverTime,
  revenueByCategory,
  topProducts,
  ordersByRegion,
  queryVolume,
  formatVnd,
} from "@/lib/mock-data";
import {
  useDashboards,
  dashboardStore,
  widgetCatalog,
  newWidget,
  type Widget,
} from "@/lib/dashboard-store";
import { toast } from "sonner";
import {
  CalendarRange,
  Database,
  Download,
  Eye,
  EyeOff,
  GripVertical,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  X,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s["id"] === "string" ? (s["id"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Business Dashboard — Data Assistant" },
      {
        name: "description",
        content:
          "Bảng điều khiển phân tích kinh doanh có thể tuỳ chỉnh widget: doanh thu, đơn hàng, khách hàng và ngành hàng.",
      },
      { property: "og:title", content: "Business Dashboard — Data Assistant" },
      {
        property: "og:description",
        content: "Doanh thu, đơn hàng, khách hàng và ngành hàng trong bảng điều khiển tuỳ chỉnh.",
      },
    ],
  }),
  component: DashboardPage,
});

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
];

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid var(--color-border)",
  fontSize: 12,
  boxShadow: "var(--shadow-raised)",
};

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Area
            type="monotone"
            dataKey="v"
            stroke={up ? "var(--color-success)" : "var(--color-destructive)"}
            fill={up ? "var(--color-success)" : "var(--color-destructive)"}
            fillOpacity={0.12}
            strokeWidth={1.75}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CardMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Download className="size-4" /> Xuất PNG
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RefreshCw className="size-4" /> Làm mới dữ liệu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const RANGE_FACTOR: Record<string, number> = {
  "30d": 0.34,
  "90d": 0.62,
  ytd: 1,
  "12m": 1.12,
};

function DashboardPage() {
  const { id } = Route.useSearch();
  const dashboards = useDashboards();
  const active =
    dashboards.find((d) => d.id === id) ?? dashboards.find((d) => d.isDefault) ?? dashboards[0];

  const [range, setRange] = useState("ytd");
  const [source, setSource] = useState("ds1");
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("18/09/2026 14:55");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Widget[]>(active?.widgets ?? []);
  const [addOpen, setAddOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    setDraft(active?.widgets ?? []);
    setEditing(false);
  }, [active?.id, active?.widgets]);

  const factor = RANGE_FACTOR[range] ?? 1;
  const sourceFactor = source === "ds2" ? 0.72 : source === "ds3" ? 0.41 : 1;
  const scale = factor * sourceFactor;

  const revenue = useMemo(
    () =>
      revenueOverTime
        .slice(range === "30d" ? -3 : range === "90d" ? -6 : 0)
        .map((d) => ({ ...d, revenue: Math.round(d.revenue * sourceFactor) })),
    [range, sourceFactor],
  );
  const categories = useMemo(
    () => revenueByCategory.map((c) => ({ ...c, value: Math.round(c.value * scale) })),
    [scale],
  );
  const products = useMemo(
    () => topProducts.map((p) => ({ ...p, revenue: Math.round(p.revenue * scale) })),
    [scale],
  );
  const regions = useMemo(
    () => ordersByRegion.map((r) => ({ ...r, value: Math.round(r.value * scale) })),
    [scale],
  );

  if (!active) {
    return (
      <div className="p-6">
        <EmptyState
          icon={LayoutGrid}
          title="Chưa có dashboard nào"
          description="Tạo dashboard đầu tiên tại trang quản lý dashboard."
          action={
            <Button asChild size="sm">
              <Link to="/dashboards">Mở Dashboard Management</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setUpdatedAt("18/09/2026 15:0" + Math.floor(Math.random() * 9));
    }, 900);
  };

  const widgets = editing ? draft : draft.filter((wd) => !wd.hidden);

  const patch = (wid: string, p: Partial<Widget>) =>
    setDraft((cur) => cur.map((x) => (x.id === wid ? { ...x, ...p } : x)));

  const drop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setDraft((cur) => {
      const from = cur.findIndex((x) => x.id === dragId);
      const to = cur.findIndex((x) => x.id === targetId);
      if (from < 0 || to < 0) return cur;
      const next = [...cur];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      return next;
    });
    setDragId(null);
  };

  const save = () => {
    dashboardStore.update(active.id, { widgets: draft });
    setEditing(false);
    toast.success("Đã lưu bố cục dashboard");
  };

  const renderWidget = (wd: Widget) => {
    switch (wd.type) {
      case "kpis":
        return (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.id} className="panel p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-medium text-muted-foreground">{k.label}</p>
                    <p className="text-[11px] text-muted-foreground/70">{k.sublabel}</p>
                  </div>
                  <Delta value={k.change} />
                </div>
                <p className="mt-3 font-display text-[26px] leading-none font-semibold text-numeric">
                  {k.value}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">Kỳ trước: {k.previous}</p>
                <Sparkline data={k.spark} up={k.change >= 0} />
              </div>
            ))}
          </div>
        );
      case "revenue-time":
        return (
          <Panel title={wd.title} description="Doanh thu và số đơn hàng theo tháng (triệu ₫)" actions={<CardMenu />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenue}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
                  <RTooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    name="Doanh thu"
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    fill="url(#revFill)"
                  />
                  <Line
                    name="Mục tiêu"
                    type="monotone"
                    dataKey="target"
                    stroke="var(--color-chart-4)"
                    strokeWidth={1.75}
                    strokeDasharray="5 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        );
      case "revenue-category":
        return (
          <Panel title={wd.title} description="Tỷ trọng doanh thu theo ngành hàng" actions={<CardMenu />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={2}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        );
      case "top-products":
        return (
          <Panel title={wd.title} description="5 sản phẩm doanh thu cao nhất (triệu ₫)" actions={<CardMenu />}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={products} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                  <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    width={150}
                  />
                  <RTooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
              {products.slice(0, 3).map((p) => (
                <li key={p.name} className="flex justify-between">
                  <span className="truncate">{p.name}</span>
                  <span className="text-numeric">{formatVnd(p.units)} sp đã bán</span>
                </li>
              ))}
            </ul>
          </Panel>
        );
      case "orders-region":
        return (
          <Panel title={wd.title} description="Số đơn hàng theo tỉnh / thành phố" actions={<CardMenu />}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regions}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
                  <RTooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={38}>
                    {regions.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        );
      case "query-volume":
        return (
          <Panel title={wd.title} description="Lượt truy vấn Text-to-SQL và RAG theo ngày" actions={<CardMenu />}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queryVolume}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <RTooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Bar name="Text-to-SQL" dataKey="sql" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar name="RAG" dataKey="rag" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title={active.name}
        subtitle={active.description}
        actions={
          editing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="size-4" /> Add widget
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDraft(active.widgets);
                  setEditing(false);
                }}
              >
                Huỷ
              </Button>
              <Button size="sm" onClick={save}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Select
                value={active.id}
                onValueChange={(v) => {
                  window.location.href = `/dashboard?id=${v}`;
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <LayoutGrid className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dashboards.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="w-[180px]">
                  <CalendarRange className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">30 ngày gần nhất</SelectItem>
                  <SelectItem value="90d">90 ngày gần nhất</SelectItem>
                  <SelectItem value="ytd">Từ đầu năm 2026</SelectItem>
                  <SelectItem value="12m">12 tháng gần nhất</SelectItem>
                </SelectContent>
              </Select>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-[190px]">
                  <Database className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ds1">Retail Database</SelectItem>
                  <SelectItem value="ds2">Sales Database</SelectItem>
                  <SelectItem value="ds3">Inventory Warehouse</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={refresh}>
                <RefreshCw className={refreshing ? "size-4 animate-spin" : "size-4"} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="size-4" /> Edit layout
              </Button>
            </>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {active.isDefault && (
          <Badge variant="secondary" className="gap-1">
            <Star className="size-3" /> Mặc định
          </Badge>
        )}
        <Badge variant="outline">{active.scope}</Badge>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success" /> Last updated: {updatedAt}
        </span>
        <span className="text-border">|</span>
        <span>{draft.filter((x) => !x.hidden).length} widget đang hiển thị</span>
        <Link to="/dashboards" className="ml-auto text-primary hover:underline">
          Quản lý dashboard
        </Link>
      </div>

      {editing && (
        <p className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
          Kéo thẻ để sắp xếp lại, chọn độ rộng, ẩn/hiện hoặc gỡ widget. Nhấn <b>Save</b> để lưu cấu hình riêng của bạn.
        </p>
      )}

      {widgets.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Dashboard chưa có widget nào"
          description="Bật chế độ chỉnh sửa và thêm widget KPI hoặc biểu đồ."
          action={
            <Button size="sm" onClick={() => { setEditing(true); setAddOpen(true); }}>
              <Plus className="size-4" /> Add widget
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {widgets.map((wd) => (
            <div
              key={wd.id}
              draggable={editing}
              onDragStart={() => setDragId(wd.id)}
              onDragOver={(e) => editing && e.preventDefault()}
              onDrop={() => drop(wd.id)}
              className={[
                wd.span === 3 ? "xl:col-span-3" : wd.span === 2 ? "xl:col-span-2" : "xl:col-span-1",
                editing ? "rounded-2xl border border-dashed border-primary/40 p-2" : "",
                editing && wd.hidden ? "opacity-50" : "",
                dragId === wd.id ? "ring-2 ring-primary/40" : "",
              ].join(" ")}
            >
              {editing && (
                <div className="mb-2 flex items-center gap-2 px-1">
                  <GripVertical className="size-4 cursor-grab text-muted-foreground" />
                  <span className="text-[13px] font-medium">{wd.title}</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Select
                      value={String(wd.span)}
                      onValueChange={(v) => patch(wd.id, { span: Number(v) as 1 | 2 | 3 })}
                    >
                      <SelectTrigger className="h-8 w-[112px] text-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1/3 rộng</SelectItem>
                        <SelectItem value="2">2/3 rộng</SelectItem>
                        <SelectItem value="3">Toàn bộ</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => patch(wd.id, { hidden: !wd.hidden })}
                    >
                      {wd.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive"
                      onClick={() => setDraft((cur) => cur.filter((x) => x.id !== wd.id))}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
              {renderWidget(wd)}
            </div>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm widget</DialogTitle>
            <DialogDescription>Chọn widget có sẵn để thêm vào dashboard này.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {widgetCatalog.map((c) => (
              <button
                key={c.type}
                className="flex w-full items-start gap-3 rounded-lg border border-border px-3 py-2.5 text-left hover:bg-muted"
                onClick={() => {
                  setDraft((cur) => [...cur, newWidget(c.type)]);
                  setAddOpen(false);
                  toast.success(`Đã thêm widget ${c.title}`);
                }}
              >
                <Plus className="mt-0.5 size-4 text-primary" />
                <span>
                  <span className="block text-[13px] font-medium">{c.title}</span>
                  <span className="block text-[11.5px] text-muted-foreground">{c.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {editing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDraft(active.widgets)}>
            <Trash2 className="size-4" /> Khôi phục bố cục đã lưu
          </Button>
        </div>
      )}
    </div>
  );
}
