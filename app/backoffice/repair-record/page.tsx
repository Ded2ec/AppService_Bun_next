'use client'

import { useEffect, useState } from 'react'
import Modal from '@/app/components/modal'
import Swal from 'sweetalert2'
import config from '@/app/config'
import axios from 'axios'
import dayjs from 'dayjs'


export default function Page() {

const [devices, setDevices] = useState([])
const [repairRecords, setRepairRecords] = useState([])

    const [showModal, setShowModal] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [deviceBarcode, setDeviceBarcode] = useState('');
    const [deviceSerial, setDeviceSerial] = useState('');
    const [problem, setProblem] = useState('');
    const [solving, setSolving] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [id, setId] = useState(0);


    useEffect(() => {
        fetchDevices()
        fetchRepairRecords()
    }, [])

    const fetchDevices = async () => {
        const response = await axios.get(`${config.apiUrl}/api/device/list`)
        setDevices(response.data)
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        fetchRepairRecords()
        setShowModal(false);
        setId(0);
    }

    const getStatusName = (status: string) => {
        switch (status) {
            case 'active':
                return 'รอซ่อม';
            case 'pending':
                return 'รอลูกค้ายืนยัน';
            case 'repairing':
                return 'กำลังซ่อม';
            case 'done':
                return 'ซ่อมเสร็จ';
            case 'cancel':
                return 'ยกเลิก';
            case 'complete':
                return 'ลูกค้ามารับอุปกรณ์';
            default:
                return 'รอซ่อม';
        }
    }
     
    const fetchRepairRecords = async () => {
        const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`)
        setRepairRecords(response.data)
    }

    const handleDeviceChange = (deviceId: string) => {
       
        const device = (devices as any).find((device: any) => device.id === parseInt(deviceId))
            console.log(device);
        if (device) {
            
            setDeviceId(device.id)
            setDeviceName(device.name)
            setDeviceBarcode(device.barcode)
            setDeviceSerial(device.serial)
            setExpireDate(dayjs(device.expireDate).format('YYYY-MM-DD'))

          
        }else{
            setDeviceId('')
            setDeviceName('')
            setDeviceBarcode('')
            setDeviceSerial('')
            setExpireDate('')
        }
    }

    

    const handleSave = async () => {
        const payload = {
            customerName,
            customerPhone,
            deviceId: deviceId === '' ? undefined : deviceId,
            deviceName,
            deviceBarcode,
            deviceSerial,
            expireDate: expireDate === '' ? undefined : new Date(expireDate),
            problem,
            solving,
        };
    
        try {
            if(id == 0){
                const response = await axios.get(`${config.apiUrl}/api/repairRecord/checkDeviceSerial/${deviceSerial}`);
                if (response.data === true) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Device serial already exists',
                    });
                    return;
                }else{
                    await axios.post(`${config.apiUrl}/api/repairRecord/create`, payload);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Repair record created successfully',
                    });
                }
                
            }else{
                await axios.put(`${config.apiUrl}/api/repairRecord/update/${id}`, payload);
                setId(0);
            }
            Swal.fire({
                title: 'Success',
                text: 'Repair record created successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            closeModal();
        } catch (error:any) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'An error occurred. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };
    const handleDelete = async (id: number) => {
        await axios.delete(`${config.apiUrl}/api/repairRecord/remove/${id}`);
        Swal.fire({
            title: 'Deleted',
            text: 'Repair record deleted successfully',
            icon: 'error',
            confirmButtonText: 'OK',
        });
        fetchRepairRecords();
    }

    const handleEdit = (repairRecordId: any) => {
        setId(repairRecordId.id)
        setCustomerName(repairRecordId.customerName)
        setCustomerPhone(repairRecordId.customerPhone)

        if(repairRecordId.deviceId){
        setDeviceName(repairRecordId.deviceId)
        }
        setDeviceName(repairRecordId.deviceName)
        setDeviceBarcode(repairRecordId.deviceBarcode)
        setDeviceSerial(repairRecordId.deviceSerial)
        setExpireDate(dayjs(repairRecordId.expireDate).format('YYYY-MM-DD'))
        setProblem(repairRecordId.problem)
        setSolving(repairRecordId.solving)
        openModal();
    }

    return (
       <> 
        <div className="card">
            <h1>Repair Record</h1>
            <div className="card-body">
                <button className="btn btn-primary " onClick={openModal}>
                    <i className="fa-solid fa-plus mr-3"></i>
                    Add Repair Record
                    </button>
                    <table className='table mt-3'>
                        <thead>
                            <tr>
                                <th>ชื่อลูกค้า</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>อุปกรณ์</th>
                                <th>อาการเสีย</th>
                                <th>วันที่รับซ่อม</th>
                                <th>วันซ่อมเสร็จ</th>
                                <th>สถานะ</th>
                                <th style={{width: '150px'}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairRecords.map((repairRecord: any, index: number) => (
                                <tr key={index}>
                                    <td>{repairRecord.customerName}</td>
                                    <td>{repairRecord.customerPhone}</td>
                                    <td>{repairRecord.deviceName}</td>
                                    <td>{repairRecord.problem}</td>
                                    <td>{dayjs(repairRecord.createdAt).format('DD/MM/YYYY')}</td>
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDate).format('DD/MM/YYYY') : '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                    <td className="text-center" style={{ width: '220px' }}>
                                        <button className="btn-edit" style={{ borderRadius: "8px" }} 
                                        onClick={() => handleEdit(repairRecord)}>
                                            <i className="fa-solid fa-edit mr-3"></i>
                                            แก้ไข
                                        </button>
                                        <button className="btn-delete" style={{ borderRadius: "8px" }} 
                                        onClick={() => handleDelete(repairRecord.id)}>
                                            <i className="fa-solid fa-trash mr-3"></i>
                                            ลบ
                                        </button>
                                       
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
        </div>

        <Modal title="เพิ่มรายการซ่อม" isOpen={showModal} 
        onClose={closeModal} size='xl'>
            <div className="flex gap-4 mt-4">
                <div className="w-1/2">
                    <div>ชื่อลูกค้า</div>
                    <input type="text" value={customerName}
                     onChange={(e) => setCustomerName(e.target.value)}
                     className="form-control w-full" />
                </div>
                <div className="w-1/2">
            <div>เบอร์โทรศัพท์</div>
            <input type="text" value={customerPhone} 
            onChange={(e) => setCustomerPhone(e.target.value)} 
            className="form-control w-full" />
            </div>
            </div>
            
                <div className="mt-4">ชื่ออุปกรณ์ (ในระบบ)</div>
                <select className="form-control w-full" value={deviceId}
                 onChange={(e) => handleDeviceChange(e.target.value)}>
                    <option value="">---เลือกอุปกรณ์---</option>
                    {devices.map((device: any) => (
                        <option value={device.id} key={device.id}>
                            {device.name}
                        </option>
                    ))}
                </select>

                <div className="mt-4">ชื่ออุปกรณ์ (นอกระบบ)</div>
                <input type="text" 
                value={deviceName} onChange={(e) => setDeviceName(e.target.value)}
                className="form-control w-full" />
            
            
                <div className='flex gap-4 mt-4'>
                    <div className='w-1/2'>
                <div>barcode</div>
                    <input type="text"
                    value={deviceBarcode} onChange={(e) => setDeviceBarcode(e.target.value)}
                    className="form-control w-full" />
                    </div>

                    <div className='w-1/2'>
                <div>serial</div>
                    <input type="text"
                    value={deviceSerial} onChange={(e) => setDeviceSerial(e.target.value)}
                    className="form-control w-full" />
                    </div>
                 </div>
                   
                    <div className="mt-4">วันหมดประกัน</div>
                    <input type="date" 
                    value={expireDate} onChange={(e) => setExpireDate(e.target.value)}
                    className="form-control w-full" />
                  

                   
                    <div className="mt-4">อาการเสีย</div>
                    <textarea
                    value={problem} onChange={(e) => setProblem(e.target.value)}
                    className="form-control w-full" />
                    

                    <button className="btn btn-primary mt-4" onClick={handleSave}>
                        <i className="fa-solid fa-check mr-3"></i>
                        บันทึก
                        </button>

                
        </Modal>
        </>
    );
}