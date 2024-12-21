'use client';

import { useState } from "react";
import Swal from "sweetalert2";
import { config } from "../../config";
import axios from "axios";

export default function Page() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = async () => {
        if (username == '') {
            Swal.fire({
                title: 'กรุณาระบุ Username',
                icon: 'error'
            });
            return;
        }

        if (password !== '' && confirmPassword !== '') {
            if (password !== confirmPassword) {
                Swal.fire({
                    title: 'รหัสผ่านไม่ตรงกัน',
                    icon: 'error'
                });
                return;
            }
        }

        try {
            const payload = {
                username: username,
                password: password
            }
            const headers = {
                'Authorization': `Bearer ${localStorage.getItem(config.tokenKey)}`
            }

            const response = await axios.put(`${config.apiUrl}/api/user/update`, payload, {
                headers: headers
            });

            if (response.data.message == 'success') {
                Swal.fire({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    icon: 'success',
                    timer: 1000
                });
            }
        } catch (error: any) {
            Swal.fire({
                title: 'มีข้อผิดพลาด',
                icon: 'error',
                text: error.message
            });
        }
    }

    return (
        <div className="card">
            <h1>Profile</h1>
            <div className="card-body">
                <div>Username</div>
                <input type="text" className="form-control" value={username}
                    onChange={(e) => setUsername(e.target.value)} />

                <div className="mt-5">Password (หากไม่ต้องการเปลี่ยนให้ปล่อยว่าง)</div>
                <input type="password" className="form-control" value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                <div className="mt-5">ยืนยัน Password ใหม่ (หากไม่ต้องการเปลี่ยนให้ปล่อยว่าง)</div>
                <input type="password" className="form-control" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} />

                <button className="btn-primary mt-5" onClick={handleSave}>
                    <i className="fa-solid fa-check mr-3"></i>
                    บันทึก
                </button>
            </div>
        </div>
    )
}