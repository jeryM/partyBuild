/*
 * csoft frame work script
 * Copyright (c) koyochen@sina.com
   create: 2017.06.05

*/
(function(window) {
    var u = {};//定义函数变量

    var isApp = true;     // 是否是 App 状态
    u.getIsApp = function(){
        return isApp;
    }

    // 常用函数
    // 对象是否为空
    function isNull(obj) {
        if ((obj == undefined) || (obj == null)) return true;
        if ((typeof(obj) == "number") && (obj == 0)) return false; // 数字0

        if ((obj == '') || (obj == 'undefined'))
            return (true);
        else
            return (false);
    }

    // 取系统 root url
    u.getAppPath = function() {
        if (csAppInfo.isDebug == true)
            return csAppInfo.appPathDebug
        else
            return csAppInfo.appPath;
    }

    // 取本软件的 url
    u.getSoftUrl = function() {
        return u.getAppPath() + csAppInfo.softId.toLowerCase();
    }

    // 取数据专用 url(专用于和 mobile 数据交互)
    u.getDataUrl = function() {
        return u.getSoftUrl() + "/funcmobile.action";
    }

    // 对象是否为空
    u.isNull = function(v) {
        return (isNull(v));
    }

    // string to json
    u.strToJson = function(str){
      var json = eval('(' + str + ')');
      return json;
    }

    // 生成 guid
    u.guid = function() {
    	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	    return v.toString(16);
    	  });
    }

    // 显示对象内容（调试时用）
    u.showObj = function(obj) {
        var i = 0;
        for (var p in obj) {
            i++;
            if (i > 15) break;
            alert(p + '=' + obj[p]);
        }
    }

    // 合并对象到第一个对象
    u.mergeObj = function(objDest, objSrc) {
        if (objDest == objSrc) return objDest; // 两个对象相等

        if (isNull(objDest)) {
            objDest = objSrc;
            return objDest;
        }

        if (isNull(objSrc)) {
            return objDest;
        }

        if ((typeof(objDest) == 'object') && (typeof(objSrc) == 'object')) {} else {
            alert('合并对象两个类型必须均为 object')
            return objDest;
        }

        for (var p in objSrc) {
            var prop = objSrc[p];
            if ((prop == undefined) || (prop == null) || (prop == 'undefined')) {
                /*
                if (p in objDest){      // 需要删除
                     delete objDest.p;
                } */
                continue;
            } else{
                /*
                console.log(typeof(p));
                if (typeof(p) == 'object'){
                    var v = {};
                    u.mergeObj(v, prop);

                    objDest[p] = v;
                }else */
                objDest[p] = prop;
            }
        }

        return objDest;
    }

    // 显示obj内容
    u.log = function(obj){
        console.log($api.jsonToStr(obj));
    }

    // url 解析 begin
	// 返回 不带参数的 url
	u.paramUrl = function(url) {
	    if(url.indexOf("?")<0)
	    	return url;

	    return(url.substring(0, url.indexOf("?")));
	}

	// 返回参数字符串
	u.paramString = function(url) {
	    if(url.indexOf("?")==-1)
	    	return "";

	    return(url.substring(url.indexOf("?")+1));
	}

	// 编码参数
	u.addPageParam = function(rawUrl, param) {
		if (isNull(param)) return rawUrl;

		var result = "&";
		for (o in param) {
			if (isNull(param[o]))
				result += encodeURIComponent(o.toString()) + "=" + "" + "&";
			else
				result += encodeURIComponent(o.toString()) + "=" + encodeURIComponent(param[o].toString()) + "&";
		}
		result = result.substring(1, result.length - 1);
		return rawUrl + "?" + result;
	}

	// 返回参数字符串数组
	u.parsePageParam = function(url) {
	    var uri = u.paramString(url);
	    if (isNull(uri))
	    	return null;
	    else{
	    	var arr = uri.split("&");
	    	var obj = {};
	    	for(var i=0; i<arr.length; i++){
	    		var arrV = arr[i].split("=");
	    		var name = arrV[0];
	    		var value = "";
	    		if (arrV.length>1)
	    			value = arrV[1];

	    		obj[name] = value;
	    	}
	    	return (obj);
	    }
	}
    // url 解析 end

    // 封装 api 主要函数, 在系统中尽量使用 $cs. 调用 begin
    // 显示消息
    u.showMsg = function(msg) {
    	if (isApp){
    		api.toast({
    			msg: msg
    		});
    	}else
    		alert(msg);
    }

    u.parseTapmode = function() {
        if (isApp)
        	api.parseTapmode();
    }

    u.refreshHeaderLoadDone = function(){
    	if(isApp){
    		api.refreshHeaderLoadDone();
    	}
    }

    u.getWinHeight = function() {
    	if(isApp)
    		return (api.winHeight);
    	else
    		return screen.availHeight;
    }

    // 取设备参数
    u.getDeviceId = function() {
    	if(isApp){
    		return (api.deviceId);
    	}else{
    		var devid = $api.getStorage('devid_guid');
    		if (isNull(devid)){
    			devid = u.guid();			// 生成一组随机数
    			$api.getStorage("devid_guid", devid);
    		}
    		return devid;
    	}
    }

    u.getDeviceName = function() {
    	if(isApp){
    		return (api.deviceName);
    	}else{
    		return u.getDeviceId();
    	}
    }

    // 取当前页的参数
    u.getPageParam = function() {
        return (api.pageParam);
    }

    // 设置 frame 是否可见
    u.setFrameVisible = function(name, bVisible){
    	if (isApp){
	        api.setFrameAttr({
	            name: name,
	            hidden: !bVisible
	        });
    	}
    }

    // 执行 execScript
    u.execScript = function(winName, script) {
    	if (isApp){
	        api.execScript({
	            name: winName,
	            script: script
	        })
    	}else{
    		eval("window.opener." + script);
    		// window.opener.query();
    	}
    }

    // 显示进度
    u.showProgress = function(sTitle) {
    	if(isApp){
	        api.showProgress({
	            title: sTitle,
	            modal: false
	        });
    	}
    }

    u.hideProgress = function() {
    	if(isApp){
    		api.hideProgress();
    	}
    }

    // 关闭 form
    u.closeWin = function() {
    	if(isApp){
    		api.closeWin({});
    	}else{
    		window.close();
    	}
    }

    u.closeFrame = function() {
    	if(isApp){
    		api.closeFrame({});
    	}else{
    		window.close();
    	}
    }

    u.openWin = function(name, url, pageParam, objParam) {
        if (isNull(url)) url = name + '.html';

        if (isApp){
	        var v = {
	            name: name,
	            url: url,
	            pageParam: pageParam
	        };
	        u.mergeObj(v, objParam);

	        api.openWin(v);
    	}else{
    		var str = "";
    		var height = screen.availHeight - 50;
    		var	width = screen.availWidth;

    		str = "dialogHeight:" + height + "px;dialogWidth:" + width + "px;scroll:no;status:no";

    		url = u.addPageParam(url, pageParam);

    		window.showModalDialog(url,name,str);
    		// window.open(url, name, str);
    	}
    }

    u.openFrame = function(name, url, pageParam, objParam) {
        if (isNull(url)) url = name + '.html';

        if(isApp){
	        var v = {
	            name: name,
	            url: url,
	            pageParam: pageParam
	        };
	        u.mergeObj(v, objParam);

	        api.openFrame(v);

    	}else{
    		var str = "";
    		var height = screen.availHeight - 25;
    		var	width = screen.availWidth - 10;

    		str = "dialogHeight:" + height + "px;dialogWidth:" + width + "px;scroll:no;status:no";


    		url = u.addPageParam(url, pageParam);

    		window.showModalDialog(url,name,str);
    	}
    }

    // 封装 api 主要函数, 在系统中尽量使用 $cs. 调用 end

    // 设置 徽章 id: domId
    // iCount 数字，<=0 时，则不显示
    u.setBadge = function(domId, iCount) {
        var dom = $api.byId(domId);
        if (iCount <= 0) {
            $api.addCls(dom, 'aui-invisible');
        } else {
            $api.removeCls(dom, 'aui-invisible');
        }
        $api.text(dom, iCount);
    }

    // 用户是否登录
    u.isLogin = function(){
        var ui = u.getUserInfo();
        return (ui!=null);
    }

    // 取当前用户信息, 用户信息是JSONObject, userguid, userid, username, usertype, departname, logintime, mobile
    // 如无登录用户，返回 null
    u.getUserInfo = function() {
    	var ui = $api.getStorage('csuserinfo');
        if (!isNull(ui)) {
            if (isNull(ui['userid'])) return null;

            var oTime = ui['logintime'];
            // 现在距离也是很长时间 return null;
            if (!isNull(oTime)) {
                try {
                    var loginDay = Date.parse(oTime);
                    var curDay = new Date();

                    var dayCount = (Math.abs(curDay - loginDay)) / 1000 / 60 / 60 / 24;
                    if (dayCount >= 10) { // 超过10天
                        pushUnbind(ui);         // 解绑用户
                        $api.rmStorage('csuserinfo');
                        return null;
                    }
                } catch (e) {} finally {}
            }
        }else {
            return null;
        }
        return (ui);
    }

    // 绑定消息用户
    u.pushBind = function(ui){
        // 绑定推送
        try {
            var push = api.require('push');			// 登录
            push.bind({
                userName: ui['username'],
                userId: ui['userid']
            }, function(ret, err){
            });
        } catch (e) {
        }
    }

    // 解绑消息用户
    u.pushUnbind = function(ui){
        try {
            var push = api.require('push');			// 登录
            push.unbind({
                userName: ui['username'],
                userId: ui['userid']
            }, function(ret, err){
            });

            push.leaveAllGroup();
        } catch (e) {
        }
    }

    // 原生 ajax，暂不可以上传文件
    u.webAjax = function(options){
    	options = options || {};
        options.type = (options.type || "POST").toUpperCase();
        options.dataType = options.dataType || "json";
        var params = null;
        if (!isNull(options.data)){
            var arr = [];
            for (var name in options.data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(options.data[name]));
            }
            params = arr.join("&");
        }

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                var ret = {};
                if (status >= 200 && status < 300){
                	if (options.dataType == "json") {
						try{
							ret = eval('(' + xhr.responseText + ')');
						}catch(e){
							ret = xhr.responseText;
						}
					} else{
						ret = xhr.responseText;
					}

            		options.success && options.success(ret);
                } else {
                	ret['status'] = status;
                    options.error && options.error(ret, ret);
                }
            }
        }

        //连接 和 发送 - 第二步
        try{
	        if (options.type == "GET") {
	            xhr.open("GET", options.url + "?" + params, true);
	            xhr.send(null);
	        } else if (options.type == "POST") {
	            xhr.open("POST", options.url, true);
	            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	            xhr.send(params);
	        }
        }catch(ex){
        	options.error && options.error(null, ex);
        }
    }

    // 上传数据，可以上传文件
    // valuesParam: object 值对； filesParam: 文件
    // callBackSuccess: 执行成功时调用的 callBack
    // callBackFailure: 执行失败时调用的 callBack
    // bSilent: 是否静默模式
    u.ajaxReqFile = function(url, valuesParam, filesParam, callBackSuccess, callBackFailure, bSilent) {
        var ui = u.getUserInfo();
        // if (isNull(ui)){  // 未登录，由服务器端处理

        var now = Date.now();
        var tVal = valuesParam;
        if (isNull(tVal)) tVal = {};
        if (ui != null) {
            tVal['csuserguid'] = ui['userguid'];
            tVal['csusertoken'] = SHA1(u.getDeviceId() + "CS" + ui['userid'] + "CS" + now) + "." + now;
        }

        var tUrl = url;
        if (tUrl.substring(0, 4).toLowerCase() == "http") {} else
            tUrl = u.getSoftUrl() + url;

        // console.log(tUrl);
        var bRetOk = true;

        if(isApp){
	        api.ajax({
	            url: tUrl,
	            method: 'POST',
	            data: {
	                files: filesParam,
	                values: tVal
	            }
	        }, function(ret, err) {
	            // add here, 默认的错误处置
	            if (bSilent != true) {
	                if (ret) {
	                    if (ret.success == false) { // 失败
	                        bRetOk = false;
	                        u.showMsg(ret.msg);
	                    }
	                } else {
	                    bRetOk = false;
	                    u.showMsg(err.msg);
	                }
	            }

	            if (bRetOk) {
	                if (!isNull(callBackSuccess)) callBackSuccess(ret, err);
	            } else {
	                if (!isNull(callBackFailure)) callBackFailure(ret, err);
	            }
	        });
        }else{
            u.webAjax({
          	  type: 'POST',
          	  url: tUrl,
          	  data: tVal,   // files 未处理好, unfinished
          	  /*
          	  data: {
          		  files: filesParam,
                  values: tVal
              }, */
          	  // type of data we are expecting in return:
          	  dataType: 'json',
          	  success: function(ret, err){
          		  if (bSilent != true) {
                        if (ret) {
                            if (ret.success == false) { // 失败
                                bRetOk = false;
                                u.showMsg(ret.msg);
                            }
                        } else {
                            bRetOk = false;
                            u.showMsg(err.msg);
                        }
                    }

                    if (bRetOk) {
                        if (!isNull(callBackSuccess)) callBackSuccess(ret, err);
                    } else {
                        if (!isNull(callBackFailure)) callBackFailure(ret, err);
                    }
          	  },
          	  error: function(ret, err){
          		  if (!isNull(callBackFailure)) callBackFailure(ret, err);
          	  }
          	})
        }
    }

    // 简易版的 post, 不含文件上传
    u.ajaxReq = function(url, valuesParam, callBackSuccess, callBackFailure, bSilent) {
        u.ajaxReqFile(url, valuesParam, null, callBackSuccess, callBackFailure, bSilent);
    }

    /*
       从选程取数据，并渲染到模板，暂不用
       url: 远程 url
       valuesParam: JSONObject 对象
       conPre: 模板名称（前缀），
               模板名称和内容id需满足规则：  conPre-template, conPre-content
               conPre为 city, 则模板id=city-template, 内容id=city-content
       doOtherFunc: function(ret, err)
       showProg: true, false
    */
    u.getRmDataByUrl = function(url, valuesParam, conPre, doOtherFunc, showProg) {
        // 要判断是否分页
        var bNeedPage = false;              // 是否需要分页

        if (!isNull(valuesParam)){           // 存在分页信息
            if (('csPageStart' in valuesParam)&&(valuesParam['csPageSize']>0)){      // 需要分页
                if ((valuesParam.csPageStart>valuesParam.csPageCount)&&(valuesParam.csPageCount>0)){
                    u.showMsg("没有更多的数据...");
                    return;
                }

                // 分到后面几页，但总页数未取到
                if ((valuesParam.csPageStart>1)&&(valuesParam.csPageCount<0)){
                    valuesParam.csPageStart = 1;
                }
                bNeedPage = true;
				if(showProg==true)//by jeryM  2017-8-10
                showProg = true;
            }
        }

        if (showProg != false){
            if (bNeedPage)
                u.showProgress('加载第' + valuesParam.csPageStart + '页...');
            else
                u.showProgress('加载中...');
        }

        // 要 u.
        u.ajaxReq(url, valuesParam, function(ret, err) {
            var content = $api.byId(conPre + '_content');//容器
            var tpl = $api.byId(conPre + '_template').text;//模板
            var tempFn = doT.template(tpl);//模板函数

            if ((bNeedPage==true)&&(valuesParam.csPageStart>1)){      // 非第一页
                content.appendHTML(tempFn(ret.data));//实例化模板
				
            }else{
                content.innerHTML = tempFn(ret.data);
				//console.log(tempFn(ret.data));
           }

            u.refreshHeaderLoadDone();
            u.parseTapmode();

            if (bNeedPage){         // 获取总页数
                if (!isNull(ret['csPageCount'])){
                    valuesParam['csPageCount'] = ret['csPageCount'];
                    valuesParam['csPageStart'] = ret['csPageStart'];
                }
                valuesParam.csPageStartPrev = valuesParam.csPageStart;
            }

            if (!u.isNull(doOtherFunc)) doOtherFunc(ret, err);
        }, function(ret, err) {
            if (bNeedPage){  // 刷新失败，不变页码
                valuesParam.csPageStart = valuesParam.csPageStartPrev;
            }
        }, showProg);

        if (showProg != false)
          u.hideProgress();
    }

    /*
       从选程取数据，并渲染到模板，主要用的两个函数之一
       cmd: 是命令名，不需要 url
       valuesParam: JSONObject 对象
       conPre: 模板名称（前缀），
               模板名称和内容id需满足规则：  conPre-template, conPre-content
               conPre为 city, 则模板id=city-template, 内容id=city-content
       doOtherFunc: function(ret, err)
       showProg: true, false
       bAppend: 附加数据 true, false
    */
    u.getRmData = function(cmd, valuesParam, conPre, doOtherFunc, showProg) {
        if (isNull(valuesParam)) valuesParam = {};
        valuesParam['func'] = cmd;
        u.getRmDataByUrl(u.getDataUrl(), valuesParam, conPre, doOtherFunc, showProg);
    }

    /*
     	向服务器提交数据，主要用的两个函数之二
     	返回正确值的判断 if(ret && ret.success) else 时，如果 ret为空，则else不执行
     * */
    u.getRmCmd = function(cmd, valuesParam, callBackSuccess, callBackFailure, bSlient) {
        var url = u.getDataUrl();
        if (isNull(valuesParam)) valuesParam = {};
        valuesParam['func'] = cmd;
        u.ajaxReq(url, valuesParam, callBackSuccess, callBackFailure, bSlient);
    }

    /*
      从服务器上读取数据，并自动渲染到当前页面
    */
    u.loadDbForm = function(cmd, valuesParam, callBackSuccess, callBackFailure, bSlient) {
    	var url = u.getDataUrl();
        if (isNull(valuesParam)) valuesParam = {};
        valuesParam['func'] = cmd;

        u.ajaxReq(url, valuesParam, function(ret, err) {
            // 系统自动匹配 byId
            var objData = ret.data; // 需要是一个 JSONObject 对象
            for (var p in objData) {
                var el = $api.byId(p);
                if (isNull(el)) continue;
                if (isNull(objData[p]))
                    $api.html(el, "&nbsp;")
                else
                    $api.text(el, objData[p]);
            }
            if (!isNull(callBackSuccess)) callBackSuccess(ret, err);
        }, callBackFailure, bSlient);
    }

    // 取 header 的 高度
    u.getHeaderHeight = function() {
        var header = $api.byId('header');
        if (isNull(header))
            return 0;

        $api.fixStatusBar(header);
        return $api.offset(header).h;
    }

    /*
     	打开默认的内容 frame
     	contentHtml: html文件名称（不需要后面的 .html），需要与打开对象同一个目录
     * */
    u.openContent = function(contentHtml, pageParam) {
        var posH = u.getHeaderHeight();

        var url = contentHtml;
        if ((url.toLowerCase().indexOf('http://') >= 0) || (url.toLowerCase().indexOf('https://') >= 0)) {} else
            url = "./" + url + '.html';

        api.openFrame({
            name: contentHtml,
            url: url,
            rect: {
                x: 0,
                y: posH,
                w: 'auto',
                h: 'auto'
            },
            pageParam: pageParam
        });
    }

    /* 打开通用的 window
     	title: 标题
     	url:   内容的 url , 不需要带后面 '.html'
        pageParam: 是页面参数
      eg: $cs.openCommonWin("about", "关于", "about_con");
     * */
    u.openCommonWin = function(name, title, url, pageParam) {
        if (isNull(url)){  // 没指定 url ，则不处理
            url = name;
        }
        if (isApp){
	        u.openWin(name, '../win.html', {//modify jery.M 2017-8-1  ../html/win.html
	            contitle: title,
	            conurl: url,
	            conparam: pageParam
	        });
        }else{
        	u.openWin(name, url + ".html", pageParam);
        }
    }

    u.setRefreshHeaderInfo = function(callback) {
    	if(isApp){
	        api.setRefreshHeaderInfo({
	            visible: true,
	            // loadingImgae: 'wgt://image/refresh-white.png',
	            bgColor: '#f2f2f2',
	            textColor: '#4d4d4d',
	            textDown: '下拉刷新...',
	            textUp: '松开刷新...',
	            showTime: true
	        }, function(ret, err) {
	            callback(ret, err);

	            api.refreshHeaderLoadDone(); // add
	        });
    	}

    }

    // 播放声音
    // filename: 'widget://res/wav/alter1.mp3'
    u.playAudio = function(filename) {
        try {
            var audio = api.require('audio');
            audio.play({
                path: filename
            }, function(ret, err) {});
        } catch (e) {}
    }


    // end
    window.$cs = u;//自定义全局函数对象$cs
})(window);


/*
 sha1 算法
 * */
function SHA1(msg) {
    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    function lsb_hex(val) {
        var str = "";
        var i;
        var vh;
        var vl;

        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };

    function cvt_hex(val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };


    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    msg = Utf8Encode(msg);

    var msg_len = msg.length;

    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;

        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;

        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) word_array.push(0);

    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);


    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;

    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();

}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/*******************************************\
  Array 的扩展方法(2006-8-8)
  This JavaScript was writen by Dron.
  @2003-2008 Ucren.com All rights reserved.
\*******************************************/
Array.prototype.clear = function() {
    this.length = 0;
}
Array.prototype.insertAt = function(index, obj) {
    this.splice(index, 0, obj);
}
Array.prototype.removeAt = function(index) {
    this.splice(index, 1);
}
Array.prototype.remove = function(obj) {
    var index = this.indexOf(obj);
    if (index >= 0) {
        this.removeAt(index);
    }
}

/*
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
function DateAdd(interval, number, date) {
    switch (interval) {
        case "y":
            {
                date.setFullYear(date.getFullYear() + number);
                return date;
                break;
            }
        case "q":
            {
                date.setMonth(date.getMonth() + number * 3);
                return date;
                break;
            }
        case "m":
            {
                date.setMonth(date.getMonth() + number);
                return date;
                break;
            }
        case "w":
            {
                date.setDate(date.getDate() + number * 7);
                return date;
                break;
            }
        case "d":
            {
                date.setDate(date.getDate() + number);
                return date;
                break;
            }
        case "h":
            {
                date.setHours(date.getHours() + number);
                return date;
                break;
            }
        case "m":
            {
                date.setMinutes(date.getMinutes() + number);
                return date;
                break;
            }
        case "s":
            {
                date.setSeconds(date.getSeconds() + number);
                return date;
                break;
            }
        default:
            {
                date.setDate(d.getDate() + number);
                return date;
                break;
            }
    }
}

// appendHTML
HTMLElement.prototype.appendHTML = function(html) {
    // 文档片段，一次性append，提高性能
    var divTemp = document.createElement("div"), nodes = null,
        fragment = document.createDocumentFragment();
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;
    for (var i = 0, length = nodes.length; i < length; i += 1) {
        fragment.appendChild(nodes[i].cloneNode(true));
    }
    this.appendChild(fragment);
    // 据说下面这样子世界会更清净
    nodes = null;
    // fragment = null;
};
