import React, { useState } from 'react';
import { ArrowLeft, Code, Copy, CheckCircle, ExternalLink, Key, Shield, Globe } from 'lucide-react';

interface ApiDocumentationProps {
  onNavigate: (view: string) => void;
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  response: string;
  example: string;
}

function ApiDocumentation({ onNavigate }: ApiDocumentationProps) {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string>('');

  const apiEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/applications',
      description: '申請一覧を取得',
      parameters: [
        { name: 'status', type: 'string', required: false, description: '申請ステータス (pending, approved, rejected)' },
        { name: 'type', type: 'string', required: false, description: '申請種別 (business-trip, expense)' },
        { name: 'limit', type: 'number', required: false, description: '取得件数 (デフォルト: 20)' }
      ],
      response: 'Array<Application>',
      example: `{
  "data": [
    {
      "id": "BT-2024-001",
      "type": "business-trip",
      "title": "東京出張申請",
      "status": "pending",
      "amount": 52500,
      "submittedAt": "2024-07-20T09:00:00Z"
    }
  ],
  "total": 1,
  "page": 1
}`
    },
    {
      method: 'POST',
      path: '/api/v1/applications',
      description: '新規申請を作成',
      parameters: [
        { name: 'type', type: 'string', required: true, description: '申請種別 (business-trip, expense)' },
        { name: 'title', type: 'string', required: true, description: '申請タイトル' },
        { name: 'amount', type: 'number', required: true, description: '申請金額' },
        { name: 'purpose', type: 'string', required: false, description: '申請目的' }
      ],
      response: 'Application',
      example: `{
  "type": "business-trip",
  "title": "東京出張申請",
  "amount": 52500,
  "purpose": "クライアント訪問",
  "startDate": "2024-07-25",
  "endDate": "2024-07-27"
}`
    },
    {
      method: 'PUT',
      path: '/api/v1/applications/{id}/approve',
      description: '申請を承認',
      parameters: [
        { name: 'id', type: 'string', required: true, description: '申請ID' },
        { name: 'comment', type: 'string', required: false, description: '承認コメント' }
      ],
      response: 'Application',
      example: `{
  "comment": "承認いたします"
}`
    }
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getMethodColor = (method: string) => {
    const colors = {
      'GET': 'text-emerald-700 bg-emerald-100',
      'POST': 'text-blue-700 bg-blue-100',
      'PUT': 'text-amber-700 bg-amber-100',
      'DELETE': 'text-red-700 bg-red-100'
    };
    return colors[method as keyof typeof colors] || 'text-slate-700 bg-slate-100';
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">API概要</h2>
        <p className="text-slate-600 text-lg leading-relaxed">
          賢者の精算APIは、出張申請・経費精算システムとの連携を可能にするRESTful APIです。
          申請の作成、承認、データ取得など、システムの主要機能をプログラムから利用できます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/30 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-800">ベースURL</h3>
          </div>
          <code className="bg-slate-100 px-3 py-2 rounded text-sm">
            https://api.kenjano-seisan.com/v1
          </code>
        </div>

        <div className="bg-white/30 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-semibold text-slate-800">認証方式</h3>
          </div>
          <p className="text-sm text-slate-600">Bearer Token (JWT)</p>
        </div>
      </div>

      <div className="bg-blue-50/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">主な機能</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span>出張申請・経費申請の作成・更新・削除</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span>承認ワークフローの制御</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span>レポート・統計データの取得</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span>ユーザー管理・権限制御</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderAuthentication = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">認証</h2>
        <p className="text-slate-600 mb-6">
          APIへのアクセスには、JWTトークンによる認証が必要です。
        </p>
      </div>

      <div className="bg-white/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">1. トークン取得</h3>
        <div className="bg-slate-900 rounded-lg p-4 relative">
          <button
            onClick={() => copyToClipboard(`curl -X POST https://api.kenjano-seisan.com/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "your@email.com",
    "password": "your_password"
  }'`, 'auth-example')}
            className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
          >
            {copiedCode === 'auth-example' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <pre className="text-emerald-400 text-sm overflow-x-auto">
{`curl -X POST https://api.kenjano-seisan.com/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "your@email.com",
    "password": "your_password"
  }'`}
          </pre>
        </div>
      </div>

      <div className="bg-white/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">2. APIリクエスト</h3>
        <div className="bg-slate-900 rounded-lg p-4 relative">
          <button
            onClick={() => copyToClipboard(`curl -X GET https://api.kenjano-seisan.com/v1/applications \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"`, 'request-example')}
            className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
          >
            {copiedCode === 'request-example' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <pre className="text-emerald-400 text-sm overflow-x-auto">
{`curl -X GET https://api.kenjano-seisan.com/v1/applications \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"`}
          </pre>
        </div>
      </div>
    </div>
  );

  const renderEndpoints = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">エンドポイント</h2>
        <p className="text-slate-600 mb-6">
          利用可能なAPIエンドポイントの一覧です。
        </p>
      </div>

      <div className="space-y-6">
        {apiEndpoints.map((endpoint, index) => (
          <div key={index} className="bg-white/30 rounded-lg p-6 border border-white/30">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMethodColor(endpoint.method)}`}>
                {endpoint.method}
              </span>
              <code className="text-lg font-mono text-slate-800">{endpoint.path}</code>
            </div>
            
            <p className="text-slate-600 mb-4">{endpoint.description}</p>

            {endpoint.parameters && (
              <div className="mb-4">
                <h4 className="font-semibold text-slate-800 mb-2">パラメータ</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-300">
                        <th className="text-left py-2 px-3">名前</th>
                        <th className="text-left py-2 px-3">型</th>
                        <th className="text-left py-2 px-3">必須</th>
                        <th className="text-left py-2 px-3">説明</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.parameters.map((param, paramIndex) => (
                        <tr key={paramIndex} className="border-b border-slate-200">
                          <td className="py-2 px-3 font-mono">{param.name}</td>
                          <td className="py-2 px-3 text-slate-600">{param.type}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              param.required ? 'text-red-700 bg-red-100' : 'text-slate-600 bg-slate-100'
                            }`}>
                              {param.required ? '必須' : '任意'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-600">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">レスポンス例</h4>
              <div className="bg-slate-900 rounded-lg p-4 relative">
                <button
                  onClick={() => copyToClipboard(endpoint.example, `example-${index}`)}
                  className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedCode === `example-${index}` ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="text-emerald-400 text-sm overflow-x-auto">
                  {endpoint.example}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSDKs = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">SDK・ライブラリ</h2>
        <p className="text-slate-600 mb-6">
          各プログラミング言語向けのSDKとサンプルコードをご提供しています。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">JavaScript/Node.js</h3>
          <div className="bg-slate-900 rounded-lg p-4 relative">
            <button
              onClick={() => copyToClipboard(`npm install @kenjano-seisan/api-client

import { KenjaClient } from '@kenjano-seisan/api-client';

const client = new KenjaClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.kenjano-seisan.com/v1'
});

// 申請一覧取得
const applications = await client.applications.list();`, 'js-sdk')}
              className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
            >
              {copiedCode === 'js-sdk' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className="text-emerald-400 text-sm overflow-x-auto">
{`npm install @kenjano-seisan/api-client

import { KenjaClient } from '@kenjano-seisan/api-client';

const client = new KenjaClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.kenjano-seisan.com/v1'
});

// 申請一覧取得
const applications = await client.applications.list();`}
            </pre>
          </div>
        </div>

        <div className="bg-white/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Python</h3>
          <div className="bg-slate-900 rounded-lg p-4 relative">
            <button
              onClick={() => copyToClipboard(`pip install kenjano-seisan

from kenjano_seisan import KenjaClient

client = KenjaClient(
    api_key='your-api-key',
    base_url='https://api.kenjano-seisan.com/v1'
)

# 申請一覧取得
applications = client.applications.list()`, 'python-sdk')}
              className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
            >
              {copiedCode === 'python-sdk' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className="text-emerald-400 text-sm overflow-x-auto">
{`pip install kenjano-seisan

from kenjano_seisan import KenjaClient

client = KenjaClient(
    api_key='your-api-key',
    base_url='https://api.kenjano-seisan.com/v1'
)

# 申請一覧取得
applications = client.applications.list()`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    { id: 'overview', label: '概要', icon: Globe },
    { id: 'authentication', label: '認証', icon: Key },
    { id: 'endpoints', label: 'エンドポイント', icon: Code },
    { id: 'sdks', label: 'SDK', icon: ExternalLink }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-indigo-600/20"></div>
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-3"
            >
              <img 
                src="/IconOnly_Transparent_NoBuffer.LPver.png" 
                alt="賢者の精算アイコン" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-2xl font-bold text-white">賢者の精算</span>
            </button>
            
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>戻る</span>
            </button>
          </div>
        </div>
      </nav>
      <div className="relative z-10 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 pt-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                API ドキュメント
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              賢者の精算APIを使用して、システム連携を実現しましょう
            </p>
          </div>

          {/* 全内容を1ページに表示 */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="space-y-12">
              {/* API概要 */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">API概要</h2>
                <div className="space-y-6 text-white/80">
                  <p className="text-lg leading-relaxed">
                    賢者の精算APIは、出張申請・経費精算システムとの連携を可能にするRESTful APIです。
                    申請の作成、承認、データ取得など、システムの主要機能をプログラムから利用できます。
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-2">ベースURL</h4>
                      <code className="text-emerald-300 bg-slate-800/50 px-3 py-2 rounded text-sm">
                        https://api.kenjano-seisan.com/v1
                      </code>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">認証方式</h4>
                      <p className="text-white/70">Bearer Token (JWT)</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">主な機能</h4>
                    <ul className="space-y-2 text-white/70">
                      <li>• 出張申請・経費申請の作成・更新・削除</li>
                      <li>• 承認ワークフローの制御</li>
                      <li>• レポート・統計データの取得</li>
                      <li>• ユーザー管理・権限制御</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-12">
                <h2 className="text-3xl font-bold text-white mb-6">認証</h2>
                <div className="space-y-6 text-white/80">
                  <p className="text-lg leading-relaxed">
                    APIへのアクセスには、JWTトークンによる認証が必要です。
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">1. トークン取得</h3>
                    <div className="bg-slate-900 rounded-lg p-4 relative">
                      <button
                        onClick={() => copyToClipboard(`curl -X POST https://api.kenjano-seisan.com/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "your@email.com",
    "password": "your_password"
  }'`, 'auth-example')}
                        className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedCode === 'auth-example' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <pre className="text-emerald-400 text-sm overflow-x-auto">
{`curl -X POST https://api.kenjano-seisan.com/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "your@email.com",
    "password": "your_password"
  }'`}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">2. APIリクエスト</h3>
                    <div className="bg-slate-900 rounded-lg p-4 relative">
                      <button
                        onClick={() => copyToClipboard(`curl -X GET https://api.kenjano-seisan.com/v1/applications \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"`, 'request-example')}
                        className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedCode === 'request-example' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <pre className="text-emerald-400 text-sm overflow-x-auto">
{`curl -X GET https://api.kenjano-seisan.com/v1/applications \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-12">
                <h2 className="text-3xl font-bold text-white mb-6">エンドポイント</h2>
                <div className="space-y-6 text-white/80">
                  <p className="text-lg leading-relaxed">
                    利用可能なAPIエンドポイントの一覧です。
                  </p>
                  
                  <div className="space-y-8">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-lg font-mono text-emerald-300">{endpoint.path}</code>
                        </div>
                        
                        <p className="text-white/70">{endpoint.description}</p>

                        {endpoint.parameters && (
                          <div>
                            <h4 className="font-semibold text-white mb-2">パラメータ</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-white/30">
                                    <th className="text-left py-2 px-3 text-white/80">名前</th>
                                    <th className="text-left py-2 px-3 text-white/80">型</th>
                                    <th className="text-left py-2 px-3 text-white/80">必須</th>
                                    <th className="text-left py-2 px-3 text-white/80">説明</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.parameters.map((param, paramIndex) => (
                                    <tr key={paramIndex} className="border-b border-white/20">
                                      <td className="py-2 px-3 font-mono text-emerald-300">{param.name}</td>
                                      <td className="py-2 px-3 text-white/70">{param.type}</td>
                                      <td className="py-2 px-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                          param.required ? 'text-red-300 bg-red-600/30' : 'text-white/60 bg-slate-600/30'
                                        }`}>
                                          {param.required ? '必須' : '任意'}
                                        </span>
                                      </td>
                                      <td className="py-2 px-3 text-white/70">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold text-white mb-2">レスポンス例</h4>
                          <div className="bg-slate-900 rounded-lg p-4 relative">
                            <button
                              onClick={() => copyToClipboard(endpoint.example, `example-${index}`)}
                              className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
                            >
                              {copiedCode === `example-${index}` ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <pre className="text-emerald-400 text-sm overflow-x-auto">
                              {endpoint.example}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-12">
                <h2 className="text-3xl font-bold text-white mb-6">SDK・ライブラリ</h2>
                <div className="space-y-6 text-white/80">
                  <p className="text-lg leading-relaxed">
                    各プログラミング言語向けのSDKとサンプルコードをご提供しています。
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">JavaScript/Node.js</h3>
                      <div className="bg-slate-900 rounded-lg p-4 relative">
                        <button
                          onClick={() => copyToClipboard(`npm install @kenjano-seisan/api-client

import { KenjaClient } from '@kenjano-seisan/api-client';

const client = new KenjaClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.kenjano-seisan.com/v1'
});

// 申請一覧取得
const applications = await client.applications.list();`, 'js-sdk')}
                          className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedCode === 'js-sdk' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <pre className="text-emerald-400 text-sm overflow-x-auto">
{`npm install @kenjano-seisan/api-client

import { KenjaClient } from '@kenjano-seisan/api-client';

const client = new KenjaClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.kenjano-seisan.com/v1'
});

// 申請一覧取得
const applications = await client.applications.list();`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Python</h3>
                      <div className="bg-slate-900 rounded-lg p-4 relative">
                        <button
                          onClick={() => copyToClipboard(`pip install kenjano-seisan

from kenjano_seisan import KenjaClient

client = KenjaClient(
    api_key='your-api-key',
    base_url='https://api.kenjano-seisan.com/v1'
)

# 申請一覧取得
applications = client.applications.list()`, 'python-sdk')}
                          className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedCode === 'python-sdk' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <pre className="text-emerald-400 text-sm overflow-x-auto">
{`pip install kenjano-seisan

from kenjano_seisan import KenjaClient

client = KenjaClient(
    api_key='your-api-key',
    base_url='https://api.kenjano-seisan.com/v1'
)

# 申請一覧取得
applications = client.applications.list()`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 戻るボタン */}
            <div className="text-center mt-12">
              <button
                onClick={() => onNavigate('landing')}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 text-white rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>トップページに戻る</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiDocumentation;