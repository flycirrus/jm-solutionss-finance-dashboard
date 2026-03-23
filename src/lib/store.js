// LocalStorage based store for the Personal Finance Dashboard

const INITIAL_DATA = {
  user: {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    avatar: null,
    currency: "USD",
    monthlySpendingLimit: 3000,
  },
  transactions: [
    { id: "t1", type: "income", amount: 4500, category: "Salary", recipientName: "Tech Corp", status: "completed", date: new Date().toISOString(), notes: "May Salary" },
    { id: "t2", type: "expense", amount: 150, category: "Food & Grocery", recipientName: "Whole Foods", status: "completed", date: new Date().toISOString(), notes: "Weekly groceries" },
    { id: "t3", type: "expense", amount: 1200, category: "Bills & Utilities", recipientName: "City Apartments", status: "completed", date: new Date(Date.now() - 86400000).toISOString(), notes: "Rent" },
    { id: "t4", type: "expense", amount: 45, category: "Entertainment", recipientName: "Netflix", status: "completed", date: new Date(Date.now() - 172800000).toISOString(), notes: "Subscription" },
    { id: "t5", type: "income", amount: 500, category: "Freelance", recipientName: "Client A", status: "completed", date: new Date(Date.now() - 259200000).toISOString(), notes: "Website design" }
  ],
  categories: [
    { id: "c1", name: "Food & Grocery", type: "expense", icon: "shopping-cart" },
    { id: "c2", name: "Bills & Utilities", type: "expense", icon: "home" },
    { id: "c3", name: "Entertainment", type: "expense", icon: "film" },
    { id: "c4", name: "Salary", type: "income", icon: "briefcase" },
    { id: "c5", name: "Freelance", type: "income", icon: "monitor" }
  ],
  cards: [
    { id: "card1", cardNumber: "**** **** **** 1234", cardholderName: "John Doe", expiryDate: "12/25", cardType: "visa", nickname: "Primary Debit" }
  ],
  goals: [
    { id: "g1", name: "Emergency Fund", targetAmount: 10000, currentAmount: 4500, targetDate: new Date(Date.now() + 31536000000).toISOString() }
  ],
  budget: [
    { id: "b1", category: "Food & Grocery", allocatedAmount: 500, spentAmount: 150, month: "2026-03" },
    { id: "b2", category: "Entertainment", allocatedAmount: 200, spentAmount: 45, month: "2026-03" },
    { id: "b3", category: "Investment", allocatedAmount: 1000, spentAmount: 1000, month: "2026-03" }
  ]
};

const STORE_KEY = "jm_finance_dashboard_data";

export function loadData() {
  const data = localStorage.getItem(STORE_KEY);
  if (!data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(data);
}

export function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(STORE_KEY);
  return loadData();
}

export function addTransaction(transaction) {
  const data = loadData();
  data.transactions.unshift({ ...transaction, id: `t${Date.now()}`, date: transaction.date || new Date().toISOString() });
  saveData(data);
  return data;
}
