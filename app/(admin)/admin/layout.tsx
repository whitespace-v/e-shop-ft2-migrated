import AdminNavbar from "../components/AdminNavbar"

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex gap-2">
            <div>
            <AdminNavbar/>
            </div>
            {children}
        </div>
    );
}