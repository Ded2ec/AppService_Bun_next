'use client';

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { config } from "../config";

export function TopNav() {
    const [name, setName] = useState('');
    const [level, setLevel] = useState('');
    const router = useRouter();

    useEffect(() => {
        setName(localStorage.getItem('bun_service_name') || '');
        setLevel(localStorage.getItem('bun_service_level') || '');
    }, []);

    const handleLogout = async () => {
        const button = await Swal.fire({
            title: 'ออกจากระบบ',
            text: 'คุณต้องการออกจากระบบหรือไม่',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
        });

        if (button.isConfirmed) {
            localStorage.removeItem(config.tokenKey);
            localStorage.removeItem('bun_service_name');
            localStorage.removeItem('bun_service_level');

            router.push('/');
        }
    }

    const handleProfile = () => {
        router.push('/backoffice/pofile');
    }

    return (
        <nav className="bg-gray-800 shadow-sm">
            <div className="mx-auto px-6">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold ">Bunrai Service ® 
                            <i className="fa-solid fa-fire text-2xl ml-1"></i></h1>
                        
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-200">{name}</span>
                        <span className="text-indigo-400 ml-5 font-bold">( {level} )</span>

                        <button onClick={handleProfile}
                            className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-5 hover:bg-indigo-600">
                            <i className="fa-solid fa-user mr-3"></i>
                            Profile
                        </button>
                        <button onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-red-600">
                            <i className="fa-solid fa-right-from-bracket mr-3"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}