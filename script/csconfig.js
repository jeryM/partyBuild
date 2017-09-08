/*
 * csoft 项目参数设置
 * Copyright (c) koyochen@sina.com
   create: 2017.06.05
*/
// 当前项目数据
var csAppInfo = {
    // 项目基础参数
    isDebug: true,  // 是否是 debug 状态

    softId: 'd1',   // 软件编号
    appPath: 'http://dj.e65.cn:8080/chmisex/',      // 项目正常运行时的地址，必须是 ip地址或域名
    appPathDebug: 'http://192.168.1.105:8080/chmisex/'   // 项目调试运行时的地址，必须是 ip地址或域名，不能用 localhost

};

// 当前页面数据，变量里需要加 cs, 因为参数会合并并上传到服务器
var csPageInfo = {
    csPageStart: 1,         // 从第一页开始
    csPageSize: 10,         // 每页显示的数据
    csPageCount: -1,        // 总页数
    csPageStartPrev: 1,      // 上次成功时的页面 PageStart
    csId: '',               // 主键
    csOrderBy: ''           // 排序字段

};


// 初始化分页
// 不分页  initQueryPage(-1), 分页 initQueryPage()
function initQueryPage(iPageSize){
    $cs.getHeaderHeight();                            // 初始化 header 部分

    if (!$cs.isNull(iPageSize))                 // 设置分页大小
        csPageInfo.csPageSize = iPageSize;

    $cs.parseTapmode();
    $cs.mergeObj(csPageInfo, api.pageParam);                // 变量存储在 csPageInfo 中

    refreshPage();

    $cs.setRefreshHeaderInfo(function (ret, err) {
        csPageInfo.csPageStart = 1;            // 第一页
        refreshPage();                         // 页面固定函数
    });

    if (csPageInfo.csPageSize>0){               // 需要分页
        api.addEventListener({name: 'scrolltobottom'}, function(ret, err){
            csPageInfo.csPageStart++;              // 下一页
            refreshPage();                         // 页面固定函数
         });
     }
}

// 设置查询条件参数
function setPageInfo(name, value){
    csPageInfo[name] = value;
}
