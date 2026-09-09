import {
  LayoutDashboard,
  Terminal,
  BarChart3,
  FileSearch,
  Users,
  Database,
  Library,
  BookMarked,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  vi: string;
  icon: LucideIcon;
  badge?: string;
};

export const navGroups: { group: string; items: NavItem[] }[] = [
  {
    group: "Analytics",
    items: [
      { to: "/overview", label: "Overview", vi: "Tổng quan", icon: LayoutDashboard },
      { to: "/text-to-sql", label: "Text-to-SQL", vi: "Trợ lý dữ liệu", icon: Terminal, badge: "AI" },
      { to: "/dashboard", label: "Dashboard", vi: "Báo cáo kinh doanh", icon: BarChart3 },
    ],
  },
  {
    group: "Knowledge",
    items: [
      { to: "/document-qa", label: "Document Q&A", vi: "Hỏi đáp tài liệu", icon: FileSearch, badge: "RAG" },
    ],
  },
  {
    group: "Administration",
    items: [
      { to: "/users", label: "Users", vi: "Người dùng", icon: Users },
      { to: "/data-sources", label: "Data Sources", vi: "Nguồn dữ liệu", icon: Database },
      { to: "/knowledge-base", label: "Knowledge Base", vi: "Kho tri thức", icon: Library },
      { to: "/glossary", label: "Glossary", vi: "Từ điển nghiệp vụ", icon: BookMarked },
      { to: "/audit-log", label: "Audit Log", vi: "Nhật ký truy vết", icon: ScrollText },
    ],
  },
];

export const routeMeta: Record<string, { title: string; group: string; subtitle: string }> = {
  "/overview": { title: "Overview", group: "Analytics", subtitle: "Tình trạng hệ thống và hoạt động gần đây" },
  "/text-to-sql": { title: "Text-to-SQL Assistant", group: "Analytics", subtitle: "Đặt câu hỏi bằng tiếng Việt, nhận SQL và kết quả" },
  "/dashboard": { title: "Business Dashboard", group: "Analytics", subtitle: "Chỉ số kinh doanh theo thời gian thực" },
  "/document-qa": { title: "Document Assistant", group: "Knowledge", subtitle: "Hỏi đáp trên tài liệu nội bộ có trích dẫn nguồn" },
  "/users": { title: "User Management", group: "Administration", subtitle: "Quản lý tài khoản và phân quyền" },
  "/data-sources": { title: "Data Sources", group: "Administration", subtitle: "Kết nối cơ sở dữ liệu và khám phá lược đồ" },
  "/knowledge-base": { title: "Knowledge Base", group: "Administration", subtitle: "Tài liệu, xử lý và lập chỉ mục" },
  "/glossary": { title: "Business Glossary", group: "Administration", subtitle: "Ánh xạ thuật ngữ nghiệp vụ sang cấu trúc dữ liệu" },
  "/audit-log": { title: "Audit Log", group: "Administration", subtitle: "Truy vết mọi hành động trên hệ thống" },
};
