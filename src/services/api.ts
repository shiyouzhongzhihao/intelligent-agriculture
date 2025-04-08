// https://api.emailjs.com/api/v1.0/email/send
import request from '@/services/request'
export const getRequest = async (params:any) => {
  return request.post('https://api.emailjs.com/api/v1.0/email/send', params)
}
