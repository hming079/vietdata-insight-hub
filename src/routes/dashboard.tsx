import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Panel, Delta } from "@/components/kit";
import { Button } from "@/components/ui/button";
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
  formatVnd,
} from "@/lib/mock-data";
import {
  CalendarRange,
  Database,
  Download,
  Expand,
  MoreHorizontal,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Business Dashboard — Data Assistant" },
      {
        name: "description",
        content:
          "Bảng điều khiển phân tích kinh doanh: doanh thu, đơn hàng, khách hàng và hiệu quả ngành hàng.",
      },
      { property: "og:title", content: "Business Dashboard — Data Assistant" },
      {
        property: "og:description",
        content: "Doanh thu, đơn hàng, khách hàng và ngành hàng trong một bảng điều khiển.",
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
    <>
      <Button variant="ghost" size="icon" className="size-8">
        <Expand className="size-4" />
      </Button>
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
            <FileSpreadsheet className="size-4" /> Xuất CSV
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RefreshCw className="size-4" /> Làm mới dữ liệu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const RANGE_FACTOR: Record<string, number> = {
  "30d": 0.34,
  "90d": 0.62,
  ytd: 1,
  "12m": 1.12,
};

function DashboardPage() {
  const [range, setRange] = useState("ytd");
  const [source, setSource] = useState("ds1");
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("09/09/2026 14:55");

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

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setUpdatedAt("09/09/2026 15:0" + Math.floor(Math.random() * 9));
    }, 900);
  };

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Business Dashboard"
        subtitle="Báo cáo kinh doanh hợp nhất theo kênh bán và ngành hàng"
        actions={
          <>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[190px]">
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
              <SelectTrigger className="w-[200px]">
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
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success" /> Last updated: {updatedAt}
        </span>
        <span className="text-border">|</span>
        <span>So sánh với kỳ trước cùng độ dài</span>
      </div>

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

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Revenue Over Time"
          description="Doanh thu và số đơn hàng theo tháng (triệu ₫)"
          actions={<CardMenu />}
        >
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

        <Panel
          title="Revenue by Category"
          description="Tỷ trọng doanh thu theo ngành hàng"
          actions={<CardMenu />}
        >
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
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Top Products"
          description="5 sản phẩm doanh thu cao nhất (triệu ₫)"
          actions={<CardMenu />}
        >
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

        <Panel
          title="Orders by Region"
          description="Số đơn hàng theo tỉnh / thành phố"
          actions={<CardMenu />}
        >
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
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
            TP. Hồ Chí Minh và Hà Nội chiếm{" "}
            <span className="font-medium text-foreground">67.7%</span> tổng số đơn hàng trong kỳ.
          </p>
        </Panel>
      </div>
    </div>
  );
}
