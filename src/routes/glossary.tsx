import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatusPill, EmptyState } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { glossary as seed, type GlossaryTerm } from "@/lib/mock-data";
import { toast } from "sonner";
import { BookMarked, Pencil, Plus, Search, Trash2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "Business Glossary — Data Assistant" },
      {
        name: "description",
        content:
          "Từ điển nghiệp vụ ánh xạ thuật ngữ tiếng Việt sang cột dữ liệu và điều kiện lọc cho Text-to-SQL.",
      },
      { property: "og:title", content: "Business Glossary — Data Assistant" },
      {
        property: "og:description",
        content: "Chuẩn hoá thuật ngữ kinh doanh để trợ lý sinh SQL hiểu đúng ngữ nghĩa.",
      },
    ],
  }),
  component: GlossaryPage,
});

const tone = (s: GlossaryTerm["status"]) =>
  s === "Approved" ? "success" : s === "Review" ? "warning" : "neutral";

const empty = {
  id: "",
  term: "",
  definition: "",
  synonyms: "",
  mapping: "",
  conditions: "",
  examples: "",
  status: "Draft" as GlossaryTerm["status"],
};

function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>(seed);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(empty);

  const rows = terms.filter(
    (t) =>
      (t.term.toLowerCase().includes(q.toLowerCase()) ||
        t.definition.toLowerCase().includes(q.toLowerCase()) ||
        t.synonyms.join(" ").toLowerCase().includes(q.toLowerCase())) &&
      (status === "all" || t.status === status),
  );

  const save = () => {
    if (!draft.term.trim() || !draft.definition.trim()) {
      toast.error("Vui lòng nhập thuật ngữ và định nghĩa");
      return;
    }
    const payload: GlossaryTerm = {
      id: draft.id || `g${Date.now()}`,
      term: draft.term,
      definition: draft.definition,
      synonyms: draft.synonyms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      mapping: draft.mapping,
      conditions: draft.conditions,
      status: draft.status,
      owner: "Phòng Phân tích",
    };
    setTerms((t) =>
      draft.id ? t.map((x) => (x.id === draft.id ? payload : x)) : [payload, ...t],
    );
    toast.success(draft.id ? `Đã cập nhật “${payload.term}”` : `Đã thêm thuật ngữ “${payload.term}”`);
    setOpen(false);
  };

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Business Glossary"
        subtitle="Ánh xạ thuật ngữ nghiệp vụ tiếng Việt sang cấu trúc dữ liệu để trợ lý sinh SQL hiểu đúng ngữ nghĩa"
        actions={
          <Button
            size="sm"
            onClick={() => {
              setDraft(empty);
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Thêm thuật ngữ
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tổng thuật ngữ", value: terms.length, note: "Trong từ điển nghiệp vụ" },
          {
            label: "Đã phê duyệt",
            value: terms.filter((t) => t.status === "Approved").length,
            note: "Được dùng trong sinh SQL",
          },
          {
            label: "Chờ rà soát",
            value: terms.filter((t) => t.status !== "Approved").length,
            note: "Cần chủ sở hữu xác nhận",
          },
          {
            label: "Từ đồng nghĩa",
            value: terms.reduce((s, t) => s + t.synonyms.length, 0),
            note: "Tăng độ phủ ngữ nghĩa",
          },
        ].map((c) => (
          <div key={c.label} className="panel px-5 py-4">
            <p className="text-[13px] text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-numeric">{c.value}</p>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">{c.note}</p>
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
              placeholder="Tìm thuật ngữ, định nghĩa hoặc từ đồng nghĩa..."
              className="h-9 w-80 pl-8"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-auto text-xs text-muted-foreground">{rows.length} thuật ngữ</span>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={BookMarked}
            title="Chưa có thuật ngữ phù hợp"
            description="Thêm thuật ngữ nghiệp vụ để trợ lý hiểu cách doanh nghiệp bạn gọi tên các chỉ số."
            action={
              <Button
                size="sm"
                onClick={() => {
                  setDraft(empty);
                  setOpen(true);
                }}
              >
                <Plus className="size-4" /> Thêm thuật ngữ
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-52">Term</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead>Synonyms</TableHead>
                <TableHead>Database Mapping</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id} className="align-top">
                  <TableCell>
                    <p className="font-medium">{t.term}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">{t.owner}</p>
                  </TableCell>
                  <TableCell className="max-w-xs text-muted-foreground">{t.definition}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.synonyms.map((s) => (
                        <Badge key={s} variant="secondary" className="font-normal">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="block rounded bg-muted px-1.5 py-1 font-mono text-[11.5px]">
                      {t.mapping}
                    </code>
                    {t.conditions && (
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                        WHERE {t.conditions}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={tone(t.status)}>{t.status}</StatusPill>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => {
                          setDraft({
                            id: t.id,
                            term: t.term,
                            definition: t.definition,
                            synonyms: t.synonyms.join(", "),
                            mapping: t.mapping,
                            conditions: t.conditions,
                            examples: "",
                            status: t.status,
                          });
                          setOpen(true);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive"
                        onClick={() => {
                          setTerms((cur) => cur.filter((x) => x.id !== t.id));
                          toast.success(`Đã xoá thuật ngữ “${t.term}”`);
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="panel flex items-start gap-3 border-primary/25 bg-accent/60 p-4">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-[13px] text-muted-foreground">
          Thuật ngữ ở trạng thái <span className="font-medium text-foreground">Approved</span> sẽ
          được nạp vào ngữ cảnh của mô hình sinh SQL. Ví dụ khi người dùng hỏi “DT tháng 8”, hệ
          thống tự hiểu là <code className="font-mono text-foreground">SUM(orders.total_amount)</code>{" "}
          với điều kiện <code className="font-mono text-foreground">status = &apos;COMPLETED&apos;</code>.
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Chỉnh sửa thuật ngữ" : "Thêm thuật ngữ nghiệp vụ"}</DialogTitle>
            <DialogDescription>
              Mô tả càng rõ, trợ lý sinh SQL càng hiểu đúng ý định của người dùng.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Thuật ngữ</Label>
                <Input
                  value={draft.term}
                  onChange={(e) => setDraft({ ...draft, term: e.target.value })}
                  placeholder="Doanh thu"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Trạng thái</Label>
                <Select
                  value={draft.status}
                  onValueChange={(v) =>
                    setDraft({ ...draft, status: v as GlossaryTerm["status"] })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Định nghĩa</Label>
              <Textarea
                rows={2}
                value={draft.definition}
                onChange={(e) => setDraft({ ...draft, definition: e.target.value })}
                placeholder="Tổng giá trị tiền của các đơn hàng hoàn tất."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Từ đồng nghĩa (phân tách bằng dấu phẩy)</Label>
              <Input
                value={draft.synonyms}
                onChange={(e) => setDraft({ ...draft, synonyms: e.target.value })}
                placeholder="DT, Revenue, Sales"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Ánh xạ dữ liệu</Label>
                <Input
                  className="font-mono text-[12.5px]"
                  value={draft.mapping}
                  onChange={(e) => setDraft({ ...draft, mapping: e.target.value })}
                  placeholder="orders.total_amount"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Quy tắc nghiệp vụ / điều kiện</Label>
                <Input
                  className="font-mono text-[12.5px]"
                  value={draft.conditions}
                  onChange={(e) => setDraft({ ...draft, conditions: e.target.value })}
                  placeholder="orders.status = 'COMPLETED'"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Ví dụ câu hỏi thường gặp</Label>
              <Textarea
                rows={2}
                value={draft.examples}
                onChange={(e) => setDraft({ ...draft, examples: e.target.value })}
                placeholder="Doanh thu quý 3 là bao nhiêu? / DT theo ngành hàng năm nay?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={save}>{draft.id ? "Lưu thay đổi" : "Thêm thuật ngữ"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
