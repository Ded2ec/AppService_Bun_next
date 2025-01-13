'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import config from "@/app/config";
import Swal from "sweetalert2";

export default function Page() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [facebookPage, setFacebookPage] = useState('');
    const [taxCode, setTaxCode] = useState('');

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/company/info`);

            if (response.data.id !== undefined) {
                setName(response.data.name);
                setAddress(response.data.address);
                setPhone(response.data.phone);
                setEmail(response.data.email);
                setFacebookPage(response.data.facebookPage);
                setTaxCode(response.data.taxCode);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถดึงข้อมูลร้านได้',
                text: err.message,
            })
        }
    }

    const saveCompany = async () => {
        try {
            const payload = {
                name: name,
                address: address,
                phone: phone,
                email: email,
                facebookPage: facebookPage,
                taxCode: taxCode
            }

            await axios.put(`${config.apiUrl}/api/company/update`, payload);

            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูล',
                text: 'ข้อมูลร้านถูกบันทึกเรียบร้อย',
                timer: 2000,
            })
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถบันทึกข้อมูลร้านได้',
                text: err.message,
            })
        }
    }

    return (
        <div className="card">
            <h1>ข้อมูลร้าน</h1>
            <div className="card-body">
                <div>ชื่อร้าน</div>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />

                <div className="mt-4">ที่อยู่</div>
                <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />

                <div className="mt-4">เบอร์โทรศัพท์</div>
                <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />

                <div className="mt-4">อีเมล</div>
                <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />

                <div className="mt-4">Facebook Page</div>
                <input type="text" className="form-control" value={facebookPage} onChange={(e) => setFacebookPage(e.target.value)} />

                <div className="mt-4">เลขผู้เสียภาษี</div>
                <input type="text" className="form-control" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} />

                <button className="btn btn-primary mt-4" onClick={saveCompany}>บันทึก</button>
            </div>
        </div>
    )
}