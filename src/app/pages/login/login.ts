import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Données du formulaire
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  // États
  showPassword = false;
  isLoading = false;
  showForgotPasswordModal = false;
  forgotPasswordEmail = '';

  constructor(private router: Router) {}

  // Basculer la visibilité du mot de passe
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Soumission du formulaire
  onLogin() {
    if (this.isLoading) return;

    this.isLoading = true;
    
    // Simulation d'une requête API
    setTimeout(() => {
      console.log('Tentative de connexion:', this.loginData);
      
      // Ici, vous intégreriez votre service d'authentification
      // Pour l'exemple, on simule une connexion réussie
      const loginSuccess = true;
      
      if (loginSuccess) {
        // Redirection vers la page d'accueil ou tableau de bord
        this.router.navigate(['/dashboard']);
        
        // Stocker les informations de connexion si "Se souvenir de moi" est coché
        if (this.loginData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
      } else {
        // Gérer les erreurs de connexion
        console.error('Échec de la connexion');
      }
      
      this.isLoading = false;
    }, 2000);
  }

  // Mot de passe oublié
  onForgotPassword(event: Event) {
    event.preventDefault();
    this.showForgotPasswordModal = true;
  }

  // Fermer le modal
  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
    this.forgotPasswordEmail = '';
  }

  // Envoyer le lien de réinitialisation
  sendPasswordReset() {
    if (!this.forgotPasswordEmail) return;

    console.log('Envoi du lien de réinitialisation à:', this.forgotPasswordEmail);
    
    // Simulation d'envoi d'email
    this.isLoading = true;
    
    setTimeout(() => {
      alert('Un lien de réinitialisation a été envoyé à votre adresse email.');
      this.closeForgotPasswordModal();
      this.isLoading = false;
    }, 1500);
  }

  // Connexion avec Google
  loginWithGoogle() {
    this.isLoading = true;
    console.log('Connexion avec Google...');
    
    // Simulation
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    }, 2000);
  }

  // Connexion avec Apple
  loginWithApple() {
    this.isLoading = true;
    console.log('Connexion avec Apple...');
    
    // Simulation
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    }, 2000);
  }

  // Redirection vers la page d'inscription
  onRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  // Méthode pour valider l'email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Vérifier si le formulaire est valide
  isFormValid(): boolean {
    return this.isValidEmail(this.loginData.email) && 
           this.loginData.password.length >= 6;
  }
}