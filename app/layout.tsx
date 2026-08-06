import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "域名价格查询 | Domain Price Checker",
  description:
    "查询域名是否可注册，对比 Cloudflare、Porkbun、Namecheap、阿里云、腾讯云等主流注册商的首年与续费价格。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}