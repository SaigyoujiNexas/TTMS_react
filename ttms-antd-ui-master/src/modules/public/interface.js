import ajax from "./ajax";
export const url = "http://101.201.78.192:9999";
console.log(url)

let headers = {
  'Content-Type': 'application/json',
};
if (localStorage.getItem("admin-token")) {
  headers["token"] = localStorage.getItem("admin-token");
}
if (sessionStorage.getItem("admin-token")) {
  headers["token"] = sessionStorage.getItem("admin-token");
}

const getFilmsListUrl = url + "/ttms/movie/getList";
export function getMovies(param) {
  return new Promise((res, rej) => {
    ajax({
      url: getFilmsListUrl,
      type: "GET",
      data: param,
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", "headers.token")
        }
      }
    }).then((xhr) => {
      let data = JSON.parse(xhr.responseText);
      res(data);
    }).catch((err) => {
      rej({
        status: 1,
        msg: "网络无法到达",
      })
    })
  })
}

export function getMovieByMid(mid) {
  return new Promise((res, rej) => {
    ajax({
      url: url + "/ttms/movie/getMovie",
      type: "GET",
      data: {id: mid},
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((xhr) => {
      let data = JSON.parse(xhr.responseText);
      res(data);
    }).catch((err) => {
      rej({
        status: 1,
        msg: "网络无法到达",
      })
    })
  })
}

const dataSource = [
  {
    key:1,
    code: 1,
    date: "2020-1-1",
    session: "第一场",
    state: "未售空",
    hall: "一号演出厅",
    operating: "暂无"
  },
  {
    key:2,
    code: 2,
    date: "2020-1-1",
    session: "第一场",
    state: "未售空",
    hall: "一号演出厅",
    operating: "暂无"
  },
  {
    key:3,
    code: 3,
    date: "2020-1-1",
    session: "第一场",
    state: "未售空",
    hall: "一号演出厅",
    operating: "暂无"
  },
  {
    key:4,
    code: 4,
    date: "2020-1-1",
    session: "第一场",
    state: "未售空",
    hall: "一号演出厅",
    operating: "暂无"
  },
  {
    key:5,
    code: 5,
    date: "2020-1-1",
    session: "第一场",
    state: "未售空",
    hall: "一号演出厅",
    operating: "暂无"
  },
  {
    key:6,
    code: 6,
    date: "2020-1-1",
    session: "第一场",
    state: "未售空",
    hall: "一号演出厅",
    operating: "暂无"
  }
]
export function getFilmSchedules(id) {
  return new Promise((res) => {
    setTimeout(() => {
      res(dataSource);
    }, 0);
  })
}

export function insertNewFilm(data) {
  data.actor = data.actor.split("/");
  data.releaseDate = data.releaseDate._d.getTime();
  data.type = data.type.split("/");
  data.area = data.area.split("/");
  data.language = data.language.split("/");
  data.filmlen = parseInt(data.filmlen);
  data.rate = parseFloat(data.rate);
  console.log(data);
  return new Promise((res, rej) => {
    ajax({
      url: url + "/ttms/movie/insert",
      type: "POST",
      data: data,
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      res(data.responseText)
    }).catch((e) => {
      console.log(e)
    })
  })
}

export function deleteFilm(id) {
  console.log({ id: id });
  return new Promise((res, rej) => {
    ajax({
      url: url + "/ttms/movie/delete",
      data: { id: id },
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      res(data.responseText);
    }).catch((e) => {
      console.log(e);
    })
  })
}

export function getStudioList() {
  return new Promise((res, rej) => {
    ajax({
      url: url + "/ttms/studio/query-list",
      type: "GET",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      },
    }).then((data) => {
      res(data.responseText);
    }).catch((e) => {
      rej({
        status: 4,
        msg: "网络无法到达",
      });
    });
  })
}

export function userLogin(data) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/staff/login",
      data: data,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      resolve({
        res: data.responseText,
        token: data.getResponseHeader("token")
      });
    }).catch((e) => {
      rej({
        msg: "网络无法到达"
      })
    })
  })
}

export function addStaff(data) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/staff/add",
      data: data,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      resolve(data.responseText);
    }).catch((e) => {
      rej({
        status: 4,
        msg: "网络无法到达",
      })
    })
  })
}

export function getStaff(para) {
  let num = 0;
  switch (para.roleGroup) {
    case "all":
      num = 0;
      break;
    case "conductor":
      num = 1;
      break;
    case "manager":
      num = 2;
      break;
    case "admin":
      num = 3;
      break;
    default:
      num = 0;
      break;
  }
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/staff/get",
      data: { role: num},
      type: "GET",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      resolve(data.responseText);
    }).catch((e) => {
      rej({
        status: 4,
        msg: "网络无法到达",
      })
    })
  })
}

export function deleteStaff(id) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/staff/delete",
      data: { id: id },
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      resolve(data.responseText);
    }).catch((e) => {
      rej({
        status: 4,
        msg: "网络无法到达",
      })
    })
  })
}

export function addStudio(data) {
  let row = parseInt(data.row)
  let col = parseInt(data.col)
  let req = {
    name: data.name,
    row: row,
    col: col,
  }
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/studio/insert",
      data: req,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      resolve(data.responseText);
    }).catch((e) => {
      rej({
        status: 4,
        msg: "网络无法到达",
      })
    })
  })
}

export function modStaff(data) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/staff/updaterole",
      data: data,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      resolve(data.responseText);
    }).catch((e) => {
      rej({
        status: 4,
        msg: "网络无法到达",
      })
    })
  })
}

export function deleteStudio(id) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/studio/delete",
      data: {id: id},
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      resolve(data.responseText);
    }).catch((e) => {
      rej({
        status: 4,
        msg: "网络无法到达",
      })
    })
  })
}
/**
 * @param {string} url --请求地址
 * @param {num} id --id值
 */
export function strikeOut(url, id) {
  const token = sessionStorage.getItem("admin-token");
  let headers = {
    'Content-Type': 'application/json',
  };
  if(token) {
    headers["token"] = token;
  }
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({id: id}),
    headers: headers
  }).then((res) => {
   
    if(res.ok) {
      return res.json();
    } else {
      return new Promise((_, rej) => {
        rej("网络无法到达");
      })
    }
  })
}

export function getTableData(url,body) {
  return ajax({
    url: url,
    type: "GET",
    data: body,
    before: (xhr) => {
      if(headers.token) {
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

export function toggleScheduleStatus(id) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/schedule/toggleStatus",
      data: {id: id},
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      resolve(data.responseText);
    }).catch((e) => {
      rej({
        status: 4,
        msg: "网络无法到达",
      })
    })
  })
}

export function insertNewSchedule(data) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/schedule/add",
      data: data,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
    }).then((data) => {
      resolve(data.responseText);
    }).catch((e) => {
      rej({
        status: 4,
        msg: "网络无法到达",
      })
    })
  })
}

export function getStudioSeatById(id) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/studio/query-seats",
      data: {studioId:id},
      type: "GET",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function modSeatStatus(id, status) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/studio/seat/modified",
      data: {seatId:id,status: status},
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function modStudio(body) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/studio/modify",
      data: body,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function getTicketByScheduleId(id) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/ticket/getTicketsByScheduleId",
      data: {scheduleId: id},
      type: "GET",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function submitOrder(body) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/ticket/submitOrder",
      data: body,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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


export function getUserOrders(phone) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/order/query",
      data: {phone: phone},
      type: "GET",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function returnOrder(body) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/order/reverse",
      data: body,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function resetPassword(body) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/staff/resetPwd",
      data: body,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function updatePassword(body) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/staff/updatePwd",
      data: body,
      type: "POST",
      dataType: "json",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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
export function getSalesVolume() {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/statistics/getSalesVolume",
      type: "GET",
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function getAllBoxOffice(body) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/statistics/getAllBoxOffice",
      type: "GET",
      data: body,
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function getDayBoxOffice(body) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/statistics/getTodayBoxOffice",
      type: "GET",
      data: body,
      before: (xhr) => {
        if(headers.token) {
          xhr.setRequestHeader("token", headers.token)
        }
      }
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

export function recharge(body) {
  return new Promise((resolve, rej) => {
    ajax({
      url: url + "/ttms/order/addBalance",
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