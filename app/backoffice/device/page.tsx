'use client'

import { useState, useEffect } from 'react';
import config from '@/app/config';
import Swal from 'sweetalert2';
import axios from 'axios';
import Modal from "@/app/components/modal";
import dayjs from 'dayjs';


export default function Page() {
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [serial, setSerial] = useState('');
    const [name, setName] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [remark, setRemark] = useState('');
    const [id, setId] = useState(0);

      //
    // pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [totalPage, setTotalPage] = useState(0);
    const [totalPageList, setTotalPageList] = useState<number[]>([]); // array ไว้เก็บเลขหน้า




    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const params = {
                page: page,
                pageSize: pageSize
            }
            const response = await axios.get(`${config.apiUrl}/api/device/list`, { params });
            setDevices(response.data.results);

            if (totalPage === 0) {
                setTotalPage(response.data.totalPage);

                for (let i = 1; i <= response.data.totalPage; i++) {
                    totalPageList.push(i);
                }
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    }


    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleSave = async () => {
        try {
            const payload = {
                barcode: barcode,
                serial: serial,
                name: name,
                expireDate: new Date(expireDate),
                remark: remark,
            }

            if (id === 0) {
                await axios.post(`${config.apiUrl}/api/device/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/api/device/update/${id}`, payload);
            }

            setShowModal(false);
            setBarcode('');
            setSerial('');
            setName('');
            setExpireDate('');
            setRemark('');
            setId(0);

            fetchData();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    }

    const handleEdit = (item: any) => {
        setId(item.id);
        setBarcode(item.barcode);
        setSerial(item.serial);
        setName(item.name);
        setExpireDate(item.expireDate);
        setRemark(item.remark);

        setShowModal(true);
    }

    const handleDelete = async (id: string) => {
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการลบข้อมูล?',
                text: "ข้อมูลจะถูกลบออกจากฐานข้อมูล",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                cancelButtonText: 'ยกเลิก',
                confirmButtonText: 'ยืนยัน'
            });

            if (button.isConfirmed) {
                await axios.delete(config.apiUrl + '/api/device/remove/' + id);
                fetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
            fetchData();
        }
    }

    const handleNextPage = () => {
        if (page < totalPage) {
            setPage(page + 1);
            fetchData();
        }
    }

    const handleChangePage = (page: number) => {
        setPage(page);
        fetchData();
    }
    return (
        <div className='card'>
            <h1>ทะเบียนวัสดุ อุปกรณ์</h1>
            <div className='card-body'>
                <button className='btn btn-primary' onClick={handleShowModal}>
                    <i className='fa-solid fa-plus mr-2'></i>
                    เพิ่มข้อมูล
                </button>

                <table className='table'>
                    <thead>
                        <tr>
                            <th>ชื่อวัสดุ</th>
                            <th>barcode</th>
                            <th>serial</th>
                            <th>วันที่หมดอายุ</th>
                            <th>หมายเหตุ</th>
                            <th style={{ width: '130px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((item: any) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.barcode}</td>
                                <td>{item.serial}</td>
                                <td>{dayjs(item.expireDate).format('DD/MM/YYYY')}</td>
                                <td>{item.remark}</td>
                                <td className='text-center'>
                                    <button className='btn-edit'
                                        onClick={() => handleEdit(item)}>
                                        <i className='fa-solid fa-pen-to-square'></i>
                                    </button>
                                    <button className='btn-delete'
                                        onClick={() => handleDelete(item.id)}>
                                        <i className='fa-solid fa-trash'></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* pagination */}
                <div className='mt-3'>
                    <button className='btn-edit' onClick={handlePreviousPage}>
                        <i className='fa-solid fa-arrow-left'></i>
                    </button>
                    {totalPageList.map((item: any) => (
                        page === parseInt(item) ? (
                            <button key={item} className='bg-blue-500 text-white px-3 py-2 rounded-md'>
                                {item}
                            </button>
                        ) : (
                            <button key={item} className='btn-edit mr-1 ml-1' onClick={() => handleChangePage(item)}>
                                {item}
                            </button>
                        )
                    ))}
                    <button className='btn-edit' onClick={handleNextPage}>
                        <i className='fa-solid fa-arrow-right'></i>
                    </button>
                </div>
            </div>

            <Modal title='ทะเบียนวัสดุ อุปกรณ์' isOpen={showModal}
                onClose={handleCloseModal}>
                <div>barcode</div>
                <input type='text' className='form-control' value={barcode}
                    onChange={(e) => setBarcode(e.target.value)} />

                <div className='mt-3'>serial</div>
                <input type='text' className='form-control' value={serial}
                    onChange={(e) => setSerial(e.target.value)} />

                <div className='mt-3'>ชื่อวัสดุ อุปกรณ์</div>
                <input type='text' className='form-control' value={name}
                    onChange={(e) => setName(e.target.value)} />

                <div className='mt-3'>วันที่หมดอายุ</div>
                <input type='date' className='form-control' value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)} />

                <div className='mt-3'>หมายเหตุ</div>
                <input type='text' className='form-control' value={remark}
                    onChange={(e) => setRemark(e.target.value)} />

                <button className='btn btn-primary mt-3' onClick={handleSave}>
                    <i className='fa-solid fa-check mr-3'></i>
                    บันทึกข้อมูล
                </button>
            </Modal>
        </div>
    );
}