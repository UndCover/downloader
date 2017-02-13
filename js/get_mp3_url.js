var baseurl = "http://changba.com/member/personcenter/loadmore.php?ver=1";
var queryurl = "http://changba.com/s/";

var consoleInfo,platform,queryId = 0;

function parsemp3(original) {
    // a = "http://qiniuuwmp3.changba.com/667079320.mp3",
    var realUrl = original, splitStr = /userwork\/([abc])(\d+)\/(\w+)\/(\w+)\.mp3/, fragArray = splitStr.exec(original);

    if (fragArray) {
        var d = fragArray[1], e = fragArray[2], f = fragArray[3], g = fragArray[4];
        e = parseInt(e, 8), f = parseInt(f, 16) / e / e, g = parseInt(g, 16) / e / e, "a" == d && g % 1e3 == f ? realUrl = "http://a" + e + "mp3.ch" + "angba." + "com/user" + "data/user" + "work/" + f + "/" + g + ".mp3" : "c" == d && (realUrl = "http://aliuwmp3.changba.com/userdata/userwork/" + g + ".mp3")
    }
    return realUrl;
};

//public function
function sendRequest(url, handler) {
    // $.ajax({
    //     songlistUrl : songlistUrl,
    //     cache : false,
    //     async : true,
    //     type : "GET",
    //     dataType : 'json/xml/html',
    //     success : function (result){
    //         console.log(result);
    //     }
    // });

    //ajax跨域通信
    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
            //options.songlistUrl = "http://cors.corsproxy.io/url=" + options.songlistUrl;
        }
    });
    // $.ajax({
    //     songlistUrl: songlistUrl,
    //     data: data,
    //     success: success,
    //     dataType: dataType
    // });

    // $.ajax({
    //     songlistUrl: songlistUrl,
    //     success: function (result){
    //         console.log(result);
    //     },
    // });
    $.ajax({
        url: url,
        success: handler,
        error: errorHandler,
    });

    consoleInfo.text('SendRequest>>> '+url);
}

function errorHandler(XMLHttpRequest, textStatus, errorThrown) {
    // alert(XMLHttpRequest.readyState);
    // alert(textStatus);
    consoleInfo.text("status: "+XMLHttpRequest.status+" \nreadyState: "+XMLHttpRequest.readyState+" \ntextStatus: "+textStatus);
    alert(XMLHttpRequest.status);
}

var songlistUrl , pagenum = 0;

function songListHandler(result) {
    var json = $.parseJSON(result);
    if(json.length>0){
        genList(json);
        pagenum++;
        sendRequest(songlistUrl+pagenum,songListHandler);
    }else{
        pagenum = 0;
        return;
    }
}

function getUserid(link) {  //获取用户id，queryid
    sendRequest(link,function (result) {
        queryId = queryUserId(result);
        if(queryId==0){
            consoleInfo.text("用户ID出错，请输入一个正确的歌曲地址");
            return;
        }else {
            getSongList(queryId);
        }
    });
}

//请求列表
function getSongList(userid) {
    songlistUrl = baseurl + '&userid=' + userid + '&pageNum=';
    sendRequest(songlistUrl+pagenum,songListHandler);
}
//生成列表
function genList(json) {
    var content = json;
    // console.log(json);

    var table = $("#songlist");
    for (var i = 0; i < content.length; i++) {
        var song = content[i]
        console.log(song);
        var tr = $("<tr class='trows'></tr>");
        var tdTitle = $("<td width='70%'></td>");
        var tdType = $("<td width='30%'></td>");

        var aTitle, aType;
        if (getType(song['ismv']) == 0) {
            aTitle = $("<a class='table_cells_title table_cells_mp3' href='javascript:;'></a>").text(song['songname']);
            aType = $("<a class='table_cells_type'></a>").text("mp3");
        } else {
            aTitle = $("<a class='table_cells_title table_cells_mv' href='javascript:;'></a>").text(song['songname']);
            aType = $("<a class='table_cells_type'></a>").text("MV");
        }
        aTitle.attr("id", song['enworkid']); //添加id
        aType.attr("id",'type-'+song['enworkid']);
        aTitle.appendTo(tdTitle);
        aType.appendTo(tdType);

        tdTitle.appendTo(tr);
        tdType.appendTo(tr);
        tr.appendTo(table);
    }
    // regClick(); //因为动态生成列表，所以每次加载列表，一定要调用regClick来注册事件
}

//用于判定类型
function getType(type) {
    var t = 0;
    if (type == "style='display:none'") {
        t = 0;  //mp3
    } else {
        t = 1;  //mp4
    }
    return t;
}

function getUrl(link, type) {
    var response = sendRequest(link);
    var script_array = response.getElementsByName("script");
    var url ;
    if (type == 0) {    //MP3
        url = queryMp3Url();
    } else {          //MP4
        url = queryMp4Url();
    }
    return url;
}

function queryUserId(content) {
    //需要区分设备类型
    console.log("start....Mp3Url");
    consoleInfo.text('start....queryUserId Parse');
    var pattern = /data(.?-?)userid(\s?=\s?'?"?)([0-9]*)('?"?)/;
    var fragStr = content.match(pattern);   //正则匹配到MP3 地址
    var realId = fragStr[3];
    queryUserName(content); //获取用户名
    console.log(realId);
    consoleInfo.text('解析用户ID:>>> '+realId);
    return realId;
}

function queryUserName(content) {
    var pattern2pc = /<em class="name twemoji">([^\/S]*)<\/em>/;
    var pattern2phone = /<div class="suggest-song-name text-nowrap">([^\/S]*)<\/div>([^\/S]*)<\/div>/;
    var userName;
    try{
        if(platform == 0){  //移动平台
            var fragStr = content.match(pattern2phone);
            userName = $.trim(fragStr[2]);
            // if(!userName){  //离线平台
            //     fragStr = content.match(pattern2pc);
            //     userName = fragStr[1];
            // }
            console.log(userName);
        }else{  //PC平台
            var fragStr = content.match(pattern2pc);
            userName = fragStr[1];
            console.log(userName);
        }
    }catch(error){
        consoleInfo.text('解析用户ID出错:>>> '+error);
    }
    
    if(!userName){
        return;
    }
    $(".btn_sendrequest").addClass("btn_clicked").text(userName);
    return userName;
}

function queryMp3Url(content) {
    console.log("start....Mp3Url");
    consoleInfo.text('start....Mp3Url Parse');
    //todo 正则表达式
    // http://qiniuuwmp3.changba.com/667079320.mp3
    var pattern = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?.mp3/;
    var fragStr = content.match(pattern);   //正则匹配到MP3 地址

    // console.log(fragStr);

    var urlStr = fragStr[0];

    var realUrl = parsemp3(urlStr);         //解析MP3地址

    console.log(realUrl);
    return realUrl;
}
function queryMp4Url(content) {
    console.log("start....Mp4Url");
    consoleInfo.text('start....Mp4Url Parse');
    //todo 正则表达式
    // <script>jwplayer.utils.qn = 'aHR0cDovL2xldHYuY2RuLmNoYW5nYmEuY29tL3VzZXJkYXRhL3ZpZGVvLzYzNjk3Njc2MS5tcDQ='
    var pattern2pc = /jwplayer.utils.qn\s+=\s+'([a-zA-z0-9=]*)'/;
    var pattern2phone = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?.mp4/;
    var realUrl;
    if(platform == 0){  //移动平台
        var fragStr = content.match(pattern2phone);
        realUrl = fragStr[0];
        console.log(realUrl);
    }else{  //PC平台

        var fragStr = content.match(pattern2pc);
        // 'aHR0cDovL2xldHYuY2RuLmNoYW5nYmEuY29tL3VzZXJkYXRhL3ZpZGVvLzYzNjk3Njc2MS5tcDQ='
        // var pattern2 = /'([\d\D]*)'/;

        // var str = "content:>>> "+content+" \nfragStr:>>> "+fragStr;
        // consoleInfo.text(str);

        var urlStr = fragStr[1];
        var realUrl = o(urlStr);                 //base64解析mp4地址
        console.log(realUrl);
    }

    return realUrl;
}

// $(function () {
//     //注册点击事件
//     $(".table_cells_mp3").on('click', function () {
//         console.log("click");
//     });
// });

function getTest(ss) {
    console.log("test");
}

$(function () {
    consoleInfo = $('.console_info');
    $("#songlist").on('click','.table_cells_title , .table_cells_type',function () {
        var songid,url;
        if($(this).hasClass("table_cells_clicked")){
            alert("请等待...");
            consoleInfo.text("已经发送请求，请等待...");
            return;
        }
        if($(this).hasClass("table_cells_title")){
            songid = $(this).attr('id');
            url = queryurl + songid;
            console.log("table_cells_title");
            var trNode = $(this).parents('.trows');
            var labelNode = trNode.find('.table_cells_type');

            var titleBtn = $(this);
            titleBtn.addClass("table_cells_clicked");

            if(labelNode.attr('href')){
                consoleInfo.text(labelNode.attr('href'));
                titleBtn.removeClass("table_cells_clicked");
                return;
            }

            if($(this).hasClass("table_cells_mp3")){
                sendRequest(url,function (result) {
                    var realUrl =  queryMp3Url(result);
                    // var trNode = $(this).parents('.trows');
                    // var labelNode = trNode.find('.table_cells_type');
                    labelNode.text('MP3 下载');
                    labelNode.attr('href',realUrl);
                    labelNode.addClass('table_cells_type_done');
                    titleBtn.removeClass("table_cells_clicked");
                    consoleInfo.text("已经生成链接，请点击下载>>> "+realUrl);
                });
            }else{
                sendRequest(url,function (result) {
                    var realUrl =  queryMp4Url(result);
                    // var trNode = $(this).parents('.trows');
                    // var labelNode = trNode.find('.table_cells_type');
                    labelNode.text('MV 下载');
                    labelNode.attr('href',realUrl);
                    labelNode.addClass('table_cells_type_done');
                    titleBtn.removeClass("table_cells_clicked");
                    consoleInfo.text("已经生成链接，请点击下载>>> "+realUrl);
                });
            }
        }else{
            console.log("table_cells_type>>> "+$(this).attr('id'));
            consoleInfo.text("table_cells_type>>> "+$(this).attr('id'));
        }
    });


    var system = {
        win: false,
        mac: false,
        xll: false,
        ipad:false
    };
    //检测平台
    var p = navigator.platform;

    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;

    if (system.win || system.mac || system.xll ||system.ipad) {
        platform = 1;
    } else {
        platform = 0;
    }
});

function regClick() {//注册点击事件
    $(".table_cells_mp3").on('click', function () {
        console.log("mp3_click");
        var songid = $(this).attr('id');
        var url = queryurl + songid;
        // sendRequest(songlistUrl,function (result) {
        //     // var htmlContent = $.parseHTML(result);
        //     var songlistUrl =  queryMp3Url(result);
        //
        //     var label = $(this).siblings('table_cells_type').text("MP3 下载");
        //     label.attr('href',songlistUrl);
        // })
        var mp3 = $(".table_cells_mp3").parent('.trows');
        var id = mp3.attr('id');
        console.log(mp3.attr('id'));
        var id2 = 'type-'+id;
        $(id2).text("hhhh");
        // label.attr('href',songlistUrl);
    });

    $(".table_cells_mv").on('click', function () {
        console.log("mv_click");
        var songid = $(this).attr('id');
        var url = queryurl + songid;
        sendRequest(url,function (result) {
            // var htmlContent = $.parseHTML(result);
            var url =  queryMp4Url(result);
            // var label = $(this).siblings('table_cells_type').text("MV 下载");
            // label.attr('href',songlistUrl);
        })
    });

    $(".table_cells_type").on('click', function () {
        console.log("type");
    });
};
