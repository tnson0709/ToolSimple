import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { sidebarGroups, type ToolPage } from "./toolPages";

export default function HomePage() {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(sidebarGroups.map((group) => [group.title, true]))
  );
  const pathname = location.pathname === "/" ? "/lai-suat" : location.pathname;
  const currentPage = useMemo(
    () => sidebarGroups.flatMap((group) => group.items).find((page) => page.path === pathname) ?? sidebarGroups[0].items[0],
    [pathname]
  );

  function toggleGroup(title: string) {
    setExpandedGroups((current) => ({ ...current, [title]: !current[title] }));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              ToolSimple
            </p>
            <h1 className="text-lg font-bold">Bộ công cụ tài chính & kỹ thuật</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row">
        <aside className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-72">
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Danh mục
            </p>
          </div>
          <div className="space-y-2">
            {sidebarGroups.map((group) => {
              const isExpanded = expandedGroups[group.title] ?? true;
              return (
                <div key={group.title} className="rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.title)}
                    className="mb-2 flex w-full items-center justify-between px-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <span>{group.title}</span>
                    <span className="text-xs">{isExpanded ? "▾" : "▸"}</span>
                  </button>
                  {isExpanded ? (
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            `block rounded-lg px-3 py-2 text-sm transition ${
                              isActive
                                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            }`
                          }
                        >
                          {item.title}
                        </NavLink>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex flex-col gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{currentPage.category}</p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{currentPage.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">{currentPage.description}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {currentPage.path}
              </span>
            </div>
          </div>

          {currentPage.kind === "simple-interest" ? (
            <SimpleInterestPage page={currentPage} />
          ) : currentPage.kind === "compound-interest" ? (
            <CompoundInterestPage page={currentPage} />
          ) : currentPage.kind === "financial-freedom" ? (
            <FinancialFreedomPage page={currentPage} />
          ) : currentPage.id === "electricity" || currentPage.id === "water" ? (
            <UtilityBillPage page={currentPage} />
          ) : currentPage.id === "six-bottle" || currentPage.id === "seven-bottle" ? (
            <SevenBottlePage page={currentPage} />
          ) : (
            <DefaultValuePage page={currentPage} />
          )}
        </main>
      </div>
    </div>
  );
}

function SimpleInterestPage({ page }: { page: ToolPage }) {
  const [values, setValues] = useState(page.defaults);
  const principal = values.principal ?? 0;
  const rate = values.rate ?? 0;
  const years = values.years ?? 0;
  const total = principal * (1 + (rate / 100) * years);
  const interest = total - principal;

  function updateField(field: string, nextValue: number) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { key: "principal", label: "Số tiền gốc", unit: "₫" },
          { key: "rate", label: "Lãi suất (%)", unit: "%" },
          { key: "years", label: "Thời gian (năm)", unit: "năm" },
        ].map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="number"
              value={values[field.key] ?? 0}
              onChange={(event) => updateField(field.key, Number(event.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setValues({ ...page.defaults })}>Reset giá trị mặc định</Button>
        <Button variant="outline">Tính ngay</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kết quả</CardTitle>
            <CardDescription>Giá trị sau {years} năm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Tổng tiền</p>
              <p className="text-2xl font-semibold">{total.toLocaleString("vi-VN")} ₫</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Tiền lãi</p>
              <p className="text-2xl font-semibold">{interest.toLocaleString("vi-VN")} ₫</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin nhanh</CardTitle>
            <CardDescription>Công thức: A = P × (1 + r × t)</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-300">
            <p>Với số tiền gốc {principal.toLocaleString("vi-VN")} ₫, lãi suất {rate}% trong {years} năm.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CompoundInterestPage({ page }: { page: ToolPage }) {
  const [values, setValues] = useState(page.defaults);
  const principal = values.principal ?? 0;
  const rate = values.rate ?? 0;
  const years = values.years ?? 0;
  const contribution = values.contribution ?? 0;
  const compounding = values.compounding ?? 1;
  const monthlyRate = rate / 100 / compounding;
  const periods = compounding * years;
  const futureValue =
    principal * Math.pow(1 + monthlyRate, periods) +
    contribution * ((Math.pow(1 + monthlyRate, periods) - 1) / monthlyRate);
  const interest = futureValue - principal - contribution * periods;

  function updateField(field: string, nextValue: number) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { key: "principal", label: "Số tiền gốc", unit: "₫" },
          { key: "rate", label: "Lãi suất (%)", unit: "%" },
          { key: "years", label: "Thời gian (năm)", unit: "năm" },
          { key: "contribution", label: "Đóng thêm mỗi kỳ", unit: "₫" },
          { key: "compounding", label: "Số kỳ/năm", unit: "kỳ" },
        ].map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="number"
              value={values[field.key] ?? 0}
              onChange={(event) => updateField(field.key, Number(event.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setValues({ ...page.defaults })}>Reset giá trị mặc định</Button>
        <Button variant="outline">Tính ngay</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kết quả cuối cùng</CardTitle>
            <CardDescription>Giá trị tương lai với lãi nhập gốc</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Tổng giá trị</p>
              <p className="text-2xl font-semibold">{futureValue.toLocaleString("vi-VN")} ₫</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Tiền lãi</p>
              <p className="text-2xl font-semibold">{interest.toLocaleString("vi-VN")} ₫</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin nhanh</CardTitle>
            <CardDescription>Công thức lãi kép với các kỳ ghép lãi</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-300">
            <p>Đang tính cho {periods} kỳ lãi với lãi suất {rate}%/năm và đóng thêm {contribution.toLocaleString("vi-VN")} ₫ mỗi kỳ.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UtilityBillPage({ page }: { page: ToolPage }) {
  const [values, setValues] = useState(page.defaults);
  const usage = values.usage ?? 0;
  const serviceFee = values.serviceFee ?? 0;
  const tiers = getUtilityTiers(page.id);
  const isWater = page.id === "water";

  function updateField(field: string, nextValue: number) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  const breakdown = tiers.map((tier, index) => {
    const lowerBound = index === 0 ? 0 : tiers[index - 1].upper;
    const upperBound = tier.upper;
    const amount = Math.max(0, Math.min(usage, upperBound) - lowerBound);
    const price = values[tier.priceKey] ?? tier.price;
    return {
      ...tier,
      amount,
      price,
      cost: amount * price,
    };
  });

  const subtotal = breakdown.reduce((sum, item) => sum + item.cost, 0);
  const environmentalFee = isWater ? subtotal * 0.05 : 0;
  const total = subtotal + serviceFee + environmentalFee;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="usage">{isWater ? "Lượng nước sử dụng" : "Số lượng sử dụng"}</Label>
          <Input
            id="usage"
            type="number"
            value={values.usage ?? 0}
            onChange={(event) => updateField("usage", Number(event.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceFee">Phí dịch vụ</Label>
          <Input
            id="serviceFee"
            type="number"
            value={values.serviceFee ?? 0}
            onChange={(event) => updateField("serviceFee", Number(event.target.value))}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.priceKey} className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <Label htmlFor={tier.priceKey}>{tier.label}</Label>
            <Input
              id={tier.priceKey}
              type="number"
              value={values[tier.priceKey] ?? tier.price}
              onChange={(event) => updateField(tier.priceKey, Number(event.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setValues({ ...page.defaults })}>Reset giá trị mặc định</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Kết quả thanh toán</CardTitle>
            <CardDescription>Tính theo từng bậc giá và có thể chỉnh giá trực tiếp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Tổng tiền cần thanh toán</p>
              <p className="text-2xl font-semibold">{total.toLocaleString("vi-VN")} ₫</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Tiền hàng theo bậc</p>
              <p className="text-xl font-semibold">{subtotal.toLocaleString("vi-VN")} ₫</p>
            </div>
            {isWater ? (
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Phí bảo vệ môi trường (5%)</p>
                <p className="text-xl font-semibold">{environmentalFee.toLocaleString("vi-VN")} ₫</p>
              </div>
            ) : null}
            <div className="space-y-2">
              {breakdown.map((item) => (
                <div key={item.priceKey} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                  <span>{item.label}</span>
                  <span>{item.amount.toLocaleString("vi-VN")} {isWater ? "m3" : "kWh"} × {item.price.toLocaleString("vi-VN")} ₫</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin nhanh</CardTitle>
            <CardDescription>Giá từng bậc được dùng để tính toán ngay tại đây</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>Đã nhập {usage.toLocaleString("vi-VN")} {isWater ? "m3" : "kWh"}.</p>
            <p>Phí dịch vụ: {serviceFee.toLocaleString("vi-VN")} ₫.</p>
            {isWater ? <p>Phí bảo vệ môi trường được tính tự động bằng 5% trên tiền hàng theo bậc.</p> : null}
            <p>Bạn có thể thay đổi giá ở từng ô nhập bên trên để thử các mức giá khác nhau.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FinancialFreedomPage({ page }: { page: ToolPage }) {
  const [values, setValues] = useState(page.defaults);

  function updateField(field: string, nextValue: number) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  const monthlyExpenses = values.monthlyExpenses ?? 0;
  const monthlyPassiveIncome = values.monthlyPassiveIncome ?? 0;
  const monthlyDebtPayment = values.monthlyDebtPayment ?? 0;
  const monthlyIncome = values.monthlyIncome ?? 0;
  const monthlySavings = values.monthlySavings ?? 0;
  const assets = values.assets ?? 0;
  const liabilities = values.liabilities ?? 0;
  const emergencyMonths = values.emergencyMonths ?? 6;
  const growthRate = values.growthRate ?? 0;
  const investmentYears = values.investmentYears ?? 10;

  const annualExpenses = monthlyExpenses * 12;
  const fiTarget = annualExpenses * 25;
  const fiRatio = monthlyExpenses > 0 ? monthlyPassiveIncome / monthlyExpenses : 0;
  const debtRatio = monthlyIncome > 0 ? monthlyDebtPayment / monthlyIncome : 0;
  const netWorth = assets - liabilities;
  const savingsRate = monthlyIncome > 0 ? monthlySavings / monthlyIncome : 0;
  const emergencyFundTarget = monthlyExpenses * emergencyMonths;
  const emergencyFundMin = monthlyExpenses * 6;
  const emergencyFundMax = monthlyExpenses * 12;
  const yearsToDouble = growthRate > 0 ? 72 / growthRate : 0;
  const projectedValue = netWorth * Math.pow(1 + growthRate / 100, investmentYears);

  const fiStatus = fiRatio >= 1 ? "Đã đạt mục tiêu FI" : fiRatio >= 0.5 ? "Đang ở nửa chặng đường" : "Cần tăng thu nhập thụ động";
  const debtStatus = debtRatio < 0.3 ? "Tốt" : debtRatio < 0.4 ? "Chấp nhận được" : "Nguy hiểm";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { key: "monthlyExpenses", label: "Chi phí hàng tháng", unit: "₫" },
          { key: "monthlyPassiveIncome", label: "Thu nhập thụ động hàng tháng", unit: "₫" },
          { key: "monthlyDebtPayment", label: "Tiền trả nợ hàng tháng", unit: "₫" },
          { key: "monthlyIncome", label: "Thu nhập hàng tháng", unit: "₫" },
          { key: "monthlySavings", label: "Số tiền tiết kiệm hàng tháng", unit: "₫" },
          { key: "assets", label: "Tài sản", unit: "₫" },
          { key: "liabilities", label: "Nợ", unit: "₫" },
          { key: "emergencyMonths", label: "Số tháng quỹ khẩn cấp", unit: "tháng" },
          { key: "growthRate", label: "Lãi suất kỳ vọng (%)", unit: "%" },
          { key: "investmentYears", label: "Số năm đầu tư", unit: "năm" },
        ].map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="number"
              value={values[field.key] ?? 0}
              onChange={(event) => updateField(field.key, Number(event.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setValues({ ...page.defaults })}>Reset giá trị mặc định</Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mục tiêu tự do tài chính</CardTitle>
              <CardDescription>Quy tắc 4%: mục tiêu cần có = chi phí năm × 25</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Chi phí năm</p>
                <p className="text-2xl font-semibold">{annualExpenses.toLocaleString("vi-VN")} ₫</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Mục tiêu FI</p>
                <p className="text-2xl font-semibold">{fiTarget.toLocaleString("vi-VN")} ₫</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chỉ số tài chính</CardTitle>
              <CardDescription>Đánh giá tiến độ và mức độ an toàn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">FI Ratio</p>
                <p className="text-2xl font-semibold">{(fiRatio * 100).toFixed(1)}%</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{fiStatus}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Tỷ lệ nợ</p>
                <p className="text-2xl font-semibold">{(debtRatio * 100).toFixed(1)}%</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{debtStatus}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quỹ khẩn cấp</CardTitle>
              <CardDescription>Khuyến nghị 6–12 tháng chi phí</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Mục tiêu theo {emergencyMonths} tháng</p>
                <p className="text-2xl font-semibold">{emergencyFundTarget.toLocaleString("vi-VN")} ₫</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Khuyến nghị 6–12 tháng</p>
                <p className="text-xl font-semibold">{emergencyFundMin.toLocaleString("vi-VN")} ₫ – {emergencyFundMax.toLocaleString("vi-VN")} ₫</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quy tắc 72 & lãi kép</CardTitle>
              <CardDescription>Ước tính thời gian tăng gấp đôi và giá trị tương lai</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Thời gian tăng gấp đôi</p>
                <p className="text-2xl font-semibold">{yearsToDouble.toFixed(1)} năm</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Giá trị tương lai</p>
                <p className="text-2xl font-semibold">{projectedValue.toLocaleString("vi-VN")} ₫</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt nhanh</CardTitle>
            <CardDescription>Những chỉ số cốt lõi để theo dõi tiến độ FI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Tài sản ròng</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{netWorth.toLocaleString("vi-VN")} ₫</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Tỷ lệ tiết kiệm</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{(savingsRate * 100).toFixed(1)}%</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Công thức dùng</p>
              <p>FI target = chi phí năm × 25</p>
              <p>FI ratio = thu nhập thụ động / chi phí</p>
              <p>Debt ratio = trả nợ / thu nhập</p>
              <p>Quỹ khẩn cấp = chi phí × 6–12 tháng</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SevenBottlePage({ page }: { page: ToolPage }) {
  const [values, setValues] = useState(page.defaults);

  function updateField(field: string, nextValue: number) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  const income = values.income ?? 0;
  const ratioFields = [
    { key: "essential", label: "Lọ 1 – Cần thiết", description: "Nhà ở, thực phẩm, đi lại" },
    { key: "investment", label: "Lọ 2 – Đầu tư", description: "Quỹ dài hạn, đầu tư" },
    { key: "shortTerm", label: "Lọ 3 – Mục tiêu ngắn hạn", description: "Du lịch, mua sắm lớn" },
    { key: "lifestyle", label: "Lọ 4 – Phong cách sống", description: "Giải trí, sở thích" },
    { key: "education", label: "Lọ 5 – Giáo dục", description: "Khóa học, phát triển bản thân" },
    { key: "charity", label: "Lọ 6 – Từ thiện", description: "Quyên góp, hỗ trợ cộng đồng" },
    { key: "emergency", label: "Lọ 7 – Khẩn cấp", description: "Quỹ dự phòng, sự cố" },
  ];

  const allocations = ratioFields.map((field) => {
    const percent = values[field.key] ?? 0;
    return {
      ...field,
      percent,
      amount: income * (percent / 100),
    };
  });

  const totalPercent = allocations.reduce((sum, item) => sum + item.percent, 0);
  const totalAllocated = allocations.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2 md:col-span-2 xl:col-span-1">
          <Label htmlFor="income">Thu nhập hàng tháng</Label>
          <Input
            id="income"
            type="number"
            value={values.income ?? 0}
            onChange={(event) => updateField("income", Number(event.target.value))}
          />
        </div>
        {ratioFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="number"
              value={values[field.key] ?? 0}
              onChange={(event) => updateField(field.key, Number(event.target.value))}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">{field.description}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setValues({ ...page.defaults })}>Reset giá trị mặc định</Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ theo từng lọ</CardTitle>
            <CardDescription>Công thức dùng: số tiền lọ = thu nhập × tỷ lệ / 100</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Tổng phần trăm</p>
              <p className="text-2xl font-semibold">{totalPercent.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Tổng tiền phân bổ</p>
              <p className="text-2xl font-semibold">{totalAllocated.toLocaleString("vi-VN")} ₫</p>
            </div>
            <div className="space-y-2">
              {allocations.map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-slate-500 dark:text-slate-400">{item.percent}%</p>
                  </div>
                  <p className="font-semibold">{item.amount.toLocaleString("vi-VN")} ₫</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gợi ý nhanh</CardTitle>
            <CardDescription>Điều chỉnh các tỷ lệ để phù hợp với mục tiêu tài chính</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Thu nhập nhập vào: {income.toLocaleString("vi-VN")} ₫.</p>
            <p>Công thức dùng cho mỗi lọ là thu nhập × phần trăm / 100.</p>
            <p>
              {totalPercent === 100
                ? "Tổng tỷ lệ đang bằng 100%, phù hợp với mô hình phân bổ đầy đủ."
                : `Bạn còn thiếu ${(100 - totalPercent).toFixed(1)}% để đạt tổng 100%.`}
            </p>
            <p>Nếu muốn, bạn có thể thay đổi tỷ lệ từng lọ cho phù hợp với mục tiêu cá nhân.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DefaultValuePage({ page }: { page: ToolPage }) {
  const [values, setValues] = useState(page.defaults);

  function updateField(field: string, nextValue: number) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{formatFieldLabel(key)}</Label>
            <Input
              id={key}
              type="number"
              value={value}
              onChange={(event) => updateField(key, Number(event.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setValues({ ...page.defaults })}>Reset giá trị mặc định</Button>
        <Button variant="outline">Lưu mẫu</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Giá trị hiện tại</CardTitle>
          <CardDescription>Giá trị đang được dùng cho công cụ này</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(values).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">{formatFieldLabel(key)}</p>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getUtilityTiers(pageId: string) {
  if (pageId === "electricity") {
    return [
      { label: "Bậc 1 (0–50 kWh)", upper: 50, priceKey: "tier1Price", price: 1728 },
      { label: "Bậc 2 (51–100 kWh)", upper: 100, priceKey: "tier2Price", price: 1786 },
      { label: "Bậc 3 (101–200 kWh)", upper: 200, priceKey: "tier3Price", price: 2074 },
      { label: "Bậc 4 (201–300 kWh)", upper: 300, priceKey: "tier4Price", price: 2612 },
      { label: "Bậc 5 (301–400 kWh)", upper: 400, priceKey: "tier5Price", price: 2919 },
      { label: "Bậc 6 (>400 kWh)", upper: Number.POSITIVE_INFINITY, priceKey: "tier6Price", price: 3015 },
    ];
  }

  return [
    { label: "Bậc 1 (0–10 m3)", upper: 10, priceKey: "tier1Price", price: 35000 },
    { label: "Bậc 2 (11–20 m3)", upper: 20, priceKey: "tier2Price", price: 38000 },
    { label: "Bậc 3 (>20 m3)", upper: Number.POSITIVE_INFINITY, priceKey: "tier3Price", price: 40000 },
  ];
}

function formatFieldLabel(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

