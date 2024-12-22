import Swal from 'sweetalert2';

export const config = {
    apiUrl: 'http://localhost:3001',
    tokenKey: 'token_bun_service',
    confirmDialog: () => {
        return Swal.fire({
        title: 'ยืนยันการลบข้อมูล?',
        text: "ข้อมูลจะถูกลบออกจากฐานข้อมูล",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
   });
}
}

export default config; 