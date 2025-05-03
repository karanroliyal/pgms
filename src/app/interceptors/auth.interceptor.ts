import { HttpInterceptorFn } from '@angular/common/http';

export const addHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
 const newReq= req.clone({
  headers:req.headers.set('Authorization',`Bearer ${token}`)
  
 })
 return next(newReq)
};
