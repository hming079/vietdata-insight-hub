import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, StatusPill } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { dataSources as seedSources, schema, relationships, type DataSource } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Database,
  Plus,
  Plug,
  Pencil,
  Trash2,
  Table2,
  KeyRound,
  Link2,
  ServerCog,
  Network,
} from "lucide-react";

export const Route = createFileRoute("/data-sources")({
  head: () => ({
    meta: [
      { title: "Data Sources & Schema — Data Assistant" },
      {
        name: "description",
        content:
          "Quản lý kết nối cơ sở dữ liệu doanh nghiệp và khám phá lược đồ bảng, cột, khoá và quan hệ.",
      },
      { property: "og:title", content: "Data Sources & Schema — Data Assistant" },
      {
        property: "og:description",
        content: "Kết nối PostgreSQL, SQL Server, MySQL, BigQuery và duyệt lược đồ dữ liệu.",
      },
    ],
  }),
  component: DataSourcesPage,
});

const tone = (s: DataSource["status"]) =>
  s === "Connected" ? "success" : s === "Syncing" ? "processing" : "error";

function DataSourcesPage() {
  const [sources, setSources] = useState(seedSources);
  const [open, setOpen] = useState(false);
  const [schemaFor, setSchemaFor] = useState<string | null>(null);
  const [table, setTable] = useState("orders");
  const [form, setForm] = useState({
    engine: "PostgreSQL",
    name: "",
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: "",
  });

  const selected = schema[table]!;

  const add = () => {
    if (!form.name || !form.host || !form.database) {
      toast.error("Vui lòng điền tên, host và tên cơ sở dữ liệu");
      return;
    }
    setSources((s) => [
      {
        id: `ds${Date.now()}`,
        name: form.name,
        engine: form.engine as DataSource["engine"],
        description: "Nguồn dữ liệu mới thêm",
        host: form.host,
        database: form.database,
        tables: 0,
        status: "Syncing",
        lastSync: "Đang đồng bộ lần đầu",
      },
      ...s,
    ]);
    setOpen(false);
    toast.success(`Đã thêm nguồn dữ liệu ${form.name}`);
  };

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Data Sources"
        subtitle="Kết nối cơ sở dữ liệu doanh nghiệp và khám phá lược đồ phục vụ Text-to-SQL"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Kiểm tra kết nối: 3/4 nguồn phản hồi tốt")}
            >
              <Plug className="size-4" /> Test all connections
            </Button>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-4" /> Add Data Source
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {sources.map((d) => (
          <div key={d.id} className="panel flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted">
                  <Database className="size-[18px] text-primary" />
                </span>
                <div className="leading-tight">
                  <p className="text-[14px] font-semibold">{d.name}</p>
                  <p className="text-[11.5px] text-muted-foreground">{d.engine}</p>
                </div>
              </div>
              <StatusPill status={tone(d.status)}>{d.status}</StatusPill>
            </div>
            <p className="mt-3 text-[12.5px] text-muted-foreground">{d.description}</p>
            <dl className="mt-3 space-y-1 border-t border-border pt-3 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Host</dt>
                <dd className="font-mono">{d.host}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Database</dt>
                <dd className="font-mono">{d.database}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Bảng</dt>
                <dd className="text-numeric">{d.tables} tables</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Đồng bộ</dt>
                <dd className="text-numeric">{d.lastSync}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSchemaFor(d.id);
                  toast("Đang tải lược đồ " + d.name);
                }}
              >
                <Table2 className="size-3.5" /> View Schema
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.success(`Kết nối tới ${d.name} thành công (82 ms)`)}
              >
                <Plug className="size-3.5" /> Test
              </Button>
              <Button variant="ghost" size="icon" className="size-8">
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive"
                onClick={() => {
                  setSources((s) => s.filter((x) => x.id !== d.id));
                  toast.success(`Đã xoá ${d.name}`);
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Schema explorer */}
      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <Panel
          title="Schema Explorer"
          description={
            sources.find((s) => s.id === schemaFor)?.name ?? "Retail Database · schema public"
          }
          bodyClassName="p-3"
        >
          <div className="mb-2 flex items-center gap-2 px-2 text-[12px] font-medium text-muted-foreground">
            <ServerCog className="size-3.5" /> retail_prod
          </div>
          <ul className="space-y-0.5">
            {Object.entries(schema).map(([name, t], i, arr) => (
              <li key={name} className="relative pl-4">
                <span className="absolute top-0 bottom-0 left-1 w-px bg-border" />
                {i === arr.length - 1 && (
                  <span className="absolute top-4 bottom-0 left-1 w-px bg-surface" />
                )}
                <span className="absolute top-4 left-1 h-px w-2 bg-border" />
                <button
                  onClick={() => setTable(name)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors",
                    table === name
                      ? "bg-accent font-medium text-accent-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <Table2 className="size-3.5 text-muted-foreground" />
                  <span className="flex-1 truncate font-mono text-[12.5px]">{name}</span>
                  <span className="text-numeric text-[11px] text-muted-foreground">{t.rows}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel
            title={
              <span className="font-mono">
                {table}
                <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">
                  {selected.rows} dòng
                </span>
              </span>
            }
            description={selected.desc}
            actions={
              <Badge variant="secondary">{selected.columns.length} cột</Badge>
            }
            bodyClassName="p-0"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Data type</TableHead>
                  <TableHead>Keys</TableHead>
                  <TableHead>Nullable</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.columns.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell className="font-mono text-[12.5px] font-medium">{c.name}</TableCell>
                    <TableCell className="font-mono text-[12.5px] text-muted-foreground">
                      {c.type}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        {c.pk && (
                          <span className="inline-flex items-center gap-1 rounded border border-warning/35 bg-warning/15 px-1.5 py-0.5 text-[11px] font-medium text-warning-foreground">
                            <KeyRound className="size-3" /> PK
                          </span>
                        )}
                        {c.fk && (
                          <span className="inline-flex items-center gap-1 rounded border border-info/25 bg-info/10 px-1.5 py-0.5 text-[11px] font-medium text-info">
                            <Link2 className="size-3" /> {c.fk}
                          </span>
                        )}
                        {!c.pk && !c.fk && <span className="text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.nullable ? "YES" : "NO"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>

          <Panel
            title="Table Relationships"
            description="Quan hệ khoá ngoại giữa các bảng trong lược đồ"
          >
            <div className="space-y-3">
              {relationships.map((r) => (
                <div
                  key={r.from}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
                >
                  <span className="rounded-md bg-muted px-2 py-1 font-mono text-[12px]">
                    {r.from}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Network className="size-3.5" /> {r.type}
                  </span>
                  <span className="h-px min-w-8 flex-1 bg-border" />
                  <span className="rounded-md bg-muted px-2 py-1 font-mono text-[12px]">
                    {r.to}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Các quan hệ này được dùng để sinh mệnh đề JOIN tự động trong module Text-to-SQL.
            </p>
          </Panel>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Data Source</DialogTitle>
            <DialogDescription>
              Thông tin đăng nhập được mã hoá và lưu trong kho bí mật của hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Loại cơ sở dữ liệu</Label>
              <Select
                value={form.engine}
                onValueChange={(v) => setForm({ ...form, engine: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                  <SelectItem value="SQL Server">SQL Server</SelectItem>
                  <SelectItem value="MySQL">MySQL</SelectItem>
                  <SelectItem value="BigQuery">BigQuery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tên hiển thị</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Retail Database"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Host</Label>
              <Input
                value={form.host}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
                placeholder="10.0.4.21"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Port</Label>
              <Input
                value={form.port}
                onChange={(e) => setForm({ ...form, port: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tên cơ sở dữ liệu</Label>
              <Input
                value={form.database}
                onChange={(e) => setForm({ ...form, database: e.target.value })}
                placeholder="retail_prod"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="analytics_ro"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => toast.success("Kết nối thử nghiệm thành công (96 ms)")}
            >
              <Plug className="size-4" /> Test Connection
            </Button>
            <Button onClick={add}>Lưu nguồn dữ liệu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
