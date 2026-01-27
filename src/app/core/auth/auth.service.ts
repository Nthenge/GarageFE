import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { handleApiError } from '../utils/error-handler';
import { StorageService } from '../utils/storageservice';
import { Environment } from '../../../environment/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    role: string;
    firstname?: string;
    detailsCompleted: boolean;
  };
}

export interface RegisterRequest {
  firstname: string;
  secondname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    role?: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface VerifyTokenResponse {
  valid: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'token';
  private roleToken = 'role';
  private nameKey = 'firstname';
  private apiURL = Environment.authUrl;
  private welcome = '';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiURL}/user/login`, request).pipe(
      tap(res => {
        const user = res.data;

        this.storageService.setItem(this.tokenKey, user.token);
        this.storageService.setItem(this.roleToken, user.role);
        this.storageService.setItem('detailsCompleted', user.detailsCompleted ? 'true' : 'false');

        if (user.firstname) {
          this.storageService.setItem(this.nameKey, user.firstname);
          this.welcome = `Welcome back, ${user.firstname}`;
        }
      }),
      catchError(handleApiError)
    );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiURL}/user/register`, userData).pipe(
      tap(res => {
        if (res.data?.token) {
          this.storageService.setItem(this.tokenKey, res.data.token);

          if (res.data.role) {
            this.storageService.setItem(this.roleToken, res.data.role);
          }
        }
      }),
      catchError(handleApiError)
    );
  }
  logout(): void {
    const token = this.storageService.getItem(this.tokenKey);

    if (token) {
      const storageKey = `ownerSetup_${token}`;
      this.storageService.removeItem(storageKey);
    }

    this.storageService.removeItem(this.tokenKey);
    this.storageService.removeItem(this.roleToken);
    this.storageService.removeItem(this.nameKey);
    this.storageService.removeItem('profileData');
    this.storageService.removeItem('detailsCompleted');
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return this.storageService.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return this.storageService.getItem(this.roleToken);
  }

  hasCompletedDetails(): boolean {
    return this.storageService.getItem('detailsCompleted') === 'true';
  }

  setDetailsCompleted(status: boolean): void {
    this.storageService.setItem('detailsCompleted', status ? 'true' : 'false');
  }
  getUserName(): string | null {
    return this.storageService.getItem(this.nameKey);
  }

  getWelcomeMessage(): string {
    return this.welcome;
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.apiURL}/user/reset-password`,
      { email }
    ).pipe(
      catchError(handleApiError)
    );
  }

  verifyResetToken(token: string): Observable<VerifyTokenResponse> {
  return this.http.post<VerifyTokenResponse>(
    `${this.apiURL}/user/verify-reset-token`,
    { token }
  ).pipe(
    catchError(err => {
      const msg = err?.error?.message || 'Token verification failed';
      return throwError(() => ({ valid: false, message: msg }));
    })
  );
}

  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.apiURL}/user/update-password`,
      { token, newPassword }
    ).pipe(
      catchError(handleApiError)
    );
  }
}



