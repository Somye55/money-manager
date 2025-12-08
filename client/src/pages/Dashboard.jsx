import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Mock Data
  const expenses = useMemo(() => [
    { id: 1, amount: 500, category: 'Food', date: '2023-10-01' },
    { id: 2, amount: 1200, category: 'Transport', date: '2023-10-02' },
    { id: 3, amount: 2000, category: 'Shopping', date: '2023-10-03' },
    { id: 4, amount: 300, category: 'Food', date: '2023-10-04' },
    { id: 5, amount: 1500, category: 'Bills', date: '2023-10-05' },
  ], []);

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const chartData = {
    labels: ['Food', 'Transport', 'Shopping', 'Bills'],
    datasets: [
      {
        label: 'Expenses',
        data: [800, 1200, 2000, 1500],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
            color: 'var(--text-secondary)'
        }
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="p-4 space-y-6">
      {/* Cards */}
      <div className="grid-cols-2">
        <div className="card bg-gradient-to-br from-green-500 to-emerald-700 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-90">Total Balance</p>
              <h2 className="text-2xl font-bold mt-1">₹ 45,000</h2>
            </div>
            <Wallet className="opacity-80" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-500 to-rose-700 text-white">
             <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-90">This Month</p>
              <h2 className="text-2xl font-bold mt-1">₹ {totalExpense}</h2>
            </div>
            <ArrowDownRight className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Spend Analysis</h3>
        <div className="h-64 flex justify-center">
            <Doughnut data={chartData} options={options} />
        </div>
      </div>

       {/* Recent Specs */}
       <div>
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
        <div className="space-y-3">
            {expenses.map(ex => (
                <div key={ex.id} className="card p-3 flex-between">
                    <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-xl">
                            🍔
                        </div>
                        <div>
                            <p className="font-semibold">{ex.category}</p>
                            <p className="text-xs text-text-secondary">{ex.date}</p>
                        </div>
                    </div>
                    <p className="font-bold text-danger">- ₹{ex.amount}</p>
                </div>
            ))}
        </div>
       </div>
    </div>
  );
};

export default Dashboard;
