import Link from "next/link";

export function Sidebar() {
    const menuItems = [
        { title: 'Dashboard', href: '/dashboard', icon: 'fa-solid fa-chart-simple' },
        { title: 'พนักงานร้าน', href: '/backoffice/user', icon: 'fa-solid fa-users' },
        { title: 'บันทึกการซ่อม', href: '/backoffice/repair-record', icon: 'fa-solid fa-screwdriver' },
        { title: 'สถานะการซ่อม', href: '/backoffice/repair-status', icon: 'fa-solid fa-gear' },
        { title: 'สถิติการซ่อมของช่าง', href: '/backoffice/mecthanic-report', icon: 'fa-solid fa-right-from-bracket' },
        { title: 'รายงานรายได้', href: '/backoffice/income-report', icon: 'fa-solid fa-money-bill' },
        { title: 'ทะเบียนวัสดุ อุปกรณ์', href: '/backoffice/device', icon: 'fa-solid fa-box' },
        { title: 'ข้อมูลร้าน', href: '/backoffice/company', icon: 'fa-solid fa-shop' },
    ];
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <i className="fa-solid fa-user text-4xl mr-5"></i>
                <h1 className="text-xl font-bold">Bun Service 2025</h1>
            </div>
            <nav className="sidebar-nav bg-gray-950 p-4 rounded-tl-3xl ml-4">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.title}>
                            <Link href={item.href} className="sidebar-item">
                                <i className={item.icon + ' mr-2 w-6'}></i>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}