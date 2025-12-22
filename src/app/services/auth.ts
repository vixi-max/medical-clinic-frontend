// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    login: string;
    nom: string;
    prenom: string;
    email: string;
    numTel: string;
    role: string;
    cabinetId?: number;
    imageId?: string;
    signatureId?: string;
  };
}

export interface User {
  id: number;
  login: string;
  nom: string;
  prenom: string;
  email: string;
  numTel: string;
  role: string;
  cabinetId?: number;
  imageId?: string;
  signatureId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    this.loadUserFromStorage();
  }

  // Connexion
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response: AuthResponse) => {
          this.handleLoginSuccess(response);
        }),
        catchError((error: any) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  private handleLoginSuccess(response: AuthResponse): void {
    // Stocker le token et les informations utilisateur
    localStorage.setItem('token', response.token);
    localStorage.setItem('userRole', response.user.role.toLowerCase());
    localStorage.setItem('userData', JSON.stringify(response.user));
    
    // Mettre à jour le BehaviorSubject
    this.currentUserSubject.next(response.user);
    
    // Rediriger selon le rôle
    this.redirectBasedOnRole(response.user.role);
  }

  private redirectBasedOnRole(role: string): void {
    const roleLower = role.toLowerCase();
    
    switch(roleLower) {
      case 'secretaire':
        this.router.navigate(['/secretaire/secretary-dashboard']);
        break;
      case 'medecin':
        this.router.navigate(['/medecin/dashboard']);
        break;
      case 'super_admin':
      case 'admin_cabinet':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  // Méthode getCurrentUser - RETOURNE l'utilisateur courant
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Méthode isSuperAdmin - vérifie si l'utilisateur est SUPER_ADMIN
  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user) {
      // Vérifier aussi dans le localStorage
      const userData = this.getUserData();
      return userData?.role === 'SUPER_ADMIN' || userData?.role === 'super_admin';
    }
    return user.role === 'SUPER_ADMIN' || user.role === 'super_admin';
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Vérifier l'authentification
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Vérifier si le token est expiré
    const tokenData = this.parseJwt(token);
    if (!tokenData || !tokenData.exp) return false;
    
    return Date.now() < tokenData.exp * 1000;
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  // Charger l'utilisateur depuis le localStorage
  private loadUserFromStorage(): void {
    const userData = this.getUserData();
    if (userData) {
      this.currentUserSubject.next(userData);
    }
  }

  // Getters
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserData(): User | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Vérifier les rôles
  isSecretary(): boolean {
    const role = this.getUserRole();
    return role === 'secretaire';
  }

  isDoctor(): boolean {
    const role = this.getUserRole();
    return role === 'medecin';
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'super_admin' || role === 'admin_cabinet';
  }

  // Vérifier si l'utilisateur a un cabinet (admin ou médecin)
  hasCabinet(): boolean {
    const user = this.getCurrentUser();
    return !!user?.cabinetId;
  }

  // Mettre à jour les données utilisateur
  updateUserData(userData: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  // Rafraîchir les données utilisateur depuis l'API
  refreshUserData(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`)
      .pipe(
        tap(user => {
          this.updateUserData(user);
        }),
        catchError(error => {
          console.error('Error refreshing user data:', error);
          return throwError(() => error);
        })
      );
  }
}