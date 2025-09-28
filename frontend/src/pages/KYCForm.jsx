import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus, Flame } from 'lucide-react';

const KYCForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', panNumber: '' });
  const [idImage, setIdImage] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setIdImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (idImage) {
      data.append('idImage', idImage);
    }
    
    try {
      await signup(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Flame className="mx-auto h-12 w-12 text-indigo-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-slate-50">Create your account</h2>
            <p className="mt-2 text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                    Sign in
                </Link>
            </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-900 shadow-2xl rounded-2xl p-8 space-y-6">
            <input name="name" type="text" placeholder="Full Name" required onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input name="panNumber" type="text" placeholder="PAN Number" required onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <div>
                <label htmlFor="idImage" className="block text-sm font-medium text-slate-300">Upload Dummy ID</label>
                <input id="idImage" name="idImage" type="file" required onChange={handleFileChange} className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"/>
            </div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900">
                <UserPlus size={20} className="mr-2"/> Create Account
            </button>
        </form>
      </div>
    </div>
  );
};

export default KYCForm;