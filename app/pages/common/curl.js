const md5 = require('md5');
import {ElMessage } from 'element-plus'
/**
 * 前端封装的curl方法
 * @params options 请求参数
 */

const curl =({
  url, // 请求地址
  method = 'POST', // 请求方式
  headers = {}, // 请求头
  query = {}, // 请求参数 url query
  data = {}, // 请求体 post body
  responseType = 'json', // 返回数据类型 response data type
  timeout = 10000, // 超时时间
  errorMessage = '请求失败，请稍后再试', // 错误提示
}) => {
  // 接口签名处理(让接口变动态)
  const signKey = 'gwqbiudniueahewfuieuwddncaadsjk';
  const st = Date.now();

  // 构造请求参数(把参数转化为 axios 参数)
  const ajaxSetting = {
    url,
    method,
    params: query,
    data,
    responseType,
    timeout,
    headers: {
      ...headers,
      s_t: st,
      s_sign: md5(`${signKey}_${st}`),
    },
  };

  return axios.request(ajaxSetting).then((response) => {
    const resData = response.data || {};

    // 后端API返回的数据格式
    const { success } = resData;

    // 失败
    if (!success) {
      const { code, message } = resData;

      if (code === 442) {
        ElMessage.error('请求参数错误');
      } else if (code === 445) {
        ElMessage.error('请求不合法');
      } else if (code === 50000) {
        ElMessage.error(message);
      } else {
        ElMessage.error(errorMessage);
      }

      console.error(message);

      return Promise.resolve({ success, code, message });
    }

    // 成功
    const { data, metadata } = resData;
    return Promise.resolve({ success, data, metadata });
  }).catch((error) => {
    const { message } = error;

    if (message.match(/timeout/)) {
      return Promise.resolve({
        message: 'Request Timeout',
        code: 504
      })
    }

    return Promise.resolve(error)
  });

}

export default curl;