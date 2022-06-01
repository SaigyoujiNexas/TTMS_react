export const baseurl = "http://101.201.78.192:9999"
const RequestParam = {// eslint-disable-line
    /** 请求地址 */
    url: "",
    type: "",
    data: {},
    dataType: "",
    before: function () { },
}

/**
 * @param {RequestParam} act 
 * @returns {Promise<XMLHttpRequest>}
 */
export function ajax(act) {
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
                            window.location = "../login";
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
let headers = {
    'Content-Type': 'application/json'
};
if (localStorage.getItem("user-token")) {
    headers["token"] = localStorage.getItem("user-token");
}
if (sessionStorage.getItem("user-token")) {
    headers["token"] = localStorage.getItem("user-token");
}
export function getCode(phone) {
    return new Promise(async (resolve, rej) => {
        try {
            console.log(phone)
            let obj = await fetch(baseurl + "/ttms/user/login/getCode", {
                method: "POST",
                body: JSON.stringify({
                    phone: phone
                }),
                headers: headers
            });
            let res = await obj.json();
            resolve(res);
        } catch (err) {
            console.log(err);
            rej(err)
        }
    })
}

export function judgeCode(data) {
    return new Promise(async (resolve, rej) => {
        try {
            /**@type {Response} */
            let obj = await fetch(baseurl + "/ttms/user/login/judgeCode", {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers
            });
            let res = await obj.json();
            let resHeader = obj.headers;
            resolve({
                res: res,
                headers: resHeader
            });
        } catch (err) {
            console.log(err);
            rej(err)
        }
    })
}

export function getMovies(body) {
    let param = {
        sortType: "rate",
        sortRule: "down",
        page: 1,
        pageLimit: 8
    }
    if(body) {
        param = body;
    }
    return new Promise(async (resolve, rej) => {
        try {
            let res = await ajax({
                url: baseurl + "/ttms/movie/getList",
                type: "GET",
                before: (xhr) => {
                    if (headers.token) {
                        xhr.setRequestHeader("token", headers.token);
                    }
                },
                data: param
            });
            res = JSON.parse(res.responseText);
            resolve(res);
        } catch (err) {
            console.log(err);
            rej(err)
        }
    })
}

export function getTableData(url, body) {
    return ajax({
        url: url,
        type: "GET",
        data: body,
        before: (xhr) => {
            if (headers.token) {
                xhr.setRequestHeader("token", headers.token)
            }
        }
    }).then((xhr) => {
        return JSON.parse(xhr.responseText);
    }).catch(() => {
        return new Promise((_, rej) => {
            rej({
                msg: "网络无法到达"
            })
        })
    })
}

export function getTicketByScheduleId(id) {
    return new Promise((resolve, rej) => {
        ajax({
            url: baseurl + "/ttms/ticket/getTicketsByScheduleId",
            data: { scheduleId: id },
            type: "GET",
            dataType: "json",
            before: (xhr) => {
                if (headers.token) {
                    xhr.setRequestHeader("token", headers.token);
                }
            },
        }).then((xhr) => {
            resolve(xhr.responseText);
        }).catch((e) => {
            rej({
                status: 4,
                msg: "网络无法到达",
                data: {}
            })
        })
    })
}

export function submitOrder(body) {
    return new Promise((resolve, rej) => {
        ajax({
            url: baseurl + "/ttms/user/buyTickets",
            data: body,
            type: "POST",
            dataType: "json",
            before: (xhr) => {
                if (headers.token) {
                    xhr.setRequestHeader("token", headers.token);
                }
            },
        }).then((xhr) => {
            resolve(xhr.responseText);
        }).catch((e) => {
            rej({
                status: 4,
                msg: "网络无法到达",
            })
        })
    })
}

export function testToken(token) {
    return new Promise((res, rej) => {
        ajax({
            url: baseurl + "/ttms/user/test",
            before: (xhr) => {
                xhr.setRequestHeader("token", token)
            },
            type: "GET",
        }).then((xhr) => {
            res(xhr.responseText);
        }).catch((e) => {
            rej({
                status: 4,
                msg: "网络无法到达",
            })
        })
    })
}

export function getUserInform(token) {
    return new Promise((res, rej) => {
        ajax({
            url: baseurl + "/ttms/user/inform/get",
            before: (xhr) => {
                xhr.setRequestHeader("token", token)
            },
            type: "POST",
        }).then((xhr) => {
            res(xhr.responseText);
        }).catch((e) => {
            rej({
                status: 4,
                msg: "网络无法到达",
            })
        })
    })
}

export function modUserInform(body) {
    return new Promise((res, rej) => {
        ajax({
            url: baseurl + "/ttms/user/inform/update",
            before: (xhr) => {
                if (headers.token) {
                    xhr.setRequestHeader("token", headers.token);
                }
            },
            type: "POST",
            data: body,
            dataType: "json"
        }).then((xhr) => {
            res(xhr.responseText);
        }).catch((e) => {
            rej({
                status: 4,
                msg: "网络无法到达",
            })
        })
    })
}

export function getUserOrders() {
    return new Promise((res, rej) => {
        ajax({
            url: baseurl + "/ttms/user/getOrder",
            before: (xhr) => {
                if (headers.token) {
                    xhr.setRequestHeader("token", headers.token);
                }
            },
            type: "GET",
        }).then((xhr) => {
            res(xhr.responseText);
        }).catch((e) => {
            rej({
                status: 4,
                msg: "网络无法到达",
            })
        })
    })
}

export function returnOrder(data) {
    return new Promise((res, rej) => {
        ajax({
            url: baseurl + "/ttms/user/reverseOrder",
            before: (xhr) => {
                if (headers.token) {
                    xhr.setRequestHeader("token", headers.token);
                }
            },
            type: "POST",
            dataType: 'json',
            data: data
        }).then((xhr) => {
            res(xhr.responseText);
        }).catch((e) => {
            rej({
                status: 4,
                msg: "网络无法到达",
            })
        })
    })
}

export function recharge(body) {
    return new Promise((resolve, rej) => {
      ajax({
        url: baseurl + "/ttms/user/addBalance",
        type: "POST",
        data: body,
        before: (xhr) => {
          if(headers.token) {
            xhr.setRequestHeader("token", headers.token)
          }
        },
        dataType: "json"
      }).then((xhr) => {
        resolve(xhr.responseText);
      }).catch((e) => {
        rej({
          status: 4,
          msg: "网络无法到达",
        })
      })
    })
  }