/*
 * @Description: 获取cookie
 * @Author: cg
 * @Date: 2024-09-19 14:47:16
 * @LastEditors: cg
 * @LastEditTime: 2024-09-19 14:47:39
 */
export function getCookie(cookieName: string) {
  let cookieValue = '';
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0].trim() === cookieName.trim()) {
        cookieValue = cookie[1].trim();
        break;
      }
    }
  }
  return cookieValue;
}
