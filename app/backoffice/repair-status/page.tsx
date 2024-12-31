'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import config from "@/app/config";
import Swal from "sweetalert2";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function page() {

    const [repairRecords, setRepairRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState(0);
    const [status, setStatus] = useState('');
    const [solving , setSolving] = useState('');
    const [statusList, setStatusList] = useState([
        { value: 'active', label: 'รอซ่อม' },
        { value: 'pending', label: 'รอลูกค้ายืนยัน' },
        { value: 'repairing', label: 'กำลังซ่อม' },
        { value: 'done', label: 'ซ่อมเสร็จ' },
        { value: 'cancel', label: 'ยกเลิก' },
        { value: 'complete', label: 'ลูกค้ามารับอุปกรณ์' },
    ]);
    const [statusForFilter, setStatusForFilter] = useState('');
    const [tempRepairRecords, setTempRepairRecords] = useState([]);
    const [engineers,setEngineers] = useState ([]);
    const [engineerId, setEngineerId] = useState(0);

    
    useEffect(() => {
        fetchRepairRecords();
        fetchEngineers();
    }, []);

    const fetchEngineers = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/user/listEngineer`);
            setEngineers(response.data);
            setEngineerId(response.data[0].id);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message,
            });
        }
    }

    const fetchRepairRecords = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`);
            setRepairRecords(response.data);
            setTempRepairRecords(response.data);
        } catch (error:any) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
                footer: '<a href="">Why do I have this issue?</a>'
              })
        }
    }

    const getStatusName = (status: string) => {
        const statusObj = statusList.find((item: any) => item.value === status);
        return statusObj?.label ?? 'รอซ่อม';
    }
        
    

    const handleEdit = (id: number) => {
        const repairRecord = repairRecords.find((repairRecord: any) => repairRecord.id === id) as any;
        if(repairRecord){
            setId(repairRecord.id);
            setStatus(repairRecord?.status ?? ''   );
            setSolving(repairRecord?.solving ?? '');
            setShowModal(true);
        }
    }
    const handleSave = async () => {
        try {
            const payload = {
                status: status,
                solving: solving
            }
            const respone = await axios.put(`${config.apiUrl}/api/repairRecord/updateStatus/${id}`,payload);
                fetchRepairRecords();
                setShowModal(false);
                Swal.fire({
                    icon: 'success',
                    title: 'ปรับสถานะสำเร็จ',
                    text: 'ปรับสถานะสำเร็จ',
                  })
        }catch(error:any){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
                footer: '<a href="">Why do I have this issue?</a>'
              })
        }
    }

    const handleFilter = (statusForFilter: string) => {
        if (statusForFilter) {
            const filteredRecords = tempRepairRecords.filter((repairRecord: any) => repairRecord.status === statusForFilter);
            setRepairRecords(filteredRecords);
            setStatusForFilter(statusForFilter);
        } else {
            setRepairRecords(tempRepairRecords);
            setStatusForFilter('');
        } 
    }


    return (
        <>
        <div className="card">
        <h1>สถานะการซ่อม</h1>
                <div>
                    <select className="form-control"
                        value={statusForFilter}
                        onChange={(e) => handleFilter(e.target.value)}
                    >
                        <option value="">--- ทั้งหมด ---</option>
                        {statusList.map((item: any) => (
                            <option value={item.value} key={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>


            </div>
            <div className="card-body">
            <table className="table mt-3">
                <thead>
                    <tr >
                        <th>ชื่อลูกค้า</th>
                        <th>เบอร์โทรศัพท์</th>
                        <th>อุปกรณ์</th>  
                        <th>อาการ</th>
                        <th>วันที่รับอุปกรณ์</th>
                        <th>วันซ่อมเสร็จ</th>
                        <th>สถานะ</th>
                        <th style={{width: '170px'}} className="text-center">จัดการสถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    {repairRecords.map((repairRecord:any) => (
                        <tr key={repairRecord.id}>
                            <td>{repairRecord.customerName}</td>
                            <td>{repairRecord.customerPhone}</td>
                            <td>{repairRecord.deviceSerial}</td>
                            <td>{repairRecord.Problem}</td>
                            <td>{dayjs(repairRecord.createdAt).format('DD/MM/YYYY')}</td>
                            <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDate).format('DD/MM/YYYY') : '-'}</td>
                            <td>{getStatusName(repairRecord.status)}</td>
                            <td className="text-center">
                                <button className="btn-edit " onClick={() => handleEdit(repairRecord.id)}>
                                    <i className="fa fa-edit"></i>
                                    ปรับสถานะ
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
        <Modal title="ปรับสถานะ" isOpen={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <div>เลือกสถานะ</div>
                            <div>
                                <select className="form-control w-full"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {statusList.map((item: any) => (
                                        <option value={item.value} key={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div>เลือกช่างซ่อม</div>
                            <div>
                                <select className="form-control w-full"
                                    value={engineerId}
                                    onChange={(e) => setEngineerId(Number(e.target.value))}
                                >
                                    {engineers.map((engineer: any) => (
                                        <option value={engineer.id} key={engineer.id}>
                                            {engineer.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                <div className="mt-3">
                    <div>การแก้ไข</div>
                    <textarea className="form-control w-full" rows={5} value={solving} 
                    onChange={(e) => setSolving(e.target.value)}></textarea>
                </div>
                <button className="btn btn-primary mt-3" onClick={handleSave}>
                    <i className="fa fa-check mr-3"></i>
                    ปรับสถานะ</button>
            </div>
        
        </Modal>

        </>
    );
}

