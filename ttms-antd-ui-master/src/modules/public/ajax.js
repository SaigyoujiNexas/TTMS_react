const RequestParam = {// eslint-disable-line
    /** 请求地址 */
    url:"",
    type:"",
    data:{},
    dataType: "",
    before: function(){},
}

/**
 * @param {RequestParam} act 
 * @returns {Promise<XMLHttpRequest>}
 */
export default function ajax(act) {
    var xhr = new XMLHttpRequest();
    if (act.type === 'GET') {
        let each;
        for (each in act.data) {
            act.url += act.url.indexOf('?') === -1 ? "?" : "&";
            act.url = act.url + encodeURIComponent(each) + "=" + encodeURIComponent(act.data[each]);
        }
        xhr.open(act.type, act.url, true);
        if (act.before) {
            act.before(xhr);
        }
        xhr.send();
    } else if (act.type === 'POST' && act.dataType === "json") {

        xhr.open(act.type, act.url, true);
        if (act.before) {
            act.before(xhr);
        }
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(act.data));
    } else {
        xhr.open(act.type, act.url, true);
        if (act.before) {
            act.before(xhr);
        }
        console.log(act.data);
        xhr.send(act.data);
    }
    return new Promise((resolve, rej) => {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    resolve(xhr);
                } else {
                    let res = null;
                    try {
                        res = JSON.parse(xhr.responseText);
                        if(res.status === 1 || res.status === "1") {
                            // window.location = "/";
                            sessionStorage.setItem("back", window.location.pathname);
                        } else {
                            rej(xhr);
                        }  
                    } catch(err) {
                        console.log(xhr.getAllResponseHeaders())
                        console.log(err);
                    }
                }
            }
        }
    })
}