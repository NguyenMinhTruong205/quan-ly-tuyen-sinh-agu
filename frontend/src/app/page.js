
"use client";

import Link from "next/link";
import styles from "./page.module.css";

const features = [
  {
    icon: "📝",
    title: "Nộp hồ sơ trực tuyến",
    description:
      "Đăng ký thông tin xét tuyển và gửi hồ sơ trực tuyến thuận tiện.",
    href: "/nop-ho-so",
    action: "Nộp hồ sơ",
  },
  {
    icon: "🔎",
    title: "Tra cứu hồ sơ",
    description:
      "Theo dõi tình trạng tiếp nhận và xử lý hồ sơ xét tuyển của bạn.",
    href: "/tra-cuu",
    action: "Tra cứu ngay",
  },
  {
    icon: "🎓",
    title: "Thông tin tuyển sinh",
    description:
      "Tìm hiểu thông tin tuyển sinh và chuẩn bị hồ sơ đăng ký.",
    href: "/tra-cuu",
    action: "Tìm hiểu thêm",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      {/* PHẦN GIỚI THIỆU */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            TRƯỜNG ĐẠI HỌC AN GIANG
          </div>

          <h1>
            CỔNG THÔNG TIN
            <span>TUYỂN SINH AGU</span>
          </h1>

          <p className={styles.heroDescription}>
            Chào mừng bạn đến với hệ thống quản lý tuyển sinh trực tuyến
            của Trường Đại học An Giang. Tra cứu thông tin, đăng ký và
            theo dõi hồ sơ xét tuyển thuận tiện trên một nền tảng.
          </p>

          <div className={styles.heroActions}>
            <Link href="/nop-ho-so" className={styles.primaryButton}>
              📝 Nộp hồ sơ ngay
            </Link>

            <Link href="/tra-cuu" className={styles.secondaryButton}>
              🔎 Tra cứu hồ sơ
            </Link>
          </div>

          <div className={styles.heroNote}>
            <span className={styles.noteDot}></span>
            Hệ thống hỗ trợ đăng ký và tra cứu hồ sơ trực tuyến
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualCircle}>
            <div className={styles.visualIcon}>🎓</div>
            <div className={styles.visualTitle}>AGU</div>
            <div className={styles.visualSubtitle}>
              AN GIANG UNIVERSITY
            </div>
          </div>

          <div className={styles.floatingCard}>
            <span>📚</span>
            <div>
              <strong>Hành trình tri thức</strong>
              <small>Bắt đầu từ hôm nay</small>
            </div>
          </div>
        </div>
      </section>

      {/* DỊCH VỤ TRỰC TUYẾN */}
      <section className={styles.introSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>
            DỊCH VỤ TRỰC TUYẾN
          </span>

          <h2>Đồng hành cùng bạn trong mùa tuyển sinh</h2>

          <p>
            Các chức năng cần thiết được tích hợp để bạn dễ dàng thực hiện
            và theo dõi quá trình đăng ký xét tuyển.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((item) => (
            <article className={styles.featureCard} key={item.title}>
              <div className={styles.featureIcon}>{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <Link href={item.href} className={styles.featureLink}>
                {item.action} <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* HƯỚNG DẪN ĐĂNG KÝ */}
      <section className={styles.stepsSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>HƯỚNG DẪN</span>

          <h2>Các bước đăng ký hồ sơ</h2>

          <p>
            Thực hiện theo các bước đơn giản để gửi và theo dõi hồ sơ
            của bạn.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>01</div>
            <h3>Đăng ký tài khoản</h3>
            <p>Tạo tài khoản để sử dụng các chức năng của hệ thống.</p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>02</div>
            <h3>Điền thông tin</h3>
            <p>
              Cung cấp thông tin cá nhân và thông tin đăng ký xét tuyển.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>03</div>
            <h3>Gửi hồ sơ</h3>
            <p>
              Kiểm tra thông tin và gửi hồ sơ qua hệ thống trực tuyến.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>04</div>
            <h3>Theo dõi kết quả</h3>
            <p>
              Sử dụng chức năng tra cứu để theo dõi tình trạng hồ sơ.
            </p>
          </div>
        </div>
      </section>

      {/* KÊU GỌI ĐĂNG KÝ */}
      <section className={styles.callout}>
        <div>
          <span className={styles.sectionLabel}>
            CỔNG TUYỂN SINH AGU
          </span>

          <h2>Sẵn sàng bắt đầu hành trình của bạn?</h2>

          <p>
            Truy cập hệ thống để đăng ký hoặc tra cứu hồ sơ tuyển sinh.
          </p>
        </div>

        <div className={styles.calloutActions}>
          <Link href="/dang-ky" className={styles.calloutPrimary}>
            Tạo tài khoản
          </Link>

          <Link href="/tra-cuu" className={styles.calloutSecondary}>
            Tra cứu hồ sơ
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <strong>TRƯỜNG ĐẠI HỌC AN GIANG</strong>

        <span>Cổng thông tin tuyển sinh trực tuyến</span>

        <small>
          © 2026 AGU. Hệ thống quản lý tuyển sinh.
        </small>
      </footer>
    </main>
  );
}
