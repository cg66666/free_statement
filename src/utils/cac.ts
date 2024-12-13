// import type { RequestResponse } from 'umi-request';
// import request from 'umi-request';

const baseOAuthUrl = '/cag';
// const localUri = `${window.location.origin}/rsm`;
const localuri = getLocalUri();
const outmostWindow = getParentWindow(window);

const cac = {
  config: {
    // 登出请求地址
    logoutUri: baseOAuthUrl + '/logout',
    // 认证地址
    userAuthorizationUri: baseOAuthUrl + '/authorize',
    // 获取用户
    userInfo: baseOAuthUrl + '/user',
    // 本地地址
    localUri: localuri
  },

  token: {
    loadToken() {
      return {
        access_token: cac.common.getCookie('cosmosource_token')
      };
    }
  },

  common: {
    getCookie(cookieName: string) {
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
  },

  loginUtil: {
    logout: function () {
      const logoutUrl = cac.config.logoutUri + '?logout_redirect_uri=' + cac.config.localUri;
      outmostWindow.location.href = logoutUrl;
      sessionStorage.clear(); // 清除工作空间
    },
    login: function () {
      const authorUrl =
        cac.config.userAuthorizationUri + '?redirect_uri=' + outmostWindow.location.href;
      outmostWindow.location.href = authorUrl;
      sessionStorage.clear(); // 清除工作空间
    },
    checkLogin: function () {
      const accessToken = cac.token.loadToken().access_token;
      if (!accessToken || accessToken === 'null') {
        cac.loginUtil.login();
        return false;
      }
      return true;
    }
  },

  api: {
    // getUserInfoAsync: function (
    //   callback:
    //     | ((
    //         value: RequestResponse<any>,
    //       ) => RequestResponse<any> | PromiseLike<RequestResponse<any>>)
    //     | null
    //     | undefined,
    //   error: ((reason: any) => PromiseLike<never>) | null | undefined,
    // ) {
    //   request.post(cac.config.userInfo).then(callback).catch(error);
    // },
    getUserInfo: function () {
      const tokenMap = parseJwt(cac.token.loadToken().access_token);
      if (tokenMap == null) return null;
      localStorage.setItem('tenantId', tokenMap.tenantId);
      return {
        user_id: tokenMap.user_id,
        user_name: tokenMap.user_name,
        display_name: tokenMap.display_name,
        tenantId: tokenMap.tenantId
      };
    }
  }
};

function parseJwt(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const payload = decodeBase64(parts[1]);
  if (payload == null) return null;

  return JSON.parse(payload);
}

function getParentWindow(currentWindow: Window): Window {
  // if (!findTopSwitch) {
  //   return currentWindow;
  // }
  const parentWindow = currentWindow.parent;
  if (parentWindow.location.href !== currentWindow.location.href) {
    return getParentWindow(parentWindow);
  }
  return currentWindow;
}

function getLocalUri() {
  let contextPath = '';
  const path = window.location.pathname;
  const firstIndex = path.indexOf('/');

  if (firstIndex !== -1) {
    const secondIndex = path.indexOf('/', firstIndex + 1);
    contextPath = path.substring(firstIndex, secondIndex !== -1 ? secondIndex : path.length);
    contextPath = contextPath === '/cac' || contextPath === '/' ? '' : contextPath;
  }
  return window.location.protocol + '//' + window.location.host + contextPath;
}

function decodeBase64(str: string) {
  let output = str.replace(new RegExp('-', 'gm'), '+').replace(new RegExp('_', 'gm'), '/');

  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      return null;
  }
  return decodeURIComponent(escape(window.atob(output)));
}
export default cac;
