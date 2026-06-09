import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Trophy,
  Megaphone,
  Shield,
  LogOut,
  Upload,
} from 'lucide-react'
import PearLogo from '../ui/PearLogo'
import { logOut } from '../../services/firebaseAuth'
import { useUserStore } from '../../store/useUserStore'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'დაფა' },
  { to: '/leaderboard', icon: Trophy, label: 'ლიდერბორდი' },
  { to: '/announcements', icon: Megaphone, label: 'განცხადებები' },
]

const modelNav = [
  { to: '/models/mariami', icon: Users, label: 'მარიამი' },
  { to: '/models/ninuci', icon: Users, label: 'ნინუცი' },
  { to: '/models/liza', icon: Users, label: 'ლიზა' },
]

export default function Sidebar() {
  const { role, clearUser, modelId } = useUserStore()

  const handleLogout = async () => {
    await logOut()
    clearUser()
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-pear-accent text-white'
        : 'text-pear-muted hover:text-pear-text hover:bg-black/[0.04]'
    }`

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-black/[0.06] z-40 flex flex-col"
    >
      <div className="p-6 border-b border-black/[0.06]">
        <PearLogo size="sm" />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <item.icon size={18} strokeWidth={1.5} />
            {item.label}
          </NavLink>
        ))}

        {role === 'admin' && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-[10px] uppercase tracking-widest text-pear-muted mb-2">
                მართვა
              </p>
              <NavLink to="/models" className={linkClass}>
                <Users size={18} strokeWidth={1.5} />
                ყველა მოდელი
              </NavLink>
              <NavLink to="/uploads" className={linkClass}>
                <Upload size={18} strokeWidth={1.5} />
                ატვირთვები
              </NavLink>
            </div>

            <div className="pt-2 pb-2">
              <p className="px-4 text-[10px] uppercase tracking-widest text-pear-muted mb-2">
                პროფილები
              </p>
              {modelNav.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  <item.icon size={18} strokeWidth={1.5} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </>
        )}

        {role !== 'admin' && modelId && (
          <div className="pt-4">
            <p className="px-4 text-[10px] uppercase tracking-widest text-pear-muted mb-2">
              ჩემი პროფილი
            </p>
            <NavLink to={`/models/${modelId}`} className={linkClass}>
              <Users size={18} strokeWidth={1.5} />
              ჩემი გალერეა
            </NavLink>
          </div>
        )}

        {role === 'admin' && (
          <NavLink to="/admin" className={linkClass}>
            <Shield size={18} strokeWidth={1.5} />
            ადმინ პანელი
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-black/[0.06]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-pear-muted hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut size={18} strokeWidth={1.5} />
          გასვლა
        </button>
      </div>
    </motion.aside>
  )
}
