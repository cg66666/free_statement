/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-08-18 15:40:54
 * @LastEditors: cg
 * @LastEditTime: 2024-11-21 13:35:13
 */
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { message as message2, notification } from 'antd';
import cac from '@/utils/cac';

// code码提示语
const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

export interface IData<T> {
  code: string;
  data: T;
  error: string;
  successful: boolean;
  message: string;

  // 部分特殊接口返回
  status?: number;
  msg?: string;
}

/** 消息通知，默认时间 */
const duration = 2;
/** 成功返回码 */
const successCode = '000000';

export const instance = axios.create({
  withCredentials: true,
  timeout: 1000 * 60 * 30 // 设置超时时间
});

instance.interceptors.request.use(
  (req) => {
    const c_token = cac.common.getCookie('XSRF-TOKEN');
    const { access_token } = cac.token.loadToken();
    if (access_token) {
      localStorage.setItem('access_token', access_token);
    }
    req.headers['X-Requested-With'] = 'XMLHttpRequest';
    req.headers['Authorization'] = `bearer ${access_token}`;
    req.headers['X-XSRF-TOKEN'] = c_token;
    return req;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (resp: AxiosResponse) => {
    const { data: _data, config } = resp;
    const { code, message } = _data;
    // 针对权限接口的特殊处理
    if (config.url && config.url === '/cosmo-demo/api/v1/permission' && resp.statusText === 'OK') {
      return { successful: true, ..._data };
    }
    if (code === successCode) return { successful: true, ..._data };
    // 错误提示大于20个字的需要更长的阅读时间
    message2.warning(message);
    return { successful: false, ..._data };
  },
  (error: AxiosError) => {
    const { response, request } = error;
    if (response && response.status) {
      const { status } = response;
      const data = response.data as any;
      if (status === 401) {
        notification.error({
          description: codeMessage[status],
          message: status,
          duration
        });
        // 前往登录逻辑
        cac.loginUtil.login();
      }
      if (status === 403) {
        const msg = data && data.msg ? data.msg : data ? data : codeMessage['403']; // 对403状态码跳转至统一的403页面
        window.location.href = '/403?msg=' + msg;
      }
      if (status && status === 500) {
        window.location.href = '/500';
      }
    } else if (!response) {
      if (!request.options.skipErrorMessage) {
        notification.error({
          description: '您的网络发生异常，无法连接服务器',
          message: '网络异常'
        });
      }
    }
    return {
      ...(error.response?.data as any),
      successful: false
    };
  }
);

/**
 *  Get请求
 * @param url 请求地址
 * @param data 请求参数
 * @param config  请求配置
 * @returns
 */
export const get = <T>(
  url: string,
  params: Record<string, any> = {},
  config?: AxiosRequestConfig
): Promise<IData<T>> =>
  new Promise((resolve, reject) => {
    const mergeConfig = { ...config, params };
    instance
      .get<IData<T>>(url, mergeConfig)
      .then((res) => {
        // @ts-ignore
        resolve(res);
      })
      .catch(() => {
        reject();
      });
  });

/**
 *  Post请求
 * @param url 请求地址
 * @param data 请求参数
 * @param config  请求配置
 * @returns
 */
export const post = <T>(
  url: string,
  data: { [key: string]: any } = {},
  config?: AxiosRequestConfig
): Promise<IData<T>> =>
  new Promise((resolve, reject) => {
    instance
      .post<IData<T>>(url, data, config)
      .then((res) => {
        // @ts-ignore
        resolve(res);
      })
      .catch(() => {
        reject();
      });
  });
