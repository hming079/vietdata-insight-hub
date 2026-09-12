import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatusPill } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { documents, type DocFile } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Check,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Eye,
  CircleDashed,
} from "lucide-react";

export const Route = createFileRoute("/knowledge-base")({
  head: () => ({
    meta: [
      { title: "Knowledge Base — Data Assistant" },
      {
        name: "description",
        content:
          "Quản lý tài liệu tri thức: tải lên, trích xuất văn bản, chia chunk, sinh embedding và lập chỉ mục.",
      },
      { property: "og:title", content: "Knowledge Base — Data Assistant" },
      {
        property: "og:description",
        content: "Theo dõi pipeline xử lý tài liệu từ tải lên tới lập chỉ mục vector.",
      },
    ],
  }),
  component: KnowledgeBasePage,
});

const statusMap: Record<DocFile["status"], { s: "success" | "processing" | "error"; label: string }> =
  {
    ready: { s: "success", label: "Ready" },
    processing: { s: "processing", label: "Processing" },
    failed: { s: "error", label: "Failed" },
  };

const pipeline = [
  { key: "uploaded", label: "Uploaded", desc: "Tệp được tải lên kho lưu trữ an toàn" },
  { key: "extracted", label: "Text extracted", desc: "Trích xuất văn bản và bảng biểu" },
  { key: "chunked", label: "Chunked", desc: "Chia thành đoạn 512 token, overlap 64" },
  { key: "embedded", label: "Embeddings generated", desc: "Vector 1024 chiều cho mỗi đoạn" },
  { key: "indexed", label: "Indexed", desc: "Đưa vào chỉ mục vector phục vụ truy vấn" },
];

function KnowledgeBasePage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<DocFile | null>(null);

  const rows = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(q.toLowerCase()) &&
      (status === "all" || d.status === status),
  );

  const stats = [
    { label: "Tổng tài liệu", value: documents.length, tone: "text-foreground" },
    {
      label: "Đang xử lý",
      value: documents.filter((d) => d.status === "processing").length,
      tone: "text-info",
    },
    {
      label: "Sẵn sàng",
      value: documents.filter((d) => d.status === "ready").length,
      tone: "text-success",
    },
    {
      label: "Thất bại",
      value: documents.filter((d) => d.status === "failed").length,
      tone: "text-destructive",
    },
  ];

  const stepsDone = (d: DocFile) =>
    d.status === "ready" ? 5 : d.status === "processing" ? 3 : 2;

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Knowledge Base"
        subtitle="Kho tài liệu nội bộ phục vụ hỏi đáp RAG · tổng 870 chunks đã lập chỉ mục"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Đã làm mới trạng thái xử lý")}
            >
              <RefreshCw className="size-4" /> Refresh
            </Button>
            <Button size="sm" onClick={() => toast.success("Hộp thoại tải tài liệu đã mở")}>
              <Upload className="size-4" /> Upload Document
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel px-5 py-4">
            <p className="text-[13px] text-muted-foreground">{s.label}</p>
            <p className={cn("mt-1 font-display text-2xl font-semibold text-numeric", s.tone)}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm tài liệu..."
              className="h-9 w-72 pl-8"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-auto text-xs text-muted-foreground">
            {rows.length} tài liệu · nhấn vào dòng để xem chi tiết
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead className="text-right">Pages</TableHead>
              <TableHead className="text-right">Chunks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((d) => (
              <TableRow
                key={d.id}
                className="cursor-pointer"
                onClick={() => setSelected(d)}
              >
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-md border border-border bg-muted">
                      <FileText className="size-4 text-primary" />
                    </span>
                    <span className="font-medium">{d.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{d.type}</TableCell>
                <TableCell className="text-numeric text-right">{d.size}</TableCell>
                <TableCell className="text-numeric text-right">{d.pages}</TableCell>
                <TableCell className="text-numeric text-right">
                  {d.chunks || <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  <StatusPill status={statusMap[d.status].s}>
                    {statusMap[d.status].label}
                  </StatusPill>
                </TableCell>
                <TableCell className="text-numeric text-muted-foreground">{d.uploaded}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setSelected(d)}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive"
                      onClick={() => toast.success(`Đã xoá ${d.name} khỏi kho tri thức`)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" /> {selected.name}
                </SheetTitle>
                <SheetDescription>
                  Chi tiết tài liệu và tiến trình xử lý trong pipeline RAG
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-6">
                <dl className="grid grid-cols-2 gap-3 text-[13px]">
                  {[
                    ["Định dạng", selected.type],
                    ["Dung lượng", selected.size],
                    ["Số trang", String(selected.pages)],
                    ["Số chunks", selected.chunks ? String(selected.chunks) : "—"],
                    ["Ngày tải lên", selected.uploaded],
                    ["Mô hình embedding", "multilingual-e5-large"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-border px-3 py-2">
                      <dt className="text-[11.5px] text-muted-foreground">{k}</dt>
                      <dd className="mt-0.5 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[13px] font-semibold">Processing pipeline</p>
                    <StatusPill status={statusMap[selected.status].s}>
                      {statusMap[selected.status].label}
                    </StatusPill>
                  </div>
                  <Progress value={(stepsDone(selected) / 5) * 100} className="mb-4 h-1.5" />
                  <ol className="relative space-y-4 pl-7">
                    <span className="absolute top-2 bottom-2 left-[11px] w-px bg-border" />
                    {pipeline.map((step, i) => {
                      const done = i < stepsDone(selected);
                      const active = i === stepsDone(selected) && selected.status === "processing";
                      const failed = i === stepsDone(selected) && selected.status === "failed";
                      return (
                        <li key={step.key} className="relative">
                          <span
                            className={cn(
                              "absolute top-0.5 -left-7 flex size-[22px] items-center justify-center rounded-full border",
                              done
                                ? "border-success bg-success text-success-foreground"
                                : active
                                  ? "border-info bg-info/10 text-info"
                                  : failed
                                    ? "border-destructive bg-destructive/10 text-destructive"
                                    : "border-border bg-background text-muted-foreground",
                            )}
                          >
                            {done ? (
                              <Check className="size-3.5" />
                            ) : active ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <CircleDashed className="size-3.5" />
                            )}
                          </span>
                          <p
                            className={cn(
                              "text-[13px] font-medium",
                              !done && !active && !failed && "text-muted-foreground",
                            )}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11.5px] text-muted-foreground">{step.desc}</p>
                          {failed && (
                            <p className="mt-1 font-mono text-[11.5px] text-destructive">
                              ERROR: unsupported embedded font, không trích xuất được văn bản
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.success("Đã đưa tài liệu vào hàng đợi xử lý lại")}
                  >
                    <RefreshCw className="size-4" /> Xử lý lại
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive"
                    onClick={() => {
                      toast.success(`Đã xoá ${selected.name}`);
                      setSelected(null);
                    }}
                  >
                    <Trash2 className="size-4" /> Xoá tài liệu
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
