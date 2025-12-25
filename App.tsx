
import React, { useState, useMemo } from 'react';
import { 
  Apple, 
  Smartphone, 
  MessageCircle, 
  Users, 
  Camera, 
  QrCode, 
  Heart,
  ChevronRight,
  Download,
  Info,
  Globe,
  ExternalLink,
  Truck,
  Search,
  FileText,
  BookOpen,
  Mail,
  Briefcase,
  LifeBuoy,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  SearchX,
  Hash,
  Copy
} from 'lucide-react';

const BrandIcon = ({ text, color = "bg-yellow-50", textColor = "text-yellow-600" }: { text: string, color?: string, textColor?: string }) => (
  <div className={`w-14 h-14 md:w-16 md:h-16 ${color} rounded-2xl flex items-center justify-center overflow-hidden border border-black/5 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
    <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-tighter ${textColor} leading-tight text-center px-1 break-all`}>
      {text}
    </span>
  </div>
);

const PlatformCard: React.FC<{ name: string; brand: string; color: string; textColor: string }> = ({ name, brand, color, textColor }) => (
  <button 
    onClick={() => alert(`${name} 功能即将上线，敬请期待！`)}
    className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 w-full text-left"
  >
    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
      <span className={`text-[8px] font-bold ${textColor} text-center leading-tight px-0.5`}>{brand}</span>
    </div>
    <span className="text-xs font-bold text-gray-700 group-hover:text-black whitespace-nowrap">{name}</span>
  </button>
);

interface Article {
  title: string;
  tags: string[];
  content?: React.ReactNode;
}

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [scamInput, setScamInput] = useState('');
  const [scamStatus, setScamStatus] = useState<'idle' | 'safe' | 'danger'>('idle');
  const [matchedDomain, setMatchedDomain] = useState<string | null>(null);

  // Mock Blacklist for Scam Sites
  const scamBlacklist = [
    'fxpl.flypixes.click',
    'flypixes.click',
    'fake-mercari.com',
    'scam-shop.jp',
    'fishing-site.net',
    'www.fxpl.flypixes.click'
  ];

  const handleCheckScam = () => {
    if (!scamInput.trim()) return;
    const rawInput = scamInput.toLowerCase().trim();
    const foundScam = scamBlacklist.find(scamDomain => rawInput.includes(scamDomain));
    
    if (foundScam) {
        setScamStatus('danger');
        setMatchedDomain(foundScam);
    } else {
        setScamStatus('safe');
        setMatchedDomain(null);
    }
  };

  const manualData: Article[] = [
    { title: "APP新手指南", tags: ["入门", "注册", "教程"] },
    { title: "Animate代购规则", tags: ["规则", "代购", "动漫"] },
    { title: "kyoani代购规则", tags: ["规则", "代购", "京阿尼"] },
    { title: "Mandarake代购规则", tags: ["规则", "代购", "二手"] },
    { title: "moponline代购规则", tags: ["规则", "代购"] },
    { title: "Rakuten代购规则", tags: ["规则", "代购", "乐天"] },
    { title: "Teway+代购规则", tags: ["规则", "代购"] },
    { title: "ZOZOTOWN代购规则", tags: ["规则", "代购", "服装"] },
    { title: "骏河屋代购规则", tags: ["规则", "代购", "二手"] },
    { 
      title: "煤炉拍卖代购规则", 
      tags: ["规则", "拍卖", "Mercari"],
      content: (
        <>
          <p className="mb-4 text-justify leading-relaxed">
            乐酷淘平台为您提供煤炉拍卖自助出价服务，当您出价时，系统将自动进行处理，24小时实时出价；参与便捷，出价灵活，助您以理想价格购得心仪商品。
          </p>
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-6 text-sm text-yellow-800">
            <span className="font-bold">功能解锁要求：</span>
            乐酷淘会员须年满18周岁并进行身份证实名认证后，Lv1及以上会员可联系平台在线客服申请解锁煤炉自助拍卖功能。
          </div>
          <h4 className="font-bold text-gray-900 mt-8 mb-4 text-lg border-l-4 border-yellow-500 pl-3">一、竞拍流程</h4>
          <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-700 marker:text-yellow-500 font-medium">
             <li><span className="text-gray-900 font-bold">浏览商品：</span>请进入煤炉站点，筛选【拍卖商品】。</li>
             <li><span className="text-gray-900 font-bold">参与出价：</span>点击商品页面的【出价竞拍】按钮，输入您的出价金额，确认无误后提交。</li>
             <li><span className="text-gray-900 font-bold">注意事项：</span>依据煤炉拍卖规则，竞拍出价不允许取消。请在出价前仔细核对，确认无误之后再提交。</li>
          </ol>
          <p className="mt-8 text-center font-bold text-gray-800">请您在参与拍卖前，充分了解煤炉拍卖的购物风险，仔细阅读拍品说明，并参考卖家的信用评价谨慎选购。祝您购物愉快！</p>
        </>
      )
    },
    { title: "雅虎日拍代购规则", tags: ["规则", "拍卖", "Yahoo"] },
    { title: "罗盘盘代购规则", tags: ["规则", "代购"] },
    { title: "会员等级规则", tags: ["会员", "积分", "等级"] },
    { title: "保价服务说明", tags: ["保险", "服务", "安全"] },
    { title: "免责声明", tags: ["法律", "声明"] },
    { title: "合单服务", tags: ["物流", "发货", "包裹"] },
    { title: "品类专线", tags: ["物流", "线路"] },
    { title: "售后服务", tags: ["客服", "退款", "退货", "投诉", "问题"] },
    { title: "增值服务", tags: ["加固", "拍照", "服务"] },
    { title: "提款说明手册", tags: ["余额", "提现", "钱"] },
    { title: "禁止代购违禁物品", tags: ["规则", "违禁品", "限制"] },
    { title: "订阅推送", tags: ["通知", "消息"] },
    { title: "费用构成", tags: ["价格", "手续费", "运费"] },
    { title: "隐私保护", tags: ["安全", "协议"] },
    { title: "面单规范协议", tags: ["物流", "协议"] },
    { title: "顺丰直通车协议", tags: ["物流", "顺丰", "协议"] },
  ];

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return manualData;
    const lowerQuery = searchQuery.toLowerCase();
    return manualData.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) || 
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, manualData]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    alert(`已复制邮箱: ${email}`);
  };

  const jpPlatforms = [
    { name: 'メルカリ', brand: 'MERCARI', color: 'bg-red-50', textColor: 'text-red-500' },
    { name: 'らしんばん', brand: 'LASHIN', color: 'bg-blue-50', textColor: 'text-blue-500' },
    { name: 'ヤフオク', brand: 'YAHOO!', color: 'bg-red-50', textColor: 'text-red-600' },
    { name: '楽天市場', brand: 'RAKUTEN', color: 'bg-red-50', textColor: 'text-red-700' },
    { name: 'まんだらけ', brand: 'MANDA', color: 'bg-orange-50', textColor: 'text-orange-600' },
    { name: 'アニメイト', brand: 'ANIMATE', color: 'bg-blue-50', textColor: 'text-blue-600' },
    { name: 'Rakuma', brand: 'RAKUMA', color: 'bg-red-50', textColor: 'text-red-500' },
    { name: '駿河屋', brand: 'SURUGA', color: 'bg-blue-50', textColor: 'text-blue-700' },
    { name: '京都アニメ', brand: 'KYOANI', color: 'bg-pink-50', textColor: 'text-pink-500' },
    { name: '雅虎闲置', brand: 'PAYPAY', color: 'bg-red-50', textColor: 'text-red-500' },
    { name: 'ZOZOTOWN', brand: 'ZOZO', color: 'bg-gray-100', textColor: 'text-black' }
  ];

  const logistics = [
    { name: '日本邮政', brand: 'JP POST', color: 'bg-red-50', textColor: 'text-red-600' },
    { name: '顺丰速运', brand: 'SF', color: 'bg-gray-900', textColor: 'text-yellow-500' },
    { name: '京东物流', brand: 'JD', color: 'bg-blue-50', textColor: 'text-blue-600' },
    { name: '圆通速递', brand: 'YTO', color: 'bg-purple-50', textColor: 'text-purple-600' },
    { name: '申通快递', brand: 'STO', color: 'bg-orange-50', textColor: 'text-orange-600' }
  ];

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10 shadow-sm">
          <button onClick={() => setSelectedArticle(null)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 truncate flex-1">{selectedArticle.title}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-3xl mx-auto w-full bg-white md:my-6 md:rounded-2xl md:shadow-sm">
          <div className="mb-6">
             <div className="flex flex-wrap gap-2 mb-4">
                {selectedArticle.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">#{tag}</span>
                ))}
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-6">{selectedArticle.title}</h2>
             <div className="prose prose-yellow max-w-none text-gray-700">
                {selectedArticle.content || <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed"><FileText size={48} className="mb-3 opacity-20" /><p>该文档暂无详细内容</p></div>}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans">
        {/* Header - Simple clean header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-white font-black shadow-sm text-xl shrink-0">淘</div>
                <div>
                    <h1 className="font-black text-lg leading-tight text-gray-900">乐酷淘·兔头</h1>
                    <p className="text-xs text-gray-400 font-medium">日本海淘潮流社区</p>
                </div>
            </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Download Card - Top Left (Large) */}
                <div className="md:col-span-2 lg:col-span-2 bg-white rounded-[2rem] p-8 relative overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1.5 rounded-lg font-bold tracking-wider mb-4 inline-block uppercase">OFFICIAL APP</span>
                            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">下载客户端</h2>
                            <p className="text-gray-500 font-medium max-w-xs mb-8">多终端同步，开启极致丝滑的乐酷淘体验。</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="https://apps.apple.com/ca/app/%E4%B9%90%E9%85%B7%E6%B7%98-%E5%85%94%E5%A4%B4%E5%88%87%E7%85%A4%E6%B5%B7%E6%B7%98%E6%97%A5%E6%9C%AC/id6478657714" target="_blank" className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-black transition-colors shadow-lg shadow-black/10">
                                <Apple size={20} /> <span className="hidden sm:inline">App Store</span>
                            </a>
                            <a href="https://a.app.qq.com/o/render?pkgname=com.xumei.lekutao" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-gray-50 transition-colors">
                                <Smartphone size={20} /> <span className="hidden sm:inline">安卓下载</span>
                            </a>
                        </div>
                    </div>
                    {/* Background Icon */}
                    <div className="absolute top-8 right-8 text-yellow-50 opacity-100 transform scale-100 group-hover:scale-110 transition-transform duration-500">
                        <Download size={140} className="text-yellow-100" />
                    </div>
                </div>

                {/* 2. Social Cards - Top Right */}
                <a href="https://pd.qq.com/s/hgfi5uai6" target="_blank" className="col-span-1 bg-white rounded-[2rem] p-6 flex flex-col justify-between group shadow-sm hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">腾讯频道</h3>
                        <p className="text-xs text-gray-400 mt-1">乐酷淘兔头官方社区</p>
                    </div>
                </a>

                <a href="https://xhslink.com/m/2fmVl9ENOQb" target="_blank" className="col-span-1 bg-white rounded-[2rem] p-6 flex flex-col justify-between group shadow-sm hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Camera size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">小红书</h3>
                        <p className="text-xs text-gray-400 mt-1">发现好物分享</p>
                    </div>
                </a>

                {/* 3. Weibo Card (New Position) */}
                <a href="#" className="col-span-1 bg-white rounded-[2rem] p-6 flex flex-col justify-between group shadow-sm hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Hash size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">官方微博</h3>
                        <p className="text-xs text-gray-400 mt-1">关注获取最新资讯</p>
                    </div>
                </a>

                {/* 4. Logistics Card (Restored) */}
                <div className="col-span-1 bg-white rounded-[2rem] p-6 flex flex-col shadow-sm hover:shadow-lg transition-all group overflow-hidden h-full">
                    <div className="flex items-center gap-3 mb-4 shrink-0">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                             <Truck size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">物流支持</h3>
                            <p className="text-xs text-gray-400">官方合作线路</p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                        {logistics.map(l => (
                            <div key={l.name} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                 <div className={`w-6 h-6 ${l.color} rounded flex items-center justify-center shrink-0`}>
                                    <span className={`text-[8px] font-bold ${l.textColor}`}>{l.brand}</span>
                                 </div>
                                 <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{l.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Scam Checker (Shifted to end of Row 2) */}
                <div className="md:col-span-2 bg-white rounded-[2rem] p-6 border border-orange-100 relative overflow-hidden group shadow-sm hover:shadow-lg transition-all">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">防诈骗查询</h3>
                                <p className="text-xs text-gray-400">输入网址或关键词检测风险</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text" 
                                placeholder="如: flypixes.click" 
                                value={scamInput}
                                onChange={(e) => {
                                    setScamInput(e.target.value);
                                    setScamStatus('idle');
                                    setMatchedDomain(null);
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleCheckScam()}
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400"
                            />
                            <button onClick={handleCheckScam} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 rounded-xl text-sm transition-colors shadow-lg shadow-orange-200">查询</button>
                        </div>
                        {scamStatus !== 'idle' && (
                            <div className={`p-3 rounded-xl flex items-start gap-3 text-sm animate-in fade-in zoom-in-95 duration-200 ${scamStatus === 'danger' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                {scamStatus === 'danger' ? (
                                    <>
                                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold">高风险警示！检测到诈骗域名。</p>
                                            {matchedDomain && <p className="text-xs bg-red-100/50 px-2 py-0.5 rounded mt-1 inline-block">匹配: {matchedDomain}</p>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold">暂无该域名黑名单记录。</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <ShieldAlert size={100} className="text-orange-500 -rotate-12" />
                    </div>
                </div>

                {/* 6. Official Account (WeChat) */}
                <div className="md:col-span-2 bg-white rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-sm hover:shadow-lg transition-all group">
                    <div className="flex-1">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                            <QrCode size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">官方公众号</h3>
                        <p className="text-sm text-gray-500 mb-6">微信搜索：<span className="text-green-600 font-bold underline decoration-2 underline-offset-4">乐酷淘</span></p>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg border border-gray-100">绑定账号</span>
                            <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg border border-gray-100">煤炉秒切</span>
                        </div>
                    </div>
                    <div className="w-32 h-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                        <span className="text-xs text-center">扫码关注<br/>(占位)</span>
                    </div>
                </div>

                {/* 7. Help Center */}
                <div className="md:col-span-2 bg-white rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col h-[360px]">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">使用手册 & 帮助</h3>
                            <p className="text-xs text-gray-400">搜索规则、教程或售后问题</p>
                        </div>
                    </div>
                    <div className="relative mb-4 shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="搜索问题... 例如：退款、新手" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {filteredArticles.length > 0 ? filteredArticles.map((item, index) => (
                            <button key={index} onClick={() => setSelectedArticle(item)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-yellow-500 transition-colors">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-700 block">{item.title}</span>
                                        <div className="flex gap-1 mt-0.5">
                                            {item.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] text-gray-400">#{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-yellow-500" />
                            </button>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-24 text-gray-400"><SearchX size={24} className="mb-2 opacity-30"/><span className="text-xs">无结果</span></div>
                        )}
                    </div>
                </div>

                {/* 8. Contact & QQ Groups */}
                <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* QQ 1 */}
                    <div className="bg-white rounded-[2rem] p-6 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all group">
                         <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4">
                            <Users size={20} />
                         </div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">QQ Group</p>
                         <h3 className="text-2xl font-black text-gray-900 group-hover:text-sky-600 transition-colors">850815830</h3>
                         <a href="#" className="text-xs font-bold text-yellow-500 mt-4 flex items-center gap-1">立即申请加入 <ChevronRight size={12}/></a>
                    </div>
                    {/* QQ 2 */}
                    <div className="bg-white rounded-[2rem] p-6 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all group">
                         <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4">
                            <Users size={20} />
                         </div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">QQ Group</p>
                         <h3 className="text-2xl font-black text-gray-900 group-hover:text-sky-600 transition-colors">566807796</h3>
                         <a href="#" className="text-xs font-bold text-yellow-500 mt-4 flex items-center gap-1">立即申请加入 <ChevronRight size={12}/></a>
                    </div>
                    {/* Contact - Spans 2 cols in LG */}
                    <div className="sm:col-span-2 lg:col-span-2 bg-white rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-lg transition-all">
                        <div className="flex-1 text-center md:text-left">
                             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-3 mx-auto md:mx-0">
                                <Mail size={24} />
                             </div>
                             <h3 className="text-lg font-bold text-gray-900">联系我们</h3>
                             <p className="text-xs text-gray-400">商务合作与意见反馈</p>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button onClick={() => handleCopyEmail('work@lekutao.cn')} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors text-left group">
                                <Briefcase size={16} className="text-gray-400 group-hover:text-yellow-600" />
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400">商务合作</div>
                                    <div className="text-sm font-bold text-gray-900">work@lekutao.cn</div>
                                </div>
                            </button>
                            <button onClick={() => handleCopyEmail('support@lekutao.cn')} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors text-left group">
                                <LifeBuoy size={16} className="text-gray-400 group-hover:text-yellow-600" />
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400">建议反馈</div>
                                    <div className="text-sm font-bold text-gray-900">support@lekutao.cn</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 9. Android Stores - Full Width */}
                <div className="md:col-span-2 lg:col-span-4 bg-white rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                        <Info className="text-yellow-500" /> 应用商店同步上架
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
                        {[
                            { name: '华为下载', brand: 'Huawei', color: 'bg-red-50', textColor: 'text-[#E60012]' },
                            { name: '小米下载', brand: 'XIAOMI', color: 'bg-orange-50', textColor: 'text-[#FF6700]' },
                            { name: 'OPPO下载', brand: 'OPPO', color: 'bg-green-50', textColor: 'text-[#008A5E]' },
                            { name: 'VIVO下载', brand: 'VIVO', color: 'bg-blue-50', textColor: 'text-[#0057FF]' },
                            { name: '腾讯下载', brand: 'YYB', color: 'bg-yellow-50', textColor: 'text-yellow-600' },
                            { name: '百度下载', brand: 'BD', color: 'bg-sky-50', textColor: 'text-[#2152F3]' }
                        ].map(item => (
                            <div key={item.name} className="flex flex-col items-center group cursor-pointer">
                                <BrandIcon text={item.brand} color={item.color} textColor={item.textColor} />
                                <div className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-yellow-500 transition-colors">Download At</div>
                                <div className="font-bold text-sm text-gray-900">{item.name}</div>
                            </div>
                        ))}
                    </div>
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 hidden md:block pointer-events-none">
                        <Smartphone size={200} className="rotate-12" />
                    </div>
                </div>

                {/* 10. Japanese Platforms - Full Width */}
                <div className="md:col-span-2 lg:col-span-4 bg-white rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                         <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                             <Globe className="text-red-500" /> 日本电商平台支持
                         </h3>
                         <span className="text-xs bg-gray-50 px-3 py-1 rounded-full text-gray-500 font-bold border border-gray-100 flex items-center gap-1 cursor-pointer hover:bg-gray-100">
                             <ExternalLink size={12}/> 点击进入专区
                         </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {jpPlatforms.map(platform => (
                            <PlatformCard key={platform.name} {...platform} />
                        ))}
                    </div>
                </div>

            </div>
            
            {/* Footer */}
            <footer className="mt-16 text-center text-gray-400 text-xs pb-8">
                <p className="mb-2">© 2025 乐酷淘 lekutao · All rights reserved.</p>
                <div className="flex justify-center gap-4">
                    <a href="#" className="hover:text-gray-600">隐私政策</a>
                    <span>|</span>
                    <a href="#" className="hover:text-gray-600">服务条款</a>
                </div>
            </footer>
        </div>
    </div>
  );
};

export default App;
