# tagCloud
为Ghost增加标签云支持，需要Ghost版本支持Public API
Add TagCloud Support For Ghost, Ghost Public API is required

Demo :  https://www.hoyt-tian.com/

# Usage
在Ghost的Code injection中添加如下代码

```
<script>
Copy Content from ./dist/tagcloud.js here
</script>
 
<script>
fetch(ghost.url.api('tags',{limit:'all'}))
    .then(function(response){
                           return response.json();
                           })
    .then(function(data){
        new TagCloud(data.tags, TagCloud.prototype.plugins.ellipse).start();
    });
</script>
```
