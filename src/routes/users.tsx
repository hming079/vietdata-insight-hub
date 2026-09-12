import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatusPill, EmptyState } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { users as seedUsers, permissionList, rolePermissions, type UserRow } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRoundX,
  Users as UsersIcon,
} from "lucide-react";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "User Management — Data Assistant" },
      {
        name: "description",
        content: "Quản lý tài khoản người dùng, vai trò Admin/Analyst/Viewer và quyền truy cập hệ thống.",
      },
      { property: "og:title", content: "User Management — Data Assistant" },
      {
        property: "og:description",
        content: "Tài khoản, vai trò và ma trận quyền truy cập của nền tảng dữ liệu.",
      },
    ],
  }),
  component: UsersPage,
});

const statusOf = (s: UserRow["status"]) =>
  s === "Active" ? "success" : s === "Pending" ? "processing" : "neutral";

const roleTone: Record<UserRow["role"], string> = {
  Admin: "border-primary/25 bg-primary/10 text-primary",
  Analyst: "border-info/25 bg-info/10 text-info",
  Viewer: "border-border bg-muted text-muted-foreground",
};

const emptyDraft = {
  id: "",
  name: "",
  email: "",
  role: "Analyst" as UserRow["role"],
  status: "Active" as UserRow["status"],
};

function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>(seedUsers);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [perms, setPerms] = useState<string[]>((rolePermissions["Analyst"] ?? []));

  const filtered = rows.filter(
    (u) =>
      (u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase())) &&
      (role === "all" || u.role === role) &&
      (status === "all" || u.status === status),
  );

  const openNew = () => {
    setDraft(emptyDraft);
    setPerms((rolePermissions["Analyst"] ?? []));
    setOpen(true);
  };

  const openEdit = (u: UserRow) => {
    setDraft({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status });
    setPerms((rolePermissions[u.role] ?? []));
    setOpen(true);
  };

  const save = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      toast.error("Vui lòng nhập họ tên và email");
      return;
    }
    if (draft.id) {
      setRows((r) => r.map((u) => (u.id === draft.id ? { ...u, ...draft } : u)));
      toast.success(`Đã cập nhật người dùng ${draft.name}`);
    } else {
      setRows((r) => [
        {
          ...draft,
          id: `u${Date.now()}`,
          lastActive: "Chưa đăng nhập",
          created: "09/09/2026",
          initials: draft.name
            .trim()
            .split(" ")
            .slice(-2)
            .map((w) => w[0])
            .join("")
            .toUpperCase(),
        },
        ...r,
      ]);
      toast.success(`Đã tạo người dùng ${draft.name}`);
    }
    setOpen(false);
  };

  const remove = (u: UserRow) => {
    setRows((r) => r.filter((x) => x.id !== u.id));
    toast.success(`Đã xoá ${u.name}`);
  };

  const counts = {
    total: rows.length,
    admin: rows.filter((r) => r.role === "Admin").length,
    active: rows.filter((r) => r.status === "Active").length,
    pending: rows.filter((r) => r.status === "Pending").length,
  };

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="User Management"
        subtitle="Quản lý tài khoản, vai trò và quyền truy cập của nền tảng dữ liệu"
        actions={
          <Button size="sm" onClick={openNew}>
            <Plus className="size-4" /> Add User
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tổng người dùng", value: counts.total, note: "Toàn hệ thống" },
          { label: "Quản trị viên", value: counts.admin, note: "Toàn quyền hệ thống" },
          { label: "Đang hoạt động", value: counts.active, note: "Đăng nhập 30 ngày qua" },
          { label: "Chờ kích hoạt", value: counts.pending, note: "Chưa xác thực email" },
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
              placeholder="Tìm theo tên hoặc email..."
              className="h-9 w-72 pl-8"
            />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Analyst">Analyst</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} / {rows.length} người dùng
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={UserRoundX}
            title="Không tìm thấy người dùng phù hợp"
            description="Thử xoá bớt bộ lọc hoặc tìm bằng địa chỉ email công ty."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQ("");
                  setRole("all");
                  setStatus("all");
                }}
              >
                Xoá bộ lọc
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                        {u.initials}
                      </span>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${roleTone[u.role]}`}
                    >
                      {u.role === "Admin" && <ShieldCheck className="size-3" />}
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusPill status={statusOf(u.status)}>{u.status}</StatusPill>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.lastActive}</TableCell>
                  <TableCell className="text-numeric text-muted-foreground">{u.created}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(u)}>
                          <Pencil className="size-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Đã gửi lại email kích hoạt")}>
                          <UsersIcon className="size-4" /> Gửi lại lời mời
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => remove(u)}
                        >
                          <Trash2 className="size-4" /> Xoá người dùng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
            <DialogDescription>
              Thông tin tài khoản và quyền truy cập sẽ có hiệu lực ngay sau khi lưu.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Họ và tên</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email công ty</Label>
              <Input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                placeholder="a.nguyen@vietretail.vn"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Vai trò</Label>
              <Select
                value={draft.role}
                onValueChange={(v) => {
                  setDraft({ ...draft, role: v as UserRow["role"] });
                  setPerms((rolePermissions[v] ?? []));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as UserRow["status"] })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold">Quyền truy cập</p>
                <p className="text-[11.5px] text-muted-foreground">
                  Mặc định theo vai trò, có thể tuỳ chỉnh riêng cho từng người dùng
                </p>
              </div>
              <Badge variant="secondary">{perms.length}/{permissionList.length} quyền</Badge>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {permissionList.map((p) => (
                <label
                  key={p.key}
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border px-3 py-2 hover:bg-muted"
                >
                  <Checkbox
                    checked={perms.includes(p.key)}
                    onCheckedChange={(v) =>
                      setPerms((cur) =>
                        v ? [...cur, p.key] : cur.filter((k) => k !== p.key),
                      )
                    }
                    className="mt-0.5"
                  />
                  <span className="leading-tight">
                    <span className="block text-[13px] font-medium">{p.label}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{p.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={save}>{draft.id ? "Lưu thay đổi" : "Tạo người dùng"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
