'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu, X, Copy, Check, Info, ArrowUp, Sun, Moon, Lock, LogOut,
  ChevronRight, Shield, CreditCard, User,
  Send, RefreshCw, DollarSign, Bell, Settings, Zap, BookOpen, Search, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// 登录配置 - 设置为true需要登录，设置false直接访问
const REQUIRE_LOGIN = process.env.NEXT_PUBLIC_REQUIRE_LOGIN === 'true';

// 登录凭证
const VALID_USERNAME = 'sphpay';
const VALID_PASSWORD = '123456';

// Navigation sections with icons
const sections = {
  base: [
    { id: 'transport', title: '传输规则', icon: Zap },
    { id: 'callback', title: '回调规则', icon: RefreshCw },
    { id: 'params', title: '参数规范', icon: Settings },
    { id: 'signature', title: '签名算法', icon: Shield },
  ],
  collect: [
    { id: 'collect-order', title: '统一代收', icon: Send },
    { id: 'collect-query', title: '查询订单', icon: Search },
    { id: 'collect-notify', title: '代收回调', icon: Bell },
  ],
  transfer: [
    { id: 'transfer-order', title: '代付申请', icon: CreditCard },
    { id: 'transfer-query', title: '查询订单', icon: Search },
    { id: 'transfer-notify', title: '代付回调', icon: Bell },
  ],
  query: [
    { id: 'balance-query', title: '余额查询', icon: DollarSign },
  ],
};

const allSections = [
  { category: '基础规则', items: sections.base },
  { category: '代收接口', items: sections.collect },
  { category: '代付接口', items: sections.transfer },
  { category: '查询接口', items: sections.query },
];

// Code block component with enhanced copy
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
    <div className="my-4 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded">
            {lang}
          </span>
          <span className="text-xs text-zinc-400">{title}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-600 transition-all"
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
      <pre ref={codeRef} className="p-4 overflow-x-auto text-sm scrollbar-thin">
        <code className="font-mono text-zinc-300">
          {children}
        </code>
      </pre>
    </div>
  );
}

// Notice box component
function NoticeBox({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-blue-50/80 border-blue-200 text-blue-800',
    warning: 'bg-amber-50/80 border-amber-200 text-amber-800',
  };

  return (
    <div className={cn('flex items-start gap-3 p-4 my-4 rounded-xl border backdrop-blur-sm', styles[type])}>
      <div className={cn(
        'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white flex-shrink-0 mt-0.5',
        type === 'info' ? 'bg-blue-500' : 'bg-amber-500'
      )}>
        !
      </div>
      <div className="flex-1 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// Info grid component
function InfoGrid({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group bg-white/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300"
        >
          <div className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2 font-medium">
            {item.label}
          </div>
          <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">{item.value}</div>
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
    <div className={cn('overflow-x-auto my-4 rounded-xl border border-gray-100 dark:border-slate-700', compact ? 'max-w-md' : '')}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-slate-800 dark:to-slate-800/50">
            <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-slate-700 whitespace-nowrap">
              字段名
            </th>
            <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-slate-700 whitespace-nowrap">
              变量名
            </th>
            <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-slate-700 whitespace-nowrap">
              必填
            </th>
            <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-slate-700 whitespace-nowrap">
              类型
            </th>
            <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-slate-700 whitespace-nowrap">
              示例值
            </th>
            <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-slate-700">
              描述
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors">
              <td className="p-3 border-t border-gray-100 dark:border-slate-700 text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium">
                {item.name}
              </td>
              <td className="p-3 border-t border-gray-100 dark:border-slate-700">
                <code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono font-medium">
                  {item.field}
                </code>
              </td>
              <td className="p-3 border-t border-gray-100 dark:border-slate-700 whitespace-nowrap">
                {item.required ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    必填
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400">
                    选填
                  </span>
                )}
              </td>
              <td className="p-3 border-t border-gray-100 dark:border-slate-700 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {item.type}
              </td>
              <td className="p-3 border-t border-gray-100 dark:border-slate-700 text-gray-500 dark:text-gray-400 whitespace-nowrap font-mono text-xs">
                {item.example}
              </td>
              <td className="p-3 border-t border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Section header component
function SectionHeader({ title, badge, isCallback = false }: { title: string; badge?: string; isCallback?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6 group">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white pl-3 border-l-4 border-blue-500 group-hover:border-blue-400 transition-colors">
        {title}
      </h2>
      {badge && (
        <Badge className={cn(
          'text-[11px] font-bold px-2.5 py-1 shadow-sm',
          isCallback ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'
        )}>
          {badge}
        </Badge>
      )}
    </div>
  );
}

// API info component
function ApiInfo({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-4 mb-6 border border-gray-100 dark:border-slate-700">
      {rows.map((row, idx) => (
        <div key={idx} className="flex items-start py-2.5 border-b border-dashed border-gray-200/50 dark:border-slate-700/50 last:border-0">
          <span className="w-24 flex-shrink-0 text-sm text-gray-500 dark:text-gray-400 font-medium">{row.label}</span>
          <span className="flex-1 text-sm text-gray-900 dark:text-gray-100 leading-relaxed">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

// Section divider component
function SectionDivider({ text }: { text: string }) {
  return (
    <div className="flex items-center my-12 group">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      <span className="px-6 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-full shadow-sm mx-4 backdrop-blur-sm group-hover:shadow-md group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all">
        {text}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
    </div>
  );
}

// Table of contents component
function TableOfContents({ activeSection }: { activeSection: string }) {
  return (
    <div className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 z-30">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 p-3 shadow-lg">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          目录导航
        </div>
        {allSections.map(group => (
          <div key={group.category} className="mb-2 last:mb-0">
            <div className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-1">
              {group.category}
            </div>
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  const el = document.getElementById(item.id);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all',
                  activeSection === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                )}
              >
                <item.icon className="h-3 w-3" />
                {item.title}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main component
export default function PaymentDocPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState('transport');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
    document.documentElement.classList.toggle('dark');
  };

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
      setShowBackToTop(winScroll > 400);

      // Update active section
      const allItems = allSections.flatMap(g => g.items);
      const scrollPos = winScroll + 120;
      for (let i = allItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(allItems[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(allItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 登录处理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('用户名或密码错误');
    }
  };

  // 登出处理
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  }, []);

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 登录表单 - 仅在需要登录时显示 */}
      {REQUIRE_LOGIN && !isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="w-full max-w-md p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700">
            <div className="text-center mb-8">
              <img 
                src="/sphpay-logo.png" 
                alt="Sph-Pay Logo" 
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg mb-4"
              />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Sph-Pay</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">支付API文档 · 请登录后查看</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  账户
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入账户"
                    className="pl-10 h-12"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="pl-10 h-12"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {loginError}
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg">
                登录
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              测试账户：sphpay / 123456
            </p>
          </div>
        </div>
      )}

      {/* 显示文档内容 */}
      {(isLoggedIn || !REQUIRE_LOGIN) && (
        <>
          {/* Header */}
          <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between h-14 px-4 lg:px-8">
              <div className="flex items-center gap-4">
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src="/kopay-logo.png" 
                      alt="Sph-Pay Logo" 
                      className="w-10 h-10 rounded-xl shadow-lg"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Sph-Pay</h1>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5">支付API文档</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="hidden sm:flex items-center gap-1 px-2 py-1">
                  <BookOpen className="h-3 w-3" />
                  v1.0
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="rounded-lg"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-gray-500 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">退出</span>
                </Button>
              </div>
            </div>
          </header>

          <div className="flex">
            {/* Sidebar */}
            <aside className={cn(
              'w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-100 dark:border-slate-800 fixed h-[calc(100vh-3.5rem)] overflow-y-auto z-40 transition-all duration-300',
              mobileMenuOpen ? 'block' : 'hidden'
            )}>
              <nav className="p-4">
                {allSections.map((group, gIdx) => (
                  <div key={group.category} className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <span className="w-5 h-5 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-md text-[9px] font-bold">
                        {gIdx + 1}
                      </span>
                      {group.category}
                    </div>
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 mb-0.5 group',
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                        )}
                      >
                        <item.icon className={cn(
                          'h-4 w-4 transition-transform group-hover:scale-110',
                          activeSection === item.id ? 'text-blue-500 dark:text-blue-400' : ''
                        )} />
                        {item.title}
                        {activeSection === item.id && (
                          <ChevronRight className="h-3 w-3 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </aside>

            {/* Mobile overlay */}
            {mobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            {/* Main content */}
            <main className={cn(
              'flex-1 min-h-[calc(100vh-3.5rem)] transition-all duration-300',
              mobileMenuOpen ? 'lg:ml-64' : 'lg:ml-0'
            )}>
              <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Page header */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
                <Zap className="h-4 w-4" />
                API Documentation
              </div>
              <div className="flex justify-center mb-4">
                <img 
                  src="/kopay-logo.png" 
                  alt="Sph-Pay Logo" 
                  className="w-20 h-20 rounded-2xl shadow-xl"
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3 tracking-tight">
                Sph-Pay 支付API
              </h1>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                完整的支付系统API文档，包含传输规则、回调规则、签名算法以及各接口的详细说明
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  REST API
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-medium">
                  <Shield className="h-3 w-3" />
                  MD5 签名
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg text-xs font-medium">
                  <CreditCard className="h-3 w-3" />
                  代收/代付
                </div>
              </div>
            </div>

            {/* ==================== 基础规则部分 ==================== */}

            {/* 传输规则 */}
            <section id="transport" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="传输规则" />
              <InfoGrid items={[
                { label: '传输方式', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">HTTP</code> <span className="text-xs text-gray-400 ml-1">(生产建议HTTPS)</span></> },
                { label: '提交方式', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">POST</code> <span className="text-gray-400 mx-1">/</span> <code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">GET</code></> },
                { label: '内容类型', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">application/json</code></> },
                { label: '字符编码', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">UTF-8</code></> },
                { label: '签名算法', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">MD5</code></> },
              ]} />
            </section>

            {/* 回调规则 */}
            <section id="callback" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="回调规则" />
              <InfoGrid items={[
                { label: '传输方式', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">HTTP</code></> },
                { label: '提交方式', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">POST</code></> },
                { label: '内容类型', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">application/x-www-form-urlencoded</code></> },
                { label: '字符编码', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">UTF-8</code></> },
                { label: '签名算法', value: <><code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono">MD5</code></> },
              ]} />
            </section>

            {/* 参数规范 */}
            <section id="params" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="参数规范" />
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">1</span>
                    交易金额
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-8">
                    默认为布基纳法索交易，单位为分，参数值不能带小数，不要传递包含小数点的数值。
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">2</span>
                    时间参数
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-8">
                    所有涉及时间参数均使用精确到毫秒的13位数值，如：
                    <code className="px-2 py-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono ml-1">
                      1622016572190
                    </code>
                  </div>
                </div>
              </div>
            </section>

            {/* 签名算法 */}
            <section id="signature" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="签名算法" />

              {/* Step 1 */}
              <div className="flex gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/30">
                    1
                  </span>
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-300 to-purple-300 dark:from-blue-600 dark:to-purple-600 mt-2"></div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">拼接待签名字符串</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    设所有发送或者接收到的数据为集合M，将集合M内非空参数值的参数按照参数名ASCII码从小到大排序（字典序），使用URL键值对的格式（即key1=value1&amp;key2=value2…）拼接成字符串stringA。
                  </p>
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      注意事项
                    </div>
                    <ul className="space-y-2">
                      {['参数名ASCII码从小到大排序（字典序）', '如果参数的值为空不参与签名', '参数名区分大小写', '验证签名时sign参数不参与签名', '必须支持增加的扩展字段'].map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
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
                  <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/30">
                    2
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">计算签名值</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    在stringA最后拼接上key
                    <code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono mx-1">
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
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
                  <div className="text-[11px] font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    待签名值
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed break-all font-mono">
                    amount=10000&amp;clientIp=192.168.0.111&amp;mchOrderNo=P0123456789101&amp;notifyUrl=https://www.baidu.com&amp;platId=1000&amp;reqTime=20190723141000&amp;returnUrl=https://www.baidu.com&amp;version=1.0&amp;key=EWEFD123RGSRETYDFNGFGFGSHDFGH
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-800 p-4">
                  <div className="text-[11px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    签名结果
                  </div>
                  <div className="text-sm font-mono font-bold text-green-600 dark:text-green-400 tracking-wider">
                    4A5078DABBCE0D9C4E7668DACB96FF7A
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-lg">
                  <Info className="h-4 w-4" />
                </div>
                <span className="text-sm text-yellow-800 dark:text-yellow-300">运营管理平台可以管理商户的私钥</span>
              </div>
            </section>

            {/* ==================== 代收接口部分 ==================== */}
            <SectionDivider text="代收接口" />

            {/* 统一代收 */}
            <section id="collect-order" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="统一代收" badge="POST" />
              <ApiInfo rows={[
                { label: '接口说明', value: '商户业务系统通过统一下单接口发起支付收款订单，Sph-Pay支付网关会根据商户配置的支付通道路由支付通道完成支付下单。' },
                { label: '适用对象', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">普通商户</code></> },
                { label: '请求URL', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono break-all">https://sphpay.vip/api/pay/unifiedOrder</code></> },
                { label: '请求方式', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">POST</code></> },
                { label: '请求类型', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">application/json</code> <span className="text-gray-400 mx-1">/</span> <code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">form-urlencoded</code></> },
              ]} />

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded text-xs font-bold">R</span>
                请求参数
              </h4>
              <ParamTable data={[
                { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号,系统获取' },
                { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID,系统获取' },
                { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '商户生成的订单号' },
                { name: '支付方式', field: 'wayCode', required: true, type: 'String(30)', example: 'TG_QR', description: '哥伦固定：COLOMBIA_QR 秘鲁固定：MILURU_QR' },
                { name: '支付金额', field: 'amount', required: true, type: 'int', example: '100', description: '单位分,不含小数点' },
                { name: '货币代码', field: 'currency', required: true, type: 'String(3)', example: 'COP', description: '哥伦固定：COP 泌鲁固定：PEN' },
                { name: '商品标题', field: 'subject', required: true, type: 'String(64)', example: '商品标题测试', description: '商品标题' },
                { name: '商品描述', field: 'body', required: true, type: 'String(256)', example: '商品描述测试', description: '商品描述' },
                { name: '异步通知地址', field: 'notifyUrl', required: false, type: 'String(128)', example: 'https://...', description: '支付结果异步回调URL' },
                { name: '跳转通知地址', field: 'returnUrl', required: false, type: 'String(128)', example: 'https://...', description: '支付结果同步跳转通知URL' },
                { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2...', description: '签名值，详见签名算法' },
                { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
              ]} />

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
  "notifyUrl": "https://www.sphpay.vip",
  "signType": "MD5",
  "currency": "cny",
  "mchNo": "M1623984572"
}`}
              </CodeBlock>

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded text-xs font-bold">Rs</span>
                返回参数
              </h4>
              <ParamTable data={[
                { name: '返回状态', field: 'code', required: true, type: 'int', example: '0', description: '0-下单成功，其他-处理有误，详见错误码' },
                { name: '返回信息', field: 'msg', required: false, type: 'String(128)', example: '签名失败', description: '具体错误原因' },
                { name: '签名信息', field: 'sign', required: false, type: 'String(32)', example: 'CCD9083A6...', description: '对data内数据签名,如data为空则不返回' },
                { name: '返回数据', field: 'data', required: false, type: 'String(512)', example: '{}', description: '返回下单数据,json格式数据' },
              ]} />

              <NoticeBox type="info">
                注：当code = 0 且 orderState = 1 才会返回支付地址
              </NoticeBox>

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded text-xs font-bold">D</span>
                Data 数据格式
              </h4>
              <ParamTable data={[
                { name: '支付订单号', field: 'payOrderId', required: true, type: 'String(30)', example: 'U12021022311124442600', description: '返回支付系统订单号' },
                { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '返回商户传入的订单号' },
                { name: '订单状态', field: 'orderState', required: true, type: 'int', example: '2', description: '0-订单生成 1-支付中 2-支付成功 3-支付失败 4-已撤销 5-已退款 6-订单关闭' },
                { name: '支付数据类型', field: 'payDataType', required: true, type: 'String', example: 'payUrl', description: 'payUrl-跳转链接 codeImgUrl-二维码图片地址' },
                { name: '支付地址', field: 'payData', required: false, type: 'String', example: 'http://...', description: '支付链接' },
                { name: '渠道错误码', field: 'errCode', required: false, type: 'String', example: 'ACQ.PAYMENT...', description: '错误码' },
                { name: '渠道错误描述', field: 'errMsg', required: false, type: 'String', example: 'Business Failed', description: '错误描述' },
              ]} />
            </section>

            {/* 查询代收订单 */}
            <section id="collect-query" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="查询代收订单" badge="POST" />
              <ApiInfo rows={[
                { label: '接口说明', value: '商户通过该接口查询订单，支付网关会返回订单最新的数据' },
                { label: '请求URL', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">https://sphpay.vip/api/pay/query</code></> },
                { label: '请求方式', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">POST</code></> },
              ]} />
              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">请求参数</h4>
              <ParamTable data={[
                { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                { name: '支付订单号', field: 'payOrderId', required: true, type: 'String(30)', example: 'P20160427210604000490', description: '支付中心生成的订单号，与mchOrderNo二者传一即可' },
                { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '商户生成的订单号，与payOrderId二者传一即可' },
                { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2...', description: '签名值，详见签名算法' },
                { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
              ]} />
            </section>

            {/* 支付通知 */}
            <section id="collect-notify" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="代收回调" badge="回调" isCallback />
              <ApiInfo rows={[
                { label: '接口说明', value: '当订单支付成功时，支付网关会向商户系统发起回调通知。如果商户系统没有正确返回，支付网关会延迟再次通知。' },
                { label: '回调URL', value: '由支付网关根据商户配置自动回调，如：https://www.xxx.com/pay/Kopay/payNotify' },
                { label: '请求方式', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">GET</code></> },
              ]} />
              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">回调参数</h4>
              <ParamTable data={[
                { name: '商户号', field: 'mchNo', required: true, type: 'String', example: 'hcm888', description: '商户号' },
                { name: '应用ID', field: 'appId', required: true, type: 'String', example: '69b964c6e4b057f50d49a28d', description: '应用ID' },
                { name: '接口代码', field: 'ifCode', required: true, type: 'String', example: 'colombia', description: '接口代码' },
                { name: '支付订单号', field: 'payOrderId', required: true, type: 'String', example: 'P2044142100586033154', description: '支付中心生成的订单号' },
                { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String', example: 'K1776196428U12446', description: '商户传入的订单号' },
                { name: '支付金额', field: 'amount', required: true, type: 'long', example: '10500000', description: '支付金额，单位为分' },
                { name: '货币代码', field: 'currency', required: true, type: 'String', example: 'COP', description: '货币代码' },
                { name: '支付方式', field: 'wayCode', required: true, type: 'String', example: 'COLOMBIA_QR', description: '支付方式代码' },
                { name: '订单状态', field: 'state', required: true, type: 'int', example: '2', description: '0-订单生成 1-支付中 2-支付成功 3-支付失败 4-已撤销 5-已退款 6-订单关闭' },
                { name: '商品标题', field: 'subject', required: true, type: 'String', example: 'ber', description: '商品标题' },
                { name: '商品描述', field: 'body', required: false, type: 'String', example: 'ber', description: '商品描述' },
                { name: '客户端IP', field: 'clientIp', required: false, type: 'String', example: '15.228.226.143', description: '客户端IP地址' },
                { name: '创建时间', field: 'createdAt', required: true, type: 'long', example: '1776196429760', description: '订单创建时间，13位时间戳' },
                { name: '回调时间', field: 'reqTime', required: true, type: 'long', example: '1776196838883', description: '回调时间，13位时间戳' },
                { name: '签名', field: 'sign', required: true, type: 'String', example: 'CB8B5569E531B54324C94AED0B02D3FC', description: '签名值，详见签名算法' },
              ]} />
              <CodeBlock lang="TEXT" title="回调示例">
{`https://www.xxx.com/pay/Kopay/payNotify?ifCode=colombia&amount=10500000&payOrderId=P2044142100586033154&mchOrderNo=K1776196428U12446&subject=ber&wayCode=COLOMBIA_QR&sign=CB8B5569E531B54324C94AED0B02D3FC&reqTime=1776196838883&body=ber&createdAt=1776196429760&appId=69b964c6e4b057f50d49a28d&clientIp=15.228.226.143&currency=COP&state=2&mchNo=hcm888`}
              </CodeBlock>
              <NoticeBox type="warning">
                <p>业务系统处理后同步返回给支付中心，返回字符串 <code className="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 rounded text-xs font-mono">success</code> 则表示成功，返回非success则表示处理失败，支付中心会再次通知业务系统。</p>
                <p className="mt-2">通知频率为0/30/60/90/120/150,单位：秒</p>
                <p className="mt-2 font-semibold">注意：返回的字符串必须是小写，且前后不能有空格和换行符。</p>
              </NoticeBox>
            </section>

            {/* ==================== 代付接口部分 ==================== */}
            <SectionDivider text="代付接口" />

            {/* 代付申请 */}
            <section id="transfer-order" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="代付申请" badge="POST" />
              <ApiInfo rows={[
                { label: '接口说明', value: '商户通过代付接口发起转账申请，Sph-Pay支付网关将根据请求数据处理转账。' },
                { label: '请求URL', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">https://sphpay.vip/api/transferOrder</code></> },
                { label: '请求方式', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">POST</code></> },
              ]} />
              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">请求参数</h4>
              <ParamTable data={[
                { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '商户订单号' },
                { name: '接口代码', field: 'ifCode', required: true, type: 'String(10)', example: 'colombia', description: '填接口代码,详细见下方接口代码表' },
                { name: '入账方式', field: 'entryType', required: true, type: 'String(20)', example: 'BANK_CARD', description: '固定：BANK_CARD' },
                { name: '转账金额', field: 'amount', required: true, type: 'int', example: '100', description: '转账金额单位分' },
                { name: '货币代码', field: 'currency', required: true, type: 'String(3)', example: 'COP', description: '填货币代码,详细见下方货币代码表' },
                { name: '收款账号', field: 'accountNo', required: true, type: 'String(64)', example: 'o6BcIwvTvI...', description: '收款账户' },
                { name: '收款人姓名', field: 'accountName', required: true, type: 'String(64)', example: 'payName', description: '收款人名称' },
                { name: '扩展参数', field: 'extParam', required: false, type: 'String(64)', example: 'CCI', description: '哥伦比亚不填 秘鲁支付必填：CCI' },
                { name: '银行名称', field: 'bankName', required: true, type: 'String(64)', example: 'BCP', description: '填银行名称,详细见下方银行名称表' },
                { name: '转账备注', field: 'transferDesc', required: true, type: 'String(128)', example: '测试转账', description: '转账备注' },
                { name: '异步通知地址', field: 'notifyUrl', required: false, type: 'String(128)', example: 'https://...', description: '转账完成后回调该URL' },
                { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2...', description: '签名值，详见签名算法' },
                { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
              ]} />

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">接口代码表</h4>
              <ParamTable compact data={[
                { name: 'colombia', field: '-', required: false, type: '-', example: '-', description: '哥伦比亚' },
                { name: 'miluru', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
              ]} />

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">货币代码表</h4>
              <ParamTable compact data={[
                { name: 'COP', field: '-', required: false, type: '-', example: '-', description: '哥伦比亚' },
                { name: 'PEN', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
              ]} />

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">银行名称表</h4>
              <ParamTable compact data={[
                { name: 'Plin', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                { name: 'BCP', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                { name: 'Yape', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                { name: 'BBVA', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                { name: 'Scotiabank', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
                { name: 'Interbank', field: '-', required: false, type: '-', example: '-', description: '秘鲁' },
              ]} />

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">返回参数 - Data数据格式</h4>
              <NoticeBox type="info">
                注：当code = 0 且 state = 1 才表示转账中
              </NoticeBox>
              <ParamTable data={[
                { name: '转账订单号', field: 'transferId', required: true, type: 'String(30)', example: 'T202108161731281310004', description: '返回转账订单号' },
                { name: '商户转账单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: 'mho1624007315478', description: '返回商户传入的转账单号' },
                { name: '转账状态', field: 'state', required: true, type: 'int', example: '2', description: '0-订单生成 1-转账中 2-转账成功 3-转账失败 4-转账关闭' },
                { name: '转账凭证号', field: 'channelOrderNo', required: false, type: 'String', example: '20160427210604000490', description: '转账户凭证号' },
                { name: '错误码', field: 'errCode', required: false, type: 'String', example: 'ACQ.PAYMENT...', description: '返回的错误码' },
                { name: '错误描述', field: 'errMsg', required: false, type: 'String', example: 'Business Failed', description: '返回的错误描述' },
              ]} />
            </section>

            {/* 查询代付订单 */}
            <section id="transfer-query" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="查询代付订单" badge="POST" />
              <ApiInfo rows={[
                { label: '接口说明', value: '商户通过该接口查询订单，支付网关会返回订单最新的数据' },
                { label: '请求URL', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">https://sphpay.vip/api/transfer/query</code></> },
                { label: '请求方式', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">POST</code></> },
              ]} />
              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">请求参数</h4>
              <ParamTable data={[
                { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                { name: '转账订单号', field: 'transferId', required: true, type: 'String(30)', example: 'T20160427210604000490', description: '转账单号，与mchOrderNo二者传一即可' },
                { name: '商户转账单号', field: 'mchOrderNo', required: true, type: 'String(30)', example: '20160427210604000490', description: '商户单号，与transferId二者传一即可' },
                { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2...', description: '签名值，详见签名算法' },
                { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
              ]} />
            </section>

            {/* 转账通知 */}
            <section id="transfer-notify" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="代付回调通知" badge="回调" isCallback />
              <ApiInfo rows={[
                { label: '接口说明', value: '当代付完成时(成功或失败)，支付网关会向商户系统发起回调通知。如果商户系统没有正确返回，支付网关会延迟再次通知。' },
                { label: '回调URL', value: '由支付网关根据商户配置自动回调，如：https://www.xxx.com/pay/nequ/drawNotify' },
                { label: '请求方式', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">GET</code></> },
              ]} />
              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">回调参数</h4>
              <ParamTable data={[
                { name: '商户号', field: 'mchNo', required: true, type: 'String', example: 'ber888', description: '商户号' },
                { name: '应用ID', field: 'appId', required: true, type: 'String', example: '69b512c6e4b057f50d49a28b', description: '应用ID' },
                { name: '接口代码', field: 'ifCode', required: true, type: 'String', example: 'colombia', description: '接口代码' },
                { name: '入账方式', field: 'entryType', required: true, type: 'String', example: 'BANK_CARD', description: '入账方式' },
                { name: '商户订单号', field: 'mchOrderNo', required: true, type: 'String', example: '20260414288394338338U21984', description: '商户生成的代付订单号' },
                { name: '代付订单号', field: 'transferId', required: true, type: 'String', example: 'T2044143312974770177', description: '支付中心生成的代付订单号' },
                { name: '代付金额', field: 'amount', required: true, type: 'long', example: '1012500', description: '代付金额，单位为分' },
                { name: '收款账号', field: 'accountNo', required: true, type: 'String', example: '3114538926', description: '收款账户' },
                { name: '收款人姓名', field: 'accountName', required: true, type: 'String', example: 'Duvier', description: '收款人姓名' },
                { name: '银行名称', field: 'bankName', required: true, type: 'String', example: 'Bank', description: '银行名称' },
                { name: '货币代码', field: 'currency', required: true, type: 'String', example: 'COP', description: '货币代码' },
                { name: '代付状态', field: 'state', required: true, type: 'int', example: '2', description: '0-订单生成 1-转账中 2-转账成功 3-转账失败 4-转账关闭' },
                { name: '转账备注', field: 'transferDesc', required: false, type: 'String', example: 'bertransfer', description: '转账备注' },
                { name: '创建时间', field: 'createdAt', required: true, type: 'long', example: '1776196718816', description: '订单创建时间，13位时间戳' },
                { name: '回调时间', field: 'reqTime', required: true, type: 'long', example: '1776196989494', description: '回调时间，13位时间戳' },
                { name: '签名', field: 'sign', required: true, type: 'String', example: '4B0D2A4DE7D0D7FBF0DECCC003364D85', description: '签名值，详见签名算法' },
              ]} />
              <CodeBlock lang="TEXT" title="回调示例">
{`https://www.xxx.com/pay/nequ/drawNotify?ifCode=colombia&entryType=BANK_CARD&amount=1012500&accountName=Duvier&mchOrderNo=20260414288394338338U21984&sign=4B0D2A4DE7D0D7FBF0DECCC003364D85&transferDesc=bertransfer&bankName=Bank&reqTime=1776196989494&transferId=T2044143312974770177&createdAt=1776196718816&accountNo=3114538926&appId=69b512c6e4b057f50d49a28b&currency=COP&state=2&mchNo=ber888`}
              </CodeBlock>
              <NoticeBox type="warning">
                <p>业务系统处理后同步返回给支付中心，返回字符串 <code className="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 rounded text-xs font-mono">success</code> 则表示成功，返回非success则表示处理失败，支付中心会再次通知业务系统。</p>
                <p className="mt-2">通知频率为0/30/60/90/120/150,单位：秒</p>
                <p className="mt-2 font-semibold">注意：返回的字符串必须是小写，且前后不能有空格和换行符。</p>
              </NoticeBox>
            </section>

            {/* ==================== 查询接口部分 ==================== */}
            <SectionDivider text="查询接口" />

            {/* 余额查询 */}
            <section id="balance-query" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700 scroll-mt-20 transition-all hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <SectionHeader title="余额查询" badge="POST" />
              <ApiInfo rows={[
                { label: '接口说明', value: '商户通过该接口查询账户余额，支付网关会返回账户最新的余额' },
                { label: '请求URL', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">https://sphpay.vip/api/query/balance</code></> },
                { label: '请求方式', value: <><code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">POST</code></> },
              ]} />
              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">请求参数</h4>
              <ParamTable data={[
                { name: '商户号', field: 'mchNo', required: true, type: 'String(30)', example: 'M1621873433953', description: '商户号' },
                { name: '应用ID', field: 'appId', required: true, type: 'String(24)', example: '60cc09bce4b0f1c0b83761c9', description: '应用ID' },
                { name: '请求时间', field: 'reqTime', required: true, type: 'long', example: '1622016572190', description: '请求接口时间,13位时间戳' },
                { name: '接口版本', field: 'version', required: true, type: 'String(3)', example: '1.0', description: '接口版本号，固定：1.0' },
                { name: '签名', field: 'sign', required: true, type: 'String(32)', example: 'C380BEC2...', description: '签名值，详见签名算法' },
                { name: '签名类型', field: 'signType', required: true, type: 'String(32)', example: 'MD5', description: '签名类型，目前只支持MD5方式' },
              ]} />

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

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">返回参数</h4>
              <ParamTable data={[
                { name: '返回状态', field: 'code', required: true, type: 'int', example: '0', description: '0-处理成功，其他-处理有误，详见错误码' },
                { name: '返回信息', field: 'msg', required: false, type: 'String(128)', example: '签名失败', description: '具体错误原因' },
                { name: '签名信息', field: 'sign', required: false, type: 'String(32)', example: 'CCD9083A6...', description: '对data内数据签名' },
                { name: '返回数据', field: 'data', required: false, type: 'String(512)', example: '{}', description: '返回数据,json格式' },
              ]} />

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">Data 数据格式</h4>
              <ParamTable data={[
                { name: '账户余额', field: 'balance', required: true, type: 'long', example: '1622016572190', description: '账户当前余额' },
              ]} />

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

              <h4 className="font-bold text-gray-900 dark:text-white mt-6 mb-3">返回码</h4>
              <ParamTable compact data={[
                { name: '0', field: '-', required: false, type: '-', example: '-', description: '成功' },
                { name: '9999', field: '-', required: false, type: '-', example: '-', description: '异常，具体错误详见msg字段' },
              ]} />
            </section>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-slate-700 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sph-Pay 支付API文档 · v1.0.0 · 持续更新中
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Table of contents */}
      <TableOfContents activeSection={activeSection} />

      {/* Back to top button */}
      <Button
        variant="default"
        size="icon"
        onClick={backToTop}
        className={cn(
          'fixed bottom-6 right-6 rounded-full shadow-lg transition-all duration-300 z-30',
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      </>
      )}

      {/* Table of contents */}
      <TableOfContents activeSection={activeSection} />

      {/* Back to top button */}
      <Button
        variant="default"
        size="icon"
        onClick={backToTop}
        className={cn(
          'fixed bottom-6 right-6 rounded-full shadow-lg transition-all duration-300 z-30',
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
