import { Injectable,signal } from "@angular/core";

export interface Alert {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // Duration in milliseconds
}

@Injectable({
  providedIn: 'root'
})
export class CustomAlertService {
  private alerts = signal<Alert[]>([]); 
  private nextId = 1;

  getAlerts() {
    return this.alerts.asReadonly();
  }
  
  success(message: string, duration: number=3000) {
    this.show('success', message, duration);
  }

  error(message: string, duration: number=5000) {
    this.show('error', message, duration);
  }

  info(message: string, duration: number=3000) {
    this.show('info', message, duration);
  }

  warning(message: string, duration: number=4000) {
    this.show('warning', message, duration);
  }

  private show(type: Alert['type'], message: string, duration: number) {
    const alert: Alert = {
      id: this.nextId++,
      type,
      message,
      duration
    };
    this.alerts.update(alerts => [...alerts, alert]);

    if(duration && duration > 0) {
      setTimeout(() => this.remove(alert.id), duration);
    }
  }

    remove(id: number) {
    this.alerts.update(alerts => alerts.filter(alert => alert.id !== id));
  }
  clear() {    this.alerts.set([]);
  }

} 