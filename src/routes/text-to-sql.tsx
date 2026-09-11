import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusPill, SqlCode, EmptyState } from "@/components/kit";
import { conversations, generatedSql, failedSql, queryResultRows, formatVnd } from "@/lib/mock-data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Database,
  Download,
  Filter,
  MessageSquarePlus,
  Paperclip,
  Pencil,
  Play,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Table2,
  Wand2,
  BarChart3,
  Code2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/text-to-sql")({
  head: () => ({
    meta: [
      { title: "Text-to-SQL Assistant — Data Assistant" },
      {
        name: "description",
        content:
          "Đặt câu hỏi kinh doanh bằng tiếng Việt, hệ thống sinh SQL, tự kiểm tra lỗi và trực quan hoá kết quả.",
      },
      { property: "og:title", content: "Text-to-SQL Assistant — Data Assistant" },
      {
        property: "og:description",
        content: "Câu hỏi tiếng Việt thành SQL kiểm chứng được, kèm bảng và biểu đồ kết quả.",
      },
    ],
  }),
  component: TextToSqlPage,
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

/* ------------------------------ Left sidebar ------------------------------ */

function ConversationList() {
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState("c1");
  const list = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(q.toLowerCase()) ||
      c.preview.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-surface">
      <div className="space-y-3 border-b border-border p-3">
        <Button className="w-full justify-start" size="sm">
          <MessageSquarePlus className="size-4" /> Cuộc hội thoại mới
        </Button>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm hội thoại..."
            className="h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-[13px] outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>
      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto p-2">
        <p className="px-2 py-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Gần đây
        </p>
        {list.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Không tìm thấy hội thoại"
            description="Thử từ khoá khác, ví dụ “doanh thu”."
            className="py-10"
          />
        ) : (
          <ul className="space-y-1">
            {list.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "w-full rounded-lg px-2.5 py-2 text-left transition-colors",
                    activeId === c.id
                      ? "border border-primary/25 bg-accent"
                      : "border border-transparent hover:bg-muted",
                  )}
                >
                  <p className="truncate text-[13px] font-medium">{c.title}</p>
                  <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                    {c.preview}
                  </p>
                  <p className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground/80">
                    <span>{c.time}</span>
                    <span>{c.messages} tin nhắn</span>
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t border-border p-3 text-[11.5px] text-muted-foreground">
        Lịch sử hội thoại được lưu 90 ngày theo chính sách nội bộ.
      </div>
    </aside>
  );
}

/* ------------------------------- SQL block -------------------------------- */

function SqlBlock({
  sql,
  executed,
  onExecute,
}: {
  sql: string;
  executed: boolean;
  onExecute: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-primary" />
          <span className="text-[13px] font-semibold">Generated SQL</span>
          <Badge variant="secondary" className="font-mono text-[10.5px]">
            PostgreSQL
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              void navigator.clipboard?.writeText(sql);
              toast.success("Đã sao chép câu lệnh SQL");
            }}
          >
            <Copy className="size-3.5" /> Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast("Chế độ chỉnh sửa SQL đã bật")}>
            <Pencil className="size-3.5" /> Edit
          </Button>
          <Button size="sm" onClick={onExecute}>
            <Play className="size-3.5" /> Execute
          </Button>
        </div>
      </div>
      <SqlCode code={sql} />
      <div className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <StatusPill status="success">SQL hợp lệ</StatusPill>
        <span>Lược đồ: public · 3 bảng tham chiếu</span>
        <span className="text-border">|</span>
        <span>Chi phí ước tính: 0.42 đơn vị</span>
        {executed && (
          <StatusPill status="success" className="ml-auto">
            Thực thi thành công · 412 ms
          </StatusPill>
        )}
      </div>
    </div>
  );
}

/* --------------------------- Self-correction ------------------------------ */

function SelfCorrection() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/60">
          <Wand2 className="size-4 text-primary" />
          <span className="text-[13px] font-semibold">SQL Self-Correction</span>
          <StatusPill status="success">2 lần thử · thành công</StatusPill>
          <ChevronDown
            className={cn(
              "ml-auto size-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 border-t border-border p-4">
            <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold">Attempt 1</p>
                <StatusPill status="error">Failed</StatusPill>
              </div>
              <div className="mt-2 overflow-hidden rounded-md border border-border">
                <SqlCode code={failedSql} className="text-[11.5px]" />
              </div>
              <p className="mt-2 font-mono text-xs text-destructive">
                ERROR: column &quot;amount&quot; does not exist
              </p>
            </div>

            <div className="relative rounded-lg border border-info/25 bg-info/5 p-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-info" />
                <p className="text-[13px] font-semibold">Self-correction analysis</p>
              </div>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                Cột <code className="font-mono text-foreground">amount</code> không tồn tại. Theo
                lược đồ, bảng <code className="font-mono text-foreground">orders</code> có cột{" "}
                <code className="font-mono text-foreground">total_amount</code>. Ngoài ra cần bổ
                sung điều kiện lọc năm 2026 và trạng thái{" "}
                <code className="font-mono text-foreground">COMPLETED</code> theo định nghĩa
                “Doanh thu” trong Business Glossary.
              </p>
            </div>

            <div className="rounded-lg border border-success/25 bg-success/5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold">Attempt 2</p>
                <StatusPill status="success">Success</StatusPill>
              </div>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                Truy vấn thực thi thành công, trả về 12 dòng trong 412 ms.
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

/* ------------------------------ Result block ------------------------------ */

type SortKey = "thang" | "doanh_thu" | "so_don_hang" | "aov";

function ResultBlock() {
  const [sortKey, setSortKey] = useState<SortKey>("thang");
  const [asc, setAsc] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState<"thang">("thang");
  const [yAxis, setYAxis] = useState<"doanh_thu" | "so_don_hang" | "aov">("doanh_thu");
  const pageSize = 6;

  const rows = useMemo(() => {
    const filtered = queryResultRows.filter((r) =>
      r.thang.toLowerCase().includes(filter.toLowerCase()),
    );
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return asc ? av - bv : bv - av;
      return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [sortKey, asc, filter]);

  const pageRows = rows.slice(page * pageSize, page * pageSize + pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const chartData = queryResultRows.map((r) => ({ x: r[xAxis], y: r[yAxis] }));

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) setAsc(!asc);
    else {
      setSortKey(k);
      setAsc(true);
    }
  };

  const th = (k: SortKey, label: string, right = false) => (
    <TableHead className={right ? "text-right" : undefined}>
      <button
        onClick={() => toggleSort(k)}
        className={cn(
          "inline-flex items-center gap-1 font-medium hover:text-foreground",
          right && "justify-end",
        )}
      >
        {label}
        {sortKey === k ? (
          asc ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          )
        ) : null}
      </button>
    </TableHead>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <Tabs defaultValue="table">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <TabsList>
            <TabsTrigger value="table">
              <Table2 className="size-3.5" /> Table
            </TabsTrigger>
            <TabsTrigger value="chart">
              <BarChart3 className="size-3.5" /> Chart
            </TabsTrigger>
            <TabsTrigger value="sql">
              <Code2 className="size-3.5" /> SQL
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {rows.length} dòng · 412 ms
            </span>
            <Button variant="outline" size="sm" onClick={() => toast.success("Đã xuất result.csv")}>
              <Download className="size-3.5" /> Export
            </Button>
          </div>
        </div>

        <TabsContent value="table" className="m-0">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div className="relative">
              <Filter className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(0);
                }}
                placeholder="Lọc theo tháng, ví dụ 03/2026"
                className="h-8 w-64 rounded-md border border-input bg-background pr-2 pl-8 text-[13px] outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                {th("thang", "Tháng")}
                {th("doanh_thu", "Doanh thu (₫)", true)}
                {th("so_don_hang", "Số đơn hàng", true)}
                {th("aov", "GT đơn TB (₫)", true)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((r) => (
                <TableRow key={r.thang}>
                  <TableCell className="font-medium">{r.thang}</TableCell>
                  <TableCell className="text-right text-numeric">
                    {formatVnd(r.doanh_thu)}
                  </TableCell>
                  <TableCell className="text-right text-numeric">
                    {formatVnd(r.so_don_hang)}
                  </TableCell>
                  <TableCell className="text-right text-numeric">{formatVnd(r.aov)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
            <span>
              Trang {page + 1} / {totalPages}
            </span>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-3.5" /> Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chart" className="m-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2.5">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="h-8 text-[13px] w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar chart</SelectItem>
                <SelectItem value="line">Line chart</SelectItem>
                <SelectItem value="pie">Pie chart</SelectItem>
              </SelectContent>
            </Select>
            <Select value={xAxis} onValueChange={(v) => setXAxis(v as "thang")}>
              <SelectTrigger className="h-8 text-[13px] w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thang">Trục X: Tháng</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yAxis} onValueChange={(v) => setYAxis(v as typeof yAxis)}>
              <SelectTrigger className="h-8 text-[13px] w-[190px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doanh_thu">Trục Y: Doanh thu</SelectItem>
                <SelectItem value="so_don_hang">Trục Y: Số đơn hàng</SelectItem>
                <SelectItem value="aov">Trục Y: GT đơn TB</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="x" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} width={72} />
                  <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => formatVnd(v)} />
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.25}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              ) : chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="y"
                    nameKey="x"
                    innerRadius={54}
                    outerRadius={110}
                    paddingAngle={1.5}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => formatVnd(v)} />
                </PieChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="x" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} width={72} />
                  <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => formatVnd(v)} />
                  <Bar dataKey="y" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="sql" className="m-0">
          <SqlCode code={generatedSql} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* --------------------------------- Page ----------------------------------- */

function TextToSqlPage() {
  const [executed, setExecuted] = useState(true);
  const [input, setInput] = useState("");
  const [extraQuestions, setExtraQuestions] = useState<string[]>([]);

  const send = () => {
    if (!input.trim()) return;
    setExtraQuestions((q) => [...q, input.trim()]);
    setInput("");
    toast("Đang phân tích câu hỏi và sinh SQL...");
  };

  return (
    <div className="flex h-full min-h-0">
      <ConversationList />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-6 py-3">
          <div className="mr-auto">
            <h1 className="font-display text-[15px] font-semibold">Text-to-SQL Assistant</h1>
            <p className="text-[11.5px] text-muted-foreground">
              Hỏi bằng tiếng Việt · SQL được kiểm chứng trước khi thực thi
            </p>
          </div>
          <Select defaultValue="ds1">
            <SelectTrigger className="h-8 text-[13px] w-[200px]">
              <Database className="size-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ds1">Retail Database</SelectItem>
              <SelectItem value="ds2">Sales Database</SelectItem>
              <SelectItem value="ds3">Inventory Warehouse</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="public">
            <SelectTrigger className="h-8 text-[13px] w-[150px]">
              <Layers className="size-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">schema: public</SelectItem>
              <SelectItem value="sales">schema: sales</SelectItem>
              <SelectItem value="staging">schema: staging</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Đã làm mới lược đồ (12 bảng)")}
          >
            <RefreshCw className="size-3.5" /> Refresh schema
          </Button>
        </div>

        {/* messages */}
        <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto bg-background px-6 py-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* user message */}
            <div className="flex justify-end">
              <div className="max-w-2xl rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[14px] text-primary-foreground shadow-card">
                Doanh thu theo từng tháng trong năm 2026 là bao nhiêu?
              </div>
            </div>

            {/* assistant */}
            <div className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </span>
              <div className="min-w-0 flex-1 space-y-4">
                <div className="text-[14px] leading-relaxed">
                  <p>
                    Tôi đã tổng hợp doanh thu theo từng tháng của năm 2026 từ bảng{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12.5px]">
                      orders
                    </code>
                    , chỉ tính các đơn ở trạng thái{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12.5px]">
                      COMPLETED
                    </code>{" "}
                    theo định nghĩa “Doanh thu” trong Business Glossary.
                  </p>
                  <ul className="mt-2 space-y-1 text-[13.5px] text-muted-foreground">
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" /> Tổng doanh thu năm
                      2026: <span className="font-medium text-foreground">24.86 tỷ ₫</span>, tăng
                      12.4% so với 2025.
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" /> Tháng 12 cao nhất
                      (2.83 tỷ ₫), tháng 2 thấp nhất (1.39 tỷ ₫) do kỳ nghỉ Tết.
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" /> Xu hướng tăng liên
                      tục từ tháng 3, trung bình +4.1%/tháng.
                    </li>
                  </ul>
                </div>

                <SelfCorrection />
                <SqlBlock
                  sql={generatedSql}
                  executed={executed}
                  onExecute={() => {
                    setExecuted(true);
                    toast.success("Truy vấn thực thi thành công · 12 dòng");
                  }}
                />
                <ResultBlock />
              </div>
            </div>

            {extraQuestions.map((q, i) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-2xl rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[14px] text-primary-foreground shadow-card">
                    {q}
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-4" />
                  </span>
                  <div className="flex-1 rounded-xl border border-border bg-surface p-4">
                    <StatusPill status="processing">Đang sinh SQL từ câu hỏi...</StatusPill>
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                      <div className="h-24 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* composer */}
        <div className="border-t border-border bg-surface px-6 py-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-border bg-background p-2 shadow-card focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={2}
                placeholder="Đặt câu hỏi về dữ liệu của bạn..."
                className="w-full resize-none bg-transparent px-2.5 py-2 text-[14px] outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center gap-2 px-1 pt-1">
                <Button variant="ghost" size="sm">
                  <Paperclip className="size-3.5" /> Ngữ cảnh
                </Button>
                <Select defaultValue="ds1">
                  <SelectTrigger className="h-8 text-[13px] w-[180px] border-0 bg-muted">
                    <Database className="size-3.5 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ds1">Retail Database</SelectItem>
                    <SelectItem value="ds2">Sales Database</SelectItem>
                  </SelectContent>
                </Select>
                <span className="ml-auto text-[11px] text-muted-foreground">
                  Enter để gửi · Shift+Enter xuống dòng
                </span>
                <Button size="sm" onClick={send} disabled={!input.trim()}>
                  <Send className="size-3.5" /> Gửi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
