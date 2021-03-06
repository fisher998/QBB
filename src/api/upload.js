import fetch from '../common/js/fetch';
import axios from 'axios';
import { getToken } from '../common/js/auth';

// 请求阿里云OSS临时授权
export function getAliyunOSS() {
    return axios({
        method: 'get',
        url: 'api/web/aliyun/sts/auth',
        headers: {
            'source': 'web',
            'auth-token': getToken()
        }
    });
}