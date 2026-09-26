import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const companyContextInterceptor: HttpInterceptorFn = (req, next) => {
  const companyId = inject(AuthService).getActiveCompanyId();

  return companyId === null
    ? next(req)
    : next(req.clone({ setHeaders: { 'X-Company-Id': companyId.toString() } }));
};