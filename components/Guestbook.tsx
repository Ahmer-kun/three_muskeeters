import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://three-muskeeters.vercel.app/api';

interface Wish {
  id: string;
  name: string;
  message: string;
  date: string;
}

const Guestbook: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [loginStep, setLoginStep] = useState<'email' | 'code'>('email');
  const [adminToken, setAdminToken] = useState('');
  const [secretTapCount, setSecretTapCount] = useState(0);

  // Load wishes
  const fetchWishes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishes`);
      if (response.ok) {
        const data = await response.json();
        const formattedWishes = data.map((wish: any) => ({
          id: wish._id || wish.id,
          name: wish.name,
          message: wish.message,
          date: new Date(wish.date).toLocaleDateString()
        }));
        setWishes(formattedWishes);
      }
    } catch (err) {
      console.error('Error fetching wishes:', err);
      // Fallback to localStorage
      const savedWishes = localStorage.getItem('birthday_wishes');
      if (savedWishes) setWishes(JSON.parse(savedWishes));
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  // Submit wish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });

      if (response.ok) {
        const newWish = await response.json();
        setWishes(prev => [newWish, ...prev]);
        setName('');
        setMessage('');
        localStorage.setItem('birthday_wishes', JSON.stringify([newWish, ...wishes]));
      } else {
        throw new Error('Failed to submit wish');
      }
    } catch (err: any) {
      console.error('Error submitting wish:', err);
      // Fallback to localStorage
      const newWish: Wish = {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        date: new Date().toLocaleDateString(),
      };
      const updatedWishes = [newWish, ...wishes];
      setWishes(updatedWishes);
      localStorage.setItem('birthday_wishes', JSON.stringify(updatedWishes));
      setName('');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Admin login handlers
  const handleSecretTrigger = () => {
    if (isAdmin) return;
    const newCount = secretTapCount + 1;
    setSecretTapCount(newCount);
    if (newCount === 5) {
      setShowLogin(true);
      setSecretTapCount(0);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (loginStep === 'email') {
        const response = await fetch(`${API_BASE_URL}/wishes/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: adminEmail.trim() }),
        });

        if (response.ok) {
          setLoginStep('code');
          alert('Verification code sent to your email!');
        } else {
          alert("Access denied");
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/wishes/admin/verify-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: adminEmail.trim(),
            code: emailCode,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAdminToken(data.token);
          setIsAdmin(true);
          setShowLogin(false);
          resetLoginForm();
          alert('Admin access granted!');
        } else {
          alert("Invalid code");
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      alert("Authentication failed");
    }
  };

  const resetLoginForm = () => {
    setAdminEmail('');
    setEmailCode('');
    setLoginStep('email');
  };

  const handleDelete = async (idToDelete: string) => {
    if (!window.confirm("Delete this wish?")) return;
    if (!isAdmin || !adminToken) return alert("Admin access required");

    try {
      const response = await fetch(`${API_BASE_URL}/wishes/${idToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });

      if (response.ok) {
        setWishes(prev => prev.filter(w => w.id !== idToDelete));
        localStorage.setItem('birthday_wishes', JSON.stringify(wishes.filter(w => w.id !== idToDelete)));
      }
    } catch (err) {
      alert('Failed to delete wish');
    }
  };

  return (
    <section className="py-20 bg-slate-100 relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 select-none">
          <h2 
            onClick={handleSecretTrigger}
            className="text-4xl font-serif font-bold text-slate-900 mb-4 cursor-default active:scale-95 transition-transform"
            title={isAdmin ? "Admin Active" : "Sign the book!"}
          >
            The Guestbook
          </h2>

          {isAdmin && (
            <div className="mb-6 flex justify-center items-center gap-3 animate-fade-in">
              <span className="text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Admin Mode Active
              </span>
              <button 
                onClick={() => {
                  setIsAdmin(false);
                  setAdminToken('');
                  resetLoginForm();
                }}
                className="text-xs text-slate-500 hover:text-red-600 underline font-medium"
              >
                Logout
              </button>
            </div>
          )}

          <p className="text-slate-600">Leave a birthday wish for the trio!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Wish Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl h-fit">
            <h3 className="text-xl font-bold mb-6 text-indigo-900">Sign the Book ✍️</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Auntie Sarah"
                  maxLength={30}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                  placeholder="Write your birthday wish here..."
                  maxLength={200}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim() || !message.trim() || loading}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Wish"}
              </button>
            </form>
          </div>

          {/* Wishes List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {wishes.map((wish) => (
              <div key={wish.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(wish.id)}
                    className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    title="Delete this wish"
                  >
                    ×
                  </button>
                )}
                <p className="text-slate-800 text-lg mb-3 italic">"{wish.message}"</p>
                <div className="flex justify-between text-sm text-slate-500">
                  <span className="text-indigo-600">— {wish.name}</span>
                  <span>{wish.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-slate-900">
              {loginStep === 'email' ? 'Admin Login' : 'Enter Code'}
            </h3>
            
            {loginStep === 'email' ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <p className="text-sm text-slate-600">Enter admin email to get verification code</p>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="admin@email.com"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Get Code
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <p className="text-sm text-slate-600">Enter the code sent to your email</p>
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 text-center text-xl font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginStep('email')}
                    className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Verify
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Guestbook;
