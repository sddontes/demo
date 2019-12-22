let _canvas = {};

// 绘图或绘制圆图
_canvas.drawPic = (opts) => {
  let _opts = {
    type: 'default',
    dx: 0, //图像的左上角在目标 canvas 上 x 轴的位置
    dy: 0, // 图像的左上角在目标 canvas 上 y 轴的位置
    dWidth: 64,   //图像的宽度
    dHeight: 64,  //图像的高度
    path: ''  //图片路径
  };
  let options = Object.assign(_opts, opts);
  let _ctx = options.ctx;

  if (options.type == 'default') {

    _ctx.drawImage(options.path, options.dx, options.dy, options.dWidth, options.dHeight);

  } else {
    // CanvasContext.arc(x, y, r, sAngle, eAngle, counterclockwise)
    // x:圆心x的坐标，y:圆心y的坐标，r:圆的半径，sAngle:起始弧度，eAngle:终止弧度,counterclockwise:弧度的方向是否是逆时针
    // type == avatar
    _ctx.save();
    _ctx.beginPath();
    // 画半径为dx/2的圆
    _ctx.arc(options.dx + options.dWidth / 2, options.dy + options.dHeight / 2, options.dHeight / 2, 0, 2 * Math.PI);
    //剪切出画的区域圆
    _ctx.clip();
    //在该区域画图，级生成圆角图片
    _ctx.drawImage(options.path, options.dx, options.dy, options.dWidth, options.dHeight);
    //恢复之前的绘图
    _ctx.restore();
  };
};

_canvas.writeText = (opts, cb) => {
  //set font styles && filltext
  let fillText = (_ctx, options, _txt, _dx, _dy) => {
    _ctx.font = '24px PingFangSC-Light'
    _ctx.setFillStyle(options.color);
    _ctx.setFontSize(options.font);
    _ctx.setTextBaseline(options.baseLine);
    _ctx.setTextAlign(options.align);
    _ctx.fillText(_txt, _dx, _dy);
  };

  let _opts = {
    ctx: null, //Object
    font: 14,
    color: '#353535',
    txt: '',//write contents
    align: 'left', //text-align
    baseLine: 'middle',
    dx: 0,
    dy: 0,
    type: 'defalut', //limit 限制区域显示 超出隐藏
    limitWidth: 0,
    //limitHeight: 0,
    limitLines: 1,
    lineHeight: 14
  };

  let options = Object.assign({}, _opts, opts);
  let _ctx = options.ctx;

  if (options.type == 'limit') {

    _ctx.save();
    _ctx.beginPath();
    //设置矩形区域 超出隐藏
    // _ctx.rect(options.dx, options.dy - 10, options.limitWidth, options.limitHeight + 10);
    // _ctx.clip();

    let curLines = 0; //现在在画第几行
    let startIndex = 0;
    let endIndex = 0;
    let curLength = 0;//当前行 已画长度

    for (let j = 0; j < options.txt.length; j++) {
      if (options.txt.charCodeAt(j) > 128) {
        curLength = curLength + options.font
      } else {
        curLength = curLength + options.font / 2
      };
      if (curLength > options.limitWidth || curLength < options.limitWidth && j == options.txt.length - 1) {
        endIndex = j - 1;
        if (j == options.txt.length - 1) {
          fillText(_ctx, options, options.txt.substring(startIndex, endIndex + 2), options.dx, options.dy + curLines * options.lineHeight);

        } else {
          fillText(_ctx, options, options.txt.substring(startIndex, endIndex + 1), options.dx, options.dy + curLines * options.lineHeight);
        };
        if (options.limitLines == curLines) return;//截止
        curLines++;
        startIndex = j;
        if (options.txt.charCodeAt(j) > 128) {
          curLength = options.font
        } else {
          curLength = options.font / 2
        };
      }
    };
    //_ctx.restore();

  } else {
    let _width = 0;
    for (let m = 0; m < options.txt.length; m++) {
      if (options.txt.charCodeAt(m) > 128) {
        _width = _width + options.font
      } else {
        _width = _width + options.font / 2
      };
    }
    fillText(_ctx, options, options.txt, options.dx, options.dy);
    cb && cb(_width);
  }
};

_canvas.writeSpecialText = (opts, cb) => {

  //set font styles && filltext
  let fillText = (_ctx, options, _txt, _dx, _dy) => {
    _ctx.font = '12px PingFangSC-Light'
    _ctx.setFillStyle(options.color);
    _ctx.setFontSize(options.font);
    _ctx.setTextBaseline(options.baseLine);
    _ctx.setTextAlign(options.align);
    _ctx.fillText(_txt, _dx, _dy);
  };

  let _opts = {
    ctx: null, //Object
    font: 14,
    color: '#353535',
    txt: '',//write contents
    align: 'left', //text-align
    baseLine: 'middle',
    dx: 0,
    dy: 0,
    type: 'defalut', //limit 限制区域显示 超出隐藏
    limitWidth: 0,
    //limitHeight: 0,
    limitLines: 1,
    lineHeight: 14
  };
  let options = Object.assign({}, _opts, opts);
  let _ctx = options.ctx;
  /**用@@@@@&&&&&替换文本内回车 */
  options.txt = options.txt.replace(/[\n]/g, "@@@@@&&&&&");
  let arr = options.txt.split('@@@@@&&&&&');
  let length = arr.length;

  let curLines = 1; //现在在画第几行
  let curLength = 0;//当前行 已画长度
  let startIndex = 0;
  let endIndex = 0;

  for (var k = 0; k < length; k++) {

    let str = arr[k]; //当前循环的字符串
    if (str == '') {
      if (options.limitLines == curLines) {
        return;
      };
      curLines++;
      curLength = 0;//当前行 已画长度
      startIndex = 0;
      endIndex = 0;
      continue;
    };
    for (let j = 0; j < str.length; j++) {

      /**
      if (str.charCodeAt(j) > 128) {
        curLength = curLength + options.font
      } else {
        curLength = curLength + options.font / 2
      };
      */

      curLength = _ctx.measureText(str.substring(startIndex, j + 1)).width;

      if (curLength > options.limitWidth || curLength < options.limitWidth && j == str.length - 1) {
        /**当前序列已花完 未超长 */
        if (j == str.length - 1) {
          //console.log(str.substring(startIndex, endIndex + 1), curLines);
          endIndex = j;
          fillText(_ctx, options, str.substring(startIndex, endIndex + 1), options.dx, options.dy + (curLines - 1) * options.lineHeight);
        }
        /**当前序列未花完 超长 */
        else {
          //console.log(str.substring(startIndex, endIndex + 1), curLines);
          endIndex = j - 1;
          fillText(_ctx, options, str.substring(startIndex, endIndex + 1), options.dx, options.dy + (curLines - 1) * options.lineHeight);
        };

        if (options.limitLines == curLines) return;//截止
        curLines++;
        startIndex = j;

        /**
        if (str.charCodeAt(j) > 128) {
          curLength = options.font
        } else {
          curLength = options.font / 2
        };
        */

      };
    };

    if (options.limitLines == curLines - 1) return;//截止
    curLength = 0;//当前行 已画长度
    startIndex = 0;
    endIndex = 0;
  };
};


module.exports = {
  _canvas: _canvas
}