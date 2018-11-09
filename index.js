export default {
    data(){
        var doc = document;
        var win = window;
        var dc = doc.documentElement;
        var encode = encodeURIComponent;

        var aresInfo = {
            d: new Date().getTime(),
            ce: navigator.cookieEnabled,
            je: navigator.javaEnabled(),
            ul: navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || '',
            de: doc.charset,
            sr: (win.screen.width || 0) + '*' + (win.screen.height || 0),
            vp: (dc.clientWidth || 0) + '*' + (dc.clientHeight || 0),
            cd: win.screen.colorDepth + '-bit' || 0,
            re: encode(doc.referrer) || '',
            dl: encode(win.location.href) || '',
            tt: encode(doc.title) || '',
            pid:'',
            dm:location.host
        };
        return {
            aresInfo: aresInfo,
            pid:'',
            oldPid:'',
            imgUrl: location.protocol + '//ares.ishangzu.com/i.gif',
            actionUrl: location.protocol + '//ares.ishangzu.com/a.gif'
        };
    },
    watch:{
        $route(){
            if (!this.appKey) {
                return;
            }
            if (this.pid) {
                this.oldPid = JSON.parse(JSON.stringify(this.pid));
                this.flow(this.oldPid, 'out');
            }
            this.pid = this.guid();
            this.flow(this.pid, 'in');
        }
    },
    methods:{
        flow(pid, action){
            var data = JSON.parse(JSON.stringify(this.aresInfo));
            data.pid = pid;

            var img = new Image();
            var query = this.getDataForQuery(data);
            img.src = this.imgUrl + '?a=' + action + query;
        },
        sendAction(className, tagName, type, remark, x, y){
            var data = {
                pid:this.pid,
                c:className,
                e:tagName,
                t:type,
                r:remark,
                x:x,
                y:y
            };

            var query = this.getDataForQuery(data);
            var img = new Image();
            img.src = this.actionUrl + '?' + query;
        },
        guid(){
            var t = new Date().getTime();

            return t + Math.floor(t * Math.random()).toString(36);
        },
        getDataForQuery(data){
            var str = '';
            for (var p in data) {
                str += '&' + p + '=' + data[p];
            }

            return str;
        }
    },
    mounted(){
        document.addEventListener('click', (ev) => {
            var doc = document;
            var e = ev || window.event;
            var x = e.pageX || e.clientX + doc.documentElement.scrollLeft || doc.body.scrollLeft;
            var y = e.pageY || e.clientY + doc.documentElement.scrollTop || doc.body.scrollTop;

            this.sendAction(e.srcElement.className, e.srcElement.nodeName, 'click', '', x, y);
        });
    }
};