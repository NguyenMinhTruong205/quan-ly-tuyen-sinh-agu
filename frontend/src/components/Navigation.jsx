
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminPage = pathname?.startsWith("/admin");

  // ĐỌC TÀI KHOẢN
  const readUser = useCallback(() => {
    try {
      const normalUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      const adminUser = JSON.parse(
        localStorage.getItem("adminInfo") || "null"
      );

      setUser(
        isAdminPage
          ? adminUser || normalUser
          : normalUser || adminUser
      );
    } catch {
      setUser(null);
    }

    setReady(true);
  }, [isAdminPage]);

  useEffect(() => {
    readUser();

    window.addEventListener("storage", readUser);
    window.addEventListener("authChanged", readUser);

    return () => {
      window.removeEventListener("storage", readUser);
      window.removeEventListener("authChanged", readUser);
    };
  }, [readUser]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // PHÂN QUYỀN
  const role = String(user?.vaiTro || user?.role || "")
    .toLowerCase()
    .replace(/\s/g, "");

  const isStaff = [
    "admin",
    "can_bo",
    "canbo",
    "staff",
    "quan_tri",
    "quantri",
  ].includes(role);

  const displayName =
    user?.hoTen || user?.name || user?.email || "Tài khoản";

  // KIỂM TRA MENU ĐANG CHỌN
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  // ĐĂNG XUẤT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");

    setUser(null);
    window.dispatchEvent(new Event("authChanged"));

    router.push("/dang-nhap");
    router.refresh();
  };

  // DANH SÁCH MENU
  const links = isAdminPage
    ? [
        {
          href: "/admin/dashboard",
          label: "Tổng quan",
          icon: "home",
        },
        {
          href: "/admin/ho-so",
          label: "Quản lý hồ sơ",
          icon: "folder",
        },
        {
          href: "/admin/he-thong",
          label: "Hệ thống",
          icon: "settings",
        },
      ]
    : [
        {
          href: "/",
          label: "Trang chủ",
          icon: "home",
        },
        {
          href: "/tra-cuu",
          label: "Tra cứu hồ sơ",
          icon: "search",
        },
      ];

  // ICON
  const Icon = ({ name, size = 20 }) => {
    const common = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.9,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    };

    const paths = {
      home: (
        <>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v12h14V9" />
          <path d="M9 21v-7h6v7" />
        </>
      ),

      search: (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 5 5" />
        </>
      ),

      user: (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
      ),

      edit: (
        <>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </>
      ),

      folder: (
        <>
          <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3Z" />
          <path d="M3 10h18" />
        </>
      ),

      settings: (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="m19.4 15 .1.1 1.2 1-1.5 2.6-1.5-.6a8 8 0 0 1-1.7 1l-.3 1.6h-3l-.3-1.6a8 8 0 0 1-1.7-1l-1.5.6-1.5-2.6 1.2-1a7 7 0 0 1 0-2l-1.2-1 1.5-2.6 1.5.6a8 8 0 0 1 1.7-1l.3-1.6h3l.3 1.6a8 8 0 0 1 1.7 1l1.5-.6 1.5 2.6-1.2 1a7 7 0 0 1 0 2Z" />
        </>
      ),
    };

    return <svg {...common}>{paths[name]}</svg>;
  };

  return (
    <div id="agu-navigation-root">
      <header className="agu-nav-header">

        {/* THANH MENU CHÍNH */}
        <div className="agu-nav-mainbar">
          <div className="agu-nav-container">

            {/* LOGO CHÍNH THỨC VÀ TÊN TRƯỜNG */}
            <Link href="/" className="agu-nav-brand">

              <div className="agu-nav-logo">
                <Image
                  src="/agu-logo.png"
                  alt="Logo chính thức Trường Đại học An Giang"
                  width={76}
                  height={76}
                  priority
                  className="agu-nav-logo-img"
                />
              </div>

              <span className="agu-nav-divider" />

              <div className="agu-brand-text">
                <span className="agu-university">
                  ĐẠI HỌC AN GIANG
                </span>

                <span className="agu-system">
                  {"HỆ THỐNG TUYỂN SINH"}
                </span>
              </div>

            </Link>

            {/* MENU MOBILE */}
            <button
              className="agu-nav-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Mở menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>

            {/* MENU ĐIỀU HƯỚNG */}
            <div
              className={`agu-nav-navigation ${
                menuOpen ? "show" : ""
              }`}
            >

              <nav className="agu-nav-links">

                {links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`agu-nav-link ${
                      isActive(item.href) ? "active" : ""
                    }`}
                  >
                    <Icon name={item.icon} size={19} />
                    <span>{item.label}</span>
                  </Link>
                ))}

                {/* NỘP HỒ SƠ / QUẢN TRỊ */}
                {user && !isAdminPage && (
                  <Link
                    href={
                      isStaff
                        ? "/admin/dashboard"
                        : "/nop-ho-so"
                    }
                    className={`agu-nav-link ${
                      isActive(
                        isStaff
                          ? "/admin/dashboard"
                          : "/nop-ho-so"
                      )
                        ? "active"
                        : ""
                    }`}
                  >
                    <Icon
                      name={isStaff ? "settings" : "folder"}
                      size={19}
                    />

                    <span>
                      {isStaff ? "Quản trị" : "Nộp hồ sơ"}
                    </span>
                  </Link>
                )}

              </nav>

              {/* TÀI KHOẢN */}
              <div className="agu-nav-actions">

                {ready && user ? (

                  <div className="agu-nav-account">

                    <div className="agu-nav-avatar">
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div className="agu-nav-account-info">
                      <small>XIN CHÀO</small>
                      <strong>{displayName}</strong>
                    </div>

                    <button
                      className="agu-nav-logout"
                      onClick={logout}
                    >
                      Đăng xuất
                    </button>

                  </div>

                ) : ready && !isAdminPage ? (

                  <div className="agu-nav-auth">

                    <Link
                      href="/dang-nhap"
                      className="agu-nav-login"
                    >
                      <Icon name="user" size={20} />
                      <span>Đăng nhập</span>
                    </Link>

                    <Link
                      href="/dang-ky"
                      className="agu-nav-register"
                    >
                      <Icon name="edit" size={19} />
                      <span>Đăng ký</span>
                      <span className="agu-nav-arrow">›</span>
                    </Link>

                  </div>

                ) : null}

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CSS GIAO DIỆN */}
      <style jsx global>{`

        /* RESET RIÊNG HEADER */
        #agu-navigation-root {
          position: relative;
          z-index: 1000;
          width: 100%;
          font-family: Arial, sans-serif;
        }

        #agu-navigation-root *,
        #agu-navigation-root *::before,
        #agu-navigation-root *::after {
          box-sizing: border-box;
        }

        #agu-navigation-root .agu-nav-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          margin: 0;
          padding: 0;
          background: #fff;
          box-shadow: 0 7px 22px rgba(16,43,75,.10);
        }

        /* THANH CHÍNH */
        #agu-navigation-root .agu-nav-mainbar {
          width: 100%;
          height: 94px;
          min-height: 94px;
          background: #fff;
          border-radius: 0 0 22px 22px;
        }

        #agu-navigation-root .agu-nav-container {
          width: min(1540px, calc(100% - 60px));
          max-width: none;
          height: 94px;
          min-height: 94px;
          margin: 0 auto;
          padding: 0;

          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 20px;
        }

        /* LOGO */
        #agu-navigation-root .agu-nav-brand {
          height: 80px;
          width: auto;
          min-width: max-content;
          margin: 0;
          padding: 0;

          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;

          gap: 13px;
          flex: 0 0 auto;

          text-decoration: none;
          white-space: nowrap;
        }

        #agu-navigation-root .agu-nav-logo {
          width: 76px;
          height: 76px;
          min-width: 76px;
          min-height: 76px;
          flex: 0 0 76px;

          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          background: transparent;
        }

        #agu-navigation-root .agu-nav-logo-img {
          display: block;
          width: 76px;
          height: 76px;
          max-width: none;
          object-fit: contain;
        }

        #agu-navigation-root .agu-nav-divider {
          display: block;
          width: 2px;
          height: 48px;
          flex: 0 0 2px;
          background: #d9ae56;
        }

        /* TÊN TRƯỜNG */
        #agu-navigation-root .agu-nav-brand-text {
          display: flex !important;
          flex-direction: column !important;
          flex-wrap: nowrap !important;
          align-items: flex-start !important;
          justify-content: center !important;

          width: auto;
          min-width: max-content;
          margin: 0;
          padding: 0;
          border: none;
          gap: 6px;
          white-space: nowrap;
        }

        #agu-navigation-root .agu-nav-university {
          display: block;
          margin: 0;
          padding: 0;

          color: #17375e;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: .3px;
          white-space: nowrap;
        }

        #agu-navigation-root .agu-nav-system {
          display: block;
          margin: 0;
          padding: 0;

          color: #c99c43;
          font-family: Georgia, serif;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: .5px;
          white-space: nowrap;
        }

        /* MENU */
        #agu-navigation-root .agu-nav-navigation {
          height: 100%;
          min-width: 0;
          flex: 1 1 auto;

          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 13px;
        }

        #agu-navigation-root .agu-nav-links {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          justify-content: flex-end !important;

          flex: 0 0 auto;
          gap: 8px;
        }

        /* NÚT MENU */
        #agu-navigation-root .agu-nav-link {
          position: relative;

          height: 46px;
          min-height: 46px;
          width: auto;
          margin: 0;
          padding: 0 18px;

          display: inline-flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          justify-content: center !important;

          gap: 9px;

          color: #17365b;
          background: #f0f3fa;
          border: 1px solid transparent;
          border-radius: 30px;

          font-family: Arial, sans-serif;
          font-size: 13px;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: all .2s ease;
        }

        #agu-navigation-root .agu-nav-link:hover {
          color: #0e3155;
          background: #e5ecf6;
          transform: translateY(-1px);
        }

        #agu-navigation-root .agu-nav-link.active {
          color: #fff;
          background: linear-gradient(135deg,#173e68,#0c2949);
          box-shadow: 0 4px 12px rgba(16,48,80,.19);
        }

        #agu-navigation-root .agu-nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 65%;
          height: 4px;
          border-radius: 5px 5px 0 0;
          background: #e8bd62;
          transform: translateX(-50%);
        }

        /* ĐĂNG NHẬP - ĐĂNG KÝ */
        #agu-navigation-root .agu-nav-actions,
        #agu-navigation-root .agu-nav-auth {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;

          width: auto;
          flex: 0 0 auto;
          gap: 9px;
        }

        #agu-navigation-root .agu-nav-login,
        #agu-navigation-root .agu-nav-register {
          height: 46px;
          min-height: 46px;
          width: auto;
          margin: 0;
          padding: 0 18px;

          display: inline-flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          justify-content: center !important;

          gap: 8px;
          border-radius: 30px;

          font-family: Arial, sans-serif;
          font-size: 13px;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition: all .2s ease;
        }

        #agu-navigation-root .agu-nav-login {
          color: #12395f;
          background: #fff;
          border: 2px solid #173b63;
        }

        #agu-navigation-root .agu-nav-login:hover {
          color: #fff;
          background: #173b63;
        }

        #agu-navigation-root .agu-nav-register {
          color: #172f4c;
          background: linear-gradient(135deg,#f8d98f,#e7ad3e);
          border: 1px solid #e4b454;
          box-shadow: 0 4px 12px rgba(190,145,57,.2);
        }

        #agu-navigation-root .agu-nav-register:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 15px rgba(190,145,57,.3);
        }

        #agu-navigation-root .agu-nav-arrow {
          font-size: 21px;
          line-height: 1;
        }

        /* TÀI KHOẢN */
        #agu-navigation-root .agu-nav-account {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          gap: 9px;
        }

        #agu-navigation-root .agu-nav-avatar {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          display: grid;
          place-items: center;
          color: #f0d69c;
          background: #173b63;
          border-radius: 50%;
          font-weight: 700;
        }

        #agu-navigation-root .agu-nav-account-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          max-width: 130px;
        }

        #agu-navigation-root .agu-nav-account-info small {
          color: #a18753;
          font-size: 9px;
          font-weight: 700;
        }

        #agu-navigation-root .agu-nav-account-info strong {
          color: #203c5c;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #agu-navigation-root .agu-nav-logout {
          padding: 10px 13px;
          color: #53657a;
          background: #fff;
          border: 1px solid #dce3eb;
          border-radius: 22px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        #agu-navigation-root .agu-nav-logout:hover {
          color: #a33b3b;
          background: #fff8f8;
        }

        /* MENU MOBILE */
        #agu-navigation-root .agu-nav-toggle {
          display: none;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          padding: 9px;
          border: 1px solid #dce3eb;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
        }

        #agu-navigation-root .agu-nav-toggle span {
          display: block;
          width: 100%;
          height: 2px;
          margin: 6px 0;
          border-radius: 5px;
          background: #173b63;
        }

        /* LAPTOP */
        @media (min-width: 1101px) and (max-width: 1500px) {

          #agu-navigation-root .agu-nav-container {
            width: calc(100% - 40px);
            gap: 10px;
          }

          #agu-navigation-root .agu-nav-brand {
            gap: 9px;
          }

          #agu-navigation-root .agu-nav-logo,
          #agu-navigation-root .agu-nav-logo-img {
            width: 58px;
            height: 58px;
            min-width: 58px;
            min-height: 58px;
          }

          #agu-navigation-root .agu-nav-divider {
            height: 40px;
          }

          #agu-navigation-root .agu-nav-university {
            font-size: 17px;
          }

          #agu-navigation-root .agu-nav-system {
            font-size: 11px;
          }

          #agu-navigation-root .agu-nav-navigation {
            gap: 7px;
          }

          #agu-navigation-root .agu-nav-links {
            gap: 5px;
          }

          #agu-navigation-root .agu-nav-link {
            padding: 0 11px;
            font-size: 11px;
          }

          #agu-navigation-root .agu-nav-login,
          #agu-navigation-root .agu-nav-register {
            padding: 0 11px;
            font-size: 11px;
          }
        }

        /* TABLET */
        @media (max-width: 1100px) {

          #agu-navigation-root .agu-nav-container {
            width: calc(100% - 32px);
            height: 82px;
            min-height: 82px;
          }

          #agu-navigation-root .agu-nav-toggle {
            display: block;
          }

          #agu-navigation-root .agu-nav-navigation {
            display: none !important;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            height: auto;
            min-width: 0;
            padding: 17px 20px;

            flex-direction: column !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            gap: 12px;

            background: #fff;
            border-top: 1px solid #edf0f4;
            box-shadow: 0 12px 24px rgba(17,42,75,.12);
          }

          #agu-navigation-root .agu-nav-navigation.show {
            display: flex !important;
          }

          #agu-navigation-root .agu-nav-links {
            width: 100%;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px;
          }

          #agu-navigation-root .agu-nav-link {
            width: 100%;
            min-height: 44px;
            justify-content: flex-start !important;
            padding: 0 15px;
          }

          #agu-navigation-root .agu-nav-actions,
          #agu-navigation-root .agu-nav-auth {
            width: 100%;
          }

          #agu-navigation-root .agu-nav-auth > a {
            flex: 1;
          }

          #agu-navigation-root .agu-nav-account {
            width: 100%;
            justify-content: space-between;
            padding-top: 12px;
            border-top: 1px solid #edf0f4;
          }
        }

        /* ĐIỆN THOẠI */
        @media (max-width: 600px) {

          #agu-navigation-root .agu-nav-container {
            width: calc(100% - 22px);
            height: 72px;
            min-height: 72px;
          }

          #agu-navigation-root .agu-nav-brand {
            gap: 7px;
          }

          #agu-navigation-root .agu-nav-logo,
          #agu-navigation-root .agu-nav-logo-img {
            width: 49px;
            height: 49px;
            min-width: 49px;
            min-height: 49px;
          }

          #agu-navigation-root .agu-nav-divider {
            height: 35px;
          }

          #agu-navigation-root .agu-nav-university {
            font-size: 12px;
          }

          #agu-navigation-root .agu-nav-system {
            font-size: 8px;
          }
        }

        @media (max-width: 380px) {
          #agu-navigation-root .agu-nav-university {
            font-size: 11px;
          }

          #agu-navigation-root .agu-nav-system {
            font-size: 7px;
          }
        }

        /* FIX CHỮ HỆ THỐNG TUYỂN SINH */
        .agu-brand-text {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .agu-system {
          display: block;
          color: #c49a4b;
          font-family: Arial, sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.3px;
          line-height: 1.5;
          white-space: nowrap;
          word-spacing: normal;
        }

      `}</style>
    </div>
  );
}
