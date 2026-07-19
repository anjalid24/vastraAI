import { NavLink } from 'react-router-dom';

/**
 * Sidebar — vertical nav used by the dashboard/admin shells.
 * `items` is [{ to, label, icon, end }]. Collapses to a horizontal scroll
 * row on small screens.
 */
export default function Sidebar({ items = [], title }) {
  return (
    <aside className="v-sidebar p-3">
      {title && (
        <div className="v-eyebrow px-2 mb-2 d-none d-lg-block">{title}</div>
      )}
      <ul className="nav flex-lg-column flex-row flex-nowrap overflow-auto">
        {items.map((it) => (
          <li className="nav-item" key={it.to}>
            <NavLink
              to={it.to}
              end={it.end}
              className="nav-link d-flex align-items-center gap-2 text-nowrap"
            >
              <span aria-hidden="true">{it.icon}</span>
              <span>{it.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
