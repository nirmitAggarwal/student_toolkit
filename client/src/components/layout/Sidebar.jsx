import { NavLink } from 'react-router-dom';
import { FiHome, FiBookOpen, FiBarChart2, FiPercent, FiImage, FiCheckCircle, FiCalendar, FiCode, FiFilter, FiFileText, FiSettings } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

const tools = [
  { label: 'Dashboard', path: '/dashboard', icon: FiHome },
  {
    group: 'Academic', items: [
      { label: 'CGPA Calculator', path: '/tools/cgpa', icon: FiBookOpen },
      { label: 'SGPA Calculator', path: '/tools/sgpa', icon: FiBookOpen },
      { label: 'Percentage Calc', path: '/tools/percentage', icon: FiPercent },
    ]
  },
  {
    group: 'Productivity', items: [
      { label: 'Attendance Tracker', path: '/tools/attendance', icon: FiCheckCircle },
      { label: 'Time Table', path: '/tools/timetable', icon: FiCalendar },
      { label: 'Calendar', path: '/calendar', icon: FiCalendar },
    ]
  },
  {
    group: 'Utilities', items: [
      { label: 'PDF Merger', path: '/tools/pdf', icon: FiFileText },
      { label: 'Image Compressor', path: '/tools/image', icon: FiImage },
      { label: 'QR Generator', path: '/tools/qr-gen', icon: FiCode },
      { label: 'QR Scanner', path: '/tools/qr-scan', icon: FiCode },
      { label: 'Unit Converter', path: '/tools/converter', icon: FiFilter },
    ]
  },
];

function Sidebar() {
  const { logout } = useAuthStore();

  return (
    <aside className="w-72 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-6 shadow-sm hidden lg:flex flex-col min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Student Toolkit</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Engineering dashboard</p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {tools.map((item, idx) => {
          if (item.group) {
            return (
              <div key={idx}>
                <p className="px-4 py-2 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">{item.group}</p>
                <div className="space-y-1">
                  {item.items.map((subitem) => {
                    const Icon = subitem.icon;
                    return (
                      <NavLink
                        key={subitem.path}
                        to={subitem.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-primary text-white shadow-glow' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {subitem.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          } else {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-primary text-white shadow-glow' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          }
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-primary text-white shadow-glow' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`
          }
        >
          <FiSettings className="h-4 w-4" />
          Settings
        </NavLink>
        <button
          onClick={logout}
          className="w-full rounded-full bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
