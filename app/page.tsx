'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChefHat, ShoppingCart, ListChecks, Wallet, BarChart3 } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    diet: 'Non-Vegetarian',
    allergies: '',
    skill: 'Beginner',
    mealsRequired: '3',
    cookingTimePerMeal: '',
    budget: '',
    people: '1',
    cuisine: 'Mixed',
    ingredients: '',
    goal: 'Healthy eating'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/generate-plan', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setPlan(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Chef AI</h1>
        <p className="text-gray-600">Personalized daily meal planning made simple.</p>
      </header>

      {!plan ? (
        <motion.form 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Age" type="number" className="p-3 border rounded-lg" onChange={e => setFormData({...formData, age: e.target.value})} />
            <input placeholder="Gender" className="p-3 border rounded-lg" onChange={e => setFormData({...formData, gender: e.target.value})} />
            <select className="p-3 border rounded-lg" onChange={e => setFormData({...formData, diet: e.target.value})}>
                <option>Non-Vegetarian</option><option>Vegetarian</option><option>Vegan</option><option>Keto</option>
            </select>
            <input placeholder="Allergies/Restrictions" className="p-3 border rounded-lg" onChange={e => setFormData({...formData, allergies: e.target.value})} />
            <select className="p-3 border rounded-lg" onChange={e => setFormData({...formData, skill: e.target.value})}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
            <input placeholder="Budget" type="number" className="p-3 border rounded-lg" onChange={e => setFormData({...formData, budget: e.target.value})} />
            <input placeholder="Available Ingredients" className="col-span-2 p-3 border rounded-lg" onChange={e => setFormData({...formData, ingredients: e.target.value})} />
            <button type="submit" className="col-span-2 bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition" disabled={loading}>
                {loading ? 'Generating...' : 'Compose Menu'}
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShoppingCart /> I. The Grocery List</h2>
            <ul className="list-disc list-inside space-y-2">
              {plan?.groceryList?.map((g: any, i: number) => <li key={i}>{g.item} - {g.quantity} ({g.cost})</li>)}
            </ul>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ListChecks /> II. The Day's Schedule</h2>
            <ul className="space-y-2">
              {plan?.schedule?.map((s: any, i: number) => <li key={i}><strong>{s.time}</strong> → {s.activity}</li>)}
            </ul>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Wallet /> III. Budget Feasibility</h2>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Total:</strong> {plan?.budgetLedger?.totalCost}</p>
              <p><strong>Limit:</strong> {plan?.budgetLedger?.limit}</p>
              <p className="col-span-2"><strong>Balance:</strong> {plan?.budgetLedger?.balance}</p>
              <p className="col-span-2"><strong>Suggestions:</strong> {plan?.budgetLedger?.suggestions}</p>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ChefHat /> Today's Menu</h2>
            <table className="w-full border-collapse">
              <thead><tr className="border-b"><th className="text-left p-3">Course</th><th className="text-left p-3">Dish</th></tr></thead>
              <tbody>
                {plan?.menu?.map((m: any, i: number) => (
                    <tr key={i} className="border-b">
                        <td className="p-3 font-semibold">{m.course}</td>
                        <td className="p-3">{m.dish} ({m.time})</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </section>
          
          <section className="bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BarChart3 /> IV. The Chef's Note</h2>
            <p className="text-gray-700 italic">{plan.chefsNote}</p>
          </section>
        </motion.div>
      )}
    </main>
  );
}
