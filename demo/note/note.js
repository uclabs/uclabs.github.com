/**
 * Created by JetBrains WebStorm.
 * User: tjk && sankyu
 * Date: 12-9-3
 * Time: 下午5:48
 * To change this template use File | Settings | File Templates.
 */
(function(){

    function Note(){
        this.id = 0;
        this.title = "";
        this.text = "";
        this.time = "";
        this.toJson = function(){
            return {
                "id" : this.id,
                "title" : this.title,
                "text" : this.text,
                "time" : this.time
            }
        }
    }

    //var maxId = 1;

    var h5note = {
        maxId : 1,
        bindEditContent:function(){
            var editArea = document.querySelectorAll("#editContent");
            editArea.addEventListener("change",function(){
                alert("change event");
                $(".title").text("change event");
            });
            editArea.addEventListener("DOMCharacterDataModified",function(){
                alert("DOMCharacterDataModified event");
                $(".title").text("DOMCharacterDataModified event");
            });
            editArea.addEventListener("focus",function(){
                alert("focus event");
                $(".title").text("focus event");
            });
        },
        //切换
        tiggler:function(event){
            var $article = $(".page");
            if($article.hasClass("showMenu")){
                $article.removeClass("showMenu");
            }else{
                $article.addClass("showMenu");
            }
        },
        updateLocalMaxId:function(){
            var temp = localStorage.getItem("maxId");
            if(temp != null){
                h5note.maxId = parseInt(temp);
            }else{
                h5note.maxId = 1;
            }
        },
        plugMaxId:function(){
            var temp = localStorage.getItem("maxId");
            if(temp != null){
                h5note.maxId = parseInt(temp) + 1;
            }
            localStorage.setItem("maxId",h5note.maxId);
        },
        //初始化
        init:function(){
            $("#main").width(window.outerWidth);
            $("#main").height(window.outerHeight);
            $("#main #menu section").height(window.outerHeight - 46);
            var headerH = $(".page header").height();
            $("#editContent").height($("#main").height() - headerH);

            h5note.updateLocalMaxId();

            h5note.getNotes();

            $("#tiggler").on("click",function(){
                h5note.tiggler();
                h5note.getNotes();
            });
            $("#save").on("click",function(){
                if($(this).text() == "新建"){
                    $(this).text("保存");
                    $("#editContent").html("");
                    $("#editContent").attr("data-id","");
                    $("#editContent").focus();

                }else{
                    console.log("开始保存笔记！");
                    h5note.addNote();
                    $(this).text("新增");
                    console.log("笔记保存成功！");
                }
            });
            $("#clear").on("click",function(){
                localStorage.clear();
                h5note.getNotes();
            });

            setTimeout(function(){window.scrollTo(0,0)},100);

        },
        //读取所有本地存储的数据
        getNotes:function(){
            var length = localStorage.length;
            var list = new Array();
            var temphtml = "",n;
            for(var i=0;i<length;i++){
                var key = localStorage.key(i);
                if(!isNaN(key)){
                    console.log(key);
                    n = JSON.parse(localStorage.getItem(key));
                    temphtml += "<article data-id='" + n.id + "'>" + n.title +"</article>";
                }
            }
            document.getElementById("noteNav").innerHTML = temphtml;
            $("#noteNav article").on("click",function(){
                h5note.showNote($(this).attr("data-id"));
                var $article = $(".page");
                if($article.hasClass("showMenu")){
                    $article.removeClass("showMenu");
                }else{
                    $article.addClass("showMenu");
                }
                $("#save").text("保存");
            });

        },
        //创建一条笔记到本地存储
        addNote:function(){
            var n = new Note();
            text = document.getElementById("editContent").innerHTML;
            text2 = document.getElementById("editContent").innerText;
            n.text = text;
            n.title = text2.substring(0,15);
            n.time = new Date().toString();
            var dataid = $("#editContent").attr("data-id");
            if(dataid != ""){
                n.id = dataid;
                localStorage.setItem(dataid,JSON.stringify(n.toJson()));
            }else{
                h5note.plugMaxId();
                n.id = h5note.maxId;
                localStorage.setItem(h5note.maxId,JSON.stringify(n.toJson()));
            }
        },
        //读取单条笔记
        getNote:function(id){
            var object = JSON.parse(localStorage.getItem(id));
            return object;
        },
        showNote:function(id){
            var n = h5note.getNote(id);
            $("#editContent").html(n.text);
            $("#editContent").attr("data-id",id);
        }
    };

    h5note.init();

})();