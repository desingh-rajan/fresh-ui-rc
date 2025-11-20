import { ComponentChildren } from "preact";
import ThemeSwitcher from "../../islands/ThemeSwitcher.tsx";

interface AdminLayoutProps {
  children: ComponentChildren;
  currentPath: string;
}

export function AdminLayout({ children, currentPath }: AdminLayoutProps) {
  const menuItems = [
    { path: "/admin/articles", label: "Articles", icon: "📄" },
    { path: "/admin/site-settings", label: "Site Settings", icon: "⚙" },
    { path: "/admin/users", label: "Users", icon: "👤" },
  ];

  return (
    <div class="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content flex flex-col">
        {/* Header */}
        <div class="w-full navbar bg-base-300">
          <div class="flex-none lg:hidden">
            <label
              htmlFor="admin-drawer"
              class="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-6 h-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          <div class="flex-1 px-2 mx-2">
            <span class="text-lg font-bold">Admin Dashboard</span>
          </div>

          <div class="flex-none gap-2">
            <ThemeSwitcher />
            <div class="dropdown dropdown-end">
              <label
                tabIndex={0}
                class="btn btn-ghost btn-circle avatar placeholder"
              >
                <div class="bg-neutral text-neutral-content rounded-full w-10">
                  <span>A</span>
                </div>
              </label>
              <ul
                tabIndex={0}
                class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a href="/admin/profile">Profile</a>
                </li>
                <li>
                  <a href="/auth/logout">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div class="p-4 lg:p-8">
          {children}
        </div>
      </div>

      {/* Sidebar */}
      <div class="drawer-side">
        <label htmlFor="admin-drawer" class="drawer-overlay" />
        <aside class="bg-base-200 w-64 min-h-full">
          <div class="p-4">
            <h1 class="text-xl font-bold mb-6">tstack-kit</h1>
          </div>

          <ul class="menu px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  class={currentPath === item.path ? "active" : ""}
                >
                  <span class="text-xl">{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
