'use client';

import React, { useState, useMemo } from 'react';
import { Search, Shield, User, ShoppingCart, Package, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { apiDocument } from '@/lib/api-data';
import type { ApiEndpoint, ApiCategory, HttpMethod } from '@/lib/api-types';

// Method badge colors
const methodColors: Record<HttpMethod, { bg: string; text: string }> = {
  GET: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  POST: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  PUT: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
  DELETE: { bg: 'bg-red-500/10', text: 'text-red-600' },
  PATCH: { bg: 'bg-purple-500/10', text: 'text-purple-600' },
};

// Category icons
const categoryIcons: Record<string, React.ElementType> = {
  shield: Shield,
  user: User,
  'shopping-cart': ShoppingCart,
  package: Package,
};

export default function ApiDocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter endpoints based on search and category
  const filteredEndpoints = useMemo(() => {
    return apiDocument.endpoints.filter((endpoint) => {
      const matchesSearch =
        searchQuery === '' ||
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || endpoint.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Group endpoints by category
  const groupedEndpoints = useMemo(() => {
    const groups: Record<string, ApiEndpoint[]> = {};
    filteredEndpoints.forEach((endpoint) => {
      if (!groups[endpoint.category]) {
        groups[endpoint.category] = [];
      }
      groups[endpoint.category].push(endpoint);
    });
    return groups;
  }, [filteredEndpoints]);

  // Get category by id
  const getCategory = (id: string): ApiCategory | undefined => {
    return apiDocument.categories.find((cat) => cat.id === id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              {apiDocument.title}
            </h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {apiDocument.version}
            </Badge>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-md px-4 sm:px-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索接口名称、路径或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 border-r bg-white dark:bg-slate-900 lg:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-4">
            <div className="mb-4">
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                接口分类
              </h2>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    selectedCategory === null
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  全部接口
                  <span className="ml-2 text-muted-foreground">
                    {apiDocument.endpoints.length}
                  </span>
                </button>
                {apiDocument.categories.map((category) => {
                  const Icon = categoryIcons[category.icon || ''] || Package;
                  const count = apiDocument.endpoints.filter(
                    (e) => e.category === category.id
                  ).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 truncate">{category.name}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-4">
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                基础地址
              </h2>
              <code className="block rounded bg-muted px-2 py-1 text-xs break-all">
                {apiDocument.baseUrl}
              </code>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="absolute left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 p-4">
              <div className="mb-4">
                <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                  接口分类
                </h2>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                      selectedCategory === null
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    全部接口
                  </button>
                  {apiDocument.categories.map((category) => {
                    const Icon = categoryIcons[category.icon || ''] || Package;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                          selectedCategory === category.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{category.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* API Description */}
          <div className="mb-8">
            <p className="text-muted-foreground">{apiDocument.description}</p>
          </div>

          {/* Endpoints List */}
          <div className="space-y-6">
            {Object.entries(groupedEndpoints).map(([categoryId, endpoints]) => {
              const category = getCategory(categoryId);
              if (!category) return null;

              return (
                <section key={categoryId}>
                  <div className="mb-4 flex items-center gap-2">
                    {React.createElement(
                      categoryIcons[category.icon || ''] || Package,
                      { className: 'h-5 w-5 text-muted-foreground' }
                    )}
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                    <span className="text-sm text-muted-foreground">
                      {category.description}
                    </span>
                  </div>

                  <Accordion type="multiple" className="space-y-3">
                    {endpoints.map((endpoint) => (
                      <AccordionItem
                        key={endpoint.id}
                        value={endpoint.id}
                        className="rounded-lg border bg-white px-4 dark:bg-slate-800"
                      >
                        <AccordionTrigger
                          className="hover:no-underline"
                        >
                          <div className="flex flex-1 items-center gap-3 py-2">
                            <Badge
                              variant="secondary"
                              className={`${methodColors[endpoint.method].bg} ${methodColors[endpoint.method].text} font-mono font-semibold`}
                            >
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm font-medium">
                              {endpoint.path}
                            </code>
                            <span className="hidden text-muted-foreground sm:inline">
                              {endpoint.name}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pb-4">
                            {/* Description */}
                            <p className="text-sm text-muted-foreground">
                              {endpoint.description}
                            </p>

                            {/* Parameters */}
                            {endpoint.parameters && endpoint.parameters.length > 0 && (
                              <div>
                                <h4 className="mb-2 text-sm font-semibold">请求参数</h4>
                                <div className="rounded-md border">
                                  <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                      <tr>
                                        <th className="px-3 py-2 text-left font-medium">参数名</th>
                                        <th className="px-3 py-2 text-left font-medium">类型</th>
                                        <th className="px-3 py-2 text-left font-medium">必填</th>
                                        <th className="px-3 py-2 text-left font-medium">说明</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {endpoint.parameters.map((param, idx) => (
                                        <tr key={idx} className="border-t">
                                          <td className="px-3 py-2 font-mono text-xs">
                                            {param.name}
                                          </td>
                                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                                            {param.type}
                                          </td>
                                          <td className="px-3 py-2">
                                            {param.required ? (
                                              <Badge variant="destructive" className="text-xs">
                                                是
                                              </Badge>
                                            ) : (
                                              <Badge variant="outline" className="text-xs">
                                                否
                                              </Badge>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 text-xs">
                                            {param.description}
                                            {param.default && (
                                              <span className="ml-1 text-muted-foreground">
                                                (默认: {param.default})
                                              </span>
                                            )}
                                            {param.enum && (
                                              <span className="ml-1 text-muted-foreground">
                                                [{param.enum.join(', ')}]
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Responses */}
                            <div>
                              <h4 className="mb-2 text-sm font-semibold">响应状态码</h4>
                              <div className="flex flex-wrap gap-2">
                                {endpoint.responses.map((response, idx) => (
                                  <Badge
                                    key={idx}
                                    variant={
                                      response.status < 300
                                        ? 'default'
                                        : response.status < 400
                                        ? 'secondary'
                                        : 'destructive'
                                    }
                                  >
                                    {response.status} {response.description}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Examples */}
                            {endpoint.examples && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button className="text-sm text-primary hover:underline">
                                    查看示例请求和响应
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {endpoint.method} {endpoint.path}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {endpoint.examples.request && (
                                      <div>
                                        <h4 className="mb-2 text-sm font-medium">请求示例</h4>
                                        <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                                          <code>{endpoint.examples.request}</code>
                                        </pre>
                                      </div>
                                    )}
                                    {endpoint.examples.response && (
                                      <div>
                                        <h4 className="mb-2 text-sm font-medium">响应示例</h4>
                                        <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                                          <code>{endpoint.examples.response}</code>
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              );
            })}

            {filteredEndpoints.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">未找到匹配的接口</p>
                <p className="text-sm text-muted-foreground">
                  尝试调整搜索关键词或清除筛选条件
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
