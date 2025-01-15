"use client";

import { useState,useEffect } from "react";
import config from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import Chart from 'apexcharts'



export default function Page() {
  const [totalRepairRecord, setTotalRepairRecord] = useState(0);
  const [totalRepairRecordNotComplete, setTotalRepairRecordNotComplete] = useState(0);
  const [totalRepairRecordComplete, setTotalRepairRecordComplete] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchData();
    
   
  },[]);

  const fetchData = async () => {
    const response = await axios.get(`${config.apiUrl}/api/repairRecord/dashboard`);

    setTotalRepairRecord(response.data.totalRepairRecord);
    setTotalRepairRecordNotComplete(response.data.totalRepairRecordNotComplete);
    setTotalRepairRecordComplete(response.data.totalRepairRecordComplete);
    setTotalAmount(response.data.totalAmount);

    renderChartIncomePerDays();
    renderChartIncomePerMonth();
    renderChartPie(
      response.data.totalRepairRecordComplete,
      response.data.totalRepairRecordNotComplete,
      response.data.totalRepairRecord
    );

  };

  const renderChartIncomePerDays = () => {
    const data = Array.from({ length: 31 }, () => Math.floor(Math.random() * 10000));
    const options = {
        chart: { type: 'bar', height: 250, background: 'white' },
        series: [{ data: data }],
        xaxis: {
            categories: Array.from({ length: 31 }, (_, i) => `${i + 1}`)
        },
    };
    const chartIncomePerDays = document.getElementById('chartIncomePerDays');
    const chart = new Chart(chartIncomePerDays, options);
    chart.render();
};

const renderChartIncomePerMonth = () => {
  const data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10000));
  const options = {
      chart: { type: 'bar', height: 250, background: 'white' },
      series: [{ data: data }],
      xaxis: {
        categories: [
          'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ]
      },
  };
  const chartIncomePerMonth = document.getElementById('chartIncomePerMonth');
  const chart = new Chart(chartIncomePerMonth, options);
  chart.render();
};


const renderChartPie = (
  totalRepairRecordComplete: number,
  totalRepairRecordNotComplete: number,
  totalRepairRecord: number
) => {
  const data = [totalRepairRecordComplete, totalRepairRecordNotComplete, totalRepairRecord];
  const options = {
      chart: { type: 'pie', height: 250, background: 'white' },
      series: data,
      labels: ['งานซ่อมเสร็จ', 'งานกำลังซ่อม', 'งานทั้งหมด'],
  };
  const chartPie = document.getElementById('chartPie');
  const chart = new Chart(chartPie, options);
  chart.render();
};

  return(

  <>
    <div className="text-2xl font-bold">Dashboard</div>
    <div className="flex mt-5 gap-4">
      <div className="w-1/4 bg-green-500 p-4 rounded-lg ">
        <div className="text-xl fontbold text-right">งานซ่อมทั้งหมด</div>
        <div className="text-4xl font-bold">{totalRepairRecord}</div>
      </div>
      <div className="w-1/4 bg-red-500 p-4 rounded-lg ">
        <div className="text-xl fontbold text-right">งานซ่อมเสร็จ</div>
        <div className="text-4xl font-bold">{totalRepairRecordComplete}</div>
      </div>
      <div className="w-1/4 bg-orange-300 p-4 rounded-lg ">
        <div className="text-xl fontbold text-right">กำลังซ่อม</div>
        <div className="text-4xl font-bold">{totalRepairRecordNotComplete}</div>
      </div>
      <div className="w-1/4 bg-pink-500 p-4 rounded-lg ">
        <div className="text-xl fontbold text-right">รายได้เดือนนี้</div>
        <div className="text-4xl font-bold">{totalAmount.toLocaleString()}</div>
      </div>
    </div>


    <div className="text-2xl font-bold mt-5 mb-2">รายได้รายวัน</div>
    <div id="chartIncomePerDays"></div>

    <div className="flex gap-4>">

        <div className="w-2/3 mr-2">
        <div className="text-2xl font-bold mt-5 mb-2">รายได้รายเดือน</div>
         <div id="chartIncomePerMonth"></div>
        </div>

      <div className="w-1/3">
      <div className="text-2xl font-bold mt-5 mb-2">งานซ่อมทั้งหมด</div>
      <div id="chartPie"></div>
      </div>
    </div>

    

  </>
  );
}
