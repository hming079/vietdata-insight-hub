// Centralised mock data for the Vietnamese Business Data Assistant prototype.

export type Status = "success" | "warning" | "error" | "processing" | "neutral";

export const currentUser = {
  name: "Nguyễn Hải Minh",
  email: "minh.nguyen@vietretail.vn",
  role: "Admin",
  initials: "HM",
};

/* ---------------------------------- KPIs --------------------------------- */

export const kpis = [
  {
    id: "revenue",
    label: "Tổng doanh thu",
    sublabel: "Total Revenue",
    value: "24.86 tỷ ₫",
    change: 12.4,
    previous: "22.11 tỷ ₫",
    spark: [18, 20, 19, 23, 22, 26, 25, 28, 27, 31, 30, 34],
  },
  {
    id: "orders",
    label: "Tổng đơn hàng",
    sublabel: "Total Orders",
    value: "48,204",
    change: 8.1,
    previous: "44,592",
    spark: [30, 32, 31, 35, 34, 36, 38, 37, 40, 42, 41, 45],
  },
  {
    id: "customers",
    label: "Khách hàng hoạt động",
    sublabel: "Active Customers",
    value: "12,867",
    change: -2.3,
    previous: "13,170",
    spark: [40, 41, 43, 42, 44, 43, 41, 40, 39, 38, 39, 38],
  },
  {
    id: "aov",
    label: "Giá trị đơn trung bình",
    sublabel: "Average Order Value",
    value: "515,800 ₫",
    change: 3.9,
    previous: "496,400 ₫",
    spark: [22, 23, 22, 24, 25, 24, 26, 27, 26, 28, 29, 30],
  },
];

export const revenueOverTime = [
  { month: "T1", revenue: 1620, orders: 3420, target: 1500 },
  { month: "T2", revenue: 1385, orders: 2980, target: 1550 },
  { month: "T3", revenue: 1910, orders: 3810, target: 1600 },
  { month: "T4", revenue: 2040, orders: 3990, target: 1700 },
  { month: "T5", revenue: 2185, orders: 4210, target: 1800 },
  { month: "T6", revenue: 2320, orders: 4380, target: 1900 },
  { month: "T7", revenue: 2115, orders: 4120, target: 2000 },
  { month: "T8", revenue: 2280, orders: 4340, target: 2050 },
  { month: "T9", revenue: 2410, orders: 4520, target: 2100 },
  { month: "T10", revenue: 2270, orders: 4310, target: 2150 },
  { month: "T11", revenue: 2495, orders: 4680, target: 2200 },
  { month: "T12", revenue: 2830, orders: 5240, target: 2300 },
];

export const revenueByCategory = [
  { name: "Điện tử", value: 8420 },
  { name: "Thời trang", value: 5910 },
  { name: "Gia dụng", value: 4380 },
  { name: "Mỹ phẩm", value: 3220 },
  { name: "Thực phẩm", value: 2930 },
];

export const topProducts = [
  { name: "Laptop Dell Inspiron 15", revenue: 2140, units: 892 },
  { name: "iPhone 17 Pro 256GB", revenue: 1980, units: 412 },
  { name: "Máy lọc không khí Xiaomi", revenue: 1240, units: 1580 },
  { name: "Tai nghe Sony WH-1000XM6", revenue: 980, units: 1120 },
  { name: "Nồi chiên không dầu Lock&Lock", revenue: 760, units: 2340 },
];

export const ordersByRegion = [
  { name: "Hồ Chí Minh", value: 18420 },
  { name: "Hà Nội", value: 14210 },
  { name: "Đà Nẵng", value: 6180 },
  { name: "Cần Thơ", value: 4520 },
  { name: "Hải Phòng", value: 3810 },
  { name: "Khác", value: 1064 },
];

/* ------------------------------- Text-to-SQL ------------------------------ */

export const conversations = [
  {
    id: "c1",
    title: "Doanh thu theo tháng 2026",
    preview: "Doanh thu theo từng tháng trong năm 2026...",
    time: "10 phút trước",
    messages: 6,
  },
  {
    id: "c2",
    title: "Top 10 khách hàng VIP",
    preview: "Khách hàng nào chi tiêu nhiều nhất quý 3?",
    time: "Hôm nay, 09:12",
    messages: 4,
  },
  {
    id: "c3",
    title: "Tỷ lệ huỷ đơn theo khu vực",
    preview: "So sánh tỷ lệ huỷ đơn giữa các miền",
    time: "Hôm qua",
    messages: 8,
  },
  {
    id: "c4",
    title: "Sản phẩm tồn kho chậm luân chuyển",
    preview: "Sản phẩm nào tồn kho trên 90 ngày?",
    time: "08/09/2026",
    messages: 5,
  },
  {
    id: "c5",
    title: "Hiệu quả chiến dịch khuyến mãi T8",
    preview: "Doanh thu trước và sau khuyến mãi",
    time: "05/09/2026",
    messages: 11,
  },
];

export const generatedSql = `SELECT
    DATE_TRUNC('month', o.order_date) AS thang,
    SUM(o.total_amount)               AS doanh_thu,
    COUNT(DISTINCT o.order_id)        AS so_don_hang
FROM orders o
WHERE o.status = 'COMPLETED'
  AND o.order_date >= '2026-01-01'
  AND o.order_date <  '2027-01-01'
GROUP BY 1
ORDER BY 1;`;

export const failedSql = `SELECT
    DATE_TRUNC('month', o.order_date) AS thang,
    SUM(o.amount) AS doanh_thu
FROM orders o
WHERE o.status = 'COMPLETED'
GROUP BY 1;`;

export const queryResultRows = [
  { thang: "01/2026", doanh_thu: 1620400000, so_don_hang: 3420, aov: 473801 },
  { thang: "02/2026", doanh_thu: 1385200000, so_don_hang: 2980, aov: 464832 },
  { thang: "03/2026", doanh_thu: 1910800000, so_don_hang: 3810, aov: 501522 },
  { thang: "04/2026", doanh_thu: 2040100000, so_don_hang: 3990, aov: 511303 },
  { thang: "05/2026", doanh_thu: 2185600000, so_don_hang: 4210, aov: 519145 },
  { thang: "06/2026", doanh_thu: 2320300000, so_don_hang: 4380, aov: 529749 },
  { thang: "07/2026", doanh_thu: 2115900000, so_don_hang: 4120, aov: 513568 },
  { thang: "08/2026", doanh_thu: 2280400000, so_don_hang: 4340, aov: 525438 },
  { thang: "09/2026", doanh_thu: 2410700000, so_don_hang: 4520, aov: 533341 },
  { thang: "10/2026", doanh_thu: 2270500000, so_don_hang: 4310, aov: 526798 },
  { thang: "11/2026", doanh_thu: 2495800000, so_don_hang: 4680, aov: 533291 },
  { thang: "12/2026", doanh_thu: 2830100000, so_don_hang: 5240, aov: 540095 },
];

/* ------------------------------- Document QA ------------------------------ */

export type DocFile = {
  id: string;
  name: string;
  pages: number;
  size: string;
  type: string;
  status: "ready" | "processing" | "failed";
  chunks: number;
  uploaded: string;
};

export const documents: DocFile[] = [
  {
    id: "d1",
    name: "Policy_2026.pdf",
    pages: 48,
    size: "3.2 MB",
    type: "PDF",
    status: "ready",
    chunks: 214,
    uploaded: "02/09/2026",
  },
  {
    id: "d2",
    name: "Sales_Regulations.pdf",
    pages: 32,
    size: "1.8 MB",
    type: "PDF",
    status: "ready",
    chunks: 148,
    uploaded: "28/08/2026",
  },
  {
    id: "d3",
    name: "HR_Handbook.pdf",
    pages: 76,
    size: "5.4 MB",
    type: "PDF",
    status: "ready",
    chunks: 322,
    uploaded: "21/08/2026",
  },
  {
    id: "d4",
    name: "Customer_Service_Policy.pdf",
    pages: 24,
    size: "1.1 MB",
    type: "PDF",
    status: "processing",
    chunks: 0,
    uploaded: "09/09/2026",
  },
  {
    id: "d5",
    name: "Quy_trinh_Kho_van.docx",
    pages: 18,
    size: "820 KB",
    type: "DOCX",
    status: "failed",
    chunks: 0,
    uploaded: "07/09/2026",
  },
  {
    id: "d6",
    name: "Bao_cao_Tai_chinh_Q2.pdf",
    pages: 41,
    size: "2.7 MB",
    type: "PDF",
    status: "ready",
    chunks: 186,
    uploaded: "15/07/2026",
  },
];

export type Citation = {
  id: number;
  doc: string;
  page: number;
  excerpt: string;
  score: number;
};

export const citations: Citation[] = [
  {
    id: 1,
    doc: "Policy_2026.pdf",
    page: 12,
    excerpt:
      "Khách hàng được phép yêu cầu đổi sản phẩm trong vòng 07 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên tem nhãn, chưa qua sử dụng và có hoá đơn mua hàng hợp lệ.",
    score: 0.94,
  },
  {
    id: 2,
    doc: "Policy_2026.pdf",
    page: 13,
    excerpt:
      "Đối với sản phẩm điện tử có giá trị trên 10.000.000 VNĐ, thời hạn đổi trả được kéo dài lên 15 ngày và phải kèm biên bản kiểm tra kỹ thuật của trung tâm bảo hành uỷ quyền.",
    score: 0.88,
  },
  {
    id: 3,
    doc: "Customer_Service_Policy.pdf",
    page: 5,
    excerpt:
      "Bộ phận Chăm sóc khách hàng có trách nhiệm phản hồi yêu cầu đổi trả trong vòng 24 giờ làm việc và cập nhật trạng thái xử lý trên hệ thống CRM.",
    score: 0.71,
  },
];

export const pdfPages: Record<number, { title: string; paragraphs: string[]; highlight?: string }> =
  {
    11: {
      title: "Điều 4. Chính sách bảo hành sản phẩm",
      paragraphs: [
        "4.1. Tất cả sản phẩm phân phối chính hãng bởi Công ty đều được áp dụng chế độ bảo hành theo tiêu chuẩn của nhà sản xuất, tối thiểu 12 tháng kể từ ngày xuất hoá đơn.",
        "4.2. Phiếu bảo hành điện tử được gửi tự động đến email khách hàng sau khi đơn hàng chuyển sang trạng thái HOÀN TẤT.",
        "4.3. Các trường hợp hư hỏng do tác động vật lý, vào nước hoặc tự ý tháo lắp không thuộc phạm vi bảo hành.",
      ],
    },
    12: {
      title: "Điều 5. Chính sách đổi trả sản phẩm",
      paragraphs: [
        "5.1. Khách hàng được phép yêu cầu đổi sản phẩm trong vòng 07 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên tem nhãn, chưa qua sử dụng và có hoá đơn mua hàng hợp lệ.",
        "5.2. Chi phí vận chuyển cho lần đổi đầu tiên do Công ty chi trả nếu lỗi thuộc về nhà sản xuất hoặc khâu giao vận.",
        "5.3. Sản phẩm khuyến mãi, hàng thanh lý và sản phẩm đã kích hoạt bảo hành điện tử không áp dụng chính sách đổi trả tại điều khoản này.",
      ],
      highlight:
        "Khách hàng được phép yêu cầu đổi sản phẩm trong vòng 07 ngày kể từ ngày nhận hàng",
    },
    13: {
      title: "Điều 5. Chính sách đổi trả sản phẩm (tiếp theo)",
      paragraphs: [
        "5.4. Đối với sản phẩm điện tử có giá trị trên 10.000.000 VNĐ, thời hạn đổi trả được kéo dài lên 15 ngày và phải kèm biên bản kiểm tra kỹ thuật của trung tâm bảo hành uỷ quyền.",
        "5.5. Yêu cầu hoàn tiền được xử lý trong vòng 05 ngày làm việc kể từ khi Công ty nhận lại sản phẩm và xác nhận tình trạng hợp lệ.",
        "5.6. Mọi tranh chấp phát sinh sẽ được giải quyết theo quy định tại Điều 12 của tài liệu này.",
      ],
      highlight:
        "thời hạn đổi trả được kéo dài lên 15 ngày",
    },
    5: {
      title: "Mục 2. Cam kết chất lượng dịch vụ",
      paragraphs: [
        "2.1. Bộ phận Chăm sóc khách hàng có trách nhiệm phản hồi yêu cầu đổi trả trong vòng 24 giờ làm việc và cập nhật trạng thái xử lý trên hệ thống CRM.",
        "2.2. Chỉ số hài lòng khách hàng (CSAT) mục tiêu cho năm 2026 là tối thiểu 92%.",
        "2.3. Mọi cuộc gọi khiếu nại cấp độ 2 phải được chuyển tiếp cho Trưởng nhóm trong vòng 15 phút.",
      ],
      highlight:
        "phản hồi yêu cầu đổi trả trong vòng 24 giờ làm việc",
    },
  };

/* --------------------------------- Users ---------------------------------- */

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Analyst" | "Viewer";
  status: "Active" | "Inactive" | "Pending";
  lastActive: string;
  created: string;
  initials: string;
};

export const users: UserRow[] = [
  { id: "u1", name: "Nguyễn Hải Minh", email: "minh.nguyen@vietretail.vn", role: "Admin", status: "Active", lastActive: "2 phút trước", created: "12/01/2026", initials: "HM" },
  { id: "u2", name: "Trần Thị Bích Ngọc", email: "ngoc.tran@vietretail.vn", role: "Analyst", status: "Active", lastActive: "18 phút trước", created: "03/02/2026", initials: "BN" },
  { id: "u3", name: "Lê Quang Huy", email: "huy.le@vietretail.vn", role: "Analyst", status: "Active", lastActive: "1 giờ trước", created: "17/02/2026", initials: "QH" },
  { id: "u4", name: "Phạm Thu Hà", email: "ha.pham@vietretail.vn", role: "Viewer", status: "Inactive", lastActive: "14 ngày trước", created: "21/03/2026", initials: "TH" },
  { id: "u5", name: "Đỗ Văn Cường", email: "cuong.do@vietretail.vn", role: "Viewer", status: "Active", lastActive: "Hôm qua", created: "02/04/2026", initials: "VC" },
  { id: "u6", name: "Vũ Khánh Linh", email: "linh.vu@vietretail.vn", role: "Analyst", status: "Pending", lastActive: "Chưa đăng nhập", created: "08/09/2026", initials: "KL" },
  { id: "u7", name: "Hoàng Minh Tuấn", email: "tuan.hoang@vietretail.vn", role: "Admin", status: "Active", lastActive: "3 giờ trước", created: "19/05/2026", initials: "MT" },
  { id: "u8", name: "Bùi Ngọc Anh", email: "anh.bui@vietretail.vn", role: "Viewer", status: "Active", lastActive: "5 giờ trước", created: "30/06/2026", initials: "NA" },
];

export const permissionList = [
  { key: "query_db", label: "Query Database", desc: "Đặt câu hỏi và thực thi truy vấn SQL sinh tự động" },
  { key: "view_dashboard", label: "View Dashboard", desc: "Xem báo cáo và bảng điều khiển phân tích" },
  { key: "query_docs", label: "Query Documents", desc: "Hỏi đáp trên kho tài liệu nội bộ" },
  { key: "manage_sources", label: "Manage Data Sources", desc: "Thêm, sửa, xoá kết nối cơ sở dữ liệu" },
  { key: "manage_kb", label: "Manage Knowledge Base", desc: "Tải lên và quản lý tài liệu tri thức" },
  { key: "manage_users", label: "Manage Users", desc: "Quản lý người dùng và phân quyền" },
  { key: "view_audit", label: "View Audit Logs", desc: "Xem nhật ký truy vết hệ thống" },
];

export const rolePermissions: Record<string, string[]> = {
  Admin: permissionList.map((p) => p.key),
  Analyst: ["query_db", "view_dashboard", "query_docs"],
  Viewer: ["view_dashboard", "query_docs"],
};

/* ------------------------------ Data sources ------------------------------ */

export type DataSource = {
  id: string;
  name: string;
  engine: "PostgreSQL" | "SQL Server" | "MySQL" | "BigQuery";
  description: string;
  host: string;
  database: string;
  tables: number;
  status: "Connected" | "Error" | "Syncing";
  lastSync: string;
};

export const dataSources: DataSource[] = [
  { id: "ds1", name: "Retail Database", engine: "PostgreSQL", description: "Dữ liệu bán lẻ đa kênh (POS + eCommerce)", host: "10.0.4.21", database: "retail_prod", tables: 12, status: "Connected", lastSync: "09/09/2026 14:32" },
  { id: "ds2", name: "Sales Database", engine: "SQL Server", description: "Hệ thống quản lý bán hàng & CRM", host: "10.0.4.44", database: "sales_dw", tables: 8, status: "Connected", lastSync: "09/09/2026 13:05" },
  { id: "ds3", name: "Inventory Warehouse", engine: "MySQL", description: "Kho vận & tồn kho theo chi nhánh", host: "10.0.5.12", database: "wms", tables: 15, status: "Syncing", lastSync: "09/09/2026 14:50" },
  { id: "ds4", name: "Marketing Analytics", engine: "BigQuery", description: "Dữ liệu chiến dịch quảng cáo đa nền tảng", host: "bq://vietretail-mkt", database: "mkt_events", tables: 6, status: "Error", lastSync: "07/09/2026 22:11" },
];

export type Column = {
  name: string;
  type: string;
  pk?: boolean;
  fk?: string;
  nullable: boolean;
  desc: string;
};

export const schema: Record<string, { rows: string; desc: string; columns: Column[] }> = {
  customers: {
    rows: "12,867",
    desc: "Thông tin khách hàng đã đăng ký tài khoản",
    columns: [
      { name: "customer_id", type: "bigint", pk: true, nullable: false, desc: "Khoá chính khách hàng" },
      { name: "full_name", type: "varchar(150)", nullable: false, desc: "Họ và tên khách hàng" },
      { name: "email", type: "varchar(150)", nullable: true, desc: "Địa chỉ email liên hệ" },
      { name: "phone", type: "varchar(20)", nullable: true, desc: "Số điện thoại" },
      { name: "region", type: "varchar(50)", nullable: true, desc: "Khu vực / tỉnh thành" },
      { name: "created_at", type: "timestamp", nullable: false, desc: "Ngày tạo tài khoản" },
    ],
  },
  orders: {
    rows: "48,204",
    desc: "Đơn hàng bán ra trên tất cả các kênh",
    columns: [
      { name: "order_id", type: "bigint", pk: true, nullable: false, desc: "Khoá chính đơn hàng" },
      { name: "customer_id", type: "bigint", fk: "customers.customer_id", nullable: false, desc: "Khách hàng đặt đơn" },
      { name: "order_date", type: "timestamp", nullable: false, desc: "Thời điểm đặt hàng" },
      { name: "total_amount", type: "numeric(18,2)", nullable: false, desc: "Tổng giá trị đơn hàng (VNĐ)" },
      { name: "discount_amount", type: "numeric(18,2)", nullable: true, desc: "Giá trị giảm giá áp dụng" },
      { name: "status", type: "varchar(20)", nullable: false, desc: "Trạng thái: NEW, COMPLETED, CANCELLED" },
      { name: "channel", type: "varchar(20)", nullable: false, desc: "Kênh bán: POS, WEB, APP" },
    ],
  },
  products: {
    rows: "3,412",
    desc: "Danh mục sản phẩm kinh doanh",
    columns: [
      { name: "product_id", type: "bigint", pk: true, nullable: false, desc: "Khoá chính sản phẩm" },
      { name: "product_name", type: "varchar(200)", nullable: false, desc: "Tên sản phẩm" },
      { name: "category", type: "varchar(80)", nullable: false, desc: "Nhóm ngành hàng" },
      { name: "unit_price", type: "numeric(18,2)", nullable: false, desc: "Đơn giá niêm yết" },
      { name: "is_active", type: "boolean", nullable: false, desc: "Sản phẩm còn kinh doanh" },
    ],
  },
  order_items: {
    rows: "156,940",
    desc: "Chi tiết dòng hàng trong mỗi đơn",
    columns: [
      { name: "order_item_id", type: "bigint", pk: true, nullable: false, desc: "Khoá chính dòng hàng" },
      { name: "order_id", type: "bigint", fk: "orders.order_id", nullable: false, desc: "Đơn hàng tương ứng" },
      { name: "product_id", type: "bigint", fk: "products.product_id", nullable: false, desc: "Sản phẩm được mua" },
      { name: "quantity", type: "integer", nullable: false, desc: "Số lượng" },
      { name: "unit_price", type: "numeric(18,2)", nullable: false, desc: "Đơn giá tại thời điểm bán" },
      { name: "line_total", type: "numeric(18,2)", nullable: false, desc: "Thành tiền dòng hàng" },
    ],
  },
};

export const relationships = [
  { from: "orders.customer_id", to: "customers.customer_id", type: "N:1" },
  { from: "order_items.order_id", to: "orders.order_id", type: "N:1" },
  { from: "order_items.product_id", to: "products.product_id", type: "N:1" },
];

/* -------------------------------- Glossary -------------------------------- */

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  synonyms: string[];
  mapping: string;
  conditions: string;
  status: "Approved" | "Draft" | "Review";
  owner: string;
};

export const glossary: GlossaryTerm[] = [
  { id: "g1", term: "Doanh thu", definition: "Tổng giá trị tiền của các đơn hàng hoàn tất.", synonyms: ["DT", "Revenue", "Sales"], mapping: "orders.total_amount", conditions: "orders.status = 'COMPLETED'", status: "Approved", owner: "Phòng Tài chính" },
  { id: "g2", term: "Đơn hàng thành công", definition: "Đơn hàng đã giao và không phát sinh hoàn trả trong 7 ngày.", synonyms: ["Completed order", "Đơn hoàn tất"], mapping: "orders.order_id", conditions: "orders.status = 'COMPLETED' AND NOT returned", status: "Approved", owner: "Phòng Vận hành" },
  { id: "g3", term: "Khách hàng hoạt động", definition: "Khách hàng có ít nhất một đơn hàng trong 90 ngày gần nhất.", synonyms: ["Active customer", "KH active"], mapping: "customers.customer_id", conditions: "MAX(orders.order_date) >= NOW() - INTERVAL '90 days'", status: "Approved", owner: "Phòng Marketing" },
  { id: "g4", term: "Giá trị đơn trung bình", definition: "Doanh thu chia cho số đơn hàng hoàn tất trong kỳ.", synonyms: ["AOV", "GTĐTB"], mapping: "SUM(orders.total_amount) / COUNT(orders.order_id)", conditions: "orders.status = 'COMPLETED'", status: "Review", owner: "Phòng Phân tích" },
  { id: "g5", term: "Tỷ lệ huỷ đơn", definition: "Tỷ lệ đơn hàng bị huỷ trên tổng số đơn tạo ra trong kỳ.", synonyms: ["Cancellation rate", "TLHĐ"], mapping: "COUNT(orders WHERE status='CANCELLED') / COUNT(orders)", conditions: "Tính theo tháng dương lịch", status: "Draft", owner: "Phòng Vận hành" },
  { id: "g6", term: "Ngành hàng", definition: "Nhóm phân loại sản phẩm theo cây danh mục cấp 1.", synonyms: ["Category", "Nhóm hàng"], mapping: "products.category", conditions: "products.is_active = true", status: "Approved", owner: "Phòng Kinh doanh" },
];

/* ------------------------------- Audit log -------------------------------- */

export type AuditRow = {
  id: string;
  time: string;
  user: string;
  action: string;
  resource: string;
  status: "Success" | "Failed" | "Warning";
  type: "sql" | "rag" | "admin";
  duration: string;
  ip: string;
  detail: {
    question?: string;
    sql?: string;
    attempts?: { n: number; ok: boolean; note: string }[];
    result?: string;
    docs?: { name: string; page: number; score: number }[];
    answer?: string;
    changes?: { field: string; from: string; to: string }[];
  };
};

export const auditLog: AuditRow[] = [
  {
    id: "a1", time: "09/09/2026 14:52:11", user: "Nguyễn Hải Minh", action: "Execute SQL", resource: "Retail Database / orders", status: "Success", type: "sql", duration: "412 ms", ip: "10.12.4.88",
    detail: {
      question: "Doanh thu theo từng tháng trong năm 2026 là bao nhiêu?",
      sql: generatedSql,
      attempts: [
        { n: 1, ok: false, note: "column \"amount\" does not exist" },
        { n: 2, ok: true, note: "Sử dụng orders.total_amount" },
      ],
      result: "12 dòng • 3 cột • tổng doanh thu 24.86 tỷ ₫",
    },
  },
  {
    id: "a2", time: "09/09/2026 14:41:03", user: "Trần Thị Bích Ngọc", action: "Query Document", resource: "Policy_2026.pdf", status: "Success", type: "rag", duration: "1.8 s", ip: "10.12.4.51",
    detail: {
      question: "Chính sách đổi trả sản phẩm trong bao lâu?",
      docs: [
        { name: "Policy_2026.pdf", page: 12, score: 0.94 },
        { name: "Policy_2026.pdf", page: 13, score: 0.88 },
        { name: "Customer_Service_Policy.pdf", page: 5, score: 0.71 },
      ],
      answer: "Khách hàng được đổi sản phẩm trong vòng 07 ngày kể từ ngày nhận hàng; sản phẩm điện tử trên 10 triệu đồng được kéo dài tới 15 ngày.",
    },
  },
  { id: "a3", time: "09/09/2026 13:58:47", user: "Hoàng Minh Tuấn", action: "Create User", resource: "users / linh.vu@vietretail.vn", status: "Success", type: "admin", duration: "96 ms", ip: "10.12.4.19", detail: { changes: [{ field: "role", from: "—", to: "Analyst" }, { field: "status", from: "—", to: "Pending" }] } },
  { id: "a4", time: "09/09/2026 13:12:22", user: "Lê Quang Huy", action: "Execute SQL", resource: "Sales Database / customers", status: "Failed", type: "sql", duration: "88 ms", ip: "10.12.4.62", detail: { question: "Top 10 khách hàng chi tiêu nhiều nhất quý 3?", sql: failedSql, attempts: [{ n: 1, ok: false, note: "permission denied for table customers" }], result: "Không có dữ liệu trả về" } },
  { id: "a5", time: "09/09/2026 11:47:10", user: "Nguyễn Hải Minh", action: "Update Glossary", resource: "glossary / Giá trị đơn trung bình", status: "Success", type: "admin", duration: "74 ms", ip: "10.12.4.88", detail: { changes: [{ field: "status", from: "Draft", to: "Review" }] } },
  { id: "a6", time: "09/09/2026 10:20:55", user: "Hoàng Minh Tuấn", action: "Add Data Source", resource: "Marketing Analytics (BigQuery)", status: "Warning", type: "admin", duration: "3.4 s", ip: "10.12.4.19", detail: { changes: [{ field: "connection", from: "—", to: "bq://vietretail-mkt" }, { field: "test", from: "—", to: "Timeout sau 3s" }] } },
  { id: "a7", time: "09/09/2026 09:34:02", user: "Bùi Ngọc Anh", action: "Query Document", resource: "HR_Handbook.pdf", status: "Success", type: "rag", duration: "2.1 s", ip: "10.12.4.77", detail: { question: "Nhân viên được nghỉ phép bao nhiêu ngày mỗi năm?", docs: [{ name: "HR_Handbook.pdf", page: 21, score: 0.91 }], answer: "Nhân viên chính thức được hưởng 12 ngày phép năm, cộng thêm 1 ngày cho mỗi 5 năm thâm niên." } },
  { id: "a8", time: "08/09/2026 17:05:39", user: "Trần Thị Bích Ngọc", action: "Delete Document", resource: "Bao_gia_2025.pdf", status: "Success", type: "admin", duration: "120 ms", ip: "10.12.4.51", detail: { changes: [{ field: "document", from: "Bao_gia_2025.pdf", to: "Đã xoá khỏi Knowledge Base" }] } },
];

/* -------------------------------- Overview -------------------------------- */

export const recentActivity = [
  { id: "r1", user: "Nguyễn Hải Minh", text: "đã chạy truy vấn “Doanh thu theo từng tháng 2026”", time: "10 phút trước", kind: "sql" as const },
  { id: "r2", user: "Trần Thị Bích Ngọc", text: "đã hỏi tài liệu Policy_2026.pdf về chính sách đổi trả", time: "22 phút trước", kind: "rag" as const },
  { id: "r3", user: "Hoàng Minh Tuấn", text: "đã tạo người dùng mới Vũ Khánh Linh (Analyst)", time: "1 giờ trước", kind: "admin" as const },
  { id: "r4", user: "Hệ thống", text: "đã lập chỉ mục xong Bao_cao_Tai_chinh_Q2.pdf (186 chunks)", time: "2 giờ trước", kind: "kb" as const },
  { id: "r5", user: "Lê Quang Huy", text: "truy vấn thất bại trên Sales Database — permission denied", time: "3 giờ trước", kind: "error" as const },
  { id: "r6", user: "Nguyễn Hải Minh", text: "cập nhật thuật ngữ “Giá trị đơn trung bình”", time: "Hôm nay, 11:47", kind: "admin" as const },
];

export const systemHealth = [
  { name: "SQL Engine", value: 99.98, status: "Hoạt động bình thường", state: "success" as Status },
  { name: "Vector Index", value: 99.4, status: "Đang lập chỉ mục 1 tài liệu", state: "processing" as Status },
  { name: "LLM Gateway", value: 97.2, status: "Độ trễ trung bình 1.4s", state: "warning" as Status },
  { name: "Data Connectors", value: 75, status: "1/4 nguồn đang lỗi kết nối", state: "error" as Status },
];

export const queryVolume = [
  { day: "T2", sql: 142, rag: 68 },
  { day: "T3", sql: 168, rag: 74 },
  { day: "T4", sql: 155, rag: 91 },
  { day: "T5", sql: 190, rag: 84 },
  { day: "T6", sql: 214, rag: 102 },
  { day: "T7", sql: 96, rag: 41 },
  { day: "CN", sql: 58, rag: 22 },
];

export const formatVnd = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n);
