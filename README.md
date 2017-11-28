# tagCloud
为Ghost增加标签云支持，需要Ghost版本支持Public API
Add TagCloud Support For Ghost, Ghost Public API is required

Demo :  https://www.hoyt-tian.com/

# Usage
在Ghost的Code injection中添加如下代码

```
<script src="https://cdn.rawgit.com/hoyt-tian/tagCloud/v0.2.0/dist/tagcloud.js"></script> 
 
 
<script>
    var isMobile = (function(){
    return  navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i);})();
    
    if(!isMobile){
        fetch(ghost.url.api('tags',{limit:'all'}))
        .then(function(response){
                               return response.json();
                               })
        .then(function(data){
            try{
                 var url = ghost.url.api().match(/^(.+)\/ghost\/.+/)[1];
                data.tags.forEach(function(tag){
                   tag.href = url + '/tag/' + tag.slug;
                });
            	new TagCloud(data.tags, TagCloud.prototype.plugins.ellipse).start();
            }catch(e){
                console.log(e);
            }
        });
    }

</script>
```
