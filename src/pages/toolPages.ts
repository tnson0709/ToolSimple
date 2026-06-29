export type ToolPage = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
  kind?: "simple-interest" | "compound-interest";
  defaults: Record<string, number>;
};

export const toolPages: ToolPage[] = [
  {
    id: "interest-simple",
    title: "Lãi suất",
    description: "Tính lãi đơn theo số tiền gốc, lãi suất và thời gian.",
    path: "/lai-suat",
    category: "Tính lãi suất",
    kind: "simple-interest",
    defaults: { principal: 100000000, rate: 8.5, years: 3 },
  },
  {
    id: "interest-compound",
    title: "Lãi kép",
    description: "Tính giá trị tương lai khi lãi nhập gốc định kỳ.",
    path: "/lai-kep",
    category: "Tính lãi suất",
    kind: "compound-interest",
    defaults: { principal: 100000000, rate: 8.5, years: 5, contribution: 1000000, compounding: 12 },
  },
  {
    id: "electricity",
    title: "Tiền điện",
    description: "Tính tiền điện theo bậc giá hiện hành, có thể thay đổi giá cho từng bậc.",
    path: "/tien-dien",
    category: "Tiền điện nước",
    defaults: {
      usage: 150,
      serviceFee: 8,
      tier1Price: 1984,
      tier2Price: 2050,
      tier3Price: 2380,
      tier4Price: 2998,
      tier5Price: 3350,
      tier6Price: 3460,
    },
  },
  {
    id: "water",
    title: "Tiền nước",
    description: "Tính tiền nước theo bậc giá hiện hành, có thể thay đổi giá cho từng bậc.",
    path: "/tien-nuoc",
    category: "Tiền điện nước",
    defaults: {
      usage: 12,
      serviceFee: 5000,
      tier1Price: 35000,
      tier2Price: 38000,
      tier3Price: 40000,
    },
  },
  {
    id: "tax",
    title: "Thuế",
    description: "Mẫu tính thuế với giá trị mặc định để thử nhanh.",
    path: "/thue",
    category: "Thuế TNCN",
    defaults: { income: 150000000, rate: 5, deduction: 11000000 },
  },
  {
    id: "personal-income-tax",
    title: "Thuế TNCN",
    description: "Mẫu tính thuế thu nhập cá nhân với giá trị mặc định.",
    path: "/thue-tncn",
    category: "Thuế TNCN",
    defaults: { income: 200000000, rate: 10, deduction: 11000000 },
  },
  {
    id: "loan-fixed",
    title: "Lãi vay cố định",
    description: "Mẫu tính lãi vay cố định với các giá trị demo.",
    path: "/lai-vay-co-dinh",
    category: "Lãi vay",
    defaults: { principal: 500000000, rate: 9, months: 24 },
  },
  {
    id: "loan-reducing",
    title: "Lãi vay giảm dần",
    description: "Mẫu tính lãi vay giảm dần với giá trị mặc định.",
    path: "/lai-vay-giam-dan",
    category: "Lãi vay",
    defaults: { principal: 500000000, rate: 8.5, months: 24 },
  },
  {
    id: "password-generator",
    title: "Sinh pass",
    description: "Mẫu công cụ sinh mật khẩu với giá trị mặc định.",
    path: "/sinh-pass",
    category: "IT",
    defaults: { length: 12, symbols: 2, numbers: 2 },
  },
  {
    id: "random-number",
    title: "Sinh số ngẫu nhiên",
    description: "Mẫu công cụ sinh số ngẫu nhiên với giá trị mặc định.",
    path: "/sinh-so-ngau-nhien",
    category: "IT",
    defaults: { min: 1, max: 100, count: 5 },
  },
  {
    id: "json-generator",
    title: "Sinh json",
    description: "Mẫu công cụ tạo JSON mẫu cho thử nghiệm.",
    path: "/sinh-json",
    category: "IT",
    defaults: { records: 3, depth: 2, pretty: 1 },
  },
  {
    id: "retirement",
    title: "Tính số tiền nghỉ hưu",
    description: "Mẫu tính số tiền nghỉ hưu với giá trị mặc định.",
    path: "/nghi-huu",
    category: "Tự do tài chính",
    defaults: { monthlyNeed: 20000000, years: 25, growth: 6 },
  },
  {
    id: "double-money",
    title: "Tính số năm đạt gấp đôi",
    description: "Mẫu tính thời gian để số tiền tăng gấp đôi.",
    path: "/gap-doi",
    category: "Tự do tài chính",
    defaults: { principal: 100000000, rate: 7.2 },
  },
  {
    id: "safe-six-months",
    title: "Tính tiền cần có để an toàn 6 tháng",
    description: "Mẫu tính số tiền dự phòng 6 tháng chi tiêu.",
    path: "/an-toan-6-thang",
    category: "Tự do tài chính",
    defaults: { monthlyExpenses: 30000000, months: 6 },
  },
  {
    id: "six-bottle",
    title: "Tính phân bổ theo nguyên lý 6 chiếc lọ",
    description: "Mẫu phân bổ tài chính theo nguyên lý 6 chiếc lọ.",
    path: "/6-chiec-lo",
    category: "Tự do tài chính",
    defaults: { income: 30000000, ratio: 50 },
  },
  {
    id: "bmi",
    title: "Tính BMI",
    description: "Mẫu tính chỉ số BMI với dữ liệu demo.",
    path: "/bmi",
    category: "Công cụ khác",
    defaults: { height: 170, weight: 65 },
  },
  {
    id: "convert",
    title: "Chuyển đổi",
    description: "Mẫu công cụ chuyển đổi với các giá trị mặc định.",
    path: "/chuyen-doi",
    category: "Công cụ khác",
    defaults: { value: 100, rate: 25000 },
  },
];

export const sidebarGroups = [
  {
    title: "Tính lãi suất",
    items: toolPages.filter((page) => page.category === "Tính lãi suất"),
  },
  {
    title: "Tiền điện nước",
    items: toolPages.filter((page) => page.category === "Tiền điện nước"),
  },
  {
    title: "Thuế TNCN",
    items: toolPages.filter((page) => page.category === "Thuế TNCN"),
  },
  {
    title: "Lãi vay",
    items: toolPages.filter((page) => page.category === "Lãi vay"),
  },
  {
    title: "IT",
    items: toolPages.filter((page) => page.category === "IT"),
  },
  {
    title: "Tự do tài chính",
    items: toolPages.filter((page) => page.category === "Tự do tài chính"),
  },
  {
    title: "Công cụ khác",
    items: toolPages.filter((page) => page.category === "Công cụ khác"),
  },
];
