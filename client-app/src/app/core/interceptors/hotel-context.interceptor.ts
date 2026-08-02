import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const hotelContextInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const activeHotelId = authService.getActiveHotelId();

  // If a SuperAdmin selected a specific hotel, inject the X-Hotel-Id header into every HTTP request
  if (activeHotelId !== null && activeHotelId !== undefined) {
    const modifiedReq = req.clone({
      setHeaders: {
        'X-Hotel-Id': activeHotelId.toString()
      }
    });
    return next(modifiedReq);
  }

  return next(req);
};