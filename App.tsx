import React, { useState, useMemo, useRef, useLayoutEffect } from 'react';
import { 
  Apple, 
  Smartphone, 
  MessageCircle, 
  Users, 
  QrCode, 
  Heart, 
  ChevronRight, 
  Download, 
  Info, 
  Globe, 
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
  Copy, 
  Ban, 
  ImageOff, 
  CreditCard, 
  Percent, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Bot 
} from 'lucide-react';

const BrandIcon = ({ text, color = "bg-yellow-50", textColor = "text-yellow-600", iconUrl }: { text: string, color?: string, textColor?: string, iconUrl?: string }) => (
  <div className={`w-14 h-14 md:w-16 md:h-16 ${color} rounded-2xl flex items-center justify-center overflow-hidden border border-black/5 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
    {iconUrl ? (
      <img src={iconUrl} alt={text} className="w-full h-full object-cover" />
    ) : (
      <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-tighter ${textColor} leading-tight text-center px-1 break-all`}>
        {text}
      </span>
    )}
  </div>
);

interface Platform {
  name: string;
  brand: string;
  color: string;
  textColor: string;
  logoUrl?: string;
  description?: string;
  url?: string;
  features?: string[];
  tips?: string;
}

const PlatformCard: React.FC<{ platform: Platform; onClick: (p: Platform) => void }> = ({ platform, onClick }) => (
  <button 
    onClick={() => onClick(platform)}
    className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 w-full text-left"
  >
    {platform.logoUrl ? (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden bg-white border border-gray-100 p-0.5">
            <img src={platform.logoUrl} alt={platform.brand} className="w-full h-full object-contain" />
        </div>
    ) : (
        <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
            <span className={`text-[8px] font-bold ${platform.textColor} text-center leading-tight px-0.5`}>{platform.brand}</span>
        </div>
    )}
    <span className="text-xs font-bold text-gray-700 group-hover:text-black whitespace-nowrap">{platform.name}</span>
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
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [scamInput, setScamInput] = useState('');
  const [scamStatus, setScamStatus] = useState<'idle' | 'safe' | 'danger'>('idle');
  const [matchedDomain, setMatchedDomain] = useState<string | null>(null);
  const scrollPositionRef = useRef(0);

  // Handle scroll restoration when switching views
  useLayoutEffect(() => {
    if (selectedPlatform || selectedArticle) {
        // When entering a detail view, scroll to top
        window.scrollTo(0, 0);
    } else {
        // When returning to main view, restore saved position
        window.scrollTo(0, scrollPositionRef.current);
    }
  }, [selectedPlatform, selectedArticle]);

  // Mock Blacklist for Scam Sites
  const scamBlacklist = [
    'fxpl.flypixes.click',
    'flypixes.click',
    'fake-mercari.com',
    'scam-shop.jp',
    'fishing-site.net',
    'www.fxpl.flypixes.click',
    'decski.enrank.shop',
    'enrank.shop',
    'sckgx.tapeimer.click',
    'tapeimer.click',
    'ulkj.nfkdkqqg.top',
    'nfkdkqqg.top'
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

  // Reusable Logistics Disclaimer Component
  const LogisticsDisclaimer = (
    <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6 text-sm text-red-800">
        <h4 className="font-bold mb-2 flex items-center gap-2"><AlertTriangle size={18}/> 特别声明：物流服务主体说明</h4>
        <p className="font-bold mb-1">请知悉：本平台的物流服务由第三方承运方提供。</p>
        <p className="leading-relaxed">
          乐酷淘平台的服务仅限于将打包好的包裹转交给物流服务方。一旦包裹转交，本平台的服务即视为结束。
          后续物流运输过程中出现的任何问题（如延误、破损、丢件、扣关等），本平台仅提供协助沟通服务，<span className="font-black underline">无法保证沟通结果或理赔成功率</span>。
          请您充分理解并同意本协议后使用该服务。
        </p>
    </div>
  );

  const manualData: Article[] = [
    { 
        title: "APP新手指南", 
        tags: ["入门", "注册", "教程", "流程"],
        content: (
            <>
                {/* LogisticsDisclaimer is now shown globally in the article view */}
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6">
                    <h3 className="font-bold text-yellow-800 text-lg mb-2">欢迎使用乐酷淘</h3>
                    <p className="text-yellow-700 text-sm leading-relaxed">
                        在这里您可以直达日本电商，选购各种新品或中古类日本商品。无论您是资深日淘玩家，还是初次接触日本购物的新手，乐酷淘都将是您值得信赖的伙伴！现在开启您的海淘之旅吧 O(∩_∩)O ~
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-8">
                    <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><AlertTriangle size={18}/> 特别声明</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-red-700 text-sm">
                        <li>本平台仅向用户提供日本交易平台的代购、代拍服务，无法保证商品质量和真假。</li>
                        <li>本平台不具备商品鉴别资质，无法进行商品真假鉴别，商品情况需要用户自行甄别。</li>
                        <li>任何通过本平台成功下单的订单，不可因为自身原因而取消订单。</li>
                        <li>十八岁以下的未成年人需在监护人同意及陪同下进行消费。</li>
                        <li>二手物品或旧藏商品可能存在使用痕迹或老化。建议尽早安排运回。因保管时间过长导致的状态变化，恕不承担责任。</li>
                        <li>本平台可协助沟通，但无法承诺沟通一定达到双方期望，介意者勿拍。</li>
                    </ol>
                </div>

                <h3 className="font-black text-2xl text-gray-900 mb-6 flex items-center gap-2">
                    <ShoppingBag className="text-yellow-500" /> 购物流程
                </h3>

                <div className="space-y-6 relative border-l-2 border-gray-100 ml-3 pl-6 pb-2">
                    {[
                        { title: "注册", content: "首页点击“我的”在个人中心进行注册。未注册的手机号码，验证登录后自动注册。" },
                        { title: "搜索", content: "在首页顶部搜索框直接搜索心仪商品。也可先选择目标站点再精准查找。" },
                        { title: "选购商品", content: "选择心仪商品进入详情页，确认信息后加入购物车。注意：1点の価格(一件价格)、箱のみ(只有箱子)、空箱(空箱子)等词汇需谨慎。" },
                        { title: "留言与议价", content: "可使用模板留言或人工留言（需在工作时间，且有会员等级限制）。达成共识后请尽快下单。不遵守煤炉规则导致的交易失败，平台不负责。" },
                        { title: "第一次支付", content: "结算即完成第一次付款（商品费用）。下单后不支持再次联系卖家。" },
                        { title: "商品入库", content: "商品到达日本仓库后，平台按顺序入库。入库后可评价卖家服务及返图。" },
                        { title: "商品出库", content: "选择个人直邮或多人拼邮（需自行组织）。" },
                        { title: "第二次支付", content: "支付国际物流费用（部分路线含税，部分自理）。支付完成后等待收货。" },
                        { title: "岛内邮费与物流", content: "如有日本国内运费（到付），需在到仓后支付。未支付邮费无法操作出库。建议煤炉购物前留言要求使用官方物流。" }
                    ].map((step, idx) => (
                        <div key={idx} className="relative">
                            <span className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-yellow-400 border-2 border-white shadow-sm"></span>
                            <h4 className="font-bold text-gray-900 text-lg mb-1">{idx + 1}. {step.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{step.content}</p>
                        </div>
                    ))}
                </div>

                <h3 className="font-black text-2xl text-gray-900 mt-10 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-blue-500" /> 个性化服务
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-gray-50 p-4 rounded-xl">
                         <h4 className="font-bold text-gray-900 mb-2">1. 指定购买</h4>
                         <p className="text-sm text-gray-600">乐酷淘暂未支持的网站，可使用“指定购买”。提交链接后平台报价，确认后付费购买（雅虎拍卖除外）。</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                         <h4 className="font-bold text-gray-900 mb-2">2. 订阅与通知</h4>
                         <p className="text-sm text-gray-600">使用关键字订阅或关注卖家上新，第一时间获取消息。通知列表可获取订单及平台最新消息。</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                         <h4 className="font-bold text-gray-900 mb-2">3. 选品对应</h4>
                         <p className="text-sm text-gray-600">卖家沟通（缺货、确认等）将通过工单服务联系，请及时回复。逾期未回复可能导致卖家自行处理，后续无法异议。</p>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Bot size={20}/> 自助下单功能</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        乐酷淘机器人自动下单功能，公众号复制链接（mid），实现快速代拍。支持钱包、支付宝、微信及花呗支付。24小时在线，随时随地，想切就切。
                    </p>
                </div>

                <div className="mt-4 bg-gray-100 rounded-xl p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Clock size={20}/> 人工服务时间</h3>
                    <div className="space-y-1 text-sm text-gray-700">
                        <p><span className="font-bold">在线客服：</span>全年无休</p>
                        <p>周一至周五 9:00-23:00</p>
                        <p>双休日及法定节假日 9:00-19:00</p>
                        <p className="mt-2 text-xs text-gray-500">双休日及节假日19:00-23:00如遇紧急锁单，可联系QQ值日客服（见群公告）。</p>
                    </div>
                </div>
            </>
        )
    },
    { title: "Animate代购规则", tags: ["规则", "代购", "动漫"] },
    { 
        title: "kyoani代购规则", 
        tags: ["规则", "代购", "京阿尼"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">一、平台概述</h4>
                    <p className="leading-relaxed">
                        Kyoani shop（京阿尼）是京都动画的官方在线商店。销售与京都动画的作品相关的各种商品，包括DVD和蓝光光盘、漫画书、原画集、T恤、公仔、海报、键盘、以及其他各种周边商品。
                    </p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">一、下单方式</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">① 页面导航下单</span>
                            <span className="text-gray-600">点击【Kyoani】图标进入站点，按品类筛选心仪商品，进入商品的详情页，进行自助下单操作。</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">② 站内搜索下单</span>
                            <span className="text-gray-600">通过平台内【搜索栏】输入商品关键词-选择【Kyoani】作为搜索范围，查找相关商品后进入商品详情页，进行下自助单操作。</span>
                        </div>
                    </div>
                    <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-xs">
                        <span className="font-bold block mb-1">⚠️ 购买规则</span>
                        任何通过本平台成功下单的订单，不可因为自身原因而取消订单。一旦下单成功，我们无法处理添加商品、更改数量、与其他订单号合并订单、单独发货等请求。因此请在下单前仔细考虑并确认订单内容和数量。
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">二、运费说明</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                            <span className="font-bold text-green-800 block mb-1">① 免邮规则</span>
                            <span className="text-green-700 text-xs">单笔订单商品总价满 <span className="font-bold">11,000日元</span> 时，可免日本国内配送运费。</span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <span className="font-bold text-blue-800 block mb-1">② 固定运费</span>
                            <span className="text-blue-700 text-xs">单笔订单商品总价低于11,000日元时，每次日本国内配送，收取运费 <span className="font-bold">880日元</span>。</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-600 text-xs">
                        <span className="font-bold block mb-1 text-gray-800">③ 补充说明：</span>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>合并一次性结算，可合并发货的计为单笔订单，单个包裹。</li>
                            <li>每个包裹的商品总价都需要独立达到免邮门槛，否则每次配送将收取880日元的运费。</li>
                            <li>免邮判断以结算页面-费用明细中的「商品总价」为准，此金额不含运费、手续费等附加费用。</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">三、发货规则</h4>
                    <p className="text-xs text-gray-500 mb-2">购物车内多件商品合并结算的发货规则如下：</p>
                    <div className="space-y-3">
                        <div className="border border-gray-200 rounded-xl p-3">
                            <span className="font-bold text-gray-800 block mb-1">① 合并发货</span>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
                                <li>最早和最晚“发货日”相差30天及以内的商品：将以一个包裹的形式一起发货。合并结算后计为单笔订单，仅支付一笔运费。</li>
                                <li>不同“预计发货日”的预售商品也可以一起发货，只要每件商品的发货日间隔在30天内即可。</li>
                            </ul>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-3">
                            <span className="font-bold text-gray-800 block mb-1">② 分开发货</span>
                            <p className="text-xs text-gray-600">最早和最晚“发货日”相差31天或以上的商品：即使合并结算，也会根据30天周期拆分成不同订单，分开发货，单独结算运费。</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-xs">
                            <span className="font-bold">③ 判断规则：</span>由系统根据各商品的发货日和配送方式，自动判断是否合并发货，不可申请或修改。
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">四、发货时效</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><span className="font-bold text-gray-800">① 现货商品（有库存）：</span>付款后，在3至5个工作日内发货。<br/><span className="text-xs text-gray-400">*若遇特殊情况，发货时间可能延长，以实际发货为准。</span></li>
                        <li><span className="font-bold text-gray-800">② 预售商品：</span>会按照商品页标注的预计发货日期发出。<br/><span className="text-xs text-gray-400">*预计发货日期为估计值，可能会因交通状况、天气、制造工艺缺陷等发生变化。</span></li>
                        <li><span className="font-bold text-gray-800">③ 混合订单：</span>如果同时买了现货商品和预售商品（或发货日期不同的预售商品），会等到最晚发货的商品准备好后，才一起发货。</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">五、售后相关</h4>
                    <div className="space-y-3 text-xs text-gray-600">
                        <p>✦ 通过本平台成功下单的订单，不可因为自身原因而取消订单。因此用户于付款前再三确认自己购买意向和所购商品是否正确再进行下单。</p>
                        <p>✦ 平台默认用户在购买时已明晰商品所属状态，因此平台作为一个帮助日本国外买家和日本国内卖家沟通的购买通道，不承担商品的任何品相问题的责任，不接受任何情况下的单方面要求取消订单退款的要求。</p>
                        <p>✦ 商品换货、卖家直接取消订单等没有让平台产生人工对应沟通成本的，平台不收取费用；让平台产生人工对应沟通成本的，将收取对应费：订单价格（含岛内运费）的10%（包含7%平台人工处理费+3%第三方支付平台手续费），不足1000日元的商品固收100日元。</p>
                        
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800">
                            <span className="font-bold block mb-1">Kyoani售后特殊说明</span>
                            用户需在收到商品入库返图后<span className="font-bold">5天内</span>完成订单确认操作。如确认存在错发、漏发、商品缺陷等问题，请在5天内联系平台客服，并提供有效凭证。平台将发送邮件咨询官方的处理流程，并协助处理争议。商品入库返图超过5天，平台将不再做任何应对，默认用户无异议。请务必在时限内进行商品确认。
                        </div>

                        <p className="text-blue-500">✦ 详细售后服务，请查阅用户手册-《售后服务》。</p>
                    </div>
                </section>

                <p className="text-center text-xs text-gray-400 mt-4 pt-4 border-t">请充分了解相关购物风险，认真仔细阅读商品页面上的说明再进行选购。</p>
            </div>
        )
    },
    { 
        title: "Mandarake代购规则", 
        tags: ["规则", "代购", "二手", "Mandarake"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">一、平台概述</h4>
                    <p className="leading-relaxed">
                        Mandarake（まんだらけ） 是日本一家知名的二手动漫、漫画、游戏、周边及同人志专卖连锁店，同时也运营着线上购物网站。商品多为二手，但状态良好，且常有稀缺或绝版物品。主要分布在东京（中野、秋叶原）、大阪、名古屋等地，以“Mandarake Complex”形式集中多家主题分店。
                    </p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">二、下单方式</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                        <p><span className="font-bold">① 页面导航：</span>通过app首页-mandarake图标进入站点，筛选商品品类精确浏览相关商品；</p>
                        <p><span className="font-bold">② 站内搜索：</span>也可通过站内搜索栏在输入商品关进并选择【mandarake】图标搜索相关商品，进入选择的商品的详情页进行下单操作。</p>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">三、费用构成</h4>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-xs">
                        购买Mandarake的商品还需支付 <span className="font-bold">10% 的消费税</span>，该消费税为Mandarake直接收取，与乐酷淘平台无关，海关关税由用户所在地海关决定是否收取。
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">四、预约商品</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>若购买页面上标注为预约的商品，该商品为预约商品，无法立刻发货，需等到标注的时间才进行发售。</li>
                        <li>若用户与预约商品一起购入了有现货的商品时，会等到预约商品发售后一起发货，不会分开发货。</li>
                        <li className="text-red-600 font-bold">Mandarake不支持预约商品取消订单操作，一旦购买无法取消，因此下单前请再三思考。</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">五、发货时间</h4>
                    <p className="text-gray-600">日本卖家发货普遍较慢，通常为下单后的3~7天左右，如果超过14天还未发货或乐酷淘日本仓库还未收到相关商品，可联系在线客服咨询。</p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">六、日本国内运费</h4>
                    <div className="space-y-2 text-gray-600">
                        <p>Mandarake 的日本国内运费通常根据包裹的总重量（包括商品和包装材料）计算。采用按店收取邮费的方式。实际运费以Mandarake站点页面结算时为准。</p>
                        <p className="text-xs bg-gray-50 p-2 rounded text-gray-500">若是到付商品，平台会事先预收2000日元的日本国内运费，最终运费会在商品入库后采用“多退少补”方式原路退回。</p>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">七、退货退款</h4>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3 text-xs text-red-800">
                        <p className="font-bold"><AlertTriangle size={14} className="inline mr-1"/>重要声明：</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>通过本平台成功下单的订单，不可因为自身原因而取消订单。因此用户于付款前再三确认自己购买意向和所购商品是否正确再进行下单。</li>
                            <li>平台默认用户在购买时已明晰商品所属状态，因此平台作为一个帮助日本国外买家和日本国内卖家沟通的购买通道，不承担任何从Mandarake购买商品的任何品相问题的责任，不接受任何情况下的单方面要求取消订单退款的要求。</li>
                            <li>Mandarake为中古商品贩售网站，中古商品通常会有使用痕迹、划痕、污渍、外盒变形、卡口有松动或其他卖家说明的其他问题，由于上述中古商品常见的折旧现象不属于商品的质量问题，无法享受全程购物保障计划、平台不承担任何从Mandarake购买商品的任何品相问题的责任，不接受任何情况下的单方面要求取消订单退款的要求。</li>
                            <li>非流水线生产的服装尺寸会存在一定误差，所以无法明确标注，用户只能自行了解制作者或制作社团的通用尺寸。</li>
                            <li>商品换货、卖家直接取消订单等没有让平台产生人工对应沟通成本的，平台不收取费用；商品申请取消让平台产生人工对应沟通成本的，按商品价格价格收取对应费。</li>
                        </ul>
                    </div>
                </section>
                
                <p className="text-center text-xs text-gray-400 mt-4 pt-4 border-t">因此，请充分了解相关购物风险，认真仔细阅读商品页面上的说明再进行选购。</p>
            </div>
        )
    },
    { 
        title: "moponline代购规则", 
        tags: ["规则", "代购", "奥特莱斯"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">一、平台概述</h4>
                    <p className="leading-relaxed">
                        三井木更津奥特莱斯是全日本店铺数量最多的奥特莱斯购物城。作为日本人气的购物圣地，有超过300家知名品牌在此集结。从高奢到潮流、从运动到生活，统统都能在三井木更津奥特莱斯在线商城买到，季末特卖、联名限定、超低折扣，心动好价等着你！
                    </p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">二、购前须知</h4>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-800 text-xs">
                        <span className="font-bold block mb-1">⚠️ 重要提示</span>
                        任何通过本平台成功下单的订单，不可因为自身原因而取消订单。因此用户于付款前，请再三确认自己的购买意向和所购商品是否正确再进行下单。
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">三、下单方式</h4>
                    <div className="space-y-3">
                         <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                             <span className="font-bold text-gray-800 block mb-1">① 页面导航下单</span>
                             <span className="text-gray-600 text-xs">点击【moponline】图标进入站点，按品类筛选心仪商品，进入商品详情页，进行自助下单操作。</span>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                             <span className="font-bold text-gray-800 block mb-1">② 站内搜索下单</span>
                             <span className="text-gray-600 text-xs">通过平台内搜索栏输入商品名称，并选择【moponline】作为搜索范围。查找相关商品后进入详情页，进行自助下单操作。</span>
                         </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">四、日本国内运费</h4>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                        <div>
                             <span className="font-bold text-gray-800 block text-sm">① 固定运费</span>
                             <span className="text-gray-600 text-xs">单笔订单商品总价低于4990日元时，每次日本国内配送，收取运费385日元（部分店铺除外）。</span>
                        </div>
                        <div>
                             <span className="font-bold text-green-600 block text-sm">② 免邮规则</span>
                             <span className="text-gray-600 text-xs">单笔订单商品总价满4990日元时，可免日本国内配送运费；支持单一站点内凑单。</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500">
                             <span className="font-bold text-gray-700 block mb-1">③ 补充说明：</span>
                             <ul className="list-disc pl-4 space-y-1">
                                <li>因部分商品取消购买，导致订单总金额低于4,990日元，则每笔订单将收取385日元运费。</li>
                                <li>部分店铺的免运费门槛可能有所不同，具体以商品页面说明为准。</li>
                                <li>包装尺寸超过160cm的家具等大件商品，需另行支付特殊配送费，具体金额依商品尺寸而定，详见商品详情页标注。</li>
                             </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">五、发货规则</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li><span className="font-bold text-gray-800">① 多包裹发货：</span>因商品发货地可能存在差异，同一店铺订单可能分多个包裹发出，送达乐酷淘日本仓库的时间亦可能不同。此情况不会向用户收取额外运费。</li>
                        <li><span className="font-bold text-gray-800">② 预购商品说明：</span>预购商品发货周期较长，用户下单前请务必确认商品页标注的“预计发货日期”。</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">六、售后服务</h4>
                    <div className="space-y-3 text-xs text-gray-600">
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800">
                            <span className="font-bold block mb-1"><AlertTriangle size={14} className="inline mr-1"/> 购前必读</span>
                            <p>✦ 通过本平台成功下单的订单，不可因为自身原因而取消订单。请用户在付款前审慎确认购买意向及商品信息。</p>
                            <p className="mt-1">✦ 在您下单前，请务必了解本平台特性：日本境内无“七天无理由退换货”服务。用户下单即视为已知晓并接受商品实际状态，平台作为一个帮助日本国外买家和日本国内卖家沟通的购买通道，不承担商品品相相关责任，亦不接受单方面退款要求。</p>
                        </div>
                        
                        <p>✦ 部分商品的材质对环境敏感，如长期存放，可能出现发霉、变质、异味等情况，影响商品状态。建议您尽早安排运回或确认发货，以保障商品质量及自身权益。我们会在保管期间尽量妥善处理，但因保管时间过长或气候因素导致的状态变化，恕不承担责任。</p>

                        <p>✦ 商品换货、卖家直接取消订单等没有让平台产生人工对应沟通成本的，平台不收取费用；让平台产生人工对应沟通成本的，将收取对应费：订单价格（含岛内运费）的10%（包含7%平台人工处理费+3%第三方支付平台手续费），不足1000日元的商品固收100日元。</p>

                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-900">
                             <span className="font-bold block mb-1">入库确认时效</span>
                             用户须在收到商品入库返图后5天内完成订单确认操作。如确认存在错发、漏发、商品缺陷等问题，请在5天内联系平台客服并提供有效凭证。平台将发送邮件咨询官方的处理流程，并协助处理争议。逾期将视为用户无异议，平台不再受理相关争议。请务必在时限内进行商品确认。
                        </div>

                        <p>✦ 由于物流运输涉及国际物流和清关环节，乐酷淘无法保证所有的商品在收到时呈现完美状态。如您的商品在运输中出现问题，您可以联系物流承运方和在线客服。申请售后必须提供完整的开箱视频，我们将根据视频内容处理您的售后申请或协助您向承运快递方进行赔偿。（无完整有效开箱将无法受理售后申请）</p>

                        <p className="text-blue-500">✦ 更多售后服务详情，请参阅用户手册-《售后服务》。</p>
                    </div>
                </section>

                <p className="text-center text-xs text-gray-400 mt-4 pt-4 border-t">请您在购物前，充分了解相关风险，仔细阅读商品页面信息及本规则说明。</p>
            </div>
        )
    },
    { 
        title: "Rakuten代购规则", 
        tags: ["规则", "代购", "乐天"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">一、平台概述</h4>
                    <p className="leading-relaxed">
                        Rakuten，又称乐天市场，是日本最大电子商店街，地位类似于国内天猫，以商家入驻模式自主运营店铺，目前有超过 4万家商家，涵盖服装、家电、美妆、食品、日用品等各类商品，几乎涵盖了所有品类。
                    </p>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-xs mt-2">
                        请注意，日本乐天（Rakuten）和韩国乐天集团（Lotte）是两家完全不同的公司。除中文汉字一样外再无任何关系。
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">二、下单方式</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>通过app首页-Rakuten图标进入站点，筛选商品品类精确浏览相关商品；</li>
                        <li>也可通过站内搜索栏输入商品名称并选择【Rakuten】图标搜索相关商品，进入选择的商品的详情页进行下单操作。</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">三、日本国内运费</h4>
                    <p className="mb-2 text-gray-600">是否包邮以及选择哪种物流由Rakuten卖家个人决定，您可使用平台筛选功能，选择卖家包邮的商品。</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
                        <li><span className="font-bold text-gray-800">邮费到付商品：</span>需要您承担日本时段的相关运费，兔头会在仓库收到货后会向您收取，不再计算在国际运费中。</li>
                        <li><span className="font-bold text-gray-800">卖家包邮的商品：</span>运费由卖家承担，如果出现包邮商品因卖家原因造成日本国内配送运费不足的，其中差价由您承担。</li>
                    </ul>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <h5 className="font-bold text-red-600 mb-2">【39ショップ】（is39Shop）免运费规则</h5>
                        <p className="text-xs text-gray-500 mb-3">在商品页或店铺首页带有 【39ショップ】（is39Shop） 标签，部分商品可能不参与免邮（需查看商品或商家详情页说明）。</p>
                        <ul className="space-y-2 text-xs text-gray-700">
                            <li className="flex justify-between border-b border-gray-50 pb-2">
                                <span>日本本州等主要地区</span>
                                <span className="font-bold text-green-600">单笔订单 ≥ 3,980日元（含税） 免运费</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-50 pb-2">
                                <span>冲绳、离岛等偏远地区</span>
                                <span className="font-bold text-green-600">单笔订单 ≥ 9,800日元（含税） 免运费</span>
                            </li>
                            <li className="pt-2 text-gray-500">
                                <span className="font-bold">非39Shop店铺：</span>运费由商家自行设定，平台默认按 850日元 计算，最终运费会在商品入库后采用“多退少补”方式原路退回。
                            </li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">四、发货时间</h4>
                    <p className="text-gray-600">日本卖家发货普遍较慢，通常为下单后的3~7天左右，如果超过14天还未发货或乐酷淘日本仓库还未收到相关商品，可联系在线客服咨询。</p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">五、留言议价</h4>
                    <p className="text-gray-600">目前该站点暂不支持议价、选品等任何留言服务。</p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">六、退货退款</h4>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3 text-xs text-red-800">
                         <p className="font-bold"><AlertTriangle size={14} className="inline mr-1"/>重要声明：</p>
                         <ul className="list-disc pl-4 space-y-1">
                            <li>通过本平台成功下单的订单，不可因为自身原因而取消订单。因此您在付款前再三确认自己购买意向和所购商品是否正确再进行下单。</li>
                            <li>平台不承担任何从Rakuten购买商品的任何品相问题的责任，不接受任何情况下的单方面要求取消订单退款的要求。</li>
                            <li>商品需经乐酷淘仓库入库后再通过国际物流送达，此过程中兔头不进行商品检查鉴别，不承担品相问题的责任。</li>
                            <li>对于卖家拒绝交易、延迟发货、物流问题导致的商品丢失损坏等情况，兔头将在一定期限内协助催单或取消订单。</li>
                            <li>若商品配件缺失、入库商品与描述不符、破损程度与描述不一致等，请在收到入库返图或重量反馈后5天内（乐酷淘工作时间内）联系客服，兔头会协助与商家沟通，最终结果以商家处理为准。</li>
                            <li>平台默认用户在购买时已明晰商品所属状态，因此平台作为一个帮助日本国外买家和日本国内卖家沟通的购买通道，商品换货、卖家直接取消订单等没有让平台产生人工对应沟通成本的，平台不收取费用；商品申请取消让平台产生人工对应沟通成本的，按商品价格比例收取对应费（不满1000日元的收100日元），上述退货退款产生的费用，若卖家不承担，则由您承担。</li>
                         </ul>
                    </div>
                </section>
                
                <p className="text-center text-xs text-gray-400 mt-4 pt-4 border-t">因此，请充分了解相关购物风险，认真仔细阅读商品页面上的说明再进行选购。</p>
            </div>
        )
    },
    { 
        title: "Rakuma代购规则", 
        tags: ["规则", "代购", "Rakuma", "二手"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Rakuma 交易模式</h4>
                    <p className="mb-4 text-gray-600">在Rakuma平台上，商家主要提供以下两种交易模式供买家选择：</p>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h5 className="font-bold text-blue-800 mb-2">直接购入模式</h5>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-blue-700">
                                <li>买家可直接点击"立即购买"并完成支付</li>
                                <li>订单将在支付成功后自动成立</li>
                                <li>交易即时生效，无需卖家额外确认</li>
                            </ul>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <h5 className="font-bold text-purple-800 mb-2">申请购入模式</h5>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-purple-700">
                                <li>买家需先提交购买申请并完成支付</li>
                                <li>系统将向卖家发送购买请求</li>
                                <li>订单需经卖家确认后方可正式成立</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-800 text-xs space-y-2">
                         <h5 className="font-bold text-sm flex items-center gap-1"><AlertTriangle size={16}/> 特别注意</h5>
                         <p className="font-bold">买家在申请提交后无法单方面取消订单。</p>
                         <p>若出现以下情况，系统将自动取消订单（大约三天左右）：</p>
                         <ul className="list-disc pl-4 space-y-1">
                            <li>卖家拒绝购买申请</li>
                            <li>商品已售罄</li>
                            <li>商品已下架</li>
                         </ul>
                         <p className="mt-2 text-red-600">订单取消后，款项将全额原路退回买家账户。</p>
                    </div>
                </section>

                <p className="text-center text-xs text-gray-400 mt-4">建议买家仔细阅读交易规则以确保顺利购物，有疑问联系平台在线客服。</p>
            </div>
        )
    },
    { 
        title: "Teway+代购规则", 
        tags: ["规则", "代购", "Teway+", "迪士尼"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">一、平台概述</h4>
                    <p className="leading-relaxed">
                        Teway+（特惠优选）是多元化日本购物平台，是乐酷淘的官方合作伙伴之一。无论您是二次元爱好者、奢侈品收藏家、还是寻找独特商品的淘货达人或是追求高品质的宝妈，在Teway+您都能轻松购入心仪的日本好物。
                    </p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">二、购前须知</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                        <p><span className="font-bold">① 规则遵守：</span>在Teway+站点购物须遵守Teway+卖家的出售规则，下单前阅读商品相关购物说明。</p>
                        <p><span className="font-bold">② 订单不可取消：</span>任何通过本平台成功下单的订单，不可因为自身原因而取消订单。因此用户于付款前，请再三确认自己的购买意向和所购商品是否正确再进行下单。</p>
                        <p><span className="font-bold">③ 缺货处理：</span>商品部分缺货：平台将通过「工单服务」提前告知缺货详情及运费变动，并确认您是否同意“先发有货商品”。请在收到通知后及时回复。</p>
                        <p><span className="font-bold">④ 二手品说明：</span>Teway+站点的部分商品为二手物品，购买前请仔细甄别。二手物品可能存在使用痕迹、老化等情况。乐酷淘不对商品进行任何确认和鉴定服务，商品情况需要用户根据返图或重量图自行甄别。</p>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">三、下单方式</h4>
                    <div className="space-y-2">
                         <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                             <span className="font-bold text-gray-800 block mb-1">路径一</span>
                             <span className="text-gray-600">通过APP首页-下拉点击【Teway+】图标进入站点，筛选商品品类。进入商品详情页，进行自助下单操作。</span>
                         </div>
                         <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                             <span className="font-bold text-gray-800 block mb-1">路径二</span>
                             <span className="text-gray-600">通过平台内【搜索栏】输入商品名称，并选择【Teway+】搜索站内相关商品。进入商品详情页，进行自助下单操作。</span>
                         </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">四、代购手续费</h4>
                    <p className="mb-2 text-xs text-gray-500">本站点仅支持优购，收费标准如下：</p>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800 text-xs">
                        <div>1000日元及以下固收：<span className="font-bold">50日元</span></div>
                        <div>1001-1999日元之间固收：<span className="font-bold">5%</span></div>
                        <div>2000-4999日元之间固收：<span className="font-bold">4%</span></div>
                        <div>5000-14999日元之间固收：<span className="font-bold">3%</span></div>
                        <div className="col-span-1 md:col-span-2 text-green-600 font-bold">15000日元及以上固收：0手续费</div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">五、日本国内运费</h4>
                    <p className="mb-3">是否包邮以及选择哪种物流由卖家决定，请注意查看商品详情页及结算页面费用明细。</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
                        <li><span className="font-bold text-gray-800">邮费到付商品：</span>需要您承担日本时段的相关运费，乐酷淘会在仓库收到货后会向您收取，不再计算在国际运费中。</li>
                        <li><span className="font-bold text-gray-800">卖家包邮的商品：</span>运费由卖家承担，如果出现包邮商品因卖家原因造成日本国内配送运费不足的，其中差价由买家承担。</li>
                        <li><span className="font-bold text-gray-800">特别说明：</span>即使同时购买同一店铺内的多件商品，也会存在分开配送的情况，可能产生多次运费，具体以实际情况为准。</li>
                    </ul>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-2">
                        <div className="bg-pink-50 px-4 py-2 font-bold text-pink-700 border-b border-pink-100">迪士尼店铺运费参考</div>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="p-3 border-b">发货来源</th>
                                    <th className="p-3 border-b">岛内运费</th>
                                    <th className="p-3 border-b">免运费门槛</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="p-3 font-bold text-gray-800 align-top">迪士尼商店</td>
                                    <td className="p-3 align-top">
                                        <div className="mb-1">一般运费：837日元</div>
                                        <div className="text-xs text-gray-500 bg-white border border-gray-100 p-1.5 rounded">
                                            <span className="font-bold">符合条件的订单：</span><br/>
                                            自动选择「宅急便」发货，运费380日元
                                        </div>
                                    </td>
                                    <td className="p-3 text-green-600 font-bold align-top">满6000日元</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-bold text-gray-800 align-top">东京迪士尼商店</td>
                                    <td className="p-3 align-top">1000日元</td>
                                    <td className="p-3 text-green-600 font-bold align-top">满10000日元</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1 pl-1">
                        <p>1. 分店发货：不同商店的商品将分开发货，需支付相应运费。</p>
                        <p>2. 运费差异：因发货地、快递公司、商品的不同，运费及配送方式会有差异，以实际产的生费用为准。</p>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">六、国际物流运费</h4>
                    <p className="text-gray-600">国际物流费用=国际运费+打包箱子费用</p>
                    <div className="mt-2 bg-gray-50 p-2 rounded text-xs text-gray-500">
                        线路详情可查阅：【用户手册-国际物流】、【用户手册-品类专线】
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">七、售后服务</h4>
                    <div className="space-y-3">
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-xs text-red-700">
                            <span className="font-bold block mb-2 text-sm flex items-center gap-1"><AlertTriangle size={14}/> 重要声明</span>
                            <p className="mb-2">✦ 通过本平台成功下单的订单，不可因为自身原因而取消订单。因此用户于付款前再三确认自己购买意向和所购商品是否正确再进行下单。</p>
                            <p className="mb-2">✦ 在您下单前，请务必了解本平台特性：日本境内无“七天无理由退换货”的说法。平台默认用户在购买时已明晰商品所属状态，不承担商品的任何品相问题的责任。</p>
                        </div>
                        
                        <div className="space-y-2 text-gray-600 text-xs pl-2">
                             <p>✦ <span className="font-bold">环境敏感商品：</span>部分商品的材质对环境敏感，如长期存放，可能出现发霉、变质、异味等情况。建议您尽早安排运回。因保管时间过长或气候因素导致的状态变化，恕不承担责任。</p>
                             <p>✦ <span className="font-bold">取消费用：</span>商品换货、卖家直接取消订单等没有让平台产生人工对应沟通成本的，平台不收取费用；让平台产生人工对应沟通成本的，将收取对应费：订单价格（含岛内运费）的10%（包含7%平台人工处理费+3%第三方支付平台手续费），不足1000日元的商品固收100日元。</p>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-900 text-xs">
                             <h5 className="font-bold mb-2">Teway+售后特殊说明</h5>
                             <p className="leading-relaxed">
                                用户需在收到商品入库返图后<span className="font-bold text-red-600 text-sm">6小时</span>完成订单确认操作。如确认存在错发、漏发、商品缺陷等问题，请在6小时内联系平台客服，并提供有效凭证。平台将发送邮件咨询官方的处理流程，并协助处理争议。商品入库返图超过6小时，平台将不再做任何应对，默认用户无异议。
                             </p>
                        </div>

                        <div className="text-xs text-gray-500">
                             <p className="mb-1">✦ 由于物流运输涉及国际物流和清关环节，乐酷淘无法保证所有的商品在收到时呈现完美状态。如您的商品在运输中出现损坏或者遗失，您可以联系物流承运方和在线客服。</p>
                             <p>✦ 申请售后必须提供完整的开箱视频，我们将根据视频内容处理您的售后申请或协助您向承运快递方进行赔偿。（无完整有效开箱将无法受理售后申请）</p>
                             <p className="mt-2 text-blue-500">详细售后服务，请查阅用户手册-《售后服务》。</p>
                        </div>
                    </div>
                </section>
                
                <p className="text-center text-xs text-gray-400 mt-6 pt-4 border-t">请充分了解相关购物风险，认真仔细阅读商品页面上的说明再进行选购。</p>
            </div>
        )
    },
    { 
        title: "ZOZOTOWN代购规则", 
        tags: ["规则", "代购", "服装", "时尚"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">一、平台概述</h4>
                    <p className="leading-relaxed">
                        ZOZOTOWN是日本最大的时尚购物平台之一，它汇聚了来自日本和国际的众多品牌，为用户提供丰富多样的时尚商品。它以销售时尚和生活方式产品为主，包括服装、鞋类、配饰、化妆品以及家居用品等，是日本本土年轻人最喜爱的购物平台之一。
                    </p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">二、下单方式</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                       <p><span className="font-bold">• 路径1：</span>app【首页】- 下拉点击【ZOZOTOWN】图标进入站点，筛选商品品类精确浏览相关商品</p>
                       <p><span className="font-bold">• 路径2：</span>站内【搜索栏】在输入商品-点击【其他站点】-选择【ZOZOTOWN】图标搜索相关商品，进入选择的商品的详情页进行下单操作</p>
                    </div>
                </section>

                <section>
                     <h4 className="font-bold text-gray-900 text-lg mb-2">三、商品购买说明</h4>
                     <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-900 space-y-2 text-xs">
                        <p>• 乐酷淘是代购日本官方网站出售的商品，由ZOZOTOWN保证商品的质量和真伪，而中古商品均来源于个人，乐酷淘及ZOZOTOWN官网无法为您保证商品品相以及是否正品，乐酷淘仅提供协助邮件服务，请谨慎购买，一经下单，平台默认用户在购买时已明晰商品所属状态。</p>
                        <p>• 中古商品通常会有使用痕迹、划痕、污渍、外盒变形、卡口有松动或其他卖家说明的其他问题，由于上述中古商品常见的折旧现象不属于商品的质量问题，平台不承担任何从ZOZOTOWN购买商品的任何品相问题的责任，不接受任何情况下的单方面要求取消订单退款的要求。</p>
                     </div>
                </section>

                <section>
                     <h4 className="font-bold text-gray-900 text-lg mb-2">四、日本国内配送规则</h4>
                     <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li><span className="font-bold text-gray-800">标准运费：</span>所有日本国内订单统一收取 330日元（含税） 的配送费。</li>
                        <li><span className="font-bold text-gray-800">即日配送：</span>（限特定地区）满足条件的订单可选择即日配送服务，需额外支付 350日元（含税）。</li>
                        <li><span className="font-bold text-gray-800">配送方式：</span>ZOZOTOWN 使用 Yamato 运送服务（如宅急便、ネコポス、EAZY 等），用户不可指定具体方式。</li>
                        <li><span className="font-bold text-gray-800">配送时间：</span>通常发货后 1～3 日内送达（冲绳及偏远地区 2～5 日）。如果超过14天还未发货或乐酷淘日本仓库还未收到相关商品，可联系在线客服咨询。预售商品，发货时间通常会在商品详情页显示。</li>
                        <li>非现货商品（预售商品、订购商品、店铺直送商品、福袋商品、其他特殊商品等）由于需要单独发货，将会额外计算日本运费。</li>
                        <li>若是到付商品，平台会事先预收330日元的日本国内运费，最终运费会在商品入库后采用“多退少补”方式原路退回。</li>
                     </ul>
                     <p className="mt-2 text-xs text-gray-400">* 上述费用及时间仅适用于日本国内，不含国际转运及其他服务费用。</p>
                </section>

                <section>
                     <h4 className="font-bold text-gray-900 text-lg mb-2">五、留言议价</h4>
                     <p className="text-gray-600">目前该站点暂不支持议价和任何留言服务。</p>
                </section>

                <section>
                     <h4 className="font-bold text-gray-900 text-lg mb-2">六、退货退款</h4>
                     <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-800 space-y-2 text-xs">
                         <p className="font-bold mb-1">⚠️ 重要提示：</p>
                         <ul className="list-disc pl-4 space-y-1">
                            <li>通过本平台成功下单的订单，不可因为自身原因而取消订单。因此您在付款前再三确认自己购买意向和所购商品是否正确再进行下单。</li>
                            <li>平台不承担任何从ZOZOTOWN购买商品的任何品相问题的责任，不接受任何情况下的单方面要求取消订单退款的要求。</li>
                            <li>商品需经乐酷淘仓库入库后再通过国际物流送达，此过程中兔头不进行商品检查鉴别，不承担品相问题的责任。</li>
                            <li>对于卖家拒绝交易、延迟发货、物流问题导致的商品丢失损坏等情况，兔头将在一定期限内协助催单或取消订单。</li>
                            <li>若商品配件缺失、入库商品与描述不符、破损程度与描述不一致等，请在收到入库返图或重量反馈后5天内(乐酷淘工作时间内)联系在线客服，提交问题说明及相关材料反馈，兔头会协助与商家沟通，最终结果以商家处理为准，逾期视为无异议，商品自动确认收货后，平台不予受理。</li>
                            <li>平台默认用户在购买时已明晰商品所属状态，因此平台作为一个帮助日本国外买家和日本国内卖家沟通的购买通道，商品换货、卖家直接取消订单等没有让平台产生人工对应沟通成本的，平台不收取费用;商品申请取消让平台产生人工对应沟通成本的，按商品价格比例收取对应费(不满1000日元的收100日元)，上述退货退款产生的费用，若卖家不承担，则由您承担。</li>
                         </ul>
                     </div>
                </section>
                
                <p className="text-center text-xs text-gray-400 mt-4">因此，请充分了解相关购物风险，认真仔细阅读商品页面上的说明再进行选购。</p>
            </div>
        )
    },
    { 
        title: "骏河屋代购规则", 
        tags: ["规则", "代购", "二手", "骏河屋"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">一、平台概述</h4>
                    <p className="leading-relaxed mb-2">
                        骏河屋是日本知名的中古（二手）网站，骏河屋在日本各地都有分店，在回收中古商品的同时也会贩卖中古品，网站主营动漫周边·游戏·图书·DVD· CD·集换卡·手办模型。
                    </p>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-xs">
                        由于是中古商品，通常价格会比新品便宜很多，经常会有意想不到的好价格，但其真实情况复杂，无法享受全程购物保障计划、平台不承担任何从骏河屋购买拍品的任何品相问题的责任，平台默认用户在购买时已明晰商品所属状态。
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">二、下单方式</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">① 页面导航下单</span>
                            <span className="text-gray-600">点击【骏河屋】图标进入站点，按品类筛选心仪商品，进入商品详情页，进行自助下单操作。</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">② 站内搜索下单</span>
                            <span className="text-gray-600">通过平台内搜索栏输入商品名称，并选择【骏河屋】作为搜索范围。查找相关商品后进入详情页，进行自助下单操作。</span>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">三、费用构成</h4>
                    <p className="mb-2 text-xs text-gray-500">用户在购买同一店铺的商品并达到一定金额后，才可享受相应档次的手续费或运费。</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <span className="font-bold text-blue-900 block mb-2">① 骏河屋手续费 (通信贩卖手续费)</span>
                            <ul className="space-y-1 text-blue-800 text-xs">
                                <li>订单总金额 &lt; 5000日元 ➜ <span className="font-bold">240日元</span></li>
                                <li>订单总金额 ≥ 5000日元 ➜ <span className="font-bold">0手续费</span></li>
                            </ul>
                            <p className="mt-2 text-[10px] text-blue-600">*骏河屋手续费不等同于乐酷淘平台手续费，骏河屋手续费由骏河屋收取。</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <span className="font-bold text-orange-900 block mb-2">② 骏河屋本店日本国内运费</span>
                            <ul className="space-y-1 text-orange-800 text-xs">
                                <li>订单总金额 &lt; 1000日元 ➜ <span className="font-bold">运费440日元</span></li>
                                <li>订单总金额 &lt; 1500日元 ➜ <span className="font-bold">运费385日元</span></li>
                                <li>订单总金额 ≥ 1500日元 ➜ <span className="font-bold">免运费</span></li>
                            </ul>
                            <p className="mt-2 text-[10px] text-orange-600">*预售商品和第三方店铺商品的运费另算，目前暂不开放。</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">四、订单沟通</h4>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>如骏河屋就订单问题（如商品库存、运费等）发起沟通，我们将通过站内信通知用户。请您及时查看并直接回复，以便我们准确传达您的处理意见。</li>
                        <li>若您未在有效期内回复，我们将遵循骏河屋官方流程处理，订单可能被骏河屋官方取消。最终处理结果将以骏河屋官方的判断为准，敬请谅解。</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">五、发货时间</h4>
                    <div className="space-y-2">
                        <p><span className="font-bold">① 发货速度：</span>骏河屋的发货普遍较慢，通常为下单后的1~8天左右，繁忙期可能会延长至9~15天，需要用户耐心等待。</p>
                        <p><span className="font-bold">② 缺货取消：</span>由于骏河屋线上线下同时贩卖商品的特性，可能会存在下单成功后被骏河屋取消订单的情况，当该情况发生时，平台会在1~2个工作日内进行退款。</p>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">六、退货退款</h4>
                    <div className="space-y-4">
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-xs">
                            <span className="font-bold block mb-1">⚠️ 下单须知</span>
                            通过本平台成功下单的订单，不可因为自身原因而取消订单。因此用户于付款前再三确认自己购买意向和所购商品是否正确在进行下单。但骏河屋有任何订单部分取消的情况下，用户可联系客服要求退回订单金额，但涉及的手续费无法退回。
                        </div>

                        <p className="text-xs text-gray-500">大部分情况下，骏河屋的商品图片并非实拍，购买时仅供参考，商品入库时也无法以与商品图片不符为由申请退货退款。</p>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h5 className="font-bold text-gray-900 mb-2">骏河屋商品入库图规则</h5>
                            <ul className="list-disc pl-5 space-y-1 text-gray-600 text-xs">
                                <li><span className="font-bold">优购商品：</span>提供一张商品番号条码返图，若商品包含纳品书，则额外拍摄纳品书清单返图。（如无商品番号条码，则按优购标准提供一张商品正面返图）</li>
                                <li><span className="font-bold">折扣购商品：</span>提供一张过秤图，若包含纳品书则额外拍摄纳品书清单返图。</li>
                                <li><span className="font-bold">特殊情况：</span>如商品番号条码返图被遮挡，需要拆封返图的，加收1个条码100日元处理费。</li>
                            </ul>
                        </div>

                        <div className="space-y-3 text-xs text-gray-700">
                            <p>
                                骏河屋为中古商品贩售网站，中古商品通常会有使用痕迹、划痕、污渍、外盒变形、卡口有松动或其他卖家说明的其他问题，由于上述中古商品常见的折旧现象不属于商品的质量问题，无法享受全程购物保障计划、平台不承担任何从骏河屋购买商品的任何品相问题的责任，不接受任何情况下的单方面要求取消订单退款的要求。
                            </p>
                            <p>
                                平台默认用户在购买时已明晰商品所属状态，因此平台作为一个帮助日本国外买家和日本国内卖家沟通的购买通道，商品换货、卖家直接取消订单等没有让平台产生人工对应沟通成本的，平台不收取费用；商品申请取消让平台产生人工对应沟通成本的，将收取对应费：订单价格（含岛内运费）的10%（包含7%平台人工处理费+3%第三方支付平台手续费），不足1000日元的商品固收100日元。
                            </p>
                        </div>

                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-red-700">
                            <span className="font-bold flex items-center gap-1 mb-1"><AlertTriangle size={12}/> 售后特殊说明</span>
                            用户需在收到商品入库返图后<span className="font-bold underline">5天内</span>完成确认操作。如确认存在错发、漏发等问题，请在5天内联系平台客服，并提供有效凭证。超过5天平台将不再做任何应对，默认用户无异议。
                        </div>
                    </div>
                </section>

                <p className="text-center text-xs text-gray-400 mt-4">请充分了解相关购物风险，认真仔细阅读商品页面上的说明再进行选购。</p>
            </div>
        )
    },
    { title: "煤炉拍卖代购规则", tags: ["规则", "拍卖", "Mercari"] },
    { title: "雅虎日拍代购规则", tags: ["规则", "拍卖", "Yahoo"] },
  ];

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return manualData;
    const lowerQuery = searchQuery.toLowerCase();
    return manualData.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) || 
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, manualData]);

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleCopyQQ = (qq: string) => {
    navigator.clipboard.writeText(qq);
    alert(`已复制QQ群号: ${qq}\n请打开QQ搜索群号加入`);
  };

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText('乐酷淘');
    alert('已复制公众号名称 "乐酷淘" \n请打开微信粘贴搜索');
  };

  const jpPlatforms: Platform[] = [
    { 
      name: 'らしんばん', 
      brand: 'LASHIN', 
      color: 'bg-blue-50', 
      textColor: 'text-blue-500',
      logoUrl: 'https://i.postimg.cc/y84d1NtV/Lashinbang-Logo.png',
      description: 'Lashinbang (指南针) 是日本知名的二手动漫周边连锁店，被誉为“御宅族的宝库”。这里汇集了海量的动画BD/DVD、CD、同人志、手办模型、声优周边以及各类动漫角色精品。对于喜欢淘货的二次元爱好者来说，这里绝对是寻找绝版珍藏和高性价比好物的天堂。',
      url: 'https://shop.lashinbang.com/?gad_source=1&gad_campaignid=22118993904&gbraid=0AAAAACbiS-yuxqjn8TGp2O4orhqjZvXRh&gclid=Cj0KCQiAx8PKBhD1ARIsAKsmGbeZnwwInDXMSClAZNhcRxN2zbrSpuPdKQ58imyQeGC0EVlYbQW6dzkaAmgUEALw_wcB',
      features: ['二次元综合商城', '绝版周边', '同人志/CD', '性价比极高'],
      tips: 'Lashinbang 经常会有价格非常实惠的未拆封二手商品（新古品），是淘宝捡漏的好去处。'
    },
    { 
      name: '雅虎日拍', 
      brand: 'YAHOO!', 
      color: 'bg-red-50', 
      textColor: 'text-red-600',
      logoUrl: 'https://i.postimg.cc/x88J2tWc/雅虎拍卖.png',
      description: '日本最大的在线拍卖平台，不仅有商家出售的新品，更有大量个人卖家出售的绝版珍藏。无论是手办、游戏卡牌还是古董，这里往往能找到其他地方买不到的稀有物品。',
      url: 'https://auctions.yahoo.co.jp/',
      features: ['全日本最大拍卖场', '绝版稀有物', '自动出价系统', '捡漏圣地'],
      tips: '竞拍结束前5-10分钟是出价高峰期，建议避免极限操作。'
    },
    { 
      name: '楽天市場', 
      brand: 'RAKUTEN', 
      color: 'bg-red-50', 
      textColor: 'text-red-700',
      logoUrl: 'https://i.postimg.cc/sxxQrwt1/乐天市场.png',
      description: '日本乐天市场是日本最大的综合性电商平台之一，入驻店铺众多，商品种类涵盖衣食住行各个方面。对于海淘用户来说，是购买日本本土品牌、美妆护肤、零食特产的首选之地。',
      url: 'https://www.rakuten.co.jp/',
      features: ['综合性商城', '官方旗舰店入驻', '定期大促活动', '品类齐全'],
      tips: '乐天市场店铺众多，常有“乐天Super Sale”等大型促销活动。很多店铺提供满额日本国内包邮服务，适合凑单购买。'
    },
    { 
      name: 'Mandarake', 
      brand: 'MANDA', 
      color: 'bg-orange-50', 
      textColor: 'text-orange-600',
      logoUrl: 'https://i.postimg.cc/3NN4TnP0/M店.png',
      description: 'Mandarake 是全球知名的二手动漫神店，被誉为“御宅族的圣地”。拥有极其专业的鉴定团队，库存涵盖了几十年前的古董玩具到最新的动漫周边，特别是特摄、昭和玩具和原画手稿方面极具权威。',
      url: 'https://order.mandarake.co.jp/order/',
      features: ['专业鉴定', '古董玩具', '全球知名', '库存庞大'],
      tips: 'Mandarake 的库存更新非常快，看到心仪的稀有物品建议立即下单，否则手慢无。'
    },
    { 
      name: 'アニメイト', 
      brand: 'ANIMATE', 
      color: 'bg-blue-50', 
      textColor: 'text-blue-600',
      logoUrl: 'https://i.postimg.cc/Y00GHbJW/A店.png',
      description: 'Animate 是日本最大的动漫周边、漫画、游戏专卖店。这里有最新的动漫周边预约、独家限定特典以及各种线下活动周边。是购买官方正版周边（谷子）的首选。',
      url: 'https://www.animate-onlineshop.jp/',
      features: ['官方正版周边', '独家特典', '最新预约', '全国连锁'],
      tips: '很多热门动漫周边的预售都有Animate限定特典，预订时请务必确认特典信息。'
    },
    { 
      name: 'Rakuma', 
      brand: 'RAKUMA', 
      color: 'bg-red-50', 
      textColor: 'text-red-500',
      logoUrl: 'https://i.postimg.cc/D00JTBtb/rakuma.png',
      description: 'Rakuma 是日本乐天旗下的二手闲置交易APP（原Fril）。相比Mercari，Rakuma的手续费较低，因此很多卖家愿意在这里以更优惠的价格出售商品，是淘二手好物的另一个优质选择。',
      url: 'https://fril.jp/',
      features: ['乐天旗下', '手续费低', '女性用户多', '时尚美妆'],
      tips: '由于和乐天积分互通，有时会有专门针对Rakuma的优惠券发放，购物前记得查看。'
    },
    { 
      name: '駿河屋', 
      brand: 'SURUGA', 
      color: 'bg-blue-50', 
      textColor: 'text-blue-700',
      logoUrl: 'https://i.postimg.cc/D00JTBt0/骏河屋.jpg',
      description: '骏河屋以“收购价格高、销售价格低”著称，拥有极其庞大的二手ACG商品库存，从游戏光盘、书籍到杂货周边应有尽有。特别是其“福袋”文化，深受玩家喜爱。',
      url: 'https://www.suruga-ya.jp/',
      features: ['超低价格', '库存海量', '福袋文化', '发货稍慢'],
      tips: '骏河屋发货速度相对较慢（以慢著称），购买时请做好等待的心理准备，但价格绝对真香。'
    },
    { 
      name: '京アニ', 
      brand: 'KYOANI', 
      color: 'bg-pink-50', 
      textColor: 'text-pink-500',
      logoUrl: 'https://i.postimg.cc/gjjXWNfJ/京ani.png',
      description: '京都动画（京阿尼）的官方在线商店。这里独家销售京阿尼制作的动画作品（如《紫罗兰永恒花园》、《Free!》、《吹响吧！上低音号》等）的原画集、设定资料集和官方周边。',
      url: 'https://kyoanishop.com/',
      features: ['官方直营', '原画设定集', '精美作画', '独家商品'],
      tips: '京阿尼的原画集非常抢手，且往往会有再版周期，遇到有货建议直接入手收藏。'
    },
    { 
      name: '雅虎闲置', 
      brand: 'PAYPAY', 
      color: 'bg-red-50', 
      textColor: 'text-red-500',
      logoUrl: 'https://i.postimg.cc/Vvvr8D3r/雅虎闲置.png',
      description: 'Yahoo! Japan 推出的二手交易APP，深度整合 PayPay 支付。相比雅虎拍卖的竞价模式，这里采用一口价模式，购买更加直接快速。',
      url: 'https://paypayfleamarket.yahoo.co.jp/',
      features: ['一口价交易', 'PayPay整合', '周末优惠券', '操作便捷'],
      tips: '平台经常在周末发放折扣优惠券，是周末捡漏的好时机。'
    },
    { 
      name: 'ZOZOTOWN', 
      brand: 'ZOZO', 
      color: 'bg-gray-100', 
      textColor: 'text-black',
      logoUrl: 'https://i.postimg.cc/J00DLP9J/zozotown.png',
      description: 'ZOZOTOWN 是日本最大的时尚潮流购物网站。汇集了数千个品牌，从高端潮牌到平价快时尚应有尽有。特别是日系穿搭爱好者，这里是获取最新日本潮流资讯和单品的最佳平台。',
      url: 'https://zozo.jp/',
      features: ['日本最大潮牌', '品牌齐全', '二手古着', '潮流风向标'],
      tips: 'ZOZOTOWN 的二手区（ZOZOUSED）往往能淘到成色极好的品牌古着，价格却只有原价的一小部分。'
    },
    { 
      name: 'メルカリ', 
      brand: 'MERCARI', 
      color: 'bg-red-50', 
      textColor: 'text-red-500',
      logoUrl: 'https://i.postimg.cc/900RhJvQ/download.png',
      description: 'Mercari（煤炉）是日本最大的二手闲置交易平台，被称为“日本闲鱼”。每天有数百万件商品上架，流量巨大，是寻找绝版周边、明星小卡、二手电子产品的最佳去处。',
      url: 'https://jp.mercari.com/',
      features: ['日本闲鱼', '流量巨大', '捡漏神地', '秒切助手'],
      tips: '热门商品在煤炉上往往是“秒没”，建议配合乐酷淘的极速秒切功能使用。'
    }
  ];

  const handlePlatformClick = (platform: Platform) => {
      if (platform.url || platform.description) {
          scrollPositionRef.current = window.scrollY;
          setSelectedPlatform(platform);
      } else {
          alert(`${platform.name} 功能即将上线，敬请期待！`);
      }
  };

  const logistics = [
    { name: '日本邮政', brand: 'JP POST', color: 'bg-red-50', textColor: 'text-red-600' },
    { name: '顺丰速运', brand: 'SF', color: 'bg-gray-900', textColor: 'text-yellow-500' },
    { name: '京东物流', brand: 'JD', color: 'bg-blue-50', textColor: 'text-blue-600' },
    { name: '圆通速递', brand: 'YTO', color: 'bg-purple-50', textColor: 'text-purple-600' },
    { name: '申通快递', brand: 'STO', color: 'bg-orange-50', textColor: 'text-orange-600' }
  ];

  // Render Logic for Article Detail
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
             {/* Show Logistics Disclaimer Globally for all articles */}
             {LogisticsDisclaimer}
             <div className="prose prose-yellow max-w-none text-gray-700">
                {selectedArticle.content || <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed"><FileText size={48} className="mb-3 opacity-20" /><p>该文档暂无详细内容</p></div>}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Logic for Platform Detail
  if (selectedPlatform) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10 shadow-sm">
            <button onClick={() => setSelectedPlatform(null)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="font-bold text-lg text-gray-900 truncate flex-1">平台详情</h1>
          </div>
  
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-3xl mx-auto w-full">
             <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-5 mb-8">
                     {selectedPlatform.logoUrl ? (
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-black/5 overflow-hidden p-2">
                             <img src={selectedPlatform.logoUrl} alt={selectedPlatform.brand} className="w-full h-full object-contain" />
                        </div>
                     ) : (
                        <div className={`w-20 h-20 ${selectedPlatform.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-black/5`}>
                             <span className={`text-base font-black ${selectedPlatform.textColor} text-center leading-tight`}>{selectedPlatform.brand}</span>
                        </div>
                     )}
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedPlatform.name}</h2>
                        <div className="flex gap-2">
                             <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">日本直邮</span>
                             <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">官方代购</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                     <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Info size={20} className="text-yellow-500"/> 关于平台
                     </h3>
                     <p className="text-gray-600 leading-relaxed font-medium">
                         {selectedPlatform.description || "暂无详细介绍。"}
                     </p>
                </div>

                {selectedPlatform.features && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-yellow-500"/> 特色亮点
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {selectedPlatform.features.map((feature, idx) => (
                                <div key={idx} className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-yellow-600 shrink-0"/>
                                    <span className="text-sm font-bold text-gray-800">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedPlatform.tips && (
                     <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                        <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2 text-sm">
                            <LifeBuoy size={16}/> 乐酷淘小贴士
                        </h4>
                        <p className="text-sm text-blue-700 leading-relaxed">
                            {selectedPlatform.tips}
                        </p>
                    </div>
                )}
                
                {selectedPlatform.url && (
                    <a 
                        href={selectedPlatform.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-[#1a1a1a] text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-[0.98]"
                    >
                        前往官网浏览
                    </a>
                )}
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
                <img 
                  src="https://i.postimg.cc/2SPJfSYw/f0f60b19cc68204ff8ba86a3581291c1.jpg" 
                  alt="Logo" 
                  className="w-10 h-10 rounded-xl shadow-sm shrink-0 object-cover"
                />
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

                {/* 2. Social Cards - Top Right (Optimized) */}
                
                {/* Tencent Channel */}
                <a href="https://pd.qq.com/s/hgfi5uai6" target="_blank" className="col-span-1 bg-white rounded-[2rem] p-6 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden min-h-[220px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                    
                    <div className="flex justify-between items-start relative z-10">
                         {/* Brand Icon */}
                         <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100/50">
                            <MessageCircle size={28} />
                         </div>
                         
                         {/* Image */}
                         <img 
                            src="https://i.postimg.cc/wxhY9Pj6/QQ-pin-dao-Logo-svg.png" 
                            alt="Tencent Channel" 
                            className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm object-cover transition-all duration-300 rotate-3 group-hover:rotate-6 group-hover:scale-105" 
                         />
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h3 className="font-bold text-xl text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">腾讯频道</h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">乐酷淘兔头官方社区</p>
                         <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            立即加入 <ChevronRight size={12} />
                        </div>
                    </div>
                </a>

                {/* Xiaohongshu */}
                <a href="https://xhslink.com/m/2fmVl9ENOQb" target="_blank" className="col-span-1 bg-white rounded-[2rem] p-6 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden min-h-[220px]">
                     <div className="absolute inset-0 bg-gradient-to-br from-transparent to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                    
                    <div className="flex justify-between items-start relative z-10">
                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-red-100/50">
                             <Heart size={28} />
                        </div>
                        
                        {/* Image */}
                        <img 
                           src="https://i.postimg.cc/3xGcZ04z/xiaohongshu-logo-png-seeklogo-557258.png" 
                           alt="Xiaohongshu" 
                           className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm object-cover transition-all duration-300 -rotate-3 group-hover:-rotate-6 group-hover:scale-105" 
                        />
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h3 className="font-bold text-xl text-gray-900 leading-tight group-hover:text-red-600 transition-colors">小红书</h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">发现好物分享</p>
                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-red-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            去看看 <ChevronRight size={12} />
                        </div>
                    </div>
                </a>

                {/* 3. Weibo Card (New Position) */}
                <a href="https://weibo.com/u/6977355074" target="_blank" className="col-span-1 bg-white rounded-[2rem] p-6 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden min-h-[220px]">
                     <div className="absolute inset-0 bg-gradient-to-br from-transparent to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                    
                    <div className="flex justify-between items-start relative z-10">
                         <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-orange-100/50">
                            <Globe size={28} />
                        </div>
                        
                        <img 
                           src="https://i.postimg.cc/G9w50bZn/2111599.png" 
                           alt="Weibo" 
                           className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm object-cover transition-all duration-300 rotate-2 group-hover:rotate-4 group-hover:scale-105" 
                        />
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h3 className="font-bold text-xl text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">官方微博</h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">关注获取最新资讯</p>
                         <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            关注我们 <ChevronRight size={12} />
                        </div>
                    </div>
                </a>

                {/* 4. Logistics Card (Restored) */}
                <div className="col-span-1 bg-white rounded-[2rem] p-6 flex flex-col shadow-sm hover:shadow-lg transition-all group overflow-hidden h-full min-h-[220px]">
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
                <div className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-orange-100 relative overflow-hidden group shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                                <ShieldAlert size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-tight">防诈骗查询</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">乐酷淘安全中心 · 实时风险检测</p>
                            </div>
                        </div>

                        {/* Enhanced Input Area */}
                        <div className="bg-orange-50/50 p-2 rounded-2xl border border-orange-100 flex flex-col sm:flex-row gap-2 mb-6 transition-all hover:bg-orange-50 hover:border-orange-200 focus-within:ring-4 focus-within:ring-orange-100/50">
                             <div className="flex-1 flex items-center pl-4 py-1">
                                <Search className="text-orange-300 shrink-0 mr-3" size={24} />
                                <input 
                                    type="text" 
                                    placeholder="输入网址检测 (如: flypixes.click)" 
                                    value={scamInput}
                                    onChange={(e) => {
                                        setScamInput(e.target.value);
                                        setScamStatus('idle');
                                        setMatchedDomain(null);
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCheckScam()}
                                    className="w-full bg-transparent border-none text-lg font-bold text-gray-900 placeholder:text-gray-400 focus:ring-0 px-0"
                                />
                             </div>
                             <button 
                                onClick={handleCheckScam} 
                                className="bg-orange-500 hover:bg-orange-600 text-white font-black text-base px-8 py-3 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95 shrink-0"
                            >
                                立即查询
                            </button>
                        </div>
                        
                        {/* Dynamic Content: Results or Tips */}
                        {scamStatus !== 'idle' ? (
                            <div className={`p-5 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${scamStatus === 'danger' ? 'bg-red-50 border-2 border-red-100' : 'bg-green-50 border-2 border-green-100'}`}>
                                {scamStatus === 'danger' ? (
                                    <>
                                        <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0"><AlertTriangle size={24} /></div>
                                        <div>
                                            <h4 className="text-lg font-black text-red-700 mb-1">高风险警示！检测到诈骗域名</h4>
                                            {matchedDomain && <p className="text-sm font-bold bg-white/50 text-red-800 px-2 py-1 rounded inline-block">匹配黑名单: {matchedDomain}</p>}
                                            <p className="text-sm text-red-600 mt-2 font-medium">请勿进行任何转账或交易操作，避免财产损失。</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0"><ShieldCheck size={24} /></div>
                                        <div>
                                            <h4 className="text-lg font-black text-green-700 mb-1">暂无风险记录</h4>
                                            <p className="text-sm text-green-600 font-medium">该域名未在乐酷淘黑名单中。请依然保持警惕，注意核实。</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="mt-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">常见诈骗特征 / HIGH RISK FEATURES</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 hover:bg-white hover:shadow-sm transition-all">
                                        <Ban size={20} className="text-orange-400" />
                                        <span className="text-xs font-bold text-gray-600">页面制作粗糙</span>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 hover:bg-white hover:shadow-sm transition-all">
                                        <ImageOff size={20} className="text-orange-400" />
                                        <span className="text-xs font-bold text-gray-600">盗用其他网站图片</span>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 hover:bg-white hover:shadow-sm transition-all">
                                        <CreditCard size={20} className="text-orange-400" />
                                        <span className="text-xs font-bold text-gray-600">仅支持转账</span>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 hover:bg-white hover:shadow-sm transition-all">
                                        <Percent size={20} className="text-orange-400" />
                                        <span className="text-xs font-bold text-gray-600">异常的折扣</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <ShieldAlert size={140} className="text-orange-500 -rotate-12" />
                    </div>
                </div>

                {/* 6. Official Account (WeChat) - Copy to Clipboard Enabled */}
                <div className="md:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden flex flex-col justify-between h-full">
                    <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                                <QrCode size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 leading-none mb-2">官方公众号</h3>
                                <div className="flex items-center gap-2 text-base text-gray-500 font-medium">
                                    微信搜索：
                                    <button 
                                        onClick={handleCopyWeChat}
                                        className="bg-green-50 text-green-700 px-3 py-1 rounded-lg font-bold border border-green-100 hover:bg-green-100 hover:border-green-200 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer group/btn"
                                        title="点击复制公众号名称"
                                    >
                                        乐酷淘
                                        <Copy size={14} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-green-200 transition-colors">
                                <div className="bg-white text-green-600 text-sm font-black px-3 py-1.5 rounded-lg shadow-sm h-fit shrink-0 border border-green-100">01</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">账号绑定</h4>
                                    <p className="text-gray-600 font-medium leading-relaxed">
                                        点击H5网页版登录后，在 <span className="text-gray-900 font-extrabold bg-white px-1.5 rounded shadow-sm">【我的】-【更多设置】-【绑定微信】</span>。
                                    </p>
                                </div>
                            </div>
                             <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-green-200 transition-colors">
                                <div className="bg-white text-green-600 text-sm font-black px-3 py-1.5 rounded-lg shadow-sm h-fit shrink-0 border border-green-100">02</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">极速秒切 & 通知</h4>
                                    <p className="text-gray-600 font-medium leading-relaxed text-sm">
                                        绑定后发送 <span className="text-gray-900 font-extrabold bg-white px-1.5 rounded shadow-sm">煤炉MID或链接</span>，系统扣除余额自动秒切（仅限煤炉个人卖家商品，不支持SHOP商品和拍卖商品）。公众号也会推送商品上新和入库等通知。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-100 border-dashed rounded-xl p-5 relative z-10">
                        <div className="flex gap-4 items-center">
                             <div className="bg-yellow-100 p-2 rounded-full shrink-0 text-yellow-600">
                                <AlertTriangle size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-yellow-800 text-sm uppercase tracking-wide mb-0.5">重要提示：余额不互通？</h4>
                                <p className="text-sm text-yellow-900 font-medium leading-relaxed">
                                    如遇异常，请检查 <span className="font-black underline decoration-yellow-500/50">H5端与APP端</span> 是否为同一账号，避免重复注册。
                                </p>
                             </div>
                        </div>
                    </div>
                    
                    {/* Decorative BG */}
                    <div className="absolute -right-6 -bottom-6 text-green-50 opacity-50 pointer-events-none">
                        <QrCode size={180} />
                    </div>
                </div>

                {/* 7. Help Center */}
                <div className="md:col-span-2 bg-white rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col h-full">
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
                    <div className="h-96 lg:flex-auto overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {filteredArticles.length > 0 ? filteredArticles.map((item, index) => (
                            <button key={index} onClick={() => {
                                scrollPositionRef.current = window.scrollY;
                                setSelectedArticle(item);
                            }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
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
                    <button onClick={() => handleCopyQQ('850815830')} className="bg-white rounded-[2rem] p-6 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all group text-left w-full">
                         <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                         </div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">QQ群1</p>
                         <h3 className="text-2xl font-black text-gray-900 group-hover:text-sky-600 transition-colors">850815830</h3>
                         <div className="text-xs font-bold text-yellow-500 mt-4 flex items-center gap-1">点击复制群号 <Copy size={12}/></div>
                    </button>
                    {/* QQ 2 */}
                    <button onClick={() => handleCopyQQ('566807796')} className="bg-white rounded-[2rem] p-6 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all group text-left w-full">
                         <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                         </div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">QQ群2</p>
                         <h3 className="text-2xl font-black text-gray-900 group-hover:text-sky-600 transition-colors">566807796</h3>
                         <div className="text-xs font-bold text-yellow-500 mt-4 flex items-center gap-1">点击复制群号 <Copy size={12}/></div>
                    </button>
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
                            <button onClick={() => handleSendEmail('work@lekutao.cn')} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors text-left group">
                                <Briefcase size={16} className="text-gray-400 group-hover:text-yellow-600" />
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400">商务合作</div>
                                    <div className="text-sm font-bold text-gray-900">work@lekutao.cn</div>
                                </div>
                            </button>
                            <button onClick={() => handleSendEmail('support@lekutao.cn')} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors text-left group">
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: '华为下载', brand: 'Huawei', color: 'bg-red-50', textColor: 'text-[#E60012]', url: 'https://appgallery.huawei.com/app/C110442015', iconUrl: 'https://i.postimg.cc/658q8KJB/20211215073714-Huawei-App-Gallery-svg.png' },
                            { name: '小米下载', brand: 'XIAOMI', color: 'bg-orange-50', textColor: 'text-[#FF6700]', url: 'https://app.mi.com/details?id=com.xumei.lekutao', iconUrl: 'https://i.postimg.cc/5jdrTTCG/download.png' },
                            { name: 'VIVO下载', brand: 'VIVO', color: 'bg-blue-50', textColor: 'text-[#0057FF]', url: 'https://detail-browser.vivo.com.cn/v115/index.html?appId=3789821&resource=301&source=2', iconUrl: 'https://i.postimg.cc/wv0g9Hzp/download.png' },
                            { name: '应用宝下载', brand: 'YYB', color: 'bg-yellow-50', textColor: 'text-yellow-600', url: 'https://sj.qq.com/appdetail/com.xumei.lekutao', iconUrl: 'https://i.postimg.cc/fT4DZHnk/e68e6a94850887c5c758da76fcdb90c5-512-512.jpg' }
                        ].map(item => (
                            <a 
                                key={item.name} 
                                href={item.url || "#"} 
                                target={item.url ? "_blank" : "_self"}
                                rel={item.url ? "noopener noreferrer" : ""}
                                className="flex flex-col items-center group cursor-pointer"
                                onClick={(e) => !item.url && e.preventDefault()}
                            >
                                <BrandIcon text={item.brand} color={item.color} textColor={item.textColor} iconUrl={(item as any).iconUrl} />
                                <div className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-yellow-500 transition-colors">Download At</div>
                                <div className="font-bold text-sm text-gray-900">{item.name}</div>
                            </a>
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
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {jpPlatforms.map(platform => (
                            <PlatformCard key={platform.name} platform={platform} onClick={handlePlatformClick} />
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