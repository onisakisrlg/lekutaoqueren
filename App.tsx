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
    { title: "kyoani代购规则", tags: ["规则", "代购", "京阿尼"] },
    { title: "Mandarake代购规则", tags: ["规则", "代购", "二手"] },
    { title: "moponline代购规则", tags: ["规则", "代购", "奥特莱斯"] },
    { title: "Rakuten代购规则", tags: ["规则", "代购", "乐天"] },
    { title: "Rakuma代购规则", tags: ["规则", "代购", "Rakuma", "二手"] },
    { title: "Teway+代购规则", tags: ["规则", "代购", "Teway+", "迪士尼"] },
    { title: "ZOZOTOWN代购规则", tags: ["规则", "代购", "服装", "时尚"] },
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
    { 
        title: "罗针盘代购规则", 
        tags: ["规则", "代购", "罗针盘", "中古"],
        content: (
            <>
                <div className="space-y-6 text-sm text-gray-700">
                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">一、平台概述</h4>
                        <p className="leading-relaxed">
                            罗针盘（らしんばん）是日本知名的中古（二手）店铺，主营种类繁多，漫画，动画，手办，光碟，挂画，抱枕套，本子等等。
                        </p>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">二、下单方式</h4>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                            <div>
                                <span className="font-bold text-gray-900 block mb-1">① 页面导航下单</span>
                                <span className="text-gray-600">点击【罗针盘】图标进入站点，按品类筛选心仪商品，进入商品详情页，进行自助下单操作。</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block mb-1">② 站内搜索下单</span>
                                <span className="text-gray-600">通过平台内搜索栏输入商品名称，并选择【罗针盘】作为搜索范围。查找相关商品后进入详情页，进行自助下单操作。</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">三、购前须知</h4>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><span className="font-bold text-red-500">不可取消：</span>请在下单前仔细确认商品的各项状态和购买数量，一经下单后，您无法主动取消订单。</li>
                            <li>
                                <span className="font-bold">购买失败风险：</span>
                                支付完成的订单，并不代表一定购买成功，因为在本站下单与实际在罗针盘（らしんばん）上完成购买之间存在时间差。因此会存在商品已经出售或者中途下架，导致商品购买失败的情况，此时，APP会取消您的订单，并进行自动退款。
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">四、岛内运费</h4>
                        <p className="mb-2">罗针盘（らしんばん）按店收取日本岛内运费，以系统实际计算为准。</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <span className="font-bold text-green-800 block mb-1">① 罗针盘online店铺</span>
                                <span className="text-green-700 text-xs">免日本岛内运费</span>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                <span className="font-bold text-yellow-800 block mb-1">② 罗针盘其他店铺</span>
                                <ul className="list-disc pl-4 text-xs text-yellow-700 space-y-1">
                                    <li>单店铺合计 &lt; 5000日元：收取运费</li>
                                    <li>单店铺合计 ≥ 5000日元：免收运费</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">五、售后服务</h4>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                            <h5 className="font-bold text-blue-900 mb-2">商品状态说明</h5>
                            <p className="text-blue-800 text-xs mb-2">罗针盘上所有产品除原装产品外均为二手产品。可能会有轻微的使用痕迹、划痕、损坏、擦伤等。</p>
                            <div className="space-y-1 text-xs text-blue-800">
                                <p><span className="font-bold bg-white px-1 rounded">A：未开封</span> 外包装存在使用痕迹或破损。</p>
                                <p><span className="font-bold bg-white px-1 rounded">B：状态良好/较好</span> 本体可能存在一定的擦痕。</p>
                                <p><span className="font-bold bg-white px-1 rounded">C：状态普通/不好</span> 本体有明显的擦痕、破损或污渍，或缺赠品。</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs text-gray-500">
                                平台默认用户在购买时已明晰商品所属状态，因此平台作为一个帮助日本国外买家和日本国内卖家沟通的购买通道，<span className="font-bold">不承担任何从罗盘针购买商品的任何品相问题的责任，不接受任何情况下的单方面要求取消订单退款的要求。</span>
                            </p>
                            
                            <div className="bg-gray-100 p-3 rounded-lg text-xs text-gray-600">
                                <span className="font-bold block mb-1">取消费用说明：</span>
                                商品换货、卖家直接取消订单等没有让平台产生人工对应沟通成本的，平台不收取费用；商品申请取消让平台产生人工对应沟通成本的，将收取对应费：订单价格（含岛内运费）的10%（包含7%平台人工处理费+3%第三方支付平台手续费），不足1000日元的商品固收100日元。
                            </div>

                            <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-red-700">
                                <span className="font-bold flex items-center gap-1 mb-1"><AlertTriangle size={12}/> 售后特殊说明</span>
                                用户需在收到商品入库返图后<span className="font-bold underline">5天内</span>完成确认操作。如确认存在错发、漏发等问题，请在5天内联系平台客服，并提供有效凭证。超过5天平台将不再做任何应对，默认用户无异议。
                            </div>
                        </div>
                    </section>
                    
                    <p className="text-center text-xs text-gray-400 mt-4">请充分了解相关购物风险，认真仔细阅读商品页面上的说明再进行选购。</p>
                </div>
            </>
        )
    },
    { 
        title: "会员等级规则", 
        tags: ["会员", "积分", "等级"],
        content: (
            <div className="space-y-8 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">一、会员等级介绍</h4>
                    <p className="leading-relaxed">会员等级由用户使用乐酷淘业务累计获取的经验值决定，用户达到相应的等级门槛即可升级。用户可以通过购物、签到、平台活动等方式获取经验值，从而提升等级。</p>
                    <div className="mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800 text-xs">
                        <span className="font-bold">等级有效期：</span>用户账号存续时间内一直有效。
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">二、经验值说明</h4>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>用于评定用户会员等级的值被称为经验值。</li>
                        <li>用户每日、每月可获取经验值不限量。</li>
                        <li>若发生退款，该笔交易已发放的经验值会进行相应扣除（扣除商品标价折算所得的经验值）。</li>
                        <li>请勿违规刷经验值（包括但不限于虚假交易、恶意退款等不良行为）。如发现存在违规行为，平台有权扣除您的经验值，情节严重的，将禁止您获取经验值。</li>
                    </ul>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-xs text-red-700">
                        <h5 className="font-bold flex items-center gap-1 mb-2"><AlertTriangle size={14}/> 特殊说明：账号风控</h5>
                        <p className="leading-relaxed">
                            在会员使用乐酷淘会员服务时，如发现您的账号存在异常情况或风险（虚假交易、恶意退款、白嫖权限、辱骂客服等任何对有害平台的行为），平台有权根据行为的严重性，对您的账号权限封禁或整体封禁。
                            <br/><br/>
                            <span className="font-bold">• 权限封禁：</span>不会影响会员等级提升及经验值获取，封禁至少48小时后自动解禁。
                            <br/>
                            <span className="font-bold">• 永久封禁：</span>会员等级、经验值等个人资产将处于禁止状态。
                        </p>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">三、经验值获取方式</h4>
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <h5 className="font-bold text-gray-900 mb-2 border-b pb-2">1. 购物经验值</h5>
                            <ul className="text-xs space-y-1 text-gray-600">
                                <li><span className="font-bold">定义：</span>指在乐酷淘平台购物【成功入库】后获得的经验值。</li>
                                <li><span className="font-bold">折算标准：</span>100日元 = 10经验值。</li>
                                <li><span className="font-bold">计算规则：</span>一般按商品标价折算（雅虎/煤炉拍卖按中拍价）。含税及岛内运费一并计算。数值精确到个位（四舍五入，&lt;10日元算1经验值）。</li>
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <h5 className="font-bold text-gray-900 mb-2">2. 签到经验值</h5>
                                <p className="text-xs text-gray-600">APP端个人中心签到获得，具体以签到页面为准。</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <h5 className="font-bold text-gray-900 mb-2">3. 活动经验值</h5>
                                <p className="text-xs text-gray-600">参与平台组织活动获得，详情见具体活动说明。</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">四、会员等级对照表</h4>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="min-w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                                <tr>
                                    <th className="px-4 py-3">等级</th>
                                    <th className="px-4 py-3">升级门槛 (经验值)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {[
                                    {l: 'LV0', v: '0'}, {l: 'LV1', v: '5,000'}, {l: 'LV2', v: '10,000'},
                                    {l: 'LV3', v: '25,000'}, {l: 'LV4', v: '50,000'}, {l: 'LV5', v: '70,000'},
                                    {l: 'LV6', v: '90,000'}, {l: 'LV7', v: '120,000'}, {l: 'LV8', v: '160,000'},
                                    {l: 'LV9', v: '200,000'}, {l: 'LV10', v: '260,000'}, {l: 'LVMAX', v: '320,000+'}
                                ].map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                        <td className="px-4 py-2 font-bold text-gray-900">{row.l}</td>
                                        <td className="px-4 py-2 text-gray-600 font-medium">{row.v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">* VIP10级以后可无限升级，福利与VIP10相同。</p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">五、等级权益</h4>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="min-w-full text-xs text-left">
                            <thead className="bg-yellow-50 text-yellow-800 font-bold">
                                <tr>
                                    <th className="px-3 py-3 whitespace-nowrap">等级</th>
                                    <th className="px-3 py-3 whitespace-nowrap">自助议价幅度</th>
                                    <th className="px-3 py-3 min-w-[140px]">优惠券奖励</th>
                                    <th className="px-3 py-3 whitespace-nowrap">卖家上新关注</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {[
                                    {lv: 'LV0', bargain: '无', coupon: '无', watch: '无'},
                                    {lv: 'LV1', bargain: '无', coupon: '无', watch: '无'},
                                    {lv: 'LV2', bargain: '无', coupon: '无', watch: '2个'},
                                    {lv: 'LV3', bargain: '无', coupon: '100日元运费券*1', watch: '2个'},
                                    {lv: 'LV4', bargain: '无', coupon: '100日元运费券*1', watch: '5个'},
                                    {lv: 'LV5', bargain: '无', coupon: '100日元运费券*1', watch: '5个'},
                                    {lv: 'LV6', bargain: '10%', coupon: '200日元运费券*1', watch: '5个'},
                                    {lv: 'LV7', bargain: '10%', coupon: '200日元运费券*1', watch: '7个'},
                                    {lv: 'LV8', bargain: '10%', coupon: '200日元运费券', watch: '7个'},
                                    {lv: 'LV9', bargain: '10%', coupon: '200日元运费券*1', watch: '10个'},
                                    {lv: 'LV10', bargain: '区间议价(10%-15%)', coupon: '300日元运费券*1\n打包加急券*1', watch: '10个'},
                                    {lv: 'LVMAX', bargain: '区间议价(10%-15%)', coupon: '300日元运费券*1\n打包加急券*1', watch: '10个'},
                                ].map((row, i) => (
                                    <tr key={i}>
                                        <td className="px-3 py-3 font-bold text-gray-900 align-top">{row.lv}</td>
                                        <td className="px-3 py-3 text-gray-600 align-top">{row.bargain}</td>
                                        <td className="px-3 py-3 text-red-500 font-bold whitespace-pre-wrap align-top leading-relaxed">{row.coupon}</td>
                                        <td className="px-3 py-3 text-gray-600 align-top">{row.watch}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">* 区间议价说明：1-4999日元(10%)，5000-29999日元(12%)，30000日元及以上(15%)</p>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">六、权益特殊说明</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">💬 留言机会</span>
                            <span className="text-gray-600 text-xs">会员每成功购买一单，即可获得三次留言机会。</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">🎟️ 周末议价券 (LV0-5)</span>
                            <span className="text-gray-600 text-xs">每周六0:00起可领取，有效期至周日24:00。仅限LV0-5用户使用，可进行小幅度自助议价。</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">🔍 搜索权限 (LV3+)</span>
                            <span className="text-gray-600 text-xs">LV3及以上用户可以使用搜索链接功能、在商品详情页拷贝URL以及搜索URL。</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">📅 优惠券领取</span>
                            <span className="text-gray-600 text-xs">会员每月月初可于APP会员权益页面领取当前等级所属的优惠券。</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">📦 打包加急券</span>
                            <span className="text-gray-600 text-xs">限出库订单≤10件使用。使用后及打包完成后无法追加商品。一旦使用，不论打包是否完成，均无法返还。</span>
                        </div>
                    </div>
                </section>
            </div>
        )
    },
    { 
        title: "保价服务说明", 
        tags: ["保险", "服务", "安全"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <p className="leading-relaxed mb-4">使用保价服务前，请仔细阅读以下内容。确认使用保价服务即表示您已理解并同意本说明的所有条款。</p>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-xs font-bold">
                        🚫 请注意：分箱包裹暂不支持保价。
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">一、 保价费用详情</h4>
                    <div className="space-y-4">
                        {/* SF General & ZTO & STO */}
                        <div className="border border-gray-200 rounded-xl p-3 bg-white">
                            <h5 className="font-bold text-gray-900 text-sm mb-2">顺丰杂货/饰品/娃娃/衣物特快 & 中通/申通杂货</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li><span className="font-bold">保费：</span>固定300日元</li>
                                <li><span className="font-bold">最高赔付：</span>商品实际金额 (上限2,000元人民币)</li>
                                <li><span className="text-gray-400 text-[10px]">示例：商品5万日元(约2500人民币)，保费300日元，损毁最高赔2000人民币。</span></li>
                            </ul>
                        </div>

                        {/* SF Large */}
                        <div className="border border-gray-200 rounded-xl p-3 bg-white">
                            <h5 className="font-bold text-gray-900 text-sm mb-2">顺丰大件/毛绒/动漫周边大件 & 顺丰重-衣物</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li><span className="font-bold">保费：</span>商品总价 × 1% (最低300日元)</li>
                                <li><span className="font-bold">最高赔付：</span>商品实际金额</li>
                                <li><span className="text-gray-400 text-[10px]">示例：商品4万日元，保费400日元。损毁赔付4万日元。</span></li>
                            </ul>
                        </div>

                        {/* Category Lines */}
                        <div className="border border-gray-200 rounded-xl p-3 bg-white">
                            <h5 className="font-bold text-gray-900 text-sm mb-2">各类品类专线 (头盔/运动/数码/手办等)</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li><span className="font-bold">保费：</span>商品总价 × 1% (最低2000日元)</li>
                                <li className="text-red-500 font-bold">⚠️ 仅保整箱丢失，不保物品损坏</li>
                                <li><span className="font-bold">最高赔付：</span>商品实际金额</li>
                                <li><span className="text-gray-400 text-[10px]">示例：商品50万日元，保费5000日元。整箱丢失赔付50万日元。</span></li>
                            </ul>
                        </div>

                        {/* EMS */}
                        <div className="border border-gray-200 rounded-xl p-3 bg-white">
                            <h5 className="font-bold text-gray-900 text-sm mb-2">EMS</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li><span className="font-bold">保费：</span>≤2万日元免费；每超2万加收50日元</li>
                                <li><span className="font-bold">最高赔付：</span>商品实际金额 (上限200万日元)</li>
                                <li><span className="text-gray-400 text-[10px]">示例：商品5万日元，保费=0+50+50=100日元。损毁赔付5万日元。</span></li>
                            </ul>
                        </div>

                        {/* Intl Parcel */}
                        <div className="border border-gray-200 rounded-xl p-3 bg-white">
                            <h5 className="font-bold text-gray-900 text-sm mb-2">国际邮包空运/海运</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li><span className="font-bold">保费：</span>≤2万日元保费400日元；每超2万加收50日元</li>
                                <li><span className="font-bold">最高赔付：</span>商品实际金额 (上限200万日元)</li>
                                <li><span className="text-gray-400 text-[10px]">示例：商品5万日元，保费=400+50+50=500日元。损毁赔付5万日元。</span></li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">二、未保价赔付标准</h4>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
                        <table className="min-w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-3 py-2">线路</th>
                                    <th className="px-3 py-2">赔付上限</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                <tr><td className="px-3 py-2">EMS</td><td className="px-3 py-2">20,000日元</td></tr>
                                <tr><td className="px-3 py-2">国际书留</td><td className="px-3 py-2">6,000日元</td></tr>
                                <tr><td className="px-3 py-2">顺丰/中通/申通系列</td><td className="px-3 py-2">三倍运费或100美金(取低)</td></tr>
                                <tr><td className="px-3 py-2">品类专线</td><td className="px-3 py-2">300人民币/kg (取低)</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-4">
                        <h5 className="font-bold text-gray-800 text-xs mb-1">国际邮包系列 (海运/空运) 未保价赔付表</h5>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-gray-600">
                            <div>≤5KG: 11,160日元</div>
                            <div>5-10KG: 15,170日元</div>
                            <div>10-15KG: 19,190日元</div>
                            <div>15-20KG: 23,200日元</div>
                            <div>20-25KG: 27,220日元</div>
                            <div>25-30KG: 31,230日元</div>
                        </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-700 text-xs">
                        <span className="font-bold">特别声明：</span>不购买保价服务，即代表您自愿承担所有商品损坏、部分丢失及赔偿不足的风险。乐酷淘平台仅提供协助，不承担赔偿责任。
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">三、 非理赔范围</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                        <li className="flex items-start gap-2"><span className="text-red-500">×</span> 易碎品 (玻璃/陶瓷/屏幕/乐器等)</li>
                        <li className="flex items-start gap-2"><span className="text-red-500">×</span> 外包装完好但内物丢失/损坏</li>
                        <li className="flex items-start gap-2"><span className="text-red-500">×</span> 无异常签收后发生的问题</li>
                        <li className="flex items-start gap-2"><span className="text-red-500">×</span> 报关信息不符导致海关查扣</li>
                        <li className="flex items-start gap-2"><span className="text-red-500">×</span> 违禁品/限制品</li>
                        <li className="flex items-start gap-2"><span className="text-red-500">×</span> "袋装打包"商品破损</li>
                        <li className="flex items-start gap-2"><span className="text-red-500">×</span> 不可抗力 (战争/疫情/灾害)</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">四、 理赔规则 & 凭证</h4>
                    <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <h5 className="font-bold text-blue-900 text-sm mb-1">1. 核心凭证 (缺一不可)</h5>
                            <ul className="list-disc pl-4 text-xs text-blue-800 space-y-1">
                                <li><span className="font-bold">完整开箱视频：</span>未拆封展示单号 ➜ 一镜到底 ➜ 完全拆除。不得剪辑/暂停/加速。</li>
                                <li><span className="font-bold">出库图：</span>仓库发货原始照片。</li>
                                <li><span className="font-bold">签收凭证：</span>快递员面前核对的证明。</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <h5 className="font-bold text-gray-900 text-sm mb-1">2. 签收建议</h5>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                务必<span className="font-bold">先检查后签收</span>。若发现异常（破损/重量不符），请立即在快递员见证下：称重保留证据、拍摄开箱视频、在运单注明异常并让快递员签字。
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">五、 理赔申请流程</h4>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 text-xs text-gray-700 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <span className="font-bold w-20 shrink-0">发送邮件：</span>
                            <a href="mailto:service@lekutao.cn" className="text-blue-600 hover:underline">service@lekutao.cn</a>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <span className="font-bold w-20 shrink-0">邮件标题：</span>
                            <span>线路名称 + 理赔申请 + 运单号</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <span className="font-bold w-20 shrink-0">邮件内容：</span>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>详细问题描述</li>
                                <li>外包装六面清晰照片</li>
                                <li>商品实物照片</li>
                                <li>运单及商品清单截图</li>
                                <li>商品价值证明</li>
                                <li>完整的开箱视频（附件形式）</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <p className="text-center text-xs text-gray-400 mt-4 border-t pt-4">
                    乐酷淘平台在理赔过程中仅提供必要的协助，不承担任何赔偿责任。具体的理赔结果由物流方根据其条款进行判定。
                </p>
            </div>
        )
    },
    { title: "免责声明", 
        tags: ["法律", "声明"], 
        content: (
            <>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                    本免责声明旨在明确乐酷淘平台（以下简称“平台”）与用户之间的权利、义务与责任。涵盖代购、仓储、物流及相关服务的全部使用规则与风险提示。
                    <br/>
                    <span className="font-bold text-gray-900">请您在使用平台服务前务必仔细阅读并充分理解以下内容。如您对本免责声明有任何疑问，建议在下单前咨询人工客服或专业人士后再行委托代购。</span>
                </p>

                <h4 className="font-bold text-gray-900 mt-6 mb-3 text-lg border-l-4 border-yellow-500 pl-3">一、平台定位与服务范围</h4>
                <div className="space-y-4 text-sm text-gray-700">
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（一）平台职能</h5>
                        <ol className="list-decimal pl-5 space-y-1">
                            <li>乐酷淘仅作为第三方代购平台及物流服务提供方，连接日本国内卖家与日本国外买家。平台不参与商品买卖，不对商品的来源、真实性、质量及使用目的承担任何实质性审查或保证责任。</li>
                            <li>平台将通过技术手段对面单信息的合理性进行形式审核（如申报价值与商品类目匹配度校验），对明显异常的申报将提示用户修正。</li>
                        </ol>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（二）服务内容</h5>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><span className="font-bold">代购支持：</span>协助消费者下单、联系卖家、跟进发货等，但不对商品本身质量负责。</li>
                            <li><span className="font-bold">日本国内仓储：</span>提供商品入库、拍照、称重、短期或长期存储、打包等服务。对于优购商品，提供 1 张入库实拍图；对于折扣购商品，提供1张称重图。照片仅供展示，不做质量鉴定依据。若商品本体被遮挡，平台无法核实是否为空包，相关风险需用户自行承担。</li>
                            <li><span className="font-bold">国际物流：</span>通过指定快递渠道将商品运送至用户所在国家或地区；运费通过比较“实际重量（称重）”与“体积重量（尺重）”，按较大者计费。</li>
                        </ul>
                    </div>
                </div>

                <h4 className="font-bold text-gray-900 mt-8 mb-3 text-lg border-l-4 border-yellow-500 pl-3">二、用户行为与下单责任</h4>
                <div className="space-y-4 text-sm text-gray-700">
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（一）信息真实性</h5>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>用户在提交订单时，应保证所填写信息（包括但不限于收件人姓名、地址、联系电话、商品申报价值、品名、数量等）真实有效。</li>
                            <li>若因用户提供虚假或错误信息导致的任何后果（如包裹延误、退运、扣留等）由用户自行承担，平台不承担责任。</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（二）商品用途及二次销售禁止</h5>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>根据《中华人民共和国海关法》等法律法规，境外进口至中国的个人代购商品，仅限“个人自用、合理数量”，禁止二次销售。</li>
                            <li>中古品、二手商品、拆封样品等不得擅自用于二次销售。若用户违规转卖，可能面临海关扣押、罚款、市场监管处罚甚至刑事责任。</li>
                            <li>平台不对用户实际使用商品可能引发的法律纠纷承担任何责任。</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（三）确保面单信息合规</h5>
                        <p className="mb-2">严禁用户瞒报、虚报面单上的任何信息。用户需确保物流面单载明的信息（收件人姓名、地址、商品品名、数量、申报价值等）真实、准确、完整。</p>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-red-700">
                            <span className="font-bold">风险提示：</span>若怀疑假货，须在时限内联系客服锁单并提交对比材料。平台协助处理，如认定为假货协助退款，但收取10%服务费（最低100日元）。
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（四）代购订单取消与退货风险</h5>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>通过平台成功下单付款后，用户不得因个人原因取消订单。订单一旦付款，不可撤销。</li>
                            <li>若需退货或换货，需由用户与日本卖家协商并承担相应运费、税费与其他费用；平台不承担退货过程中的任何损失或纠纷责任。</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（五）特别提醒</h5>
                        <p>十八岁以下的未成年人用户在本平台进行消费时，需要获得监护人的同意，并在监护人的陪同下进行消费。</p>
                    </div>
                </div>

                <h4 className="font-bold text-gray-900 mt-8 mb-3 text-lg border-l-4 border-yellow-500 pl-3">三、商品真伪与售后处理</h4>
                <div className="space-y-4 text-sm text-gray-700">
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（一）商品真伪及服务限制</h5>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>平台无法逐一验证卖家信息与商品真伪，也不承诺商品质量、配件完整性与成色。</li>
                            <li>用户需在入库返图或告知重量后6小时内（官方店铺需在5天内）进行确认。超时视为“默认无异议”。</li>
                            <li>折扣购商品如未购买返图服务，平台直接入库发货，风险自担。</li>
                            <li><span className="font-bold">假货处理：</span>若怀疑假货，须在时限内联系客服锁单并提交对比材料。平台协助处理，如认定为假货协助退款，但收取10%服务费（最低100日元）。</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（二）售后处理规则</h5>
                        <p>平台不提供维修、退换货服务，仅协助沟通。发现问题须在规定时限（6小时/5天）及工作时间内联系客服。超时不予受理。</p>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（三）易损/特殊材质商品风险</h5>
                        <p>易碎品（玻璃、陶瓷、CD盒等）不在物流赔偿范围，平台不予额外赔偿。仓储过久导致的状态变化（发霉等）平台不负责。</p>
                    </div>
                </div>

                <h4 className="font-bold text-gray-900 mt-8 mb-3 text-lg border-l-4 border-yellow-500 pl-3">四、仓储与打包说明</h4>
                <div className="space-y-4 text-sm text-gray-700">
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（一）仓库入库标准</h5>
                        <p>平台仓库进行开箱、拍照和称重。入库拍照仅供展示，不做质量鉴定依据。</p>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（二）仓储时效与费用</h5>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><span className="font-bold">优购：</span>S/M标签无限期免费（超1年免责），其他标签免费90天。</li>
                            <li><span className="font-bold">折扣购：</span>免费60天。</li>
                            <li><span className="font-bold">超时收费：</span>每天每件50日元。</li>
                            <li><span className="font-bold">弃权：</span>超过免费期30天，视为放弃所有权，平台有权处置。</li>
                            <li>已打包/退运包裹需30天内处理，否则按废弃处理。</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（三）货品完整性责任</h5>
                        <p>仓库仅对“入库至出库前”期间的外部物理完整性负责。</p>
                    </div>
                </div>

                <h4 className="font-bold text-gray-900 mt-8 mb-3 text-lg border-l-4 border-yellow-500 pl-3">五、物流与禁运物品</h4>
                <div className="space-y-4 text-sm text-gray-700">
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（一）物流时效</h5>
                        <p>时效仅为估算，实际受快递、海关、天气等影响。平台无法对送达时间作承诺。</p>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（二）运费与税费</h5>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>运费按“实际重量”与“体积重量”较大者计费。</li>
                            <li><span className="font-bold">税费自理路线：</span>关税等费用由用户自行承担。</li>
                            <li><span className="font-bold">税费预付路线：</span>下单时支付预估税费，后续以实际征收为准。</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（三）禁止商品与敏感物品</h5>
                        <p>购买禁运/限制进口品类导致退运扣押，损失由用户承担。严禁通过“个人物品”名义进行商业转售。</p>
                    </div>
                </div>

                <h4 className="font-bold text-gray-900 mt-8 mb-3 text-lg border-l-4 border-yellow-500 pl-3">六、个人邮寄进境物品的次数与金额</h4>
                <div className="space-y-4 text-sm text-gray-700">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h5 className="font-bold text-blue-900 mb-2">1. 单次限值</h5>
                        <ul className="list-disc pl-5 space-y-1 text-blue-800">
                            <li><span className="font-bold">普通邮寄：</span>限值2000元人民币。单件不可分割且自用可超限。</li>
                            <li><span className="font-bold">跨境电商：</span>单次限值5000元，年度限值26000元。</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <h5 className="font-bold text-green-900 mb-2">2. 免征税额</h5>
                        <p className="text-green-800">应征进口税税额 ≤ 50元人民币，予以免征。</p>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">3. 超限后果</h5>
                        <p>需办理退运或转一般贸易报关。故意拆单规避限值可能被认定走私。</p>
                    </div>
                </div>

                <h4 className="font-bold text-gray-900 mt-8 mb-3 text-lg border-l-4 border-yellow-500 pl-3">七、特别声明</h4>
                <div className="space-y-4 text-sm text-gray-700">
                    <p><span className="font-bold">（一）商品风险提示：</span>平台不对商品真假、质量做实质审查。发货后出现的质量问题，平台仅协助沟通。</p>
                    <p><span className="font-bold">（二）不可抗力免责：</span>因自然灾害、战争、政策等不可抗力导致服务中断，平台不承担责任。</p>
                    <p><span className="font-bold">（三）系统与数据安全：</span>技术故障导致的损失不承担赔偿。用户需妥善保管账号密码。</p>
                    <p><span className="font-bold">（四）法律适用：</span>本声明适用中华人民共和国法律。争议协商不成可向平台所在地法院起诉。</p>
                </div>

                <h4 className="font-bold text-gray-900 mt-8 mb-3 text-lg border-l-4 border-yellow-500 pl-3">八、联系方式与售后须知</h4>
                <div className="space-y-4 text-sm text-gray-700">
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（一）客服工作时间</h5>
                        <p>周一至周五：09:00-23:00</p>
                        <p>周末及节假日：09:00-19:00 (晚间仅限QQ群值班)</p>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（二）物流售后相关规则</h5>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><span className="font-bold">理赔凭证：</span>必须提供完整开箱视频（未拆封展示单号至完全拆除，一镜到底）。保留出库图、签收凭证。</li>
                            <li><span className="font-bold">签收注意：</span>先检查后签收。发现异常立即拍照、称重并让快递员签字。</li>
                            <li><span className="font-bold">反馈时限：</span>24小时内联系客服及承运方。</li>
                            <li><span className="font-bold">非理赔范围：</span>易碎品、内物异常（外包完好）、签收后反馈、违规商品、不可抗力等。</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">（三）中国段物流异常</h5>
                        <p>包裹入境后异常，请第一时间联系国内承运商（如顺丰）。必要时拨打12305投诉。</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500 text-center">
                    <p className="font-bold text-gray-700 mb-2">九、免责声明生效与更新</p>
                    <p>本声明自发布之日起生效。平台保留修订权利，更新后即时生效。继续使用服务视为接受更新。</p>
                </div>
            </>
        )
    },
    { 
        title: "合单服务", 
        tags: ["物流", "发货", "包裹"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <p className="leading-relaxed mb-4">当您购买的不同商品在乐酷淘仓库囤货够多时，可以通过【我的】-【我的订单】-【已入库】进行合单。</p>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
                        <p><span className="font-bold text-blue-900">📦 合单模式：</span>可以选择【直邮】or【拼邮】。</p>
                        <p><span className="font-bold text-blue-900">🚀 单件速发：</span>只想发一件可选此项。默认加急，不支持后续开箱及追加，不限线路。</p>
                        <p><span className="font-bold text-blue-900">💰 手续费：</span>50个OR订单内合单免手续费；超出部分按每单100日元计收。</p>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">一、直邮与拼邮</h4>
                    <div className="space-y-4">
                        <div>
                            <h5 className="font-bold text-gray-900 mb-1">1. 合单直邮</h5>
                            <p className="text-gray-600 text-xs">仓库会根据您的选择进行商品打包称重，并告知重量给您。您确认重量后，可根据需求选择相应得物流方式支付运费。</p>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-900 mb-1">2. 合单拼邮</h5>
                            <p className="text-gray-600 text-xs mb-2">选择合单拼邮，会多一个步骤：分享拼邮链接。</p>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-600 space-y-2">
                                <p>① <span className="font-bold">发起人：</span>选定自己需要打包的商品并加入拼邮中，生成拼邮链接分享给参与人。</p>
                                <p>② <span className="font-bold">参与人：</span>通过链接加入拼邮队列，确认需要打包的商品后，由发起人提交订单。</p>
                                <p>③ <span className="font-bold">打包支付：</span>仓库按每个参与人独立打包并上传重量。发起人确认总重并支付运费。拼邮邮费由发起人自行收取，平台不提供代收。</p>
                                <p className="text-red-500 font-bold">④ 风险提示：参与人需发起人自行组织，平台只提供拼邮环境，不提供安全保障，风险自担。</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">二、拼邮订单分箱与取出</h4>
                    <div className="space-y-4">
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-red-700 font-bold">
                            🚫 禁止分箱：任何拼邮订单均不支持分箱操作。
                        </div>
                        
                        <div>
                            <h5 className="font-bold text-gray-900 mb-2">拼邮订单取出服务</h5>
                            <p className="text-xs text-gray-500 mb-2">仅团长有权申请。合单后若需减少包裹内商品，需支付开箱费取出。</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="border border-gray-200 rounded-xl p-3">
                                    <span className="block font-bold text-gray-900 mb-1">🎲 基础随机取出</span>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li><span className="font-bold">费用：</span>200日元开箱费</li>
                                        <li><span className="font-bold">场景：</span>不指定，允许随机</li>
                                        <li><span className="font-bold">标准：</span>随机取出1-2件，使包裹基本符合需求</li>
                                    </ul>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-3">
                                    <span className="block font-bold text-gray-900 mb-1">🎯 指定取出</span>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li><span className="font-bold">费用：</span>200日元开箱费 + 500日元取出费 (限1-2件，超出的500/件)</li>
                                        <li><span className="font-bold">场景：</span>有特定商品必须取出</li>
                                        <li><span className="font-bold">标准：</span>按团长指定操作</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-xs text-yellow-800">
                            <span className="font-bold block mb-1">⚠️ 用户须知：</span>
                            <ul className="list-disc pl-4 space-y-1">
                                <li><span className="font-bold">取出原则：</span>优先取出对缩减体积/重量最有效的商品（最大/最重）。此原则不可协商。</li>
                                <li><span className="font-bold">随机性确认：</span>团长及参团用户申请即视为接受随机性。因取出何人何物产生的纠纷，平台概不负责。</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">三、合单注意事项</h4>
                    <div className="space-y-2 text-xs text-gray-600">
                        <p><span className="font-bold text-gray-800">📦 包裹上限：</span>单个拼邮包裹需遵守日本邮局规定（重量≤30kg，体积周长≤3米）。不同路线规定不同，请参考物流手册。</p>
                        <p><span className="font-bold text-gray-800">🛂 海关限值：</span>用户需确保符合目的地海关要求（中国大陆单次2000元；港澳台800元；其他1000元）。超限后果自负。</p>
                        <p><span className="font-bold text-gray-800">🚢 线路要求：</span>请遵守各物流方对商品数量和单箱重量的要求。游戏机/奢侈品等可能需补税，以物流方要求为准。</p>
                        <p><span className="font-bold text-gray-800">💡 操作建议：</span>建议订单全部入库后再申请合单。申请通过后增减商品产生的费用由用户承担。</p>
                        <p><span className="font-bold text-gray-800">📸 出库返图：</span>折扣购/优购享免费出库集体照。商品多时无法保证每件清晰。设备原因返图失败无法追溯。</p>
                        <p><span className="font-bold text-gray-800">⏰ 及时邮寄：</span>合单审核通过后请在30天内支付运费，否则视为放弃。</p>
                        <p><span className="font-bold text-gray-800">📝 面单确认：</span>平台提供智能合单，申报信息由用户确认。相关费用和法律风险由用户承担。</p>
                    </div>
                </section>
            </div>
        )
    },
    { 
        title: "品类专线", 
        tags: ["物流", "线路"], 
        content: (
            <>
                <div className="space-y-6 text-sm text-gray-700">
                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">线路介绍</h4>
                        <p>「品类专线」物流线路，针对不同商品品类（包包，相机、球拍等）设置了专属运输通道，提供更灵活、更透明的寄送选择。</p>
                        <p className="mt-2">为确保您的包裹顺利清关、快速送达，请阅读并遵守以下规则。</p>
                        <div className="bg-blue-50 p-3 rounded-lg mt-3 border border-blue-100">
                            <p className="font-bold text-blue-800">费用构成：</p>
                            <p className="text-blue-700">品类专线国际物流费用 = 运费 + 打包箱子费用</p>
                            <p className="text-xs text-blue-600 mt-1">*箱子收费标准可查阅-【用户手册-国际物流-箱子收费规则】</p>
                        </div>
                    </section>

                    <section className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2"><AlertTriangle size={18}/> 一箱一品类规则</h4>
                        <ul className="list-disc pl-5 space-y-1 text-yellow-900">
                            <li><span className="font-bold">核心规则：</span>每箱仅限寄送同一品类的商品。</li>
                            <li>单箱内商品数量及金额无限制。</li>
                            <li><span className="font-bold">重要提示：</span>每箱包裹均会开箱核对品类，请勿混装其他品类物品。</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-4 border-l-4 border-blue-500 pl-3">寄送专线说明</h4>
                        <div className="space-y-3">
                            {[
                                { title: "衣服专线", desc: "仅限各类服装（衣服、裤子、袜子、帽子等），含一般品牌、童装、潮牌。" },
                                { title: "鞋子专线", desc: "仅限各类鞋子（一般品牌、童鞋、潮牌）。" },
                                { title: "玩偶手办模型专线", desc: "仅限汽车模型、手办、玩偶、玩偶挂件。" },
                                { title: "相纸、拍立得专线", desc: "仅限相纸、拍立得相机、一次性相机。" },
                                { title: "动漫周边专线", desc: "徽章、卡片、钥匙扣、海报、文件夹、立牌等动漫周边。（禁运：含食品的动漫周边）" },
                                { title: "动漫周边（含CD）专线", desc: "动漫周边、可发CD、DVD（禁运：涉黄、涉政等法律禁止内容）" },
                                { title: "CD专线", desc: "仅限CD、DVD（禁运：涉黄、涉政等法律禁止内容）" },
                                { title: "包包首饰专线", desc: "高级包袋、珠宝首饰、衣鞋饰品等。（禁运：手表、珊瑚、裸钻和珍珠等首饰原材料）" },
                                { title: "头盔专线", desc: "仅限头盔。" },
                                { title: "运动用具专线", desc: "登山用具、露营用品、羽毛球拍等运动器材。（单箱限单个物品）" },
                                { title: "数码专线", desc: "中古数码相机、中古镜头。（禁运：游戏机）（电池：1个包裹内置在相机的，加上外放的，合计最大2个）" },
                                { title: "化妆品专线", desc: "粉饼、口红等各类化妆品（禁运：香水、含气体物品、易燃易爆物品）" },
                                { title: "保健品专线", desc: "各类保健品" },
                                { title: "高尔夫球杆专线", desc: "仅限高尔夫球杆" },
                                { title: "高尔夫周边专线", desc: "仅限高尔夫相关的周边产品，例如球包，高尔夫球，握把等。" },
                                { title: "渔轮专线", desc: "仅可寄送整箱渔轮" },
                                { title: "鱼竿专线", desc: "仅可寄送整箱鱼竿(长度限120cm内)" },
                                { title: "汽配专线", desc: "仅可寄送汽车配件 (需提前咨询，含电池和液体物品不可邮寄，方向盘需拆卸气囊寄送）" },
                                { title: "品类UPS香港/澳门线", desc: "仅寄送至香港、澳门" }
                            ].map((line, idx) => (
                                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="font-bold text-gray-800">{line.title}：</span>
                                    <span className="text-gray-600">{line.desc}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-blue-500 pl-3">税费说明</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">税费自理</span>
                                    <span className="font-bold text-gray-800">品类UPS香港/澳门线、品类香港/澳门线</span>
                                </div>
                                <p className="text-gray-600 text-xs leading-relaxed mb-2">支付的国际物流费用不包含税费，用户自行办理清关手续、按海关要求缴纳税费。</p>
                                <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
                                    <li><span className="font-bold">香港：</span>一般无进口税。</li>
                                    <li><span className="font-bold">澳门：</span>对大部分普通商品实行免进口关税。</li>
                                    <li>个人自用/消费包裹免申报（限额内）。烟酒、特殊物品需申报。</li>
                                    <li>是否产生税费以实际情况为准，请按当地海关要求缴纳税费。</li>
                                </ul>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded">税费预付</span>
                                    <span className="font-bold text-gray-800">其余专线</span>
                                </div>
                                <p className="text-gray-600 text-xs leading-relaxed">由物流方代办清关手续，用户在支付国际物流费用时一并支付预估税费。若后续被物流方要求额外补税，一切以物流方要求为准。</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-blue-500 pl-3">运费规则详情</h4>
                        <p className="text-xs text-red-500 mb-4 font-bold bg-red-50 p-2 rounded inline-block">* 除包包首饰专线，其余专线价格均含国际运费与中国国内段运费</p>
                        
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-xl p-4 bg-white">
                                <h5 className="font-bold text-gray-900 mb-2 border-b pb-2">衣服/鞋子/玩偶手办/相纸拍立得/动漫周边专线</h5>
                                <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-600">
                                    <div><span className="text-gray-400">运费：</span>1680日元/kg</div>
                                    <div><span className="text-gray-400">起寄：</span>4kg (不满算4kg)</div>
                                    <div><span className="text-gray-400">续重：</span>840日元/0.5kg</div>
                                    <div><span className="text-gray-400">限重：</span>20kg</div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">计费：取【实际称重】与【体积重量】中的较大值。(体积重=长*宽*高/12000)</p>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-4 bg-white">
                                <h5 className="font-bold text-gray-900 mb-2 border-b pb-2">动漫周边（含CD）/ CD专线</h5>
                                <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-600">
                                    <div><span className="text-gray-400">运费：</span>2160日元/kg</div>
                                    <div><span className="text-gray-400">起寄：</span>4kg (不满算4kg)</div>
                                    <div><span className="text-gray-400">续重：</span>1080日元/0.5kg</div>
                                    <div><span className="text-gray-400">限重：</span>20kg</div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">计费：取【实际称重】与【体积重量】中的较大值。(体积重=长*宽*高/12000)</p>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-4 bg-white">
                                <h5 className="font-bold text-gray-900 mb-2 border-b pb-2">运动用具 / 数码专线</h5>
                                <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-600">
                                    <div><span className="text-gray-400">运费：</span>2400日元/kg</div>
                                    <div><span className="text-gray-400">起寄：</span>4kg (不满算4kg)</div>
                                    <div><span className="text-gray-400">续重：</span>1200日元/0.5kg</div>
                                    <div><span className="text-gray-400">限重：</span>20kg</div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">计费：取【实际称重】与【体积重量】中的较大值。(体积重=长*宽*高/12000)</p>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-4 bg-white">
                                <h5 className="font-bold text-gray-900 mb-2 border-b pb-2">化妆品 / 保健品专线</h5>
                                <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-600">
                                    <div><span className="text-gray-400">运费：</span>2000日元/kg</div>
                                    <div><span className="text-gray-400">起寄：</span>4kg (不满算4kg)</div>
                                    <div><span className="text-gray-400">续重：</span>1000日元/0.5kg</div>
                                    <div><span className="text-gray-400">限重：</span>15kg</div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">计费：取【实际称重】与【体积重量】中的较大值。(体积重=长*宽*高/6000)</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-xl p-3 bg-white">
                                    <h5 className="font-bold text-gray-900 text-sm mb-1">包包首饰专线</h5>
                                    <p className="text-xs text-gray-600">4600日元/kg (1kg起寄，按1kg续重)</p>
                                    <p className="text-[10px] text-red-500 mt-1">*国内段运费到付</p>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-3 bg-white">
                                    <h5 className="font-bold text-gray-900 text-sm mb-1">头盔专线</h5>
                                    <p className="text-xs text-gray-600">10,080日元/个 (1个起寄，一箱限2个)</p>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-3 bg-white">
                                    <h5 className="font-bold text-gray-900 text-sm mb-1">高尔夫球杆专线</h5>
                                    <p className="text-xs text-gray-600">2880日元/kg (4kg起寄，限重15kg)</p>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-3 bg-white">
                                    <h5 className="font-bold text-gray-900 text-sm mb-1">高尔夫周边专线</h5>
                                    <p className="text-xs text-gray-600">1920日元/kg (4kg起寄，限重15kg)</p>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-3 bg-white">
                                    <h5 className="font-bold text-gray-900 text-sm mb-1">渔轮 / 鱼竿专线</h5>
                                    <p className="text-xs text-gray-600">2640日元/kg (4kg起寄，限重20kg)</p>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-3 bg-white">
                                    <h5 className="font-bold text-gray-900 text-sm mb-1">汽配专线</h5>
                                    <p className="text-xs text-gray-600">2040日元/kg (4kg起寄，限重20kg)</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-blue-500 pl-3">香港/澳门线路</h4>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                <h5 className="font-bold text-gray-900 text-sm mb-2">品类UPS香港/澳门线</h5>
                                <ul className="text-xs text-gray-600 space-y-1 mb-2">
                                    <li>重量限制：0.5kg-100kg（超100kg需联系客服）</li>
                                    <li>体积重量：长*宽*高/5000</li>
                                    <li>计费标准：不抹零；取实重与体积重较大值</li>
                                </ul>
                                <div className="bg-white p-2 text-center text-xs text-gray-400 border border-dashed border-gray-300 rounded">
                                    具体收费表请咨询客服或查看APP内详情
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                <h5 className="font-bold text-gray-900 text-sm mb-2">品类香港/澳门线</h5>
                                <ul className="text-xs text-gray-600 space-y-1 mb-2">
                                    <li>重量限制：0.5kg起寄，最多一吨（超1000kg需联系客服）</li>
                                    <li>体积重量：长*宽*高/5000</li>
                                </ul>
                                <div className="bg-white p-2 text-center text-xs text-gray-400 border border-dashed border-gray-300 rounded">
                                    具体收费表请咨询客服或查看APP内详情
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-blue-500 pl-3">时效与查询</h4>
                        <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                            <li><span className="font-bold">预计时效：</span>揽收后约14-20个工作日送达（遇海关查验顺延）。UPS港澳线2-3天，普货港澳线3-4天。</li>
                            <li><span className="font-bold">物流单号：</span>清关完成后获取。国内统一顺丰。</li>
                            <li><span className="font-bold">贵重物品：</span>可选顺丰到付。</li>
                        </ul>
                    </section>

                    <section className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2 text-sm"><Ban size={16}/> 禁运品类</h4>
                        <p className="text-xs text-red-700 leading-relaxed">
                            严格禁止：18禁物品、食品、食玩（含动漫周边附赠食品）、游戏机、手表、珊瑚、裸钻和珍珠等首饰原材料、香水、气体、易燃易爆物品、烟、酒、涉黄、涉政等法律禁止内容。
                        </p>
                        <p className="text-[10px] text-red-500 mt-2 font-bold">
                            ⚠️ 各地海关政策可能随时调整，特殊物品寄送前请务必联系平台客服！
                        </p>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-blue-500 pl-3">打包说明</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            易损、易碎物品（如头盔、包包、首饰、玻璃制品、手办、相机镜头、高尔夫球杆等）<span className="font-bold text-red-500">必须加购专用保护材料</span>。未加购若出现破损，乐酷淘不承担赔偿责任。
                        </p>
                    </section>

                    <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-200">
                        <p>乐酷淘「品类专线」，用心守护您的每一份托付。</p>
                        <p>如有任何疑问，请随时联系在线客服。</p>
                    </div>

                </div>
            </>
        )
    },
    { title: "优购与折扣购", tags: ["增值服务", "规则", "费用"] },
    { title: "违规操作应对机制", tags: ["规则", "违规", "处罚"] },
    { title: "优惠券规则说明", tags: ["优惠券", "规则", "福利"] },
    { title: "积分规则", tags: ["积分", "规则", "会员"] },
    { title: "售后服务", tags: ["客服", "退款", "退货", "投诉", "问题"] },
    { title: "增值服务", tags: ["加固", "拍照", "服务", "仓储", "打包"] },
    { title: "提款说明手册", tags: ["余额", "提现", "钱"] },
    { title: "禁止代购违禁物品", tags: ["规则", "违禁品", "限制"] },
    { 
        title: "费用构成", 
        tags: ["价格", "手续费", "运费"],
        content: (
            <div className="space-y-6 text-sm text-gray-700">
                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3">支付流程概览</h4>
                    <p className="leading-relaxed mb-4">在乐酷淘购物过程中，您将经历至少2次支付，完成从下单到收货的全过程。</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <span className="font-bold text-blue-900 block mb-2">第一次支付</span>
                            <span className="text-xs text-blue-600 block mb-2">下单商品 → 运送至乐酷淘仓库</span>
                            <ul className="list-disc pl-4 text-xs text-blue-800 space-y-1">
                                <li><span className="font-bold">商品金额：</span>按站内汇率换算。</li>
                                <li><span className="font-bold">代购手续费：</span>服务费（活动期可能减免）。</li>
                                <li><span className="font-bold">日本岛内运费：</span>若非到付，计入此阶段。</li>
                                <li><span className="font-bold">增值服务费：</span>如拍照、拆包等（若勾选）。</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <span className="font-bold text-green-900 block mb-2">第二次支付</span>
                            <span className="text-xs text-green-600 block mb-2">乐酷淘仓库 → 发往您手中</span>
                            <ul className="list-disc pl-4 text-xs text-green-800 space-y-1">
                                <li><span className="font-bold">国际物流费用：</span>国际运费 + 打包箱子费。</li>
                                <li><span className="font-bold">其他费用：</span>到付岛内运费、合箱费、保险等。</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-100 p-3 rounded-lg text-center text-xs font-bold text-gray-700 border border-gray-200">
                        总费用 = 商品价格 + 代购手续费 + 日本国内运费 + 国际物流费用(含箱子费) + 其他附加费
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">费用详情说明</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <h5 className="font-bold text-gray-900 mb-1">1. 商品价格 & 浮价风险</h5>
                            <p className="text-xs text-gray-600">即日本原网站标明的售价。若因价格浮动导致委托款项不足，平台将通知下单失败并退款，用户需重新下单。</p>
                        </div>
                        
                        <div>
                            <h5 className="font-bold text-gray-900 mb-1">2. 日本国内运费</h5>
                            <p className="text-xs text-gray-600">如商品为到付，入库后收取。包邮商品若因卖家原因导致运费不足，差价由买家承担。</p>
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                            <h5 className="font-bold text-yellow-900 mb-2 text-sm">3. 站内汇率说明</h5>
                            <ul className="text-[10px] text-yellow-800 space-y-1">
                                <li>汇率 = 当日外汇牌价 + 银行转换费 + 国际结算手续费。</li>
                                <li>钱包支付以日元结算，第三方支付（微信/支付宝）以人民币结算。</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">代购手续费标准</h4>
                    <p className="text-[10px] text-gray-400 mb-2">执行时间：2025年5月1日10:00 - 12月31日10:00 (北京时间)</p>
                    
                    <div className="space-y-3">
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-3 py-2 font-bold text-gray-700 text-xs">指定购买手续费</div>
                            <div className="p-3 text-xs text-gray-600 space-y-1">
                                <div className="flex justify-between"><span>≤ 1000日元</span><span>固收 50日元</span></div>
                                <div className="flex justify-between"><span>1001 - 14999日元</span><span>固收 7%</span></div>
                                <div className="flex justify-between"><span>15000 - 29999日元</span><span>固收 1%</span></div>
                                <div className="flex justify-between font-bold text-green-600"><span>≥ 30000日元</span><span>免手续费</span></div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-3 py-2 font-bold text-gray-700 text-xs">普通站点自助购买 (煤炉/骏河屋/Rakuma等)</div>
                            <table className="w-full text-xs text-left">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr><th className="p-2">金额区间</th><th className="p-2">优购</th><th className="p-2">折扣购</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr><td className="p-2">≤ 1000</td><td className="p-2">50日元</td><td className="p-2 font-bold text-green-600">0</td></tr>
                                    <tr><td className="p-2">1001-1999</td><td className="p-2">5%</td><td className="p-2 font-bold text-green-600">0</td></tr>
                                    <tr><td className="p-2">2000-4999</td><td className="p-2">4%</td><td className="p-2 font-bold text-green-600">0</td></tr>
                                    <tr><td className="p-2">5000-14999</td><td className="p-2">3%</td><td className="p-2 font-bold text-green-600">0</td></tr>
                                    <tr><td className="p-2">≥ 15000</td><td className="p-2 font-bold text-green-600" colSpan={2}>免手续费</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-3 py-2 font-bold text-gray-700 text-xs">拍卖站点 & 其他 (雅虎/Teway+等)</div>
                            <div className="p-3 text-xs text-gray-600 space-y-1">
                                <p className="mb-2 text-[10px] text-gray-400">* 仅支持【优购】模式</p>
                                <div className="flex justify-between"><span>≤ 1000日元</span><span>50日元</span></div>
                                <div className="flex justify-between"><span>1001 - 1999日元</span><span>5%</span></div>
                                <div className="flex justify-between"><span>2000 - 4999日元</span><span>4%</span></div>
                                <div className="flex justify-between"><span>5000 - 14999日元</span><span>3%</span></div>
                                <div className="flex justify-between font-bold text-green-600"><span>≥ 15000日元</span><span>免手续费</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">寄送至日本境内的特殊费用</h4>
                    <p className="text-xs text-gray-600 mb-3">根据日本《消费税法》，寄送至日本国内地址（私人地址、转运仓等）需缴纳消费税及出库服务费。</p>
                    
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-xs space-y-3">
                        <div>
                            <span className="font-bold text-red-800 block mb-1">1. 消费税 (10%)</span>
                            <p className="text-red-700">基准 = (商品金额 + 手续费 + 到付运费) × 10%</p>
                        </div>
                        <div>
                            <span className="font-bold text-red-800 block mb-1">2. 出库服务费</span>
                            <p className="text-red-700">每笔OR订单固定收取 <span className="font-bold">300日元</span></p>
                        </div>
                        <div>
                            <span className="font-bold text-red-800 block mb-1">3. 注意事项</span>
                            <ul className="list-disc pl-4 text-red-700 space-y-1">
                                <li>使用优惠券需返还优惠金额。</li>
                                <li>未支付上述费用将暂停出库。</li>
                            </ul>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-red-100 mt-2">
                            <span className="font-bold text-red-900 block mb-1">🧮 计算示例：</span>
                            <p className="text-red-800 leading-relaxed">
                                商品1000 + 运费200 + 手续费0 <br/>
                                消费税 = (1000+0+200)×10% = 120<br/>
                                服务费 = 300<br/>
                                <span className="font-bold">合计应付 = 1200(本金) + 120(税) + 300(费) = 1620日元</span>
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 border-l-4 border-yellow-500 pl-3">国际物流与关税</h4>
                    <div className="space-y-4">
                        <div>
                            <h5 className="font-bold text-gray-900 mb-1">国际物流费</h5>
                            <p className="text-xs text-gray-600">按包裹重量和选择的路线（EMS/顺丰/品类专线等）收取。含打包箱子费用。</p>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-900 mb-1">关税说明</h5>
                            <div className="grid grid-cols-1 gap-2 mt-1">
                                <div className="bg-gray-50 p-2 rounded text-xs">
                                    <span className="font-bold text-red-500">[税费自理]</span> EMS、国际书留、国际邮包系列
                                </div>
                                <div className="bg-gray-50 p-2 rounded text-xs">
                                    <span className="font-bold text-green-500">[税费预付]</span> 顺丰、中通、申通、品类专线 (多退少补，以物流方为准)
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    },
    { title: "隐私保护", tags: ["安全", "协议", "隐私", "政策"] },
    { 
        title: "面单规范协议", 
        tags: ["物流", "协议"],
        content: (
            <>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                    <h4 className="font-bold text-blue-900 mb-2">尊敬的乐酷淘用户:</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        为配合国家海关监管政策，避免因申报信息不实造成的清关退件、销毁或罚款风险，乐酷淘平台严格执行《海关申报真实规范》要求，请您在按照页面提示确认同意本协议之前，应当认真阅读本协议并完全理解本条内容，对自身风险承担能力做出判断。如您对协议有任何疑问，可向乐酷淘客服咨询。
                    </p>
                </div>

                <div className="space-y-6 text-sm text-gray-700">
                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-3">1. 确保所有提交的面单信息真实合法，如实申报(海关监管核心规则)</h4>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                            <div>
                                <span className="font-bold text-gray-900 block mb-1">商品数量：</span>
                                <span className="text-gray-600">与包裹实际商品数量一致，不可多报/少报；</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block mb-1">商品名称：</span>
                                <span className="text-gray-600">必须具体+准确描述，避免模糊用词(如“日用品”、“配件”)；</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block mb-1">商品金额：</span>
                                <span className="text-gray-600">按实际购买价格如实申报，禁止低报或随意编造；金额为"商品购买价格（含岛内运费）+平台手续费"的总和。</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">2. 个人自用原则</h4>
                        <p className="leading-relaxed">根据相关法律规定，通过各路线寄送的包裹，仅限个人自用，不得进行二次销售。</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">3. 违规责任承担</h4>
                        <p className="leading-relaxed mb-4">
                            如因用户故意或重大过失提供虚假面单信息、违规申报，导致包裹被海关查扣、处罚等，由此造成的危害、损失或者其他风险，由用户自行承担，乐酷淘平台概不承担任何责任。且用户应赔偿乐酷淘平台因此产生的全部损失（包括但不限于罚款、律师费、商誉损失）。
                        </p>
                        
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <h5 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                                <AlertTriangle size={18}/> 违规申报用户将可能面临以下结果:
                            </h5>
                            <ul className="list-disc pl-5 space-y-2 text-red-700">
                                <li>包裹被海关扣押、退运或销毁;</li>
                                <li>可能被判定为规避税收，被列入重点监管或失信名单;</li>
                                <li>被处以罚款或行政处罚，情节严重的，依法追究刑事责任;</li>
                            </ul>
                        </div>
                    </section>

                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-800 mt-6">
                        <p className="font-medium leading-relaxed">
                            乐酷淘请求用户如实申报，既是对您自身权益的保护，也有助于平台良性发展。请您务必重视并配合，确保所提交的信息真实合法。感谢您的理解与支持！
                        </p>
                    </div>
                </div>
            </>
        )
    },
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