/**
 * Created by JetBrains WebStorm.
 * User: tjk && sankyu
 * Date: 12-5-24
 * Time: 上午11:58
 * To change this template use File | Settings | File Templates.
 */
(function(window,document){

    //连续震动,UCWEB默认支持最大10秒
    var v1 = 10000,
        //间隔震动
        v2 = 500,
        //间隔震动时的循环间隔
        timeout = null,
        //计时
        i = 0,
        //原图和手机屏幕间的长宽比例
        ratioWidth = 0,ratioHeight = 0,
        //按钮移动位置的偏移量
        offset = 18,
        //当前震动状态 -1为停止，1为间隔震动，2为连续震动
        status = -1;

    //图片源
    var imagesSource = [
            {id:'bg',src:'img/bg.png'},
            {id:'bg_red',src:'img/red_bg.png'},
            {id:'bg_blue',src:'img/blue_bg.png'},
            {id:'btn',src:'img/btn.png'}
        ],
        //图片数量
        imagesLen = imagesSource.length,
        //图片缓存
        images = [],
        imagesInit = 0,
        //
        imagesTimeout;

    var btnPosStartHeight = 0,
        btnPosStartWidth = 0,
        btnPosEndWidth = 0,
        btnPosEndHeight = 0,
        currentBgImage = null;

    function $(id){
        return document.getElementById(id);
    }

    function once(){
        navigator.vibrate(200);
    }

    function v1Fun(){
        navigator.vibrate(v1);
    }

    function v2Fun(){
        navigator.vibrate(v2);
    }

    function stop(){
        window.clearTimeout(timeout);
        window.clearInterval(timeout);
        navigator.vibrate(0);
    }

    window.count = function(){}


    window.onload = function(){
        //统计时间
        window.setInterval(count,1000);

        init();

        currentBgImage = getImageById('bg');

        $('canvas').addEventListener('touchstart',function(e){
            vibrate(e);
        });

    };

    function initImages(){
        for(var i=0;i<imagesLen;i++){
            var tmp = new Image();
            tmp.id = imagesSource[i].id;
            tmp.src = imagesSource[i].src;
            tmp.onload = function(){
                imagesInit++;
            }
            images.push(tmp);
        }
    }

    function imagesInitLoop(){
        if(imagesInit == imagesLen){
            window.clearTimeout(imagesTimeout);
            setCanvasWH();
            paint();
            return;
        }
        imagesTimeout = window.setTimeout(imagesInitLoop,33);
    }

    function init(){
        initImages()
        imagesInitLoop();
    }

    function getImageById(id){
        for(var i=0;i<imagesLen;i++){
            if(images[i].id == id){
                return images[i];
            }
        }
        return null;
    }

    function paint(){
        var canvas = $("canvas");
        var ctx = canvas.getContext('2d');

        ctx.save();

        //画背景
        ctx.drawImage(currentBgImage,0,0,canvas.width,canvas.height);

        var btnImage = getImageById('btn');
        var btnWH = resetBtnImageWH(btnImage,canvas);
        btnPosStartHeight = Math.round(canvas.height - btnWH[1]) + offset;
        btnPosStartWidth = Math.round(canvas.width / 2 - btnWH[0] / 2) + 2;
        btnPosEndWidth = btnPosStartWidth + btnWH[0];
        btnPosEndHeight = btnPosStartHeight + btnWH[1];

        ctx.translate(btnPosStartWidth,btnPosStartHeight);
        ctx.drawImage(btnImage,0,0,btnWH[0],btnWH[1]);

        ctx.restore();
       

    }


    function setCanvasWH(){
        var canvas = $('canvas');
        if (canvas.width != window.outerWidth ||
            canvas.height != window.outerHeight){
            canvas.width = window.outerWidth;
            canvas.height = window.outerHeight;
        }
    }

    //重置按钮宽高
    function resetBtnImageWH(btnImage,canvas){
        var width = 0,height = 0,
            canvas = $('canvas');
        ratioWidth = canvas.width / getImageById('bg').width;
        ratioHeight = canvas.height / getImageById('bg').height;
        width = Math.round(btnImage.width * ratioWidth);
        height = Math.round(btnImage.height * ratioHeight);
        return [width,height];
    }

    function vibrate(e){

        var canvas = $("canvas"), 
            screenX = e.touches[0].screenX,
            screenY = e.touches[0].screenY;
        
        //控制在按钮区域内。
        if(screenX > btnPosStartWidth && screenY > btnPosStartHeight
            && screenX < btnPosEndWidth && screenY < btnPosEndHeight){
            //修改按钮位置、当前震动状态以及
            switch(status){
                case -1 : 
                    status = 1;
                    offset = 0;
                    currentBgImage = getImageById('bg_blue');
                    stop();
                    timeout = window.setInterval(v2Fun,1000);
                    break;
                case 1 : 
                    status = 2;
                    offset = -18;
                    currentBgImage = getImageById('bg_red');
                    stop();
                    v1Fun();
                    break;
                case 2 : 
                    status = -1;
                    offset = 18;
                    currentBgImage = getImageById('bg');
                    stop();
                    break;
                default:
                    status = -1;
                    offset = 18;
                    currentBgImage = getImageById('bg');
                    stop();
                    break;
            }

            //重画效果图
            paint();

        }



    }


})(this,document);