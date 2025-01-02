/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-12-27 14:04:29
 * @LastEditors: cg
 * @LastEditTime: 2024-12-27 15:05:19
 */

// 用于首次打开项目查看登录状态
const checkLogin = async () => {
  //   const query = getQueryParams();
  //   const XToken = getCookie('X-TOKEN');
  //   // 判断是否ticket第一次登录后进入页面
  //   if (query.ticket) {
  //     try {
  //       const res = await post('/chat_room/getToken', { ticket: query.ticket });
  //       if (res.successful) {
  //         // 获取当前 URL
  //         const currentUrl = new URL(window.location.href);
  //         // 删除查询参数
  //         currentUrl.search = '';
  //         // 替换当前 URL
  //         history.replaceState({}, document.title, currentUrl.href);
  //         // 刷新页面
  //         location.reload();
  //       }
  //     } catch (err) {
  //       console.log('err', err);
  //     }
  //   } else if (XToken) {
  //     const res = await get('/chat_room/checkToken');
  //     if (res.successful) {
  //       mode.value = ModeEnum.LOGGED;
  //     }
  //   }
};

// 去登陆
export const toLogin = () => {
  const urlObj = new URL(window.location.href);
  const searchParams = new URLSearchParams(urlObj.search);
  // 防止特殊情况，查询字符串中的ticket参数不能保存
  searchParams.delete('ticket');
  urlObj.search = searchParams.toString();
  window.location.href = import.meta.env.VITE_LOGIN_URL + '?redirectUrl=' + urlObj.href;
};

// 退出登录
export const toLogOut = async () => {
  //   const res = await get('/chat_room/logout');
  //   if (res.successful) {
  //     // 清除cookie
  //     document.cookie = 'X-TOKEN' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  //     loginStore.mode = ModeEnum.NOTLOGING;
  //     loginStore.userName = '';
  //     loginStore.roomInfo = undefined;
  //     ElMessage({
  //       message: '退出登录成功！',
  //       type: 'warning',
  //       plain: true
  //     });
  //   }
};
