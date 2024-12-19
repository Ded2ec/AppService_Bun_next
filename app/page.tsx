'use client'

import swal from 'sweetalert2';
import { config } from './config';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
     if(username === '' || password === '') {
      swal.fire({
        title: 'Error',
        text: 'Username and password are required',
        icon: 'error',
       }); 
       return;
     }
     const payload = {
      username,
      password
     }

     const response = await axios.post(`${config.apiUrl}/api/user/signin`, payload);
     console.log(response.data);

     if(response.data.token) {
      localStorage.setItem(config.tokenKey, response.data.token);
      router.push('/backoffice/dashboard');
     }else{
      swal.fire({
        title: 'Error',
        text: 'Invalid username or password',
        icon: 'error',
       }); 
       return;
     }
    } catch (error: any) {
     swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error',
     });
    }
  };

return (
   <div className='flex flex-col items-center min-h-screen p-8 bg-gradient-to-br from-gray-800 to-gray-950'>
<div className='text-gray-400 text-4xl font-bold mb-10'>Bun Service </div>
<div className='bg-gray-880 p-8 rounded-2xl shadow-xl w-full max-w-md'>
<h1 className='text-2xl font-bold mb-4 text-white'><div>Login</div></h1>
<form className='flex flex-col gap-2 mt-10 w-full' onSubmit={handleSubmit}>
<div>
<i className='fa fa-user mr-2'></i>
username
</div>
<input type='text' placeholder='Username' value={username} 
onChange={(e) => setUsername(e.target.value)} className='p-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' />
<div className='mt-5'>
<i className='fa fa-lock mr-2'></i>
password
</div>
<input type='password' placeholder='Password' value={password} 
onChange={(e) => setPassword(e.target.value)} className='p-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' />
<button type='submit' className='btn mt-5 text-xl'>
  <i className='fa fa-sign-in mr-2'></i>
  Sign In
</button>
</form>
</div>
</div>

);
}