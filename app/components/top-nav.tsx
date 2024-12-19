export default function TopNav() {
  return (
    <nav className="bg-gray-800 shadow-sm">
        <div className="mx-auto px-6">
            <div className="flex h-16 justify-between items-center">
                <div className="flex-shrink-6">
                   <h1 className="text-xl font-bold ">Bun Service</h1>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-200">Admin</span>
                </div>
            </div>
        </div>
    </nav>
  );
}
