
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
  HelpCircle,
  X,
  Tag,
  Mail,
  Briefcase,
  LifeBuoy,
  Copy,
  Check
} from 'lucide-react';

const BrandIcon = ({ text, color = "bg-yellow-50", textColor = "text-yellow-600" }: { text: string, color?: string, textColor?: string }) => (
  <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center overflow-hidden border border-black/5 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
    <span className={`text-[11px] font-black uppercase tracking-tighter ${textColor} leading-tight text-center px-1 break-all`}>
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
  content?: string;
}

const App: React.FC = () => {
  const [logoError, setLogoError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Manual Data based on user screenshot
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
    { title: "煤炉拍卖代购规则", tags: ["规则", "拍卖", "Mercari"] },
    { title: "雅虎日拍代购规则", tags: ["规则", "拍卖", "Yahoo"] },
    { title: "罗盘盘代购规则", tags: ["规则", "代购"] },
    { title: "会员等级规则", tags: ["会员", "积分", "等级"] },
    { title: "保价服务说明", tags: ["保险", "服务", "安全"] },
    { title: "免责声明", tags: ["法律", "声明"] },
    { title: "合单服务", tags: ["物流", "发货", "包裹"] },
    { title: "品类专线", tags: ["物流", "线路"] },
    { title: "售后服务", tags: ["客服", "退款", "退货", "投诉", "问题"] },
    { title: "国际物流", tags: ["运费", "运输", "时效"] },
    { title: "增值服务", tags: ["加固", "拍照", "服务"] },
    { title: "提款说明手册", tags: ["余额", "提现", "钱"] },
    { title: "禁止代购违禁物品", tags: ["规则", "违禁品", "限制"] },
    { title: "订阅推送", tags: ["通知", "消息"] },
    { title: "费用构成", tags: ["价格", "手续费", "运费"] },
    { title: "隐私保护", tags: ["安全", "协议"] },
    { title: "面单规范协议", tags: ["物流", "协议"] },
    { title: "顺丰直通车协议", tags: ["物流", "顺丰", "协议"] },
  ];

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Filter logic
  const filteredManuals = useMemo(() => {
    if (!searchQuery) return manualData.filter(m => ["APP新手指南", "售后服务", "费用构成"].includes(m.title)); // Default popular items
    const lowerQuery = searchQuery.toLowerCase();
    return manualData.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery]);

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

  return (
    <div className="min-h-screen relative overflow-hidden pb-12">
      {/* Dynamic Background Elements - Yellow Theme */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-100 rounded-full blur-[120px] opacity-60 -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-50 rounded-full blur-[120px] opacity-60 -z-10"></div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        
        {/* Header Section */}
        <header className="flex flex-col items-center mb-16 text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/20 overflow-hidden group border-4 border-white transition-transform duration-500 hover:scale-105">
              {logoError ? (
                <div className="w-full h-full bg-yellow-400 flex items-center justify-center">
                   <span className="text-white font-black text-4xl">淘</span>
                </div>
              ) : (
                <img 
                  src="/logo.png" 
                  alt="乐酷淘 Logo" 
                  className="w-full h-full object-cover p-1"
                  onError={() => setLogoError(true)}
                />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white px-2 py-0.5 rounded-lg border border-yellow-100 shadow-sm text-[10px] font-bold text-yellow-600">
              乐酷淘兔头
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
            乐酷淘<span className="text-yellow-500">·兔头</span>
          </h1>
          <p className="text-gray-500 max-w-lg text-lg font-medium leading-relaxed">
            极致好物淘选，潮流社区集合站。<br/>
            收藏此页，永久联系，永不失联。
          </p>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Main Download Card - Large */}
          <div className="md:col-span-2 lg:col-span-2 bento-card p-8 rounded-[2.5rem] flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Download size={140} className="text-yellow-500" />
            </div>
            <div className="relative z-10">
              <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6 inline-block uppercase tracking-widest">Official App</span>
              <h2 className="text-3xl font-bold mb-4">下载客户端</h2>
              <p className="text-gray-600 mb-8 max-w-[240px]">多终端同步，开启极致丝滑的乐酷淘体验。</p>
            </div>
            <div className="flex flex-wrap gap-3 relative z-10">
              <a 
                href="https://apps.apple.com/ca/app/%E4%B9%90%E9%85%B7%E6%B7%98-%E5%85%94%E5%A4%B4%E5%88%87%E7%85%A4%E6%B5%B7%E6%B7%98%E6%97%A5%E6%9C%AC/id6478657714" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] bg-gray-900 text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-black transition-colors shadow-lg shadow-black/10"
              >
                <Apple size={20} /> App Store
              </a>
              <a href="#" className="flex-1 min-w-[140px] bg-white text-gray-900 border border-gray-100 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-colors shadow-lg shadow-black/5">
                <Smartphone size={20} /> 安卓下载
              </a>
            </div>
          </div>

          {/* Social Links */}
          <a href="https://pd.qq.com/s/hgfi5uai6" target="_blank" rel="noopener noreferrer" className="bento-card p-8 rounded-[2.5rem] flex flex-col justify-between group">
            <div className="bg-blue-50 text-blue-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
               <MessageCircle size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">腾讯频道</h3>
              <p className="text-gray-500 text-sm">乐酷淘兔头官方社区</p>
            </div>
          </a>

          <a href="https://xhslink.com/m/2fmVl9ENOQb" target="_blank" rel="noopener noreferrer" className="bento-card p-8 rounded-[2.5rem] flex flex-col justify-between group">
            <div className="bg-red-50 text-red-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
               <Camera size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">小红书</h3>
              <p className="text-gray-500 text-sm">发现好物分享</p>
            </div>
          </a>

           {/* Manual / Help Center Search */}
           <div className="md:col-span-2 bento-card p-8 rounded-[2.5rem] flex flex-col relative overflow-hidden group h-[340px]">
            <div className="flex items-center gap-3 mb-6 relative z-10 shrink-0">
               <div className="bg-yellow-50 text-yellow-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                  <BookOpen size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-gray-900">使用手册 & 帮助</h3>
                  <p className="text-xs text-gray-400">搜索规则、教程或售后问题</p>
               </div>
            </div>

            <div className="relative z-10 mb-4 shrink-0">
              <div className="relative group/search">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-yellow-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="搜索问题... 例如：退款、新手、合单" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all shadow-sm placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2">
               {filteredManuals.length > 0 ? (
                 <div className="space-y-2">
                   {filteredManuals.map((item, index) => (
                     <button 
                        key={index}
                        onClick={() => setSelectedArticle(item)}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/50 hover:bg-white border border-transparent hover:border-yellow-200 transition-all group/item text-left hover:shadow-sm"
                     >
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-400 group-hover/item:text-yellow-500 transition-colors shrink-0" />
                              <span className="text-sm font-bold text-gray-700 group-hover/item:text-gray-900 truncate">{item.title}</span>
                           </div>
                           <div className="flex flex-wrap gap-1.5 pl-6">
                              {item.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 group-hover/item:bg-yellow-50 group-hover/item:text-yellow-700 transition-colors">
                                  #{tag}
                                </span>
                              ))}
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover/item:text-yellow-500 group-hover/item:translate-x-1 transition-all" />
                     </button>
                   ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400 py-4">
                    <HelpCircle size={32} className="mb-2 opacity-20" />
                    <p className="text-xs">未找到相关内容，请换个关键词试试</p>
                 </div>
               )}
            </div>
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
               <BookOpen size={120} className="-rotate-12" />
            </div>
          </div>

          {/* WeChat Search Card */}
          <div className="lg:col-span-2 bento-card p-8 rounded-[2.5rem] flex items-center gap-8 bg-gradient-to-br from-white to-yellow-50/30 group">
             <div className="flex-1">
                <div className="bg-green-50 text-green-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                   <QrCode size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-2">官方公众号</h3>
                <p className="text-gray-500 mb-4">微信搜索：<span className="text-yellow-600 font-bold underline underline-offset-4">乐酷淘</span></p>
                <div className="flex gap-2">
                   <span className="text-[10px] bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">绑定账号</span>
                   <span className="text-[10px] bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">煤炉秒切</span>
                </div>
             </div>
             <div className="hidden sm:block w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200">
                <span className="text-xs text-center p-4">扫码关注<br/>(占位)</span>
             </div>
          </div>

          {/* QQ Groups */}
          <div className="bento-card p-8 rounded-[2.5rem] flex flex-col justify-between group">
             <div className="flex items-center justify-between mb-8">
                <div className="bg-sky-50 text-sky-500 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400">官方1群</span>
             </div>
             <div>
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">QQ Group</p>
                <h3 className="text-2xl font-black text-gray-900 mb-4">850815830</h3>
                <a href="#" className="flex items-center text-yellow-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                  立即申请加入 <ChevronRight size={16} />
                </a>
             </div>
          </div>

          <div className="bento-card p-8 rounded-[2.5rem] flex flex-col justify-between group">
             <div className="flex items-center justify-between mb-8">
                <div className="bg-sky-50 text-sky-500 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400">官方2群</span>
             </div>
             <div>
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">QQ Group</p>
                <h3 className="text-2xl font-black text-gray-900 mb-4">566807796</h3>
                <a href="#" className="flex items-center text-yellow-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                  立即申请加入 <ChevronRight size={16} />
                </a>
             </div>
          </div>

          {/* Contact / Email Card - NEW FEATURE */}
          <div className="lg:col-span-2 bento-card p-8 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                    <Mail size={24} />
                </div>
                <div>
                     <h3 className="text-xl font-bold text-gray-900">联系我们</h3>
                     <p className="text-xs text-gray-400">商务合作与意见反馈</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {/* Business Email */}
                <button 
                  className="bg-gray-50 hover:bg-yellow-50 border border-gray-100 hover:border-yellow-200 rounded-2xl p-4 transition-all group/email text-left relative overflow-hidden" 
                  onClick={() => handleCopyEmail('work@lekutao.cn')}
                >
                     <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                            <Briefcase size={14} className="text-gray-400 group-hover/email:text-yellow-600 transition-colors" />
                            <span className="text-xs font-bold text-gray-500 group-hover/email:text-yellow-700 transition-colors">商务合作</span>
                         </div>
                         {copiedEmail === 'work@lekutao.cn' ? (
                            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Check size={10} /> 已复制
                            </span>
                         ) : (
                            <Copy size={12} className="text-gray-300 group-hover/email:text-yellow-500 opacity-0 group-hover/email:opacity-100 transition-all" />
                         )}
                     </div>
                     <p className="text-sm sm:text-base font-black text-gray-900 break-all">work@lekutao.cn</p>
                </button>

                {/* Support Email */}
                <button 
                  className="bg-gray-50 hover:bg-yellow-50 border border-gray-100 hover:border-yellow-200 rounded-2xl p-4 transition-all group/email text-left relative overflow-hidden" 
                  onClick={() => handleCopyEmail('support@lekutao.cn')}
                >
                     <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                            <LifeBuoy size={14} className="text-gray-400 group-hover/email:text-yellow-600 transition-colors" />
                            <span className="text-xs font-bold text-gray-500 group-hover/email:text-yellow-700 transition-colors">建议反馈</span>
                         </div>
                         {copiedEmail === 'support@lekutao.cn' ? (
                            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Check size={10} /> 已复制
                            </span>
                         ) : (
                            <Copy size={12} className="text-gray-300 group-hover/email:text-yellow-500 opacity-0 group-hover/email:opacity-100 transition-all" />
                         )}
                     </div>
                     <p className="text-sm sm:text-base font-black text-gray-900 break-all">support@lekutao.cn</p>
                </button>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-50 -z-10 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Android Stores Aggregator */}
          <div className="md:col-span-3 lg:col-span-4 bento-card p-10 rounded-[2.5rem] overflow-hidden relative">
             <div className="absolute top-0 right-0 p-12 opacity-5 hidden lg:block pointer-events-none">
                <Smartphone size={240} className="rotate-12" />
             </div>
             <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-12 flex items-center gap-3 text-gray-900">
                  <Info size={24} className="text-yellow-500" /> 各大安卓应用商店同步上架
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12">
                   {[
                     { name: '华为', brand: 'Huawei', color: 'bg-red-50', textColor: 'text-[#E60012]' },
                     { name: '小米', brand: 'XIAOMI', color: 'bg-orange-50', textColor: 'text-[#FF6700]' },
                     { name: 'OPPO', brand: 'OPPO', color: 'bg-green-50', textColor: 'text-[#008A5E]' },
                     { name: 'VIVO', brand: 'VIVO', color: 'bg-blue-50', textColor: 'text-[#0057FF]' },
                     { name: '腾讯', brand: 'YYB', color: 'bg-yellow-50', textColor: 'text-yellow-600' },
                     { name: '百度', brand: 'BD', color: 'bg-sky-50', textColor: 'text-[#2152F3]' }
                   ].map((item) => (
                     <div key={item.name} className="group cursor-pointer flex flex-col items-start">
                        <BrandIcon text={item.brand} color={item.color} textColor={item.textColor} />
                        <div className="text-gray-400 text-[9px] mt-4 mb-1 font-bold group-hover:text-yellow-500 transition-colors uppercase tracking-[0.2em] whitespace-nowrap">
                           Download at
                        </div>
                        <div className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 group-hover:text-black group-hover:border-yellow-400 transition-all w-full">
                           {item.name}下载
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Japanese E-commerce Platforms */}
          <div className="md:col-span-3 lg:col-span-4 bento-card p-8 rounded-[2.5rem] relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <div className="bg-red-50 text-red-500 w-10 h-10 rounded-xl flex items-center justify-center">
                         <Globe size={20} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">日本电商平台支持</h3>
                   </div>
                   <span className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                     <ExternalLink size={12} /> 点击进入专区
                   </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                   {jpPlatforms.map((platform) => (
                      <PlatformCard 
                        key={platform.name} 
                        name={platform.name} 
                        brand={platform.brand} 
                        color={platform.color} 
                        textColor={platform.textColor} 
                      />
                   ))}
                </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-50/50 rounded-full blur-3xl -z-10"></div>
          </div>

          {/* Logistics Support Section */}
          <div className="md:col-span-3 lg:col-span-4 bento-card p-8 rounded-[2.5rem] relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="bg-gray-900 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                      <Truck size={20} />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900">官方物流支持</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                   {logistics.map((item) => (
                      <PlatformCard 
                        key={item.name} 
                        name={item.name} 
                        brand={item.brand} 
                        color={item.color} 
                        textColor={item.textColor} 
                      />
                   ))}
                </div>
             </div>
          </div>

        </div>

        {/* Footer info */}
        <footer className="mt-20 text-center pb-12">
           <p className="text-gray-400 text-sm mb-4">© 2025 乐酷淘 lekutao · 专业日淘聚合平台</p>
           <div className="flex items-center justify-center gap-6">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">服务协议</a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">隐私政策</a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors flex items-center gap-1">
                 <Heart size={14} className="text-red-400" /> 遇见美好
              </a>
           </div>
        </footer>

      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedArticle(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
              <div>
                 <h3 className="text-xl font-black text-gray-900 mb-2">{selectedArticle.title}</h3>
                 <div className="flex gap-2">
                    {selectedArticle.tags.map(tag => (
                       <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700">
                         <Tag size={10} /> {tag}
                       </span>
                    ))}
                 </div>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Simulated Text */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
                 <p className="lead text-lg text-gray-800 font-medium mb-6">
                    这里是关于“{selectedArticle.title}”的详细说明文档。我们致力于为您提供最透明、最便捷的日淘体验。
                 </p>
                 <h4 className="font-bold text-gray-900 mt-6 mb-3">1. 服务概述</h4>
                 <p className="mb-4">
                    乐酷淘一直秉承用户至上的原则。针对{selectedArticle.title}，我们制定了详细的规范流程，以确保每一位用户的权益得到充分保障。所有的操作都在我们的系统内全程留痕，透明可查。
                 </p>
                 <h4 className="font-bold text-gray-900 mt-6 mb-3">2. 核心规则</h4>
                 <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>规则适用范围：本说明适用于所有乐酷淘注册用户。</li>
                    <li>时效性：请注意，相关政策可能会根据日本市场或物流渠道的变化进行微调，请以最新公告为准。</li>
                    <li>用户义务：用户在使用服务前，建议详细阅读本指南，避免因操作失误造成不必要的损失。</li>
                 </ul>
                 <h4 className="font-bold text-gray-900 mt-6 mb-3">3. 常见问题 (FAQ)</h4>
                 <p className="mb-4">
                    <strong>Q: 如果遇到特殊情况怎么办？</strong><br/>
                    A: 您可以随时联系我们的在线客服，或者在官方QQ群（850815830）中进行咨询，管理员会第一时间为您解答。
                 </p>
                 <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mt-8">
                    <p className="text-xs text-yellow-800 font-bold mb-1">💡 温馨提示</p>
                    <p className="text-xs text-yellow-700">
                       本文档最后更新于 2024年12月23日。如果您对内容有疑问，请截图联系客服。
                    </p>
                 </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
               <button 
                 onClick={() => setSelectedArticle(null)}
                 className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors"
               >
                 关闭
               </button>
               <button 
                 onClick={() => alert("功能开发中：将跳转到客服咨询页面")}
                 className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-black transition-colors shadow-lg shadow-gray-900/10"
               >
                 联系客服咨询
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Floating Tooltip */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[max-content]">
         <div className="bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl border border-white/10">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-xs font-bold tracking-tight">建议收藏此页面，永不失联</span>
            <div className="w-px h-4 bg-gray-700"></div>
            <button className="text-yellow-400 text-xs font-bold hover:text-yellow-300 transition-colors" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("链接已复制，请收藏！");
            }}>复制链接</button>
         </div>
      </div>
    </div>
  );
};

export default App;
