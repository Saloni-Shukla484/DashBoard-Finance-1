"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CreditCard,
  Download,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Transaction = {
  id: number;
  name: string;
  category: string;
  date: string;
  method: string;
  amount: number;
  color: string;
  initials: string;
};
const initialTransactions: Transaction[] = [
  {
    id: 1,
    name: "Whole Foods Market",
    category: "Groceries",
    date: "Jun 18, 2024",
    method: "Visa •••• 4821",
    amount: -86.42,
    color: "#d8edcf",
    initials: "WF",
  },
  {
    id: 2,
    name: "Figma Professional",
    category: "Subscriptions",
    date: "Jun 17, 2024",
    method: "Visa •••• 4821",
    amount: -15,
    color: "#f2e1ff",
    initials: "F",
  },
  {
    id: 3,
    name: "Acme Inc. Payroll",
    category: "Income",
    date: "Jun 15, 2024",
    method: "Direct deposit",
    amount: 4200,
    color: "#d8eaff",
    initials: "AI",
  },
  {
    id: 4,
    name: "Blue Bottle Coffee",
    category: "Dining",
    date: "Jun 14, 2024",
    method: "Apple Pay",
    amount: -6.8,
    color: "#ffe4bd",
    initials: "BB",
  },
  {
    id: 5,
    name: "Lyft Ride",
    category: "Transport",
    date: "Jun 12, 2024",
    method: "Visa •••• 4821",
    amount: -24.5,
    color: "#ffe0db",
    initials: "L",
  },
];
const expenseTrend = [
  { month: "Jan", expenses: 2480, income: 5100 },
  { month: "Feb", expenses: 2210, income: 5100 },
  { month: "Mar", expenses: 2960, income: 5200 },
  { month: "Apr", expenses: 2380, income: 5200 },
  { month: "May", expenses: 2770, income: 5400 },
  { month: "Jun", expenses: 1987, income: 5400 },
];
const categories = [
  { name: "Housing", value: 980, color: "#f26b5b" },
  { name: "Food", value: 410, color: "#f2c94c" },
  { name: "Transport", value: 248, color: "#5f8fe9" },
  { name: "Other", value: 349, color: "#58b3a7" },
];
const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Transactions", icon: CreditCard },
  { label: "Analytics", icon: TrendingUp },
  { label: "Accounts", icon: Wallet },
  { label: "Settings", icon: Settings },
];

function Money({ value }: { value: number }) {
  return (
    <span>
      {value < 0 ? "-" : ""}$
      {Math.abs(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
function StatCard({
  title,
  value,
  change,
  icon,
  tone,
}: {
  title: string;
  value: number;
  change: string;
  icon: React.ReactNode;
  tone: "coral" | "teal" | "blue";
}) {
  return (
    <div className="animate-rise rounded-[20px] border border-[#dce1d9] bg-white p-5 shadow-[0_5px_20px_rgba(35,49,42,0.03)]">
      <div className="mb-6 flex items-start justify-between">
        <span className="text-sm font-medium text-[#718078]">{title}</span>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === "coral" ? "bg-[#ffe6df] text-[#d95849]" : tone === "teal" ? "bg-[#dff4ef] text-[#368f83]" : "bg-[#e2ebff] text-[#4e78ca]"}`}
        >
          {icon}
        </div>
      </div>
      <div className="display text-[28px] font-semibold tracking-[-1px]">
        <Money value={value} />
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
        <ArrowUpRight size={14} className="text-[#3b9c79]" />
        <span className="text-[#3b9c79]">{change}</span>
        <span className="text-[#718078]">vs last month</span>
      </div>
    </div>
  );
}
function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="display text-lg font-semibold">{title}</h2>
      {action && (
        <button className="text-sm font-semibold text-[#d85d4f] hover:underline">
          {action}
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [month, setMonth] = useState("June 2024");
  const [showModal, setShowModal] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const filteredTransactions = useMemo(
    () =>
      transactions.filter(
        (tx) =>
          (tx.name.toLowerCase().includes(query.toLowerCase()) ||
            tx.category.toLowerCase().includes(query.toLowerCase())) &&
          (categoryFilter === "All categories" ||
            tx.category === categoryFilter),
      ),
    [transactions, query, categoryFilter],
  );
  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }
  function addExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    const name = String(form.get("name"));
    setTransactions((current) => [
      {
        id: Date.now(),
        name,
        category: String(form.get("category")),
        date: "Jun 20, 2024",
        method: "Visa •••• 4821",
        amount: -amount,
        color: "#ffe0db",
        initials: name.slice(0, 2).toUpperCase(),
      },
      ...current,
    ]);
    setShowModal(false);
    notify("Expense added to your ledger");
  }
  return (
    <div className="min-h-screen bg-[#f5f3ee] text-[#17231f]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-[#dce1d9] bg-[#fbfaf7] px-5 py-6 transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f26b5b] text-lg font-bold text-white">
              L
            </div>
            <span className="display text-xl font-bold tracking-[-.8px]">
              Ledgerly
            </span>
          </div>
          <button onClick={() => setMobileNav(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>
        <div className="mt-12 px-2 text-[10px] font-bold uppercase tracking-[1.5px] text-[#9aa49e]">
          Workspace
        </div>
        <nav className="mt-3 space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActive(label);
                setMobileNav(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active === label ? "bg-[#ffe6df] text-[#cf5b4d]" : "text-[#64716a] hover:bg-[#f0f0eb]"}`}
            >
              <Icon size={18} />
              {label}
              {label === "Transactions" && (
                <span className="ml-auto rounded-md bg-[#eceee9] px-1.5 py-0.5 text-[10px] text-[#77837c]">
                  12
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#e8f1eb] p-4">
          <p className="display text-sm font-semibold">
            Make every dollar count.
          </p>
          <p className="mt-1 text-xs leading-5 text-[#73837a]">
            Your financial picture is looking healthy this month.
          </p>
          <button className="mt-3 text-xs font-bold text-[#3c8c73] hover:underline">
            View insights <ArrowUpRight className="inline" size={12} />
          </button>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-[#dce1d9] pt-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d5e8df] text-xs font-bold text-[#3c806b]">
            SS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">Saloni Shukla</p>
            <p className="truncate text-xs text-[#718078]">
              soniya9151@gmail.com
            </p>
          </div>
          <MoreHorizontal size={17} className="text-[#95a099]" />
        </div>
      </aside>
      {mobileNav && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-30 bg-[#17231f]/20 lg:hidden"
        />
      )}
      <main className="lg:ml-[250px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#dce1d9] bg-[rgba(245,243,238,.88)] px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileNav(true)} className="lg:hidden">
              <Menu size={22} />
            </button>
            <div>
              <p className="text-xs font-medium text-[#718078]">
                Tuesday, June 20, 2024
              </p>
              <h1 className="display text-xl font-semibold">
                Good morning, Saloni <span className="inline-block"></span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => notify("You are all caught up")}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce1d9] bg-white text-[#718078] hover:border-[#bac6bc]"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#f26b5b]" />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#17231f] px-3.5 py-2.5 text-sm font-bold text-white transition hover:bg-[#30433a]"
            >
              <Plus size={17} />{" "}
              <span className="hidden sm:inline">Add expense</span>
            </button>
          </div>
        </header>
        {active === "Overview" ? (
          <Overview
            transactions={transactions}
            month={month}
            setMonth={setMonth}
            notify={notify}
            setActive={setActive}
          />
        ) : (
          <PagePlaceholder
            active={active}
            onAdd={() => setShowModal(true)}
            transactions={filteredTransactions}
            query={query}
            setQuery={setQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        )}
      </main>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#17231f] px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <Check size={16} className="text-[#72d0b0]" />
          {toast}
        </div>
      )}
      {showModal && (
        <ExpenseModal
          onClose={() => setShowModal(false)}
          onSubmit={addExpense}
        />
      )}
    </div>
  );
}

function Overview({
  transactions,
  month,
  setMonth,
  notify,
  setActive,
}: {
  transactions: Transaction[];
  month: string;
  setMonth: (value: string) => void;
  notify: (message: string) => void;
  setActive: (value: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[1420px] px-5 py-7 sm:px-8 lg:px-10">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[1.6px] text-[#d85d4f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f26b5b]" /> Financial
            overview
          </div>
          <h2 className="display text-[30px] font-semibold tracking-[-1.4px] sm:text-[36px]">
            Your money, in focus.
          </h2>
          <p className="mt-1 text-sm text-[#718078]">
            Here&apos;s how your finances are shaping up this month.
          </p>
        </div>
        <label className="flex w-fit items-center gap-2 rounded-xl border border-[#dce1d9] bg-white px-3 py-2 text-sm font-semibold">
          <CalendarDays size={16} className="text-[#718078]" />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent outline-none"
          >
            <option>June 2024</option>
            <option>May 2024</option>
            <option>April 2024</option>
          </select>
          <ChevronDown size={15} className="text-[#718078]" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total balance"
          value={12840.5}
          change="8.4%"
          tone="teal"
          icon={<Wallet size={17} />}
        />
        <StatCard
          title="Total income"
          value={5400}
          change="4.2%"
          tone="blue"
          icon={<ArrowDownRight size={18} />}
        />
        <StatCard
          title="Total expenses"
          value={1987.72}
          change="12.8%"
          tone="coral"
          icon={<ArrowUpRight size={18} />}
        />
        <StatCard
          title="Net savings"
          value={3412.28}
          change="16.5%"
          tone="teal"
          icon={<TrendingUp size={17} />}
        />
      </div>
      <div className="mt-7 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <section className="rounded-[20px] border border-[#dce1d9] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <SectionTitle title="Spending overview" />
              <p className="-mt-2 text-xs text-[#718078]">
                Income vs expenses over the last 6 months
              </p>
            </div>
            <button
              onClick={() => notify("Chart data exported")}
              className="flex items-center gap-1.5 rounded-lg border border-[#dce1d9] px-2.5 py-2 text-xs font-bold text-[#64716a] hover:bg-[#f8f8f5]"
            >
              <Download size={14} /> Export
            </button>
          </div>
          <div className="mt-6 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={expenseTrend}
                margin={{ top: 5, right: 0, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f26b5b" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#f26b5b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#58b3a7" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#58b3a7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#edf0eb" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a099" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a099" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #dce1d9",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    "",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#58b3a7"
                  strokeWidth={2.5}
                  fill="url(#income)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f26b5b"
                  strokeWidth={2.5}
                  fill="url(#expense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-5 text-xs font-medium text-[#718078]">
            <span className="flex items-center gap-2">
              <i className="h-2 w-2 rounded-full bg-[#58b3a7]" /> Income
            </span>
            <span className="flex items-center gap-2">
              <i className="h-2 w-2 rounded-full bg-[#f26b5b]" /> Expenses
            </span>
          </div>
        </section>
        <section className="rounded-[20px] border border-[#dce1d9] bg-white p-5 sm:p-6">
          <SectionTitle title="Where it goes" action="Details" />
          <p className="-mt-2 text-xs text-[#718078]">
            June spending by category
          </p>
          <div className="relative mx-auto mt-3 h-[210px] w-full max-w-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="value"
                  innerRadius={66}
                  outerRadius={91}
                  paddingAngle={4}
                  stroke="none"
                >
                  {categories.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    "Spent",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="display text-2xl font-bold">$1,987</span>
              <span className="text-xs text-[#718078]">total spent</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {categories.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-[#718078]">
                  <i
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </span>
                <b className="font-semibold">${item.value}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <SectionTitle title="Recent transactions" />
            <p className="-mt-2 text-xs text-[#718078]">
              Your latest money movements
            </p>
          </div>
          <button
            onClick={() => setActive("Transactions")}
            className="text-sm font-bold text-[#d85d4f] hover:underline"
          >
            View all <ArrowUpRight className="inline" size={14} />
          </button>
        </div>
        <div className="overflow-hidden rounded-[20px] border border-[#dce1d9] bg-white">
          <div className="hidden grid-cols-[1.7fr_1fr_1fr_120px] border-b border-[#dce1d9] px-5 py-3 text-[10px] font-bold uppercase tracking-[1.2px] text-[#9aa49e] sm:grid">
            <span>Transaction</span>
            <span>Date</span>
            <span>Payment method</span>
            <span className="text-right">Amount</span>
          </div>
          {transactions.slice(0, 4).map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <div className="grid items-center gap-3 border-b border-[#dce1d9] px-5 py-4 last:border-0 sm:grid-cols-[1.7fr_1fr_1fr_120px]">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
          style={{ backgroundColor: transaction.color }}
        >
          {transaction.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{transaction.name}</p>
          <p className="text-xs text-[#718078]">{transaction.category}</p>
        </div>
      </div>
      <span className="hidden text-xs text-[#718078] sm:block">
        {transaction.date}
      </span>
      <span className="hidden text-xs text-[#718078] sm:block">
        {transaction.method}
      </span>
      <span
        className={`text-right text-sm font-bold ${transaction.amount > 0 ? "text-[#399579]" : ""}`}
      >
        {transaction.amount > 0 ? "+" : ""}
        <Money value={transaction.amount} />
      </span>
    </div>
  );
}
function PagePlaceholder({
  active,
  onAdd,
  transactions,
  query,
  setQuery,
  categoryFilter,
  setCategoryFilter,
}: {
  active: string;
  onAdd: () => void;
  transactions: Transaction[];
  query: string;
  setQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}) {
  if (active === "Transactions")
    return (
      <div className="mx-auto max-w-[1420px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[1.6px] text-[#d85d4f]">
              Money movement
            </div>
            <h2 className="display text-[32px] font-semibold tracking-[-1.2px]">
              Transactions
            </h2>
            <p className="mt-1 text-sm text-[#718078]">
              Every in and out, all in one place.
            </p>
          </div>
          <button
            onClick={onAdd}
            className="flex w-fit items-center gap-2 rounded-xl bg-[#17231f] px-4 py-3 text-sm font-bold text-white"
          >
            <Plus size={17} /> Add expense
          </button>
        </div>
        <div className="rounded-[20px] border border-[#dce1d9] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#dce1d9] p-4 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-[#dce1d9] px-3 text-sm text-[#718078]">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search transactions"
                className="w-full py-2.5 outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-[#dce1d9] px-3 text-sm text-[#718078]">
              <SlidersHorizontal size={15} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white py-2.5 outline-none"
              >
                <option>All categories</option>
                <option>Groceries</option>
                <option>Subscriptions</option>
                <option>Income</option>
                <option>Dining</option>
                <option>Transport</option>
              </select>
            </label>
          </div>
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))}
          {!transactions.length && (
            <div className="p-10 text-center text-sm text-[#718078]">
              No transactions match your search.
            </div>
          )}
        </div>
      </div>
    );
  return (
    <div className="mx-auto max-w-[1420px] px-5 py-12 sm:px-8 lg:px-10">
      <div className="rounded-[24px] border border-[#dce1d9] bg-white p-8 text-center sm:p-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffe6df] text-[#d85d4f]">
          <Settings size={24} />
        </div>
        <h2 className="display mt-5 text-2xl font-bold">
          {active} is ready for your data
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718078]">
          This frontend prototype keeps the experience intentionally focused.
          Connect your backend here when the next task begins.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl border border-[#dce1d9] px-4 py-2.5 text-sm font-bold"
        >
          Refresh workspace
        </button>
      </div>
    </div>
  );
}
function ExpenseModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#17231f]/35 p-0 sm:items-center sm:p-5">
      <div className="w-full max-w-[480px] rounded-t-[24px] bg-white p-6 shadow-2xl sm:rounded-[24px]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="display text-xl font-bold">Add an expense</h2>
            <p className="mt-1 text-xs text-[#718078]">
              Keep your ledger up to date.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#718078] hover:bg-[#f0f1ed]"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-semibold">
            Expense name
            <input
              name="name"
              required
              placeholder="e.g. Dinner with friends"
              className="mt-1.5 w-full rounded-xl border border-[#dce1d9] px-3.5 py-3 text-sm outline-none focus:border-[#f26b5b]"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-semibold">
              Amount
              <input
                name="amount"
                required
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="mt-1.5 w-full rounded-xl border border-[#dce1d9] px-3.5 py-3 text-sm outline-none focus:border-[#f26b5b]"
              />
            </label>
            <label className="block text-sm font-semibold">
              Category
              <select
                name="category"
                className="mt-1.5 w-full rounded-xl border border-[#dce1d9] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#f26b5b]"
              >
                <option>Dining</option>
                <option>Groceries</option>
                <option>Transport</option>
                <option>Housing</option>
                <option>Subscriptions</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-semibold">
            Description{" "}
            <span className="font-normal text-[#718078]">(optional)</span>
            <textarea
              name="description"
              rows={3}
              placeholder="Add a note..."
              className="mt-1.5 w-full resize-none rounded-xl border border-[#dce1d9] px-3.5 py-3 text-sm outline-none focus:border-[#f26b5b]"
            />
          </label>
          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17231f] py-3.5 text-sm font-bold text-white hover:bg-[#30433a]">
            Add expense <ArrowUpRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
