import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/kit";
import { documents, citations, pdfPages, type Citation } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  FileText,
  Upload,
  Search,
  Send,
  Paperclip,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Quote,
  BookOpen,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/document-qa")({
  head: () => ({
    meta: [
      { title: "Document Q&A — Data Assistant" },
      {
        name: "description",
        content:
          "Hỏi đáp tài liệu nội bộ bằng tiếng Việt với trích dẫn nguồn, điểm liên quan và xem trước PDF.",
      },
      { property: "og:title", content: "Document Q&A — Data Assistant" },
      {
        property: "og:description",
        content: "Trả lời có trích dẫn từ tài liệu nội bộ, kèm xem trước trang PDF.",
      },
    ],
  }),
  component: DocumentQaPage,
});

const statusMap = {
  ready: { s: "success" as const, label: "Sẵn sàng" },
  processing: { s: "processing" as const, label: "Đang xử lý" },
  failed: { s: "error" as const, label: "Lỗi" },
};

function DocumentQaPage() {
  const [activeDoc, setActiveDoc] = useState("d1");
  const [activeCitation, setActiveCitation] = useState<Citation>(citations[0]);
  const [page, setPage] = useState(12);
  const [zoom, setZoom] = useState(100);
  const [q, setQ] = useState("");
  const [docFilter, setDocFilter] = useState("");
  const [pending, setPending] = useState(false);

  const pageContent = pdfPages[page];
  const docList = documents.filter((d) =>
    d.name.toLowerCase().includes(docFilter.toLowerCase()),
  );

  const openCitation = (c: Citation) => {
    setActiveCitation(c);
    setPage(c.page);
    const doc = documents.find((d) => d.name === c.doc);
    if (doc) setActiveDoc(doc.id);
  };

  const ask = () => {
    if (!q.trim()) return;
    setPending(true);
    setQ("");
    toast("Đang tìm kiếm trong 4 tài liệu đã lập chỉ mục...");
    setTimeout(() => setPending(false), 1800);
  };

  return (
    <div className="flex h-full min-h-0">
      {/* ---------------------------- Documents ---------------------------- */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-surface">
        <div className="space-y-3 border-b border-border p-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold">Tài liệu ({documents.length})</p>
            <Badge variant="secondary">4 sẵn sàng</Badge>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={docFilter}
              onChange={(e) => setDocFilter(e.target.value)}
              placeholder="Tìm tài liệu..."
              className="h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-[13px] outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => toast.success("Hộp thoại tải tài liệu đã mở")}
          >
            <Upload className="size-3.5" /> Upload Document
          </Button>
        </div>

        <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {docList.map((d) => {
              const st = statusMap[d.status];
              return (
                <li key={d.id}>
                  <button
                    onClick={() => setActiveDoc(d.id)}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors",
                      activeDoc === d.id
                        ? "border-primary/25 bg-accent"
                        : "border-transparent hover:bg-muted",
                    )}
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                      <FileText
                        className={cn(
                          "size-4",
                          d.status === "failed" ? "text-destructive" : "text-primary",
                        )}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{d.name}</span>
                      <span className="mt-0.5 block text-[11.5px] text-muted-foreground">
                        {d.pages} trang · {d.size}
                      </span>
                      <span className="mt-1.5 block">
                        <StatusPill status={st.s}>{st.label}</StatusPill>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t border-border px-3 py-2.5 text-[11.5px] text-muted-foreground">
          Chỉ mục vector: 870 chunks · cập nhật 14:20
        </div>
      </aside>

      {/* ------------------------------ Chat ------------------------------- */}
      <section className="flex min-w-0 flex-1 flex-col border-r border-border">
        <div className="flex items-center gap-3 border-b border-border bg-surface px-5 py-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4" />
          </span>
          <div className="mr-auto">
            <h1 className="font-display text-[15px] font-semibold">Document Assistant</h1>
            <p className="text-[11.5px] text-muted-foreground">
              Trả lời dựa trên tài liệu nội bộ, luôn kèm trích dẫn nguồn
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="size-3.5" /> Phạm vi: 4 tài liệu
          </Button>
        </div>

        <div className="scrollbar-slim min-h-0 flex-1 space-y-5 overflow-y-auto bg-background px-5 py-5">
          <div className="flex justify-end">
            <div className="max-w-lg rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[14px] text-primary-foreground shadow-card">
              Chính sách đổi trả sản phẩm trong bao lâu?
            </div>
          </div>

          <div className="flex gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="space-y-2.5 text-[14px] leading-relaxed">
                <p>
                  Theo quy định hiện hành, khách hàng được yêu cầu đổi sản phẩm{" "}
                  <strong>trong vòng 07 ngày</strong> kể từ ngày nhận hàng, với điều kiện sản phẩm
                  còn nguyên tem nhãn, chưa qua sử dụng và có hoá đơn hợp lệ.{" "}
                  <CitationChip c={citations[0]} onClick={openCitation} active={activeCitation.id === 1} />
                </p>
                <p>
                  Riêng sản phẩm điện tử có giá trị trên 10.000.000 VNĐ, thời hạn được kéo dài lên{" "}
                  <strong>15 ngày</strong> và phải kèm biên bản kiểm tra kỹ thuật của trung tâm bảo
                  hành uỷ quyền.{" "}
                  <CitationChip c={citations[1]} onClick={openCitation} active={activeCitation.id === 2} />
                </p>
                <p>
                  Bộ phận Chăm sóc khách hàng phải phản hồi yêu cầu đổi trả trong vòng 24 giờ làm
                  việc và cập nhật trạng thái trên hệ thống CRM.{" "}
                  <CitationChip c={citations[2]} onClick={openCitation} active={activeCitation.id === 3} />
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[11.5px] text-muted-foreground">
                <StatusPill status="success">3 nguồn trích dẫn</StatusPill>
                <span>Độ tin cậy trung bình 0.84</span>
                <span className="text-border">|</span>
                <span>Thời gian phản hồi 1.8 s</span>
              </div>
            </div>
          </div>

          {pending && (
            <div className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </span>
              <div className="flex-1 rounded-xl border border-border bg-surface p-4">
                <StatusPill status="processing">Đang truy xuất đoạn văn liên quan...</StatusPill>
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-surface p-4">
          <div className="rounded-xl border border-border bg-background p-2 shadow-card focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask();
                }
              }}
              rows={2}
              placeholder="Hỏi về nội dung tài liệu nội bộ..."
              className="w-full resize-none bg-transparent px-2.5 py-1.5 text-[14px] outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-2 px-1">
              <Button variant="ghost" size="sm">
                <Paperclip className="size-3.5" /> Đính kèm
              </Button>
              <span className="ml-auto text-[11px] text-muted-foreground">
                Câu trả lời luôn kèm trích dẫn
              </span>
              <Button size="sm" onClick={ask} disabled={!q.trim()}>
                <Send className="size-3.5" /> Gửi
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------- Citations + PDF preview -------------------- */}
      <aside className="flex w-[420px] shrink-0 flex-col bg-surface">
        <div className="border-b border-border px-4 py-3">
          <p className="text-[13px] font-semibold">Nguồn trích dẫn</p>
          <p className="text-[11.5px] text-muted-foreground">
            Nhấn vào nguồn để nhảy tới trang tương ứng
          </p>
        </div>

        <div className="scrollbar-slim max-h-[38%] space-y-2 overflow-y-auto border-b border-border p-3">
          {citations.map((c) => (
            <button
              key={c.id}
              onClick={() => openCitation(c)}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                activeCitation.id === c.id
                  ? "border-primary/40 bg-accent"
                  : "border-border hover:bg-muted",
              )}
            >
              <div className="flex items-center gap-2">
                <Quote className="size-3.5 text-primary" />
                <span className="text-[12.5px] font-semibold">Source {c.id}</span>
                <span className="ml-auto rounded-md bg-success/10 px-1.5 py-0.5 text-[11px] font-medium text-success text-numeric">
                  {c.score.toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] font-medium">
                {c.doc} <span className="text-muted-foreground">— Page {c.page}</span>
              </p>
              <p className="mt-1 line-clamp-3 text-[12px] text-muted-foreground">“{c.excerpt}”</p>
            </button>
          ))}
        </div>

        {/* PDF viewer */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-1 border-b border-border px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-numeric rounded-md border border-border bg-background px-2 py-1 text-[12px]">
              {page} / 48
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setPage((p) => Math.min(48, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
            <div className="mx-1 h-5 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setZoom((z) => Math.max(70, z - 10))}
            >
              <ZoomOut className="size-4" />
            </Button>
            <span className="text-numeric w-11 text-center text-[12px]">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
            >
              <ZoomIn className="size-4" />
            </Button>
            <div className="mx-1 h-5 w-px bg-border" />
            <Button variant="ghost" size="icon" className="size-8">
              <Search className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="ml-auto size-8">
              <Maximize2 className="size-4" />
            </Button>
          </div>

          <div className="scrollbar-slim min-h-0 flex-1 overflow-auto bg-muted p-4">
            <div
              className="mx-auto rounded-md border border-border bg-surface p-6 shadow-raised"
              style={{ width: `${zoom}%`, minWidth: 280 }}
            >
              <p className="mb-3 border-b border-border pb-2 text-[10.5px] tracking-wide text-muted-foreground uppercase">
                {documents.find((d) => d.id === activeDoc)?.name ?? "Policy_2026.pdf"} · Trang{" "}
                {page}
              </p>
              {pageContent ? (
                <>
                  <h3 className="font-display text-[14px] font-semibold">{pageContent.title}</h3>
                  <div className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-foreground/90">
                    {pageContent.paragraphs.map((p, i) => (
                      <p key={i}>{renderHighlighted(p, pageContent.highlight)}</p>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-2 py-6">
                  <div className="h-3 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-5/6 rounded bg-muted" />
                  <div className="h-3 w-4/6 rounded bg-muted" />
                  <p className="pt-4 text-center text-[12px] text-muted-foreground">
                    Trang {page} không nằm trong phạm vi trích dẫn hiện tại.
                  </p>
                </div>
              )}
              <p className="mt-6 border-t border-border pt-2 text-center text-[10.5px] text-muted-foreground">
                Tài liệu nội bộ — Lưu hành trong Công ty · Trang {page}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function CitationChip({
  c,
  onClick,
  active,
}: {
  c: Citation;
  onClick: (c: Citation) => void;
  active: boolean;
}) {
  return (
    <button
      onClick={() => onClick(c)}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 align-baseline text-[11.5px] font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-primary/30 bg-primary/8 text-primary hover:bg-primary/15",
      )}
    >
      [{c.id}] {c.doc} — Page {c.page}
    </button>
  );
}

function renderHighlighted(text: string, highlight?: string) {
  if (!highlight || !text.includes(highlight)) return text;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <mark className="rounded bg-highlight/70 px-0.5 text-foreground">{highlight}</mark>
      {after}
    </>
  );
}
