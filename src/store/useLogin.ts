/*
 * @Description: 更新频率较高，优化性能，单独使用
 * @Author: cg
 * @Date: 2024-11-20 16:16:46
 * @LastEditors: cg
 * @LastEditTime: 2025-01-02 18:08:41
 */
import { create } from 'zustand';
import { notification } from 'antd';
import { get as Get, post } from '@/ajax';
import { getCookie, getQueryParams } from '@/utils';
import { defaultComponentConfig } from '@/components/default';

interface IState {
  config: any;
  userName: string;
  toLogin: () => void;
  checkLogin: () => void;
  toLogOut: () => void;
}

export const useLoginStore = create<IState>((set, get) => ({
  config: {},
  userName: '',
  // 去登陆
  toLogin: () => {
    const urlObj = new URL(window.location.href);
    const searchParams = new URLSearchParams(urlObj.search);
    // 防止特殊情况，查询字符串中的ticket参数不能保存
    searchParams.delete('ticket');
    urlObj.search = searchParams.toString();
    window.location.href = import.meta.env.VITE_LOGIN_URL + '?redirectUrl=' + urlObj.href;
  },
  // 用于首次打开项目查看登录状态
  checkLogin: async () => {
    const query = getQueryParams();
    const SToken = getCookie('S-TOKEN');
    // 判断是否ticket第一次登录后进入页面
    if (query.ticket) {
      try {
        const res = await post('/statement/getToken', { ticket: query.ticket });
        if (res.successful) {
          // 获取当前 URL
          const currentUrl = new URL(window.location.href);
          // 删除查询参数
          currentUrl.search = '';
          // 替换当前 URL
          history.replaceState({}, document.title, currentUrl.href);
          // 刷新页面
          location.reload();
        }
      } catch (err) {
        console.log('err', err);
      }
    } else if (SToken) {
      const res = await Get<{ ok: boolean }>('/statement/checkToken');
      if (res.successful && res.data.ok) {
        // mode.value = ModeEnum.LOGGED;
        const res = await Get<{ name: string; config: any }>('/statement/getUserInfo');
        if (res.successful) {
          set({ userName: res.data.name, config: res.data.config });
        }
      } else {
        get().toLogOut();
      }
    }
  },
  // 退出登录
  toLogOut: async () => {
    const res = await Get('/statement/logout');
    if (res.successful) {
      // 清除cookie
      // document.cookie = 'S-TOKEN' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      set({ userName: '' });
      notification.info({ message: '退出成功！' });
    }
  }
}));
