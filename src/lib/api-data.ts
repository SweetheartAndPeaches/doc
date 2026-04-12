import { ApiDocument } from './api-types';

export const apiDocument: ApiDocument = {
  title: '用户管理系统 API',
  version: 'v1.0.0',
  description: '提供完整的用户管理功能，包括用户注册、登录、信息查询等接口',
  baseUrl: 'https://api.example.com',
  categories: [
    {
      id: 'auth',
      name: '认证授权',
      description: '用户注册、登录、Token 管理相关接口',
      icon: 'shield'
    },
    {
      id: 'user',
      name: '用户管理',
      description: '用户信息查询、修改、删除等接口',
      icon: 'user'
    },
    {
      id: 'order',
      name: '订单管理',
      description: '订单创建、查询、取消等接口',
      icon: 'shopping-cart'
    },
    {
      id: 'product',
      name: '商品管理',
      description: '商品列表、详情、分类等接口',
      icon: 'package'
    }
  ],
  endpoints: [
    {
      id: 'auth-register',
      method: 'POST',
      path: '/api/v1/auth/register',
      name: '用户注册',
      description: '注册新用户，返回用户信息及访问令牌',
      category: 'auth',
      tags: ['auth', 'public'],
      parameters: [
        {
          name: 'username',
          type: 'string',
          required: true,
          description: '用户名，长度 4-20 个字符'
        },
        {
          name: 'email',
          type: 'string',
          required: true,
          description: '邮箱地址，用于账号验证'
        },
        {
          name: 'password',
          type: 'string',
          required: true,
          description: '密码，长度至少 8 位，需包含数字和字母'
        }
      ],
      responses: [
        {
          status: 200,
          description: '注册成功',
          schema: {
            type: 'object',
            properties: {
              userId: { type: 'string', description: '用户唯一标识', example: 'usr_123456' },
              username: { type: 'string', description: '用户名', example: 'john_doe' },
              email: { type: 'string', description: '邮箱', example: 'john@example.com' },
              token: { type: 'string', description: '访问令牌', example: 'eyJhbGciOiJIUzI1NiIs...' }
            }
          }
        },
        {
          status: 400,
          description: '参数错误或用户名已存在'
        }
      ],
      examples: {
        request: `{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123"
}`,
        response: `{
  "success": true,
  "data": {
    "userId": "usr_123456",
    "username": "john_doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`
      }
    },
    {
      id: 'auth-login',
      method: 'POST',
      path: '/api/v1/auth/login',
      name: '用户登录',
      description: '使用用户名或邮箱登录，返回访问令牌',
      category: 'auth',
      tags: ['auth', 'public'],
      parameters: [
        {
          name: 'account',
          type: 'string',
          required: true,
          description: '登录账号（用户名或邮箱）'
        },
        {
          name: 'password',
          type: 'string',
          required: true,
          description: '密码'
        }
      ],
      responses: [
        {
          status: 200,
          description: '登录成功',
          schema: {
            type: 'object',
            properties: {
              token: { type: 'string', description: '访问令牌' },
              expiresIn: { type: 'number', description: '过期时间（秒）' }
            }
          }
        },
        {
          status: 401,
          description: '账号或密码错误'
        }
      ]
    },
    {
      id: 'user-profile',
      method: 'GET',
      path: '/api/v1/users/{userId}',
      name: '获取用户信息',
      description: '根据用户 ID 获取用户详细信息',
      category: 'user',
      tags: ['user', 'private'],
      parameters: [
        {
          name: 'userId',
          type: 'string',
          required: true,
          description: '用户唯一标识'
        }
      ],
      responses: [
        {
          status: 200,
          description: '获取成功',
          schema: {
            type: 'object',
            properties: {
              userId: { type: 'string', description: '用户ID' },
              username: { type: 'string', description: '用户名' },
              email: { type: 'string', description: '邮箱' },
              avatar: { type: 'string', description: '头像URL' },
              createdAt: { type: 'string', description: '注册时间' }
            }
          }
        },
        {
          status: 404,
          description: '用户不存在'
        }
      ]
    },
    {
      id: 'user-update',
      method: 'PUT',
      path: '/api/v1/users/{userId}',
      name: '更新用户信息',
      description: '更新指定用户的个人信息',
      category: 'user',
      tags: ['user', 'private'],
      parameters: [
        {
          name: 'userId',
          type: 'string',
          required: true,
          description: '用户唯一标识'
        },
        {
          name: 'username',
          type: 'string',
          required: false,
          description: '新用户名'
        },
        {
          name: 'avatar',
          type: 'string',
          required: false,
          description: '新头像URL'
        },
        {
          name: 'bio',
          type: 'string',
          required: false,
          description: '个人简介'
        }
      ],
      responses: [
        {
          status: 200,
          description: '更新成功'
        },
        {
          status: 403,
          description: '无权修改该用户信息'
        }
      ]
    },
    {
      id: 'order-create',
      method: 'POST',
      path: '/api/v1/orders',
      name: '创建订单',
      description: '创建新订单，包含商品信息、收货地址等',
      category: 'order',
      tags: ['order', 'private'],
      parameters: [
        {
          name: 'items',
          type: 'array',
          required: true,
          description: '订单商品列表'
        },
        {
          name: 'addressId',
          type: 'string',
          required: true,
          description: '收货地址ID'
        },
        {
          name: 'paymentMethod',
          type: 'string',
          required: true,
          description: '支付方式',
          enum: ['alipay', 'wechat', 'card']
        }
      ],
      responses: [
        {
          status: 201,
          description: '订单创建成功',
          schema: {
            type: 'object',
            properties: {
              orderId: { type: 'string', description: '订单号' },
              totalAmount: { type: 'number', description: '订单总额' }
            }
          }
        }
      ]
    },
    {
      id: 'order-list',
      method: 'GET',
      path: '/api/v1/orders',
      name: '获取订单列表',
      description: '获取当前用户的订单列表，支持分页',
      category: 'order',
      tags: ['order', 'private'],
      parameters: [
        {
          name: 'page',
          type: 'number',
          required: false,
          default: '1',
          description: '页码'
        },
        {
          name: 'pageSize',
          type: 'number',
          required: false,
          default: '20',
          description: '每页数量，最大100'
        },
        {
          name: 'status',
          type: 'string',
          required: false,
          description: '订单状态筛选',
          enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled']
        }
      ],
      responses: [
        {
          status: 200,
          description: '获取成功',
          schema: {
            type: 'object',
            properties: {
              list: { type: 'array', description: '订单列表' },
              pagination: { type: 'object', description: '分页信息' }
            }
          }
        }
      ]
    },
    {
      id: 'product-list',
      method: 'GET',
      path: '/api/v1/products',
      name: '获取商品列表',
      description: '获取商品列表，支持分类筛选、关键词搜索',
      category: 'product',
      tags: ['product', 'public'],
      parameters: [
        {
          name: 'keyword',
          type: 'string',
          required: false,
          description: '搜索关键词'
        },
        {
          name: 'category',
          type: 'string',
          required: false,
          description: '商品分类ID'
        },
        {
          name: 'sort',
          type: 'string',
          required: false,
          default: 'default',
          description: '排序方式',
          enum: ['default', 'price_asc', 'price_desc', 'sales']
        }
      ],
      responses: [
        {
          status: 200,
          description: '获取成功',
          schema: {
            type: 'object',
            properties: {
              list: { type: 'array', description: '商品列表' },
              total: { type: 'number', description: '总数' }
            }
          }
        }
      ]
    },
    {
      id: 'product-detail',
      method: 'GET',
      path: '/api/v1/products/{id}',
      name: '获取商品详情',
      description: '获取商品的详细信息，包括规格、库存、评价等',
      category: 'product',
      tags: ['product', 'public'],
      parameters: [
        {
          name: 'id',
          type: 'string',
          required: true,
          description: '商品唯一标识'
        }
      ],
      responses: [
        {
          status: 200,
          description: '获取成功',
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '商品ID' },
              name: { type: 'string', description: '商品名称' },
              description: { type: 'string', description: '商品描述' },
              price: { type: 'number', description: '价格' },
              stock: { type: 'number', description: '库存数量' },
              images: { type: 'array', description: '商品图片列表' }
            }
          }
        },
        {
          status: 404,
          description: '商品不存在'
        }
      ]
    }
  ]
};
