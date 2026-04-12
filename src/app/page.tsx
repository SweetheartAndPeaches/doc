'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Copy, Check, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Navigation sections
const sections = {
  base: [
    { id: 'transport', title: '传输规则', icon: '01' },
    { id: 'callback', title: '回调规则', icon: '02' },
    { id: 'params', title: '参数规范', icon: '03' },
    { id: 'signature', title: '签名算法', icon: '04' },
  ],
  collect: [
    { id: 'collect-order', title: '统一代收', icon: '05' },
    { id: 'collect-query', title: '查询订单', icon: '06' },
    { id: 'collect-notify', title: '支付通知', icon: '07' },
  ],
  transfer: [
    { id: 'transfer-order', title: '统一代付', icon: '08' },
    { id: 'transfer-query', title: '查询订单', icon: '09' },
    { id: 'transfer-notify', title: '转账通知', icon: '10' },
  ],
  query: [
    { id: 'balance-query', title: '余额查询', icon: '11' },
  ],
};

// Code block component
function CodeBlock({ lang, title, children }: { lang: string; title: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (codeRef.current) {
      await navigator.clipboard.writeText(codeRef.current.textContent || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded">
            {lang}
          </span>
          <span className="text-xs text-zinc-400">{title}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-600"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              复制
            </>
          )}
        </Button>
      </div>
      <pre ref={codeRef} className="p-4 overflow-x-auto text-sm">
        <code className="font-mono text-zinc-300">
          {children}
        </code>
      </pre>
    </div>
  );
}

// Notice box component
function NoticeBox({
  type,
  children,
}: {
  type: 'info' | 'warning';
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };

  return (
    <div className={cn('flex items-start gap-3 p-4 my-4 rounded-lg border', styles[type])}>
      <div
        className={cn(
          'flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white flex-shrink-0 mt-0.5',
          type === 'info' ? 'bg-blue-500' : 'bg-amber-500'
        )}
      >
        !
      </div>
      <div className="flex-1 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// Info grid component
function InfoGrid({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
        >
          <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">{item.label}</div>
          <div className="text-sm text-gray-900 leading-relaxed">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// Parameter table component
function ParamTable({
  data,
  compact = false,
}: {
  data: {
    name: string;
    field: string;
    required: boolean;
    type: string;
    example: string;
    description: string;
  }[];
  compact?: boolean;
}) {
  return (
    <div className={cn('overflow-x-auto my-4', compact ? 'max-w-md' : '')}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
              字段名
            </th>
            <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
              变量名
            </th>
            <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
              必填
            </th>
            <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
              类型
            </th>
            <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
              示例值
            </th>
            <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">
              描述
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-blue-50/30">
              <td className="p-3 border border-gray-200 text-gray-700 whitespace-nowrap">{item.name}</td>
              <td className="p-3 border border-gray-200">
                <code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs font-mono">
                  {item.field}
                </code>
              </td>
              <td className="p-3 border border-gray-200 whitespace-nowrap">
                {item.required ? (
                  <span className="text-red-500 font-medium">是</span>
                ) : (
                  <span className="text-gray-400">否</span>
                )}
              </td>
              <td className="p-3 border border-gray-200 text-gray-600 whitespace-nowrap">{item.type}</td>
              <td className="p-3 border border-gray-200 text-gray-600 whitespace-nowrap">{item.example}</td>
              <td className="p-3 border border-gray-200 text-gray-600">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Section header component
function SectionHeader({
  title,
  badge,
  isCallback = false,
}: {
  title: string;
  badge?: string;
  isCallback?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 pl-3 border-l-4 border-blue-500">{title}</h2>
      {badge && (
        <Badge
          className={cn(
            'text-[11px] font-semibold',
            isCallback ? 'bg-amber-500' : 'bg-green-500'
          )}
        >
          {badge}
        </Badge>
      )}
    </div>
  );
}

// API info component
function ApiInfo({
  rows,
}: {
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
      {rows.map((row, idx) => (
        <div key={idx} className="flex items-start py-2 border-b border-dashed border-gray-200 last:border-0">
          <span className="w-24 flex-shrink-0 text-sm text-gray-500 font-medium">{row.label}</span>
          <span className="flex-1 text-sm text-gray-900 leading-relaxed">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

// Section divider component
function SectionDivider({ text }: { text: string }) {
  return (
    <div className="flex items-center my-12">
      <div className="flex-1 h-px bg-gray-200"></div>
      <span className="px-4 py-1 text-sm font-semibold text-blue-500 bg-gray-100 rounded-full">
        {text}
      </span>
      <div className="flex-1 h-px bg-gray-200"></div>
    </div>
  );
}

// Main component
export default function PaymentDocPage() {
  const [activeSection, setActiveSection] = useState('transport');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const allSections = [
        ...sections.base,
        ...sections.collect,
        ...sections.transfer,
        ...sections.query,
      ];
      const scrollPos = window.scrollY + 120;

      for (let i = allSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(allSections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(allSections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-14 px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold rounded-lg">
                API
              </span>
              <span className="text-lg font-semibold">NEQUPAY支付文档</span>
            </div>
          </div>
          <Badge variant="secondary">v1.0</Badge>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'w-64 bg-white border-r fixed h-[calc(100vh-3.5rem)] overflow-y-auto z-40',
            'lg:block',
            mobileMenuOpen ? 'block' : 'hidden'
          )}
        >
          <nav className="p-3">
            <div className="mb-4">
              <div className="px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                基础规则
              </div>
              {sections.base.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors mb-0.5',
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-500 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-5 h-5 rounded text-[10px] font-semibold mr-2.5',
                      activeSection === item.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.title}
                </button>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="mb-4">
              <div className="px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                代收接口
              </div>
              {sections.collect.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors mb-0.5',
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-500 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-5 h-5 rounded text-[10px] font-semibold mr-2.5',
                      activeSection === item.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.title}
                </button>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="mb-4">
              <div className="px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                代付接口
              </div>
              {sections.transfer.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors mb-0.5',
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-500 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-5 h-5 rounded text-[10px] font-semibold mr-2.5',
                      activeSection === item.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.title}
                </button>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="mb-4">
              <div className="px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                查询接口
              </div>
              {sections.query.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors mb-0.5',
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-500 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-5 h-5 rounded text-[10px] font-semibold mr-2.5',
                      activeSection === item.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.title}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-3.5rem)]">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Page header */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                NEQUPAY支付API文档
              </h1>
              <p className="text-gray-500 leading-relaxed">
                本文档描述了支付系统的传输规则、回调规则、签名算法以及各接口的详细说明
              </p>
            </div>

            {/* ==================== 基础规则部分 ==================== */}

            {/* 传输规则 */}
            <section
              id="transport"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="传输规则" />
              <InfoGrid
                items={[
                  { label: '传输方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">HTTP</code> <span className="text-xs text-gray-400">(生产环境建议HTTPS)</span></> },
                  { label: '提交方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">POST</code> 或 <code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">GET</code></> },
                  { label: '内容类型', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">application/json</code></> },
                  { label: '字符编码', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">UTF-8</code></> },
                  { label: '签名算法', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">MD5</code></> },
                ]}
              />
            </section>

            {/* 回调规则 */}
            <section
              id="callback"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="回调规则" />
              <InfoGrid
                items={[
                  { label: '传输方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">HTTP</code> <span className="text-xs text-gray-400">(生产环境建议HTTPS)</span></> },
                  { label: '提交方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">POST</code></> },
                  { label: '内容类型', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">application/x-www-form-urlencoded</code></> },
                  { label: '字符编码', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">UTF-8</code></> },
                  { label: '签名算法', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">MD5</code></> },
                ]}
              />
            </section>

            {/* 参数规范 */}
            <section
              id="params"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="参数规范" />
              <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="font-semibold text-gray-900 mb-2">交易金额</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    默认为布基纳法索交易，单位为分，参数值不能带小数，不要传递包含小数点的数值。
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-900 mb-2">时间参数</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    所有涉及时间参数均使用精确到毫秒的13位数值，如：
                    <code className="px-1.5 py-0.5 bg-white border border-gray-200 text-blue-600 rounded text-xs ml-1">
                      1622016572190
                    </code>
                  </div>
                </div>
              </div>
            </section>

            {/* 签名算法 */}
            <section
              id="signature"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="签名算法" />

              {/* Step 1 */}
              <div className="flex gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <span className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white text-sm font-semibold rounded-full">
                    1
                  </span>
                  <div className="w-0.5 flex-1 bg-gray-200 mt-2"></div>
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="font-semibold text-gray-900 mb-2">拼接待签名字符串</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    设所有发送或者接收到的数据为集合M，将集合M内非空参数值的参数按照参数名ASCII码从小到大排序（字典序），使用URL键值对的格式（即key1=value1&amp;key2=value2…）拼接成字符串stringA。
                  </p>
                  <div className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">注意事项</div>
                    <ul className="space-y-2">
                      {[
                        '参数名ASCII码从小到大排序（字典序）',
                        '如果参数的值为空不参与签名',
                        '参数名区分大小写',
                        '验证调用返回或支付中心主动通知签名时，传送的sign参数不参与签名',
                        '支付中心接口可能增加字段，验证签名时必须支持增加的扩展字段',
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white text-sm font-semibold rounded-full">
                    2
                  </span>
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="font-semibold text-gray-900 mb-2">计算签名值</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    在stringA最后拼接上key
                    <code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs mx-1">
                      &quot;&amp;key=&quot; + 私钥
                    </code>
                    得到stringSignTemp字符串，并对stringSignTemp进行MD5运算，再将得到的字符串所有字符转换为大写，得到sign值signValue。
                  </p>
                </div>
              </div>

              <CodeBlock lang="Java" title="请求支付系统参数示例">
{`Map signMap = new HashMap<>();
signMap.put("platId", "1000");
signMap.put("mchOrderNo", "P0123456789101");
signMap.put("amount", "10000");
signMap.put("clientIp", "192.168.0.111");
signMap.put("returnUrl", "https://www.baidu.com");
signMap.put("notifyUrl", "https://www.baidu.com");
signMap.put("reqTime", "20190723141000");
signMap.put("version", "1.0");`}
              </CodeBlock>

              {/* Result blocks */}
              <div className="space-y-3 my-4">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="text-[11px] font-semibold text-blue-500 uppercase tracking-wide mb-2">待签名值</div>
                  <div className="text-xs text-gray-600 leading-relaxed break-all">
                    amount=10000&amp;clientIp=192.168.0.111&amp;mchOrderNo=P0123456789101&amp;notifyUrl=https://www.baidu.com&amp;platId=1000&amp;reqTime=20190723141000&amp;returnUrl=https://www.baidu.com&amp;version=1.0&amp;key=EWEFD123RGSRETYDFNGFGFGSHDFGH
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                  <div className="text-[11px] font-semibold text-green-600 uppercase tracking-wide mb-2">签名结果</div>
                  <div className="text-sm font-mono font-semibold text-green-600 tracking-wide">
                    4A5078DABBCE0D9C4E7668DACB96FF7A
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Info className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <span className="text-sm text-yellow-800">运营管理平台可以管理商户的私钥</span>
              </div>
            </section>

            {/* ==================== 代收接口部分 ==================== */}
            <SectionDivider text="代收接口" />

            {/* 统一代收 */}
            <section
              id="collect-order"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="统一代收" badge="POST" />
              <ApiInfo
                rows={[
                  { label: '接口说明', value: '商户业务系统通过统一下单接口发起支付收款订单，NEQUPAY支付网关会根据商户配置的支付通道路由支付通道完成支付下单。' },
                  { label: '适用对象', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">普通商户</code></> },
                  { label: '请求URL', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">https://kopay.bet/api/pay/unifiedOrder</code></> },
                  { label: '请求方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">POST</code></> },
                  { label: '请求类型', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">application/json</code> 或 <code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">application/x-www-form-urlencoded</code></> },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">请求参数</h4>
              <ParamTable
                data={[
                  { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号,系统获取' },
                  { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID,系统获取' },
                  { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '商户生成的订单号' },
                  { name: '支付方式', field: 'wayCode', required: true, type: 'String(30)', example: 'TG_QR', description: '哥伦固定：COLOMBIA_QR 秘鲁固定：MILURU_QR' },
                  { name: '支付金额', field: 'amount', required: true, type: 'int', example: '100', description: '单位分,不含小数点' },
                  { name: '货币代码', field: 'currency', required: true, type: 'String(3)', example: 'COP', description: '哥伦固定：COP 泌鲁固定：PEN' },
                  { name: '商品标题', field: 'subject', required: true, type: 'String(64)', example: '商品标题测试', description: '商品标题' },
                  { name: '商品描述', field: 'body', required: true, type: 'String(256)', example: '商品描述测试', description: '商品描述' },
                  { name: '异步通知地址', field: 'notifyUrl', required: false, type: 'String(128)', example: 'https://www.kopay.bet/notify.htm', description: '支付结果异步回调URL,只有传了该值才会发起回调' },
                  { name: '跳转通知地址', field: 'returnUrl', required: false, type: 'String(128)', example: 'https://www.kopay.bet/return.htm', description: '支付结果同步跳转通知URL' },
                  { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                  { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                  { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2BFD727A4B6845133519F3AD6', description: '签名值，详见签名算法' },
                  { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
                ]}
              />

              <CodeBlock lang="JSON" title="请求示例">
{`{
  "amount": 8,
  "mchOrderNo": "mho1624005107281",
  "subject": "商品标题",
  "wayCode": "ALI_BAR",
  "sign": "84F606FA25A6EC4783BECC08D4FDC681",
  "reqTime": "1624005107",
  "body": "商品描述",
  "version": "1.0",
  "appId": "60cc09bce4b0f1c0b83761c9",
  "clientIp": "192.166.1.132",
  "notifyUrl": "https://www.kopay.bet",
  "signType": "MD5",
  "currency": "cny",
  "returnUrl": "",
  "mchNo": "M1623984572"
}`}
              </CodeBlock>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">返回参数</h4>
              <ParamTable
                data={[
                  { name: '返回状态', field: 'code', required: true, type: 'int', example: '0', description: '0-下单成功，其他-处理有误，详见错误码' },
                  { name: '返回信息', field: 'msg', required: false, type: 'String(128)', example: '签名失败', description: '具体错误原因' },
                  { name: '签名信息', field: 'sign', required: false, type: 'String(32)', example: 'CCD9083A6DAD9A2DA9F668C3D4517A84', description: '对data内数据签名,如data为空则不返回' },
                  { name: '返回数据', field: 'data', required: false, type: 'String(512)', example: '{}', description: '返回下单数据,json格式数据' },
                ]}
              />

              <NoticeBox type="info">
                注：当code = 0 且 orderState = 1 才会返回支付地址
              </NoticeBox>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">Data 数据格式</h4>
              <ParamTable
                data={[
                  { name: '支付订单号', field: 'payOrderId', required: true, type: 'String(30)', example: 'U12021022311124442600', description: '返回支付系统订单号' },
                  { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '返回商户传入的订单号' },
                  { name: '订单状态', field: 'orderState', required: true, type: 'int', example: '2', description: '0-订单生成 1-支付中 2-支付成功 3-支付失败 4-已撤销 5-已退款 6-订单关闭' },
                  { name: '支付数据类型', field: 'payDataType', required: true, type: 'String', example: 'payUrl', description: 'payUrl-跳转链接 codeImgUrl-二维码图片地址' },
                  { name: '支付地址', field: 'payData', required: false, type: 'String', example: 'http://www.kopay.bet/pay.html', description: '支付链接' },
                  { name: '渠道错误码', field: 'errCode', required: false, type: 'String', example: 'ACQ.PAYMENT_AUTH_CODE_INVALID', description: '错误码' },
                  { name: '渠道错误描述', field: 'errMsg', required: false, type: 'String', example: 'Business Failed 失败', description: '错误描述' },
                ]}
              />
            </section>

            {/* 查询代收订单 */}
            <section
              id="collect-query"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="查询代收订单" badge="POST" />
              <ApiInfo
                rows={[
                  { label: '接口说明', value: '商户通过该接口查询订单，支付网关会返回订单最新的数据' },
                  { label: '请求URL', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">https://kopay.bet/api/pay/query</code></> },
                  { label: '请求方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">POST</code></> },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">请求参数</h4>
              <ParamTable
                data={[
                  { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                  { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                  { name: '支付订单号', field: 'payOrderId', required: true, type: 'String(30)', example: 'P20160427210604000490', description: '支付中心生成的订单号，与mchOrderNo二者传一即可' },
                  { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '商户生成的订单号，与payOrderId二者传一即可' },
                  { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                  { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                  { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2BFD727A4B6845133519F3AD6', description: '签名值，详见签名算法' },
                  { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
                ]}
              />
            </section>

            {/* 支付通知 */}
            <section
              id="collect-notify"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="支付通知" badge="回调" isCallback />
              <ApiInfo
                rows={[
                  { label: '接口说明', value: '当订单支付成功时，支付网关会向商户系统发起回调通知。如果商户系统没有正确返回，支付网关会延迟再次通知。' },
                  { label: '请求URL', value: '该链接是通过统一下单接口提交的参数notifyUrl设置' },
                  { label: '请求方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">POST</code></> },
                  { label: '请求类型', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">application/x-www-form-urlencoded</code></> },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">通知参数</h4>
              <ParamTable
                data={[
                  { name: '支付订单号', field: 'payOrderId', required: true, type: 'String(30)', example: 'P12021022311124442600', description: '返回支付系统订单号' },
                  { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                  { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                  { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '返回商户传入的订单号' },
                  { name: '支付金额', field: 'amount', required: true, type: 'int', example: '100', description: '支付金额,单位分' },
                  { name: '订单状态', field: 'state', required: true, type: 'int', example: '2', description: '0-订单生成 1-支付中 2-支付成功 3-支付失败 4-已撤销 5-已退款 6-订单关闭' },
                  { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2BFD727A4B6845133519F3AD6', description: '签名值，详见签名算法' },
                ]}
              />

              <NoticeBox type="warning">
                <p>业务系统处理后同步返回给支付中心，返回字符串 <code className="px-1 py-0.5 bg-yellow-100 rounded text-xs">success</code> 则表示成功，返回非success则表示处理失败，支付中心会再次通知业务系统。</p>
                <p className="mt-2">通知频率为0/30/60/90/120/150,单位：秒</p>
                <p className="mt-2 font-semibold">注意：返回的字符串必须是小写，且前后不能有空格和换行符。</p>
              </NoticeBox>
            </section>

            {/* ==================== 代付接口部分 ==================== */}
            <SectionDivider text="代付接口" />

            {/* 统一代付 */}
            <section
              id="transfer-order"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="统一代付" badge="POST" />
              <ApiInfo
                rows={[
                  { label: '接口说明', value: '商户业务系统通过转账接口发起转账申请，NEQUPAY支付网关将根据请求数据传入系统，进行转账。' },
                  { label: '请求URL', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">https://kopay.bet/api/transferOrder</code></> },
                  { label: '请求方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">POST</code></> },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">请求参数</h4>
              <ParamTable
                data={[
                  { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                  { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                  { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '商户订单号' },
                  { name: '接口代码', field: 'ifCode', required: true, type: 'String(10)', example: 'colombia', description: '填接口代码,详细见下方接口代码表' },
                  { name: '入账方式', field: 'entryType', required: true, type: 'String(20)', example: 'BANK_CARD', description: '固定：BANK_CARD' },
                  { name: '转账金额', field: 'amount', required: true, type: 'int', example: '100', description: '转账金额单位分' },
                  { name: '货币代码', field: 'currency', required: true, type: 'String(3)', example: 'COP', description: '填货币代码,详细见下方货币代码表' },
                  { name: '收款账号', field: 'accountNo', required: true, type: 'String(64)', example: 'o6BcIwvTvIqf1zXZohc61biryWik', description: '收款账户' },
                  { name: '收款人姓名', field: 'accountName', required: true, type: 'String(64)', example: 'payName', description: '收款人名称' },
                  { name: '扩展参数', field: 'extParam', required: false, type: 'String(64)', example: 'o6BcIwvTvIqf1zXZohc61biryWik', description: '哥伦比亚不填 秘鲁支付必填：CCI' },
                  { name: '银行名称', field: 'bankName', required: true, type: 'String(64)', example: 'bank_name', description: '填银行名称,详细见下方银行名称表' },
                  { name: '转账备注', field: 'transferDesc', required: true, type: 'String(128)', example: '测试转账', description: '转账备注' },
                  { name: '异步通知地址', field: 'notifyUrl', required: false, type: 'String(128)', example: 'https://kopay.bet', description: '转账完成后回调该URL,只有传了该值才会发起回调' },
                  { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                  { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                  { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC23519F3AD6', description: '签名值，详见签名算法' },
                  { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">接口代码表</h4>
              <ParamTable
                compact
                data={[
                  { name: 'colombia', field: '-', required: false, type: '-', example: '-', description: '哥伦比亚' },
                  { name: 'miluru', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">货币代码表</h4>
              <ParamTable
                compact
                data={[
                  { name: 'COP', field: '-', required: false, type: '-', example: '-', description: '哥伦比亚' },
                  { name: 'PEN', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">银行名称表</h4>
              <ParamTable
                compact
                data={[
                  { name: 'Plin', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                  { name: 'BCP', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                  { name: 'Yape', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                  { name: 'BBVA', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                  { name: 'Scotiabank', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                  { name: 'Interbank', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">返回参数 - Data数据格式</h4>
              <NoticeBox type="info">
                注：当code = 0 且 state = 1 才表示转账中
              </NoticeBox>
              <ParamTable
                data={[
                  { name: '转账订单号', field: 'transferId', required: true, type: 'String(30)', example: 'T202108161731281310004', description: '返回转账订单号' },
                  { name: '商户转账单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: 'mho1624007315478', description: '返回商户传入的转账单号' },
                  { name: '转账状态', field: 'state', required: true, type: 'int', example: '2', description: '0-订单生成 1-转账中 2-转账成功 3-转账失败 4-转账关闭' },
                  { name: '转账凭证号', field: 'channelOrderNo', required: false, type: 'String', example: '20160427210604000490', description: '转账户凭证号' },
                  { name: '错误码', field: 'errCode', required: false, type: 'String', example: 'ACQ.PAYMENT_AUTH_CODE', description: '返回的错误码' },
                  { name: '错误描述', field: 'errMsg', required: false, type: 'String', example: 'Business Failed 失败', description: '返回的错误描述' },
                ]}
              />
            </section>

            {/* 查询代付订单 */}
            <section
              id="transfer-query"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="查询代付订单" badge="POST" />
              <ApiInfo
                rows={[
                  { label: '接口说明', value: '商户通过该接口查询订单，支付网关会返回订单最新的数据' },
                  { label: '请求URL', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">https://kopay.bet/api/transfer/query</code></> },
                  { label: '请求方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">POST</code></> },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">请求参数</h4>
              <ParamTable
                data={[
                  { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                  { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                  { name: '转账订单号', field: 'transferId', required: true, type: 'String(30)', example: 'T20160427210604000490', description: '转账单号，与mchOrderNo二者传一即可' },
                  { name: '商户转账单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '商户单号，与transferId二者传一即可' },
                  { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                  { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                  { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2B3519F3AD6', description: '签名值，详见签名算法' },
                  { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
                ]}
              />
            </section>

            {/* 转账通知 */}
            <section
              id="transfer-notify"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="转账通知" badge="回调" isCallback />
              <ApiInfo
                rows={[
                  { label: '接口说明', value: '当转账完成时(成功或失败)，支付网关会向商户系统发起回调通知。如果商户系统没有正确返回，支付网关会延迟再次通知。' },
                  { label: '请求URL', value: '该链接是通过转账申请接口提交的参数notifyUrl设置' },
                  { label: '请求方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">POST</code></> },
                  { label: '请求类型', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">application/x-www-form-urlencoded</code></> },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">通知参数</h4>
              <ParamTable
                data={[
                  { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                  { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                  { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '商户生成的转账订单号' },
                  { name: '转账订单号', field: 'transferId', required: true, type: 'String(30)', example: 'T20160427210604000490', description: '支付中心生成的转账单号' },
                  { name: '转账金额', field: 'amount', required: true, type: 'int', example: '100', description: '转账金额,单位分' },
                  { name: '转账状态', field: 'state', required: true, type: 'int', example: '2', description: '0-订单生成 1-转账中 2-转账成功 3-转账失败 4-转账关闭' },
                  { name: '收款账号', field: 'accountNo', required: true, type: 'String(64)', example: 'o6BcIwvTohc61biryWik', description: '收款账户' },
                  { name: '收款人姓名', field: 'accountName', required: true, type: 'String(64)', example: 'payerName', description: '收款账户姓名' },
                  { name: '签名', field: 'sign', required: true, type: 'String', example: 'B23F3B7F8CBBC856EF07D', description: '签名值，详见签名算法' },
                ]}
              />

              <NoticeBox type="warning">
                <p>业务系统处理后同步返回给支付中心，返回字符串 <code className="px-1 py-0.5 bg-yellow-100 rounded text-xs">success</code> 则表示成功，返回非success则表示处理失败，支付中心会再次通知业务系统。</p>
                <p className="mt-2">通知频率为0/30/60/90/120/150,单位：秒</p>
                <p className="mt-2 font-semibold">注意：返回的字符串必须是小写，且前后不能有空格和换行符。</p>
              </NoticeBox>
            </section>

            {/* ==================== 查询接口部分 ==================== */}
            <SectionDivider text="查询接口" />

            {/* 余额查询 */}
            <section
              id="balance-query"
              className="bg-white rounded-xl p-6 shadow-sm mb-6 scroll-mt-20"
            >
              <SectionHeader title="余额查询" badge="POST" />
              <ApiInfo
                rows={[
                  { label: '接口说明', value: '商户通过该接口查询账户余额，支付网关会返回账户最新的余额' },
                  { label: '请求URL', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">https://kopay.bet/api/query/balance</code></> },
                  { label: '请求方式', value: <><code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs">POST</code></> },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">请求参数</h4>
              <ParamTable
                data={[
                  { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                  { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                  { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                  { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                  { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2BFD727A4B6845133519F3AD6', description: '签名值，详见签名算法' },
                  { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
                ]}
              />

              <CodeBlock lang="JSON" title="请求示例">
{`{
  "appId": "60cc09bce4b0f1c0b83761c9",
  "sign": "46940C58B2F3AE426B77A297ABF4D31E",
  "signType": "MD5",
  "reqTime": "1624006009",
  "mchNo": "M1623984572",
  "version": "1.0"
}`}
              </CodeBlock>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">返回参数</h4>
              <ParamTable
                data={[
                  { name: '返回状态', field: 'code', required: true, type: 'int', example: '0', description: '0-处理成功，其他-处理有误，详见错误码' },
                  { name: '返回信息', field: 'msg', required: false, type: 'String(128)', example: '签名失败', description: '具体错误原因' },
                  { name: '签名信息', field: 'sign', required: false, type: 'String(32)', example: 'CCD9083A6DAD9A2DA9F668C3D4517A84', description: '对data内数据签名' },
                  { name: '返回数据', field: 'data', required: false, type: 'String(512)', example: '{}', description: '返回数据,json格式' },
                ]}
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">Data 数据格式</h4>
              <ParamTable
                data={[
                  { name: '账户余额', field: 'balance', required: true, type: 'long', example: '1622016572190', description: '账户当前余额' },
                ]}
              />

              <CodeBlock lang="JSON" title="返回示例">
{`{
  "code": 0,
  "data": {
    "balance": 1000.00
  },
  "msg": "SUCCESS",
  "sign": "9548145EA12D0CD8C1628BCF44E19E0D"
}`}
              </CodeBlock>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">返回码</h4>
              <ParamTable
                compact
                data={[
                  { name: '0', field: '-', required: false, type: '-', example: '-', description: '成功' },
                  { name: '9999', field: '-', required: false, type: '-', example: '-', description: '异常，具体错误详见msg字段' },
                ]}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
