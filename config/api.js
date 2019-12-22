// 以下是业务服务器API地址
// 本机开发时使用
let WxApiRoot = 'http://47.105.235.37:8080/shop/';
// let WxApiRoot = 'https://wx.huaxi.bbjson.com/wx/';
// 局域网测试使用
// let WxApiRoot = 'http://192.168.31.156:8080/wx/';
// 云平台部署时使用
// let WxApiRoot = 'http://122.152.206.172:8080/wx/';
// 云平台上线时使用
// let WxApiRoot = 'https://www.menethil.com.cn/wx/';

module.exports = {
  // 首页
  bannerUrl: WxApiRoot + 'home/banner',//首页banner
  MomentsUrl: WxApiRoot + 'moments/list', //首页推荐列表
  publistPic: WxApiRoot + 'moments/create', //发布图片或文章
  sharedelete: WxApiRoot + 'moments/delete', //删除文章或图片
  MomentsaddWatch: WxApiRoot + 'moments/addWatch', //首页推荐列表
  MomentsUpvote: WxApiRoot + 'moments/saveUserUpvote', //点赞
  CommentPost: WxApiRoot + 'comment/post', //发表评论
  CollectAddOrDelete: WxApiRoot + 'collect/addordelete', //添加或取消收藏
  SearchIndex: WxApiRoot + 'search/search', //搜索关键字
  // 花市
  IndexUrl: WxApiRoot + 'home/index', //花市数据接口
  GoodsList: WxApiRoot + 'goods/list', //获得商品列表
  GoodsDetail: WxApiRoot + 'goods/detail', //获得商品的详情

  //购物车部分
  CartAdd: WxApiRoot + 'cart/add', // 添加商品到购物车
  CartList: WxApiRoot + 'cart/index', //获取购物车的数据
  CartChecked: WxApiRoot + 'cart/checked', // 选择或取消选择商品
  CartUpdate: WxApiRoot + 'cart/update', // 更新购物车的商品
  CartDelete: WxApiRoot + 'cart/delete', // 删除购物车的商品
  CartCheckout: WxApiRoot + 'cart/checkout', // 下单前信息确认
  GetWiKiTital: WxApiRoot + 'wiki/getWiKiTital', // 商品是否有关联百科
  Kuaidiniao: WxApiRoot + 'kuaidiniao/InstantQuery', // 查看物流信息
  OrderSubmit: WxApiRoot + 'order/submit', // 提交订单
  OrderPrepay: WxApiRoot + 'order/prepay', // 订单的预支付会话   /wx/order/canPayTime
  OrdercanPayTime: WxApiRoot + 'order/canPayTime', // 订单的预支付会话
  OrderList: WxApiRoot + 'order/list', //订单列表
  OrderDetail: WxApiRoot + 'order/detail', //订单详情
  OrderRefund: WxApiRoot + 'order/refund', //退款取消订单
  OrderDelete: WxApiRoot + 'order/delete', //删除订单
  
  //个人中心部分
  UserIndex: WxApiRoot + 'user/myPage', //个人页面用户相关信息
  UsermyMoment: WxApiRoot + 'moments/myMoment', //我的花房或他人的主页
  UsermyWatch: WxApiRoot + 'moments/myWatch', //我的关注
  Usermyfans: WxApiRoot + 'moments/myFans', //我的粉丝
  UsermyBeupvote: WxApiRoot + 'moments/myBeupvote', //收到的赞
  UsercollectArcticle: WxApiRoot + 'collect/list', //我收藏的文章
  AuthLoginByWeixin: WxApiRoot + 'users/signupByOpenId', //微信登录
  AddressList: WxApiRoot + 'address/list', //收货地址列表
  AddressDetail: WxApiRoot + 'address/detail', //收货地址详情
  AddressSave: WxApiRoot + 'address/save', //保存收货地址
  AddressDelete: WxApiRoot + 'address/delete', //删除收货地址
  RegionList: WxApiRoot + 'region/list', //获取区域列表
  Noticelist: WxApiRoot + 'notice/list', //通知消息
  CommentList: WxApiRoot + 'comment/myComment', //收到的评论

  // 大全
  WikiList: WxApiRoot + 'wiki/list', //大全列表商品
  WikiTree: WxApiRoot + 'wiki/tree', //大全列表分类
  WiKiDetail: WxApiRoot + 'wiki/detail', //大全详情
  

  // TOP百科
  TopicType: WxApiRoot + 'topic/getWikiType', //百科类型
  TopicList: WxApiRoot + 'topic/list', //百科列表
  TopicDetail: WxApiRoot + 'topic/detail', //专题详情
  TopicRelated: WxApiRoot + 'topic/related', //相关专题

  // 图片上传
  StorageUpload: WxApiRoot + 'storage/upload', //图片上传,
  UserComeDays: WxApiRoot + 'user/comeDays', //来花兮的第多少天,
  FeedbackAdd: WxApiRoot + 'feedback/submit', //添加反馈

  // GoodsNew: WxApiRoot + 'goods/new', //新品
  // GoodsHot: WxApiRoot + 'goods/hot', //热门
  // CatalogList: WxApiRoot + 'catalog/index', //分类目录全部分类数据接口
  // CatalogCurrent: WxApiRoot + 'catalog/current', //分类目录当前分类数据接口
  // AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  // AuthRegister: WxApiRoot + 'auth/register', //账号注册
  // AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  // AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  // AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号

  // GoodsCount: WxApiRoot + 'goods/count', //统计商品总数
  
  // GoodsCategory: WxApiRoot + 'goods/category', //获得分类数据

  // GoodsRelated: WxApiRoot + 'goods/related', //商品详情页的关联商品（大家都在看）

  // BrandList: WxApiRoot + 'brand/list', //品牌列表
  // BrandDetail: WxApiRoot + 'brand/detail', //品牌详情
  // CartGoodsCount: WxApiRoot + 'cart/goodscount', // 获取购物车商品件数
  
  // CollectList: WxApiRoot + 'collect/list', //收藏列表
  
  // CommentCount: WxApiRoot + 'comment/count', //评论总数
  
  
  // SearchResult: WxApiRoot + 'search/result', //搜索结果
  // SearchHelper: WxApiRoot + 'search/helper', //搜索帮助
  // SearchClearHistory: WxApiRoot + 'search/clearhistory', //搜索历史清楚
  // ExpressQuery: WxApiRoot + 'express/query', //物流查询

  
  

  // OrderCancel: WxApiRoot + 'order/cancel', //取消订单
  // OrderConfirm: WxApiRoot + 'order/confirm', //确认收货
  // OrderComment: WxApiRoot + 'order/comment', // 代评价商品信息


  // FootprintList: WxApiRoot + 'footprint/list', //足迹列表
  // FootprintDelete: WxApiRoot + 'footprint/delete', //删除足迹

  // UserFormIdCreate: WxApiRoot + 'formid/create', //用户FromId，用于发送模版消息



  

};