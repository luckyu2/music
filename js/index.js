$(function(){
    //获取本地缓存数据
    let locList = localStorage.getItem('musicList')
    let $playList = $('.right .list ul').html(locList)
    let $ul = $('.left ul');
    if($(' .list li').length!==0){
      $('.list li').fadeIn()
    }else{
      $('.right').fadeOut()
    }
 
    //  处在列表中的歌曲id
     let ids=[]
    for(let i=0;i<$('.list .liked').length;i++){
      ids.push($('.list .liked').eq(i).attr('id'))
    }
    // 在播放但不在播放列表的id
    let nullListId=-1
    // 页面关闭前将右侧列表存储起来
    window.onbeforeunload=function(){
      let musicList = $('.right ul').html()
      localStorage.setItem('musicList',musicList)
    }
    //  点击歌名播放此音乐并更改歌名和歌词

    $(document).on('click', '.layui-layer .song', function() { 
        // layer.msg('响应点击事件'); 
            playThis(this)
            // 获取点击的元素的歌名和歌手信息
            var siblings = $(this).siblings();
            var songs = siblings.eq(1).text();
            var artist = $(this).text();
            //更改播放界面的歌名和歌手
            $(".song-title").text(songs);   //更换歌名
            $(".artist").text(artist);     //更换歌手
    })
  
   
    // 发起请求并渲染页面
    async function getSearcher(str){  
        const { data:res } = await axios.get('https://autumnfish.cn/search',{
         params:{
           keywords:str
         }
       })
       // 判断是否请求成功
       if(res.code===200) {
         let musicList = res.result.songs;
         // console.log('搜索成功')
         // console.log(list)
         //  将请求回来的数据渲染到左侧列表中
         musicList.forEach(item => { 
             const newList =
                `
                <li>
                    <span class="icon" data-toggle="tooltip" data-placement="top" title="点击添加到播放列表" id="${item.id}"></span>
                    <span class="song" data-toggle="tooltip" data-placement="top" title="点击歌曲名播放此音乐" >${item.name}</span>
                    <span class="name">${item.artists[0].name}</span>
                </li>
                `
           var $li = $('<li>').html(newList);
           $ul.append($li);
            })
         //  初始化喜欢列表
         initLiked(musicList)
   
            $(document).on('click', '.layui-layer .icon', function() {
                console.log('add');
                addLiked(this)
                // 根据点击当前状态渲染页面
                if($(this).attr('class')!=='icon'){
                if($(this).siblings('.mv').length===0){
                    let liked=`<li>${$(this).parent().html()}</li>`
                    let oldStr=$('.right .list ul').html()
                    $('.right .list ul').html(liked+oldStr)
                }else{
                    let liked=`<li>${$(this).parent().html()}</li>`
                    let oldStr=$('.right .list ul').html()
                    $('.right .list ul').html(liked+oldStr)
                }
                }else{
                for(let i=0;i<$('.right .list .liked').length;i++){
                    if($('.right .list .liked').eq(i).attr('id')===$(this).attr('id')){
                    $('.right .list .liked').eq(i).parent().remove();
                    }
                }
                }
                if($('.right li').length!==0){
                $('.right .list').fadeIn()
                }
                $(document).on('click', '.layui-layer .liked', function() { 
                    console.log("ssssss");
                    delLiked(this)
                });
            })
         } else {
        console.log('404')
      }
    }
     // 点击右测的喜欢和取消左侧的喜欢并在右侧列表删除这个元素
    
// 发起请求歌曲网络资源播放地址的get请求
    async function getMusicUrl(id){
        const {data:res}= await axios.get('https://autumnfish.cn/song/url',{
        params:{
            id:id
        }
        })
        if(res.code===200){
        // console.log(res)
        let data = res.data
        //  console.log(data[0].url)
        $('#audio').attr('src',data[0].url)
        //可以拿到音乐的时长，要转换

        getMusicCover(id)   //获取歌曲的封面
        getMusicComment(id) // 获取歌曲评论
        }
    }
  // 获取歌曲的封面
    async function getMusicCover(id){
        const {data:res}= await axios.get('https://autumnfish.cn/song/detail',{
        params:{
            ids:id
        }
        })
        if(res.code===200){
        $('.turnDisc img').attr('src',res.songs[0].al.picUrl)
        }
    }

    // 获取歌曲评论
    const $chatList = $('.right .comment ul')
    async function getMusicComment(id){
        const {data:res}= await axios.get('https://autumnfish.cn/comment/hot',{
        params:{
            type:0,
            id:id
        }
        })
        if(res.code===200){
        let list = res.hotComments
        list.forEach(item=>{
            const newStr=`
            <li>
                <span class="headPhoto"
                ><img src="${item.user.avatarUrl}" alt=""
                /></span>
                <span class="nickname text-wrap">${item.user.nickname}</span>
                <br />
                <span class="content">${item.content}</span>
            </li>
            `
            // let oldStr= $('.right .comment ul').html()
            // $('.right .comment ul').html(oldStr+newStr)
            var $li = $('<li>').html(newStr);
            $chatList.append($li);
        })
        }
    }
 
//搜索框输入
      // input 中输入回车键代表搜索
    $('.searcher').on('keyup',function(e){
        if(e.keyCode===13){
        getSearcher($('.searcher').val())
        $('.searcher').val('')
        }
    })
    	// audio.src = musicList[this.index].src;
    //点击左上角搜索按钮
    const searchBox =  $('.search_container')
    $('.search').click(function(){  
        // searchBox.css('display','block')   
        searchBox.toggle()  //显示或掩藏
    });
    // 点击搜索栏空白区域关闭搜索框
    $(document).mouseup(function(e){
        if(!searchBox.is(e.target) && searchBox.has(e.target).length === 0){
            searchBox.hide();
        }
    });
    //点击搜索框搜索按钮后
    $('.search_btn').click(function(){
         //         console.log('点击搜索按钮');
        //         layer.msg('搜索中，请稍后')
        layer.msg('搜索中，请稍后...', {icon: 16,shade: [0.3, '#f5f5f5'],scrollbar: false,offset: 'auto', time:1000});
        getSearcher($('.searcher').val());

        setTimeout(function(){
            layer.open({
                type: 1, //弹出层类型 页面层
                title:'<strong>点击歌名前面的-'+'<i class="bi bi-heart"></i>'+'-添加到播放列表</strong>',//标题
                area:['25rem','90vh'],//弹窗大小
                content: $ul.prop('outerHTML') , //这里content是一个普通的String
                // content:$searchList.prop('outerHTML'),
                shade:[0.6, '#393D49'],//遮罩层
                // btnAlign: 'c',//按钮位置，c居中，r靠右
                // btn:[],//按钮类型，可以有多个,第一个对应yes回调函数,第二个对应cancel回调函数
                shadeClose:false,//是否开启点击遮罩层关闭  默认是false
                anim:1, //0 平滑放大 | 1 从上掉落 | 2 从最底部往上滑入 | 3 从左滑入 | 4 从左翻滚 | 5 渐显 | 6 抖动
                // yes:function(index, layero){    //点击确定按钮的回调事件
                //     layer.msg('点歌名前面的♥，点我没用的');
                // },
                // cancel: function(){     //右上角关闭回调函数
                //     // alert('close');
                //     // return false        //开启该代码可禁止点击该按钮关闭
                // }
            }); 
        },2000);
        

    })

    //点击打开播放列表
    $('.playList').click(function(){  
        
        layer.open({
            type: 1, //弹出层类型 页面层
            title:"点击下方👇<strong>歌名</strong>即可播放🎵",//标题
            area:['25rem','90vh'],//弹窗大小
            content: $playList.prop('outerHTML'), //这里content是一个普通的String
            btn:['清空播放列表'],//按钮类型
            btnAlign: 'c',//按钮样式
            shade:[0.4, '#393D49'],//遮罩层
            shadeClose: true,//是否开启点击遮罩层关闭  默认是false
            anim:5, //0 平滑放大 | 1 从上掉落 | 2 从最底部往上滑入 | 3 从左滑入 | 4 从左翻滚 | 5 渐显 | 6 抖动
            yes:function(index, layero){    //点击确定按钮的回调事件
                layer.msg('你已清除列表');
                // 清除本地缓存数据
                clearList()
                $(this).fadeOut();
            } 
        }); 
    });
   // 点击歌曲评论按钮
    $('.chatList').click(function(){  
        layer.open({
            type: 1, //弹出层类型 页面层
            title:"<strong>歌曲评论</strong>",//标题
            area:['25rem','90vh'],//弹窗大小
            content: $chatList.prop('outerHTML'), //这里content是一个普通的String
            // btn:['清空播放列表'],//按钮类型
            // btnAlign: 'c',//按钮样式
            shade:[0.4, '#393D49'],//遮罩层
            shadeClose: true,//是否开启点击遮罩层关闭  默认是false
            anim:2, //0 平滑放大 | 1 从上掉落 | 2 从最底部往上滑入 | 3 从左滑入 | 4 从左翻滚 | 5 渐显 | 6 抖动
        }); 
    });

// 向本地存储中判断是否存在搜索值，若存在，默认为喜欢
  function initLiked(_list){
    for(let i=0;i<$('.right .liked').length;i++){
      $('.right .liked').eq(i).attr('id')
      for(let u=0;u<_list.length;u++){
        let l_id = _list[u].id.toString()
        if($('.liked').eq(i).attr('id')===l_id){
          $('.icon').eq(u).attr('class','liked')         
        }
      }
    }
  }
  // 添加到喜欢列表
    function addLiked (_this){
        if($(_this).attr('class')!=='liked'){
        $(_this).attr('class','liked')
        }else{
        $(_this).attr('class','icon')
        }
    }
    // 点击右侧列表，取消喜欢
    function delLiked (_this){
        // console.log($('.right ul').html());
        for(let i=0;i<$('.liked').length;i++){
        if($('.liked').eq(i).attr('id')===$(_this).attr('id')){
            addLiked($('.liked').eq(i))
        }
        }
        $(_this).parent().remove()
    }
    // 清空播放列表所有数据
    function clearList(){
        $(' ul').html('')
        $('.liked').attr('class','icon')
    }
  
 // 播放列表的音乐
    function playThis(_this){
        let id = $(_this).siblings().eq(0).attr('id')
        // console.log(id);
        id=parseInt(id)
        nullListId=id
        getMusicUrl(nullListId)
        // console.log("点击播放")
        // 启动转盘
        clickPlay()
    }

     // 播放和暂停按键设置点击中间播放按钮
    $('.music-play').click(function() {
        if (audio.paused) {
            audio.play();
            clickPlay();
          } else {
            audio.pause();
            clickPlay();
          }
        // console.log(audio.paused);   
    });
   
    var audio = $('#audio')[0]
    var pipe = $('.pipe');
    var turnDisc = $('.turnDisc img');
    //   黑胶转盘转动
    function clickPlay() {
        // console.log('调用了')

        $('.bi-pause-fill').toggleClass('bi-play-fill');     
        // getTime();
        if (audio.paused) {
        pipe.css('transform', 'rotate(0deg)');
        // nowPlay.attr('class', "glyphicon glyphicon-pause");
        turnDisc.css('animation', 'turn 5s linear infinite');
       
        audio.play();
        // startCache();
        // startUpdate();
        } else {
        pipe.css('transform', 'rotate(-40deg)');
        // nowPlay.attr('class', "glyphicon glyphicon-play");
        turnDisc.css('animation', '');
        // audio[0].pause();
        audio.pause();
        // endCache();
        // endUpdate();
        }
    }
    // 深色浅色模式切换
    $('.mode').click(function() {
        $('.phone').toggleClass('dark');
        $('.bi-brightness-high-fill').toggleClass('bi-moon');
    });
})
