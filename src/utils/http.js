import axios from 'axios'
//创建一个axios实例
const service = axios.create({
  // api的base_url
  baseURL: 'http://localhost:8080',
  // 请求超时时间
  timeout: 5000
})

//使用request拦截器对axios请求配置做统一处理
service.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = localStorage.getItem('token')
    return config
  },
  (error) => {
    //请求错误处理
    Promise.reject(error)
  }
)
