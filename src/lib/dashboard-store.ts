import { useSyncExternalStore } from "react";

export type WidgetType =
  | "kpis"
  | "revenue-time"
  | "revenue-category"
  | "top-products"
  | "orders-region"
  | "query-volume";

export type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  span: 1 | 2 | 3;
  hidden?: boolean;
};

export type Dashboard = {
  id: string;
  name: string;
  description: string;
  owner: string;
  scope: "Template" | "Cá nhân";
  isDefault: boolean;
  updated: string;
  widgets: Widget[];
};

export const widgetCatalog: { type: WidgetType; title: string; desc: string; span: 1 | 2 | 3 }[] = [
  { type: "kpis", title: "KPI Cards", desc: "Doanh thu, đơn hàng, khách hàng, giá trị đơn trung bình", span: 3 },
  { type: "revenue-time", title: "Revenue Over Time", desc: "Doanh thu và mục tiêu theo tháng", span: 2 },
  { type: "revenue-category", title: "Revenue by Category", desc: "Tỷ trọng doanh thu theo ngành hàng", span: 1 },
  { type: "top-products", title: "Top Products", desc: "5 sản phẩm doanh thu cao nhất", span: 1 },
  { type: "orders-region", title: "Orders by Region", desc: "Số đơn hàng theo tỉnh / thành phố", span: 1 },
  { type: "query-volume", title: "Query Volume", desc: "Số lượt truy vấn SQL và RAG theo ngày", span: 2 },
];

const w = (type: WidgetType, over?: Partial<Widget>): Widget => {
  const c = widgetCatalog.find((x) => x.type === type)!;
  return { id: `${type}-${Math.random().toString(36).slice(2, 7)}`, type, title: c.title, span: c.span, ...over };
};

export const newWidget = w;

let dashboards: Dashboard[] = [
  {
    id: "db1",
    name: "Tổng quan kinh doanh",
    description: "Mẫu chuẩn cho ban lãnh đạo: doanh thu, ngành hàng và khu vực",
    owner: "Hệ thống",
    scope: "Template",
    isDefault: true,
    updated: "18/09/2026 09:10",
    widgets: [w("kpis"), w("revenue-time"), w("revenue-category"), w("top-products"), w("orders-region")],
  },
  {
    id: "db2",
    name: "Hiệu quả ngành hàng",
    description: "Theo dõi sản phẩm bán chạy và cơ cấu ngành hàng",
    owner: "Trần Thị Bích Ngọc",
    scope: "Cá nhân",
    isDefault: false,
    updated: "17/09/2026 16:44",
    widgets: [w("kpis", { span: 3 }), w("top-products", { span: 2 }), w("revenue-category")],
  },
  {
    id: "db3",
    name: "Vận hành dữ liệu",
    description: "Mức độ sử dụng trợ lý dữ liệu theo ngày",
    owner: "Nguyễn Hải Minh",
    scope: "Cá nhân",
    isDefault: false,
    updated: "15/09/2026 08:02",
    widgets: [w("query-volume", { span: 3 }), w("orders-region"), w("revenue-category")],
  },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const dashboardStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => dashboards,
  set(next: Dashboard[]) {
    dashboards = next;
    emit();
  },
  update(id: string, patch: Partial<Dashboard>) {
    dashboards = dashboards.map((d) => (d.id === id ? { ...d, ...patch, updated: stamp() } : d));
    emit();
  },
  create(name: string, description: string) {
    const id = `db${Date.now()}`;
    dashboards = [
      ...dashboards,
      {
        id,
        name,
        description,
        owner: "Nguyễn Hải Minh",
        scope: "Cá nhân",
        isDefault: false,
        updated: stamp(),
        widgets: [w("kpis"), w("revenue-time"), w("revenue-category")],
      },
    ];
    emit();
    return id;
  },
  duplicate(id: string) {
    const src = dashboards.find((d) => d.id === id);
    if (!src) return id;
    const copy: Dashboard = {
      ...src,
      id: `db${Date.now()}`,
      name: `${src.name} (bản sao)`,
      owner: "Nguyễn Hải Minh",
      scope: "Cá nhân",
      isDefault: false,
      updated: stamp(),
      widgets: src.widgets.map((x) => ({ ...x, id: `${x.type}-${Math.random().toString(36).slice(2, 7)}` })),
    };
    dashboards = [...dashboards, copy];
    emit();
    return copy.id;
  },
  remove(id: string) {
    dashboards = dashboards.filter((d) => d.id !== id);
    emit();
  },
  setDefault(id: string) {
    dashboards = dashboards.map((d) => ({ ...d, isDefault: d.id === id }));
    emit();
  },
};

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function useDashboards() {
  return useSyncExternalStore(
    dashboardStore.subscribe,
    dashboardStore.get,
    dashboardStore.get,
  );
}
