import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'API 接口文档',
    template: '%s | API 接口文档',
  },
  description:
    '完整的 API 接口文档，包含认证授权、用户管理、订单管理、商品管理等模块的接口说明',
  keywords: [
    'API',
    '接口文档',
    'REST API',
    '开发者文档',
  ],
  authors: [{ name: 'API Documentation Team' }],
  generator: 'Next.js',
  openGraph: {
    title: 'API 接口文档',
    description:
      '完整的 API 接口文档，包含认证授权、用户管理、订单管理、商品管理等模块的接口说明',
    url: 'https://api-docs.example.com',
    siteName: 'API 接口文档',
    locale: 'zh_CN',
    type: 'website',
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Coze Code | Your AI Engineer is Here',
  //   description:
  //     'Build and deploy full-stack applications through AI conversation. No env setup, just flow.',
  //   // images: [''],
  // },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
