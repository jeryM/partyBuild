
function  getToken(callback){
  $cs.getRmCmd('getToken','',function(ret,err){
    console.log("getToken-ret:"+JSON.stringify(ret));
    if(ret.token!='' && ret.token!=null){
      console.log("ret.token:"+ret.token);
      if(!$cs.isNull(callback))
         callback(ret);
    }
  });

}

//rongCloud 初始化并且连接  必须要执行的方法

function rongchat(){
       var rong = api.require('rongCloud2');
      //初始化
        rong.init(function(ret, err) {
          if(ret.status=='success'){
            //api.toast("初始化成功");
            console.log("初始化成功"+JSON.stringify(ret));
          }
            if (ret.status == 'error'){
              //api.toast("初始化失败："+{ msg: err.code });
              console.log("初始化失败："+JSON.stringify(err));
            }
        });
      //设置连接状态变化的监听器
        rong.setConnectionStatusListener(function(ret, err) {
        //api.toast("正在监听:"+{ msg: ret.result.connectionStatus });
             console.log("正在监听:"+JSON.stringify(ret));
        });
      //设置接收消息的监听器
        setOnReceiveMessageListener();

     var token;
     getToken(function callback(ret){
          token=ret.token;
      });
      //连接融云 IM 服务器
     setTimeout(function(){
       console.log("连接IM-token:"+token);
       getconnectIM(rong,token);
     },1000);

}//rongchat end

//connect  IM
function getconnectIM(rong,token,callback){
  var rong = api.require('rongCloud2');
  rong.connect({
    token: token
  },function(ret, err) {
    if (ret.status == 'success') {
      //包含userID和status
      console.log("connect-success-ret:"+JSON.stringify(ret));
      if(!$cs.isNull(callback))
      callback(ret,err);
    }
  });
}

  //设置接收消息的监听器
  function setOnReceiveMessageListener(){
      var rong = api.require('rongCloud2');
      rong.setOnReceiveMessageListener(function(ret, err) {
      console.log("ret.result.message:"+JSON.stringify(ret.result.message) );
      alert("ret.result.message:"+JSON.stringify(ret.result.message) );
      console.log("ret.result.message.left:"+ ret.result.message.left);
      alert("ret.result.message.left:"+ ret.result.message.left);
    });

  }



//发送文本消息
function  sendtextmessage(conversationType,targetId,text,extra){
    console.log("send:"+conversationType+","+targetId+","+text+","+extra);
    // 之前调用 init 和 connect 的代码省略
    var rong = api.require('rongCloud2');
    rong.sendTextMessage({
        conversationType: conversationType,  //消息类型
        targetId: targetId,   //接收方ID
        text: text,   //文本内容
        extra: extra   //附加消息
    }, function(ret, err) {
        if (ret.status == 'prepare'){
            api.toast({ msg: JSON.stringify(ret.result.message) });
            console.log("prepare"+JSON.stringify(ret.result.message));
        }else if (ret.status == 'success'){
            api.toast({ msg: ret.result.message.messageId });
            console.log("success" +JSON.stringify(ret.result.message.messageId) );
        }else if (ret.status == 'error'){
            api.toast({ msg: err.code });
            console.log("error"+err.code );
        }
    });
}

//接收历史消息
function getHistorymessage(callback){
  //先要获得历史最后一条
  var rong = api.require('rongCloud2');
  rong.getHistoryMessages({
    conversationType: 'PRIVATE',
    targetId: '18715082407',
    oldestMessageId: 13, //历史最后一条
    count: 20
 }, function(ret, err) {
    //alert({ msg: JSON.stringify(ret.result) });
    console.log("historymessage:"+ JSON.stringify(ret.result));
    //将接收到的消息添加到会话中
    if(!$cs.isNull(callback))
       callback(ret,err);

 });
}

//获取当前用户的会话id
function getCurrentUserId(){
  var result = null;
  var rong = api.require('rongCloud2');
  rong.getCurrentUserId(function(ret, err) {
    if(ret.result)
       result = ret.result ;
       console.log("result:"+result);
  });
  return result;
}
//-----------------------------------------------------//
/*UIChat start*/
//apicloud官方
function chatbox(){
  var UIChatBox = api.require('UIChatBox');
  UIChatBox.open({
      placeholder: '',
      maxRows: 4,
      emotionPath: 'widget://image/emotion',
      texts: {
          recordBtn: {
              normalTitle: '按住说话',
              activeTitle: '松开结束'
          },
          sendBtn: {
              title: '发送'
          }
      },
      styles: {
          inputBar: {
              borderColor: '#d9d9d9',
              bgColor: '#f2f2f2'
            //  borderColor:'#32CD32',
          },
          inputBox: {
              borderColor: '#B3B3B3',
              bgColor: '#FFFFFF'

          },
          emotionBtn: {//笑脸图标
              normalImg: 'widget://image/img/face1.png'
          },
          extrasBtn: {//附加功能按钮样式
              normalImg: 'widget://image/img/add1.png'
          },
          keyboardBtn: {//键盘按钮样式
              normalImg: 'widget://image/img/key1.png'
          },
        /*  speechBtn: {//输入框左侧按钮样式
              normalImg: 'widget://image/img/key1.png'
          },*/
          recordBtn: {//按住 录音”按钮的样式
              normalBg: '#c4c4c4',
              activeBg: '#999999',
              color: '#000',
              size: 14
          },
          indicator: {//表情和附加功能面板的小圆点指示器样式
              target: 'both',
              color: '#c4c4c4',
              activeColor: '#9e9e9e'
          },
          sendBtn: {//发送按钮样式
              titleColor: '#4cc518',
              bg: '#999999',
              activeBg: '#46a91e',
              titleSize: 14
          }
      },
      extras: {
          titleSize: 10,
          titleColor: '#a3a3a3',
          btns: [{
              title: '图片',
              normalImg: 'widget://image/img/album1.png',
              activeImg: 'widget://image/img/album2.png'
          }, {
              title: '拍照',
              normalImg: 'widget://image/img/cam1.png',
              activeImg: 'widget://image/img/cam2.png'
          }]
      }
  }, function(ret, err) {
      if (ret) {
          //alert(JSON.stringify(ret));
          console.log("chatbox-ret-json:"+JSON.stringify(ret));
          console.log("chatbox内容:"+ret.msg);
          //当发送信息时，除了将信息发送的页面，还是要将信息发送到rongIM,以及本地服务器备份
          if(ret.eventType=='send'){
            $api.append($api.byId('tul'),'<li class="right">'+transEmo(ret.msg)+'</li>');
            //发送文本消息
            sendtextmessage(conversationType,targetId,ret.msg,extra);

          }
      } else {
          //alert(JSON.stringify(err));
      }
  });
}

function button(){
  //监听 recordBtn 按钮
  var UIChatBox = api.require('UIChatBox');
  UIChatBox.addEventListener({
      target: 'recordBtn',
      name: 'press'
  }, function(ret, err) {
      if (ret) {
          alert(JSON.stringify(ret));
      } else {
          alert(JSON.stringify(err));
      }
  });

  //监听 inputBar
  //var UIChatBox = api.require('UIChatBox');
  UIChatBox.addEventListener({
      target: 'inputBar',
      name: 'move'
  }, function(ret, err) {
      if (ret) {
          //alert(JSON.stringify(ret));
      } else {
          //alert(JSON.stringify(err));
      }
  });

}

//文字表情转换
function transEmo(emoMsg){
  //表情配置信息
var emoData = [
    {"name": "Expression_1","text": "[微笑]"},
    {"name": "Expression_2","text": "[撇嘴]"},
    {"name": "Expression_3","text": "[色]"},
    {"name": "Expression_4","text": "[发呆]"},
    {"name": "Expression_5","text": "[得意]"},
    {"name": "Expression_6","text": "[流泪]"},
    {"name": "Expression_7","text": "[害羞]"},
    {"name": "Expression_8","text": "[闭嘴]"},
    {"name": "Expression_9","text": "[睡]"},
    {"name": "Expression_10","text": "[大哭]"},
    {"name": "Expression_11","text": "[尴尬]"},
    {"name": "Expression_12","text": "[发怒]"},
    {"name": "Expression_13","text": "[调皮]"},
    {"name": "Expression_14","text": "[呲牙]"},
    {"name": "Expression_15","text": "[惊讶]"},
    {"name": "Expression_16","text": "[难过]"},
    {"name": "Expression_17","text": "[酷]"},
    {"name": "Expression_18","text": "[冷汗]"},
    {"name": "Expression_19","text": "[抓狂]"},
    {"name": "Expression_20","text": "[吐]"},
    {"name": "Expression_21","text": "[偷笑]"},
    {"name": "Expression_22","text": "[愉快]"},
    {"name": "Expression_23","text": "[白眼]"},
    {"name": "Expression_24","text": "[傲慢]"},
    {"name": "Expression_25","text": "[饥饿]"},
    {"name": "Expression_26","text": "[困]"},
    {"name": "Expression_27","text": "[恐惧]"},
    {"name": "Expression_28","text": "[流汗]"},
    {"name": "Expression_29","text": "[憨笑]"},
    {"name": "Expression_30","text": "[悠闲]"},
    {"name": "Expression_31","text": "[奋斗]"},
    {"name": "Expression_32","text": "[咒骂]"},
    {"name": "Expression_33","text": "[疑问]"},
    {"name": "Expression_34","text": "[嘘]"},
    {"name": "Expression_35","text": "[晕]"},
    {"name": "Expression_36","text": "[疯了]"},
    {"name": "Expression_37","text": "[衰]"},
    {"name": "Expression_38","text": "[骷髅]"},
    {"name": "Expression_39","text": "[敲打]"},
    {"name": "Expression_40","text": "[再见]"},
    {"name": "Expression_41","text": "[擦汗]"},
    {"name": "Expression_42","text": "[抠鼻]"},
    {"name": "Expression_43","text": "[鼓掌]"},
    {"name": "Expression_44","text": "[糗大了]"},
    {"name": "Expression_45","text": "[坏笑]"},
    {"name": "Expression_46","text": "[左哼哼]"},
    {"name": "Expression_47","text": "[右哼哼]"},
    {"name": "Expression_48","text": "[哈欠]"},
    {"name": "Expression_49","text": "[鄙视]"},
    {"name": "Expression_50","text": "[委屈]"},
    {"name": "Expression_51","text": "[快哭了]"},
    {"name": "Expression_52","text": "[阴险]"},
    {"name": "Expression_53","text": "[亲亲]"},
    {"name": "Expression_54","text": "[吓]"},
    {"name": "Expression_55","text": "[可怜]"},
    {"name": "Expression_56","text": "[菜刀]"},
    {"name": "Expression_57","text": "[西瓜]"},
    {"name": "Expression_58","text": "[啤酒]"},
    {"name": "Expression_59","text": "[篮球]"},
    {"name": "Expression_60","text": "[乒乓]"},
    {"name": "Expression_61","text": "[咖啡]"},
    {"name": "Expression_62","text": "[饭]"},
    {"name": "Expression_63","text": "[猪头]"},
    {"name": "Expression_64","text": "[玫瑰]"},
    {"name": "Expression_65","text": "[凋谢]"},
    {"name": "Expression_66","text": "[嘴唇]"},
    {"name": "Expression_67","text": "[爱心]"},
    {"name": "Expression_68","text": "[心碎]"},
    {"name": "Expression_69","text": "[蛋糕]"},
    {"name": "Expression_70","text": "[闪电]"},
    {"name": "Expression_71","text": "[炸弹]"},
    {"name": "Expression_72","text": "[刀]"},
    {"name": "Expression_73","text": "[足球]"},
    {"name": "Expression_74","text": "[瓢虫]"},
    {"name": "Expression_75","text": "[便便]"},
    {"name": "Expression_76","text": "[月亮]"},
    {"name": "Expression_77","text": "[太阳]"},
    {"name": "Expression_78","text": "[礼物]"},
    {"name": "Expression_79","text": "[拥抱]"},
    {"name": "Expression_80","text": "[强]"},
    {"name": "Expression_81","text": "[弱]"},
    {"name": "Expression_82","text": "[握手]"},
    {"name": "Expression_83","text": "[胜利]"},
    {"name": "Expression_84","text": "[抱拳]"},
    {"name": "Expression_85","text": "[勾引]"},
    {"name": "Expression_86","text": "[拳头]"},
    {"name": "Expression_87","text": "[差劲]"},
    {"name": "Expression_88","text": "[爱你]"},
    {"name": "Expression_89","text": "[NO]"},
    {"name": "Expression_90","text": "[OK]"},
    {"name": "Expression_91","text": "[爱情]"},
    {"name": "Expression_92","text": "[飞吻]"},
    {"name": "Expression_93","text": "[跳跳]"},
    {"name": "Expression_94","text": "[发抖]"},
    {"name": "Expression_95","text": "[怄火]"},
    {"name": "Expression_96","text": "[转圈]"},
    {"name": "Expression_97","text": "[磕头]"},
    {"name": "Expression_98","text": "[回头]"},
    {"name": "Expression_99","text": "[跳绳]"},
    {"name": "Expression_100","text": "[投降]"},
    {"name": "Expression_101","text": "[激动]"},
    {"name": "Expression_102","text": "[街舞]"},
    {"name": "Expression_103","text": "[献吻]"},
    {"name": "Expression_104","text": "[左太极]"},
    {"name": "Expression_105","text": "[右太极]"}
];

    var emoPath, transMsg;
                var reg = /\[(.*?)\]/gm;
                transMsg = emoMsg.replace(reg, function(match) {
                        for (var i = 0, len = emoData.length; i < len; i++) {
                                if (emoData[i].text === match) {
                                        emoPath = '../../image/emotion/' + emoData[i].name + '.png';
                                        return '<img  src="' + emoPath + '" />'
                                }
                        }
                        return match;
                });
                return transMsg;
}
