import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatusPill, SqlCode, EmptyState } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { auditLog, users, type AuditRow } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  CalendarRange,
  Download,
  ScrollText,
  Search,
  Terminal,
  FileText,
  ShieldCheck,
  Clock,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — Data Assistant" },
      {
        name: "description",
        content:
          "Nhật ký truy vết toàn hệ thống: truy vấn SQL, hỏi đáp tài liệu và thao tác quản trị có thể kiểm chứng.",
      },
      { property: "og:title", content: "Audit Log — Data Assistant" },
      {
        property: "og:description",
        content: "Truy vết mọi truy vấn và thao tác quản trị kèm chi tiết thực thi.",
      },
    ],
  }),
  component: AuditLogPage,
});

const tone = (s: AuditRow["status"]) =>
  s === "Success" ? "success" : s === "Warning" ? "warning" : "error";

const typeIcon = { sql: Terminal, rag: FileText, admin: ShieldCheck };

function AuditLogPage() {
  const [q, setQ] = useState("");
  const [user, setUser] = useState("all");
  const [action, setAction] = useState("all");
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState("7d");
  const [selected, setSelected] = useState<AuditRow | null>(null);

  const actions = Array.from(new Set(auditLog.map((a) => a.action)));

  const rows = auditLog.filter(
    (a) =>
      (a.resource.toLowerCase().includes(q.toLowerCase()) ||
        a.action.toLowerCase().includes(q.toLowerCase()) ||
        a.user.toLowerCase().includes(q.toLowerCase())) &&
      (user === "all" || a.user === user) &&
      (action === "all" || a.action === action) &&
      (status === "all" || a.status === status),
  );

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Audit Log"
        subtitle="Mọi truy vấn và thao tác quản trị đều được ghi nhận phục vụ kiểm toán nội bộ"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Đã xuất audit_log_09092026.csv")}
          >
            <Download className="size-4" /> Export log
          </Button>
        }
      />

      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="h-9 w-[170px]">
              <CalendarRange className="size-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 giờ qua</SelectItem>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
            </SelectContent>
          </Select>
          <Select value={user} onValueChange={setUser}>
            <SelectTrigger className="h-9 w-[190px]">
              <SelectValue placeholder="Người dùng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả người dùng</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.name}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả hành động</SelectItem>
              {actions.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Mọi trạng thái</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tài nguyên..."
              className="h-9 w-60 pl-8"
            />
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{rows.length} bản ghi</span>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={ScrollText}
            title="Không có bản ghi nào khớp bộ lọc"
            description="Mở rộng khoảng thời gian hoặc bỏ bớt điều kiện lọc để xem thêm hoạt động."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => {
                const Icon = typeIcon[a.type];
                return (
                  <TableRow
                    key={a.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(a)}
                  >
                    <TableCell className="text-numeric font-mono text-[12.5px]">{a.time}</TableCell>
                    <TableCell className="font-medium">{a.user}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon className="size-3.5 text-muted-foreground" />
                        {a.action}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-[12.5px] text-muted-foreground">
                      {a.resource}
                    </TableCell>
                    <TableCell className="text-numeric text-right text-muted-foreground">
                      {a.duration}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={tone(a.status)}>{a.status}</StatusPill>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selected.action}
                  <StatusPill status={tone(selected.status)}>{selected.status}</StatusPill>
                </SheetTitle>
                <SheetDescription>Chi tiết bản ghi truy vết #{selected.id}</SheetDescription>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-6">
                <dl className="grid grid-cols-2 gap-3 text-[13px]">
                  {[
                    ["Thời điểm", selected.time],
                    ["Người thực hiện", selected.user],
                    ["Tài nguyên", selected.resource],
                    ["Thời gian xử lý", selected.duration],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-border px-3 py-2">
                      <dt className="text-[11.5px] text-muted-foreground">{k}</dt>
                      <dd className="mt-0.5 font-medium break-words">{v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="flex items-center gap-3 text-[11.5px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="size-3.5" /> IP {selected.ip}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" /> Múi giờ Asia/Ho_Chi_Minh
                  </span>
                </p>

                {selected.detail.question && (
                  <div>
                    <p className="mb-1.5 text-[13px] font-semibold">Câu hỏi của người dùng</p>
                    <p className="rounded-lg border border-border bg-muted px-3 py-2 text-[13px]">
                      {selected.detail.question}
                    </p>
                  </div>
                )}

                {selected.type === "sql" && (
                  <>
                    {selected.detail.sql && (
                      <div>
                        <p className="mb-1.5 text-[13px] font-semibold">SQL đã sinh</p>
                        <div className="overflow-hidden rounded-lg border border-border">
                          <SqlCode code={selected.detail.sql} />
                        </div>
                      </div>
                    )}
                    {selected.detail.attempts && (
                      <div>
                        <p className="mb-1.5 text-[13px] font-semibold">Quá trình tự sửa lỗi</p>
                        <ul className="space-y-2">
                          {selected.detail.attempts.map((at) => (
                            <li
                              key={at.n}
                              className="flex items-start gap-2 rounded-lg border border-border px-3 py-2"
                            >
                              <Badge variant="secondary">Attempt {at.n}</Badge>
                              <span className="flex-1 text-[12.5px] text-muted-foreground">
                                {at.note}
                              </span>
                              <StatusPill status={at.ok ? "success" : "error"}>
                                {at.ok ? "Success" : "Failed"}
                              </StatusPill>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selected.detail.result && (
                      <div>
                        <p className="mb-1.5 text-[13px] font-semibold">Kết quả thực thi</p>
                        <p className="rounded-lg border border-border bg-muted px-3 py-2 text-[13px]">
                          {selected.detail.result}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {selected.type === "rag" && (
                  <>
                    {selected.detail.docs && (
                      <div>
                        <p className="mb-1.5 text-[13px] font-semibold">Tài liệu truy xuất</p>
                        <ul className="space-y-2">
                          {selected.detail.docs.map((d, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-[12.5px]"
                            >
                              <FileText className="size-3.5 text-primary" />
                              <span className="flex-1">
                                {d.name}{" "}
                                <span className="text-muted-foreground">— Page {d.page}</span>
                              </span>
                              <span className="text-numeric rounded bg-success/10 px-1.5 py-0.5 text-[11px] font-medium text-success">
                                {d.score.toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selected.detail.answer && (
                      <div>
                        <p className="mb-1.5 text-[13px] font-semibold">Câu trả lời đã gửi</p>
                        <p className="rounded-lg border border-border bg-muted px-3 py-2 text-[13px]">
                          {selected.detail.answer}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {selected.detail.changes && (
                  <div>
                    <p className="mb-1.5 text-[13px] font-semibold">Thay đổi ghi nhận</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trường</TableHead>
                          <TableHead>Trước</TableHead>
                          <TableHead>Sau</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.detail.changes.map((c) => (
                          <TableRow key={c.field}>
                            <TableCell className="font-mono text-[12.5px]">{c.field}</TableCell>
                            <TableCell className="text-muted-foreground">{c.from}</TableCell>
                            <TableCell className="font-medium">{c.to}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
