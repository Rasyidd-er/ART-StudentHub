import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  PlusCircle, 
  MinusCircle, 
  Calendar, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'College' | 'Org';
  completed: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

// --- Constants & Dummy Data ---
const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: '1', name: 'Kiriman Bulanan', amount: 2000000, category: 'Parent', type: 'income', date: new Date().toISOString() },
  { id: '2', name: 'Makan Siang', amount: 20000, category: 'Food', type: 'expense', date: new Date().toISOString() },
  { id: '3', name: 'Beasiswa', amount: 500000, category: 'Scholarship', type: 'income', date: new Date().toISOString() },
];

const DUMMY_TASKS: Task[] = [
  { id: 't1', title: 'Sains Data - Lab Report', priority: 'High', type: 'College', completed: false },
  { id: 't2', title: 'Matematika Diskrit - Quiz', priority: 'Medium', type: 'College', completed: false },
  { id: 't3', title: 'Rapat Medkom HMJ', priority: 'High', type: 'Org', completed: false },
  { id: 't4', title: 'Follow-up Sponsor Dies Natalis', priority: 'Low', type: 'Org', completed: false },
];

const QUOTES = [
  "Semangat belajarnya, ingat kiriman orang tua bukan buat foya-foya! 💪",
  "Makan Indomie hari ini, makan steak pas lulus nanti. Sabar ya! 🍜",
  "Tugas numpuk? Cicil pelan-pelan, yang penting selesai. Semangat! 📚",
  "Organisasi itu investasi relasi, tapi jangan lupa kuliah ya! 🤝",
  "Jangan lupa minum air putih, anak kos harus sehat terus! 🚰"
];

// --- Components ---

const ToastItem = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl z-50 border ${
      type === 'success' 
        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400' 
        : 'bg-rose-950/80 border-rose-500/50 text-rose-400'
    } backdrop-blur-md`}
  >
    {type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
      <X size={16} />
    </button>
  </motion.div>
);

export default function App() {
  // --- States ---
  const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);
  const [activeTab, setActiveTab] = useState<'College' | 'Org'>('College');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [quote, setQuote] = useState("");
  
  // Form States (Finance)
  const [txName, setTxName] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txCategory, setTxCategory] = useState("");

  // Form States (Task)
  const [taskName, setTaskName] = useState("");
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // --- Effects ---
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const interval = setInterval(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Helpers ---
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txName || !txAmount || !txCategory) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      name: txName,
      amount: parseFloat(txAmount),
      category: txCategory,
      type: txType,
      date: new Date().toISOString(),
    };

    setTransactions([newTx, ...transactions]);
    setTxName("");
    setTxAmount("");
    setTxCategory("");
    addToast(`Berhasil mencatat ${txType === 'income' ? 'pemasukan' : 'pengeluaran'}: ${txName}`);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskName,
      priority: taskPriority,
      type: activeTab,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setTaskName("");
    addToast(`Agenda ${activeTab} baru ditambahkan!`);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      addToast("Mantap! Satu tugas telah diselesaikan ✨");
    }
  };

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    addToast("Transaksi dihapus", "error");
  };

  // --- Derived Calculations ---
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') acc.income += curr.amount;
        else acc.expense += curr.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const balance = totals.income - totals.expense;

  const currentDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-10 selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* --- Header Section --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4 mb-4">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-500/30 shrink-0">
              S
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold tracking-tight text-white leading-none"
              >
                StudentHub
              </motion.h1>
              <p className="text-slate-400 text-sm mt-1.5 font-medium italic opacity-80 max-w-md">
                "{quote}"
              </p>
            </div>
          </div>
          
          <div className="text-left md:text-right border-l md:border-l-0 md:pl-0 pl-6 border-slate-800 md:flex flex-col items-end">
            <div className="text-2xl font-bold text-white tracking-tight leading-none">{currentDate}</div>
            <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-2">
              Konsultan Produktivitas Mahasiswa
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* --- LEFT COLUMN: Finance (Wallet Management) --- */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Main Balance Card */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] -mr-40 -mt-40 transition-all group-hover:bg-emerald-500/20 rounded-full" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-3 block">Saldo Utama Dompet</span>
                    <h2 className="text-5xl font-black text-white flex items-baseline gap-2 tabular-nums">
                      Rp {balance.toLocaleString('id-ID')}
                      <span className="text-emerald-500 text-base animate-pulse font-normal ml-2">●</span>
                    </h2>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 shadow-inner">
                    <Wallet size={28} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-slate-950/60 backdrop-blur-md p-5 rounded-3xl border border-slate-800 transition-all hover:bg-slate-950/80">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Total Pemasukan</span>
                    <div className="text-2xl font-black text-emerald-400">+Rp {totals.income.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="bg-slate-950/60 backdrop-blur-md p-5 rounded-3xl border border-slate-800 transition-all hover:bg-slate-950/80">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Total Pengeluaran</span>
                    <div className="text-2xl font-black text-rose-400">-Rp {totals.expense.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Input Form & History */}
            <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col min-h-0 overflow-hidden shadow-2xl shadow-black/50">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Manajemen Wallet</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Riwayat transaksi bulanan Anda</p>
                </div>
                <div className="bg-emerald-400/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-400/20">
                  Real-time Sync
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleAddTransaction} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/50 p-2 rounded-3xl border border-slate-800/50">
                    <div className="flex flex-col">
                      <input 
                        value={txName}
                        onChange={(e) => setTxName(e.target.value)}
                        placeholder="Nama Transaksi..."
                        className="bg-transparent border-none text-xs p-4 focus:ring-0 text-slate-200 placeholder:text-slate-600 outline-none w-full"
                      />
                    </div>
                    <div>
                      <input 
                        type="number"
                        value={txAmount}
                        onChange={(e) => setTxAmount(e.target.value)}
                        placeholder="Nominal..."
                        className="bg-transparent border-none text-xs p-4 focus:ring-0 text-slate-200 placeholder:text-slate-600 outline-none w-full"
                      />
                    </div>
                    <div>
                      <select 
                        value={txType}
                        onChange={(e) => setTxType(e.target.value as any)}
                        className="bg-transparent border-none text-xs p-4 focus:ring-0 text-slate-400 outline-none w-full appearance-none cursor-pointer"
                      >
                        <option value="expense">Pengeluaran</option>
                        <option value="income">Pemasukan</option>
                      </select>
                    </div>
                    <button 
                      type="submit"
                      className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all p-4"
                    >
                      Submit
                    </button>
                  </div>
                  
                  <div className="flex gap-4">
                    <input 
                       value={txCategory}
                       onChange={(e) => setTxCategory(e.target.value)}
                       placeholder="Kategori (misal: Makan, Kos)..."
                       className="flex-1 bg-slate-950/40 border border-slate-800 text-xs p-4 rounded-2xl text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </form>

                <div className="mt-10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="text-slate-500 text-[11px] uppercase tracking-widest border-b border-slate-800">
                      <tr className="text-left">
                        <th className="pb-5 px-2 font-bold select-none text-left">Transaksi</th>
                        <th className="pb-5 px-2 font-bold select-none text-center">Kategori</th>
                        <th className="pb-5 px-2 font-bold select-none text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      <AnimatePresence mode='popLayout'>
                        {transactions.length === 0 ? (
                          <tr><td colSpan={3} className="py-12 text-center text-slate-600 italic">Belum ada catatan transaksi.</td></tr>
                        ) : (
                          transactions.map((tx) => (
                            <motion.tr 
                              key={tx.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              layout
                              className="border-b border-slate-800/40 group hover:bg-slate-800/20 transition-all"
                            >
                              <td className="py-5 px-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-1.5 h-1.5 rounded-full ${tx.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                  <p className="font-semibold text-white">{tx.name}</p>
                                </div>
                              </td>
                              <td className="py-5 px-2 text-center">
                                <span className={`text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter ${
                                  tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {tx.category}
                                </span>
                              </td>
                              <td className="py-5 px-2 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <p className={`font-black tracking-tight ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {tx.type === 'income' ? '+' : '-'} {tx.amount.toLocaleString('id-ID')}
                                  </p>
                                  <button onClick={() => removeTransaction(tx.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-rose-500 transition-all">
                                    <X size={14} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: Tasks & Org (Agenda Module) --- */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col min-h-[600px] shadow-2xl relative overflow-hidden">
              <div className="p-4 flex bg-slate-950/40 gap-2 border-b border-slate-800 p-3">
                <button 
                  onClick={() => setActiveTab('College')}
                  className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-[1.25rem] ${
                    activeTab === 'College' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Kuliah
                </button>
                <button 
                  onClick={() => setActiveTab('Org')}
                  className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-[1.25rem] ${
                    activeTab === 'Org' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Organisasi
                </button>
              </div>

              <div className="p-8 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Agenda Terdekat</h3>
                  <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-500/20">
                    {tasks.filter(t => t.type === activeTab && !t.completed).length} Aktif
                  </span>
                </div>

                {/* Add Task Compact Form */}
                <form onSubmit={handleAddTask} className="mb-8 group">
                  <div className="flex gap-2">
                    <input 
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder={`Tambah agenda ${activeTab}...`}
                      className="flex-1 bg-slate-950/40 border border-slate-800 p-4 rounded-2xl text-xs text-white outline-none focus:border-indigo-500/50 transition-all"
                    />
                    <button type="submit" className="bg-slate-800 hover:bg-indigo-500 p-4 rounded-2xl text-white transition-all shadow-inner">
                      <PlusCircle size={20} />
                    </button>
                  </div>
                  <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                    {['Low', 'Medium', 'High'].map(p => (
                      <button 
                        key={p} 
                        type="button" 
                        onClick={() => setTaskPriority(p as any)}
                        className={`text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-widest transition-all ${
                          taskPriority === p ? 'bg-indigo-500 text-white' : 'bg-slate-950 text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </form>

                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {tasks.filter(t => t.type === activeTab).length === 0 ? (
                      <div className="text-center py-20 border-2 border-dashed border-slate-800/50 rounded-[2rem]">
                         <p className="text-slate-600 text-sm font-medium italic">Libur telah tiba? 🏝️</p>
                      </div>
                    ) : (
                      tasks
                        .filter(t => t.type === activeTab)
                        .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
                        .map((task) => (
                          <motion.div 
                            key={task.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className={`group bg-slate-950/40 border border-slate-800 p-5 rounded-3xl flex items-center justify-between hover:border-indigo-500/50 transition-all ${
                              task.completed ? 'opacity-50 grayscale' : 'shadow-sm'
                            }`}
                          >
                            <div className="flex gap-5 items-center">
                              <div className={`w-1.5 h-10 rounded-full shrink-0 ${
                                task.completed ? 'bg-slate-700' : 
                                task.priority === 'High' ? 'bg-indigo-500' : 
                                task.priority === 'Medium' ? 'bg-indigo-400/50' : 'bg-indigo-300/20'
                              }`} />
                              <div>
                                <div className={`text-sm font-bold transition-all ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                                  {task.title}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest flex items-center gap-2">
                                  <span className={task.priority === 'High' ? 'text-rose-400' : 'text-indigo-400'}>
                                    Prio: {task.priority}
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-slate-800" />
                                  <span>Tugas {activeTab}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className={`w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center transition-all group-hover:scale-110 ${
                                task.completed 
                                  ? 'bg-emerald-400 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20' 
                                  : 'hover:bg-indigo-500 hover:border-indigo-500 group/btn'
                              }`}
                            >
                              <CheckCircle2 size={18} strokeWidth={3} className={task.completed ? '' : 'text-slate-600 group-hover/btn:text-white'} />
                            </button>
                          </motion.div>
                        ))
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-8 bg-slate-950 p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-20" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.25em]">Info Terakhir</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium italic opacity-80">
                    {activeTab === 'College' 
                      ? "Fokus pada submission malam ini. Semangat belajar buat masa depan cerah! ✨" 
                      : "Jangan lupa draf proposal buat rapat nanti malam. Relasi itu nomor satu! 🤝"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
        
        {/* --- Footer Signature --- */}
        <footer className="text-center pt-20 pb-12">
          <div className="inline-flex items-center gap-6 px-10 py-4 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
             <span>Designed for Productivity</span>
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
             <span>StudentHub Pro © 2026</span>
          </div>
        </footer>
      </div>

      {/* --- Toasts Implementation --- */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}
