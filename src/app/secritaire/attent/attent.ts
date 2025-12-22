import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  medecin: string;
  heureArrivee: Date;
  tempsAttente: number;
  urgence: 'faible' | 'moyenne' | 'élevée' | 'critique';
  statut: 'en-attente' | 'appelé' | 'en-consultation';
  telephone?: string;
  role: 'normal' | 'prioritaire' | 'urgence';
  rdvConfirme: boolean;
}

interface Stats {
  totalEnAttente: number;
  tempsMoyenAttente: number;
  prochainPatient: string;
  medecinsDisponibles: number;
}

@Component({
  selector: 'app-attent',
  imports: [CommonModule, FormsModule],
  templateUrl: './attent.html',
  styleUrl: './attent.scss',
})
export class Attent implements OnInit {
  currentTime: Date = new Date();
  searchTerm: string = '';
  
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  patientActuel: Patient | null = null;

  filterUrgence: string = '';
  filterStatut: string = '';

  stats: Stats = {
    totalEnAttente: 0,
    tempsMoyenAttente: 0,
    prochainPatient: '',
    medecinsDisponibles: 3
  };

  ngOnInit(): void {
    this.loadPatients();
    
    // Mettre à jour le temps
    setInterval(() => {
      this.currentTime = new Date();
      this.updateTempsAttente();
    }, 60000);
  }

  loadPatients() {
    const now = new Date();
    
    this.patients = [
      {
        id: 1,
        nom: 'Johnson',
        prenom: 'Emma',
        age: 32,
        medecin: 'Dr. Martin',
        heureArrivee: new Date(now.getTime() - 15 * 60000),
        tempsAttente: 15,
        urgence: 'élevée',
        statut: 'appelé',
        telephone: '+212655128440',
        role: 'prioritaire',
        rdvConfirme: true
      },
      {
        id: 2,
        nom: 'Smith',
        prenom: 'John',
        age: 45,
        medecin: 'Dr. Dubois',
        heureArrivee: new Date(now.getTime() - 25 * 60000),
        tempsAttente: 25,
        urgence: 'moyenne',
        statut: 'en-attente',
        telephone: '+212698765432',
        role: 'normal',
        rdvConfirme: true
      },
      {
        id: 3,
        nom: 'Davis',
        prenom: 'Sarah',
        age: 65,
        medecin: 'Dr. Martin',
        heureArrivee: new Date(now.getTime() - 5 * 60000),
        tempsAttente: 5,
        urgence: 'critique',
        statut: 'en-attente',
        telephone: '+212655443322',
        role: 'urgence',
        rdvConfirme: true
      },
      {
        id: 4,
        nom: 'Brown',
        prenom: 'Michael',
        age: 28,
        medecin: 'Dr. Moreau',
        heureArrivee: new Date(now.getTime() - 40 * 60000),
        tempsAttente: 40,
        urgence: 'faible',
        statut: 'en-attente',
        role: 'normal',
        rdvConfirme: false
      }
    ];

    this.trierPatients();
    this.updateStats();
    this.patientActuel = this.patients.find(p => p.statut === 'appelé') || null;
    this.applyFilters();
  }

  // Trier par priorité simple
  trierPatients() {
    this.patients.sort((a, b) => {
      // Patient appelé toujours en premier
      if (a.statut === 'appelé' && b.statut !== 'appelé') return -1;
      if (b.statut === 'appelé' && a.statut !== 'appelé') return 1;
      
      // RDV confirmé en priorité (interne)
      if (a.rdvConfirme && !b.rdvConfirme) return -1;
      if (!a.rdvConfirme && b.rdvConfirme) return 1;
      
      // Urgence
      const urgenceOrder = { 'critique': 4, 'élevée': 3, 'moyenne': 2, 'faible': 1 };
      if (urgenceOrder[a.urgence] !== urgenceOrder[b.urgence]) {
        return urgenceOrder[b.urgence] - urgenceOrder[a.urgence];
      }
      
      // Rôle
      const roleOrder = { 'urgence': 3, 'prioritaire': 2, 'normal': 1 };
      if (roleOrder[a.role] !== roleOrder[b.role]) {
        return roleOrder[b.role] - roleOrder[a.role];
      }
      
      // Temps d'attente
      return b.tempsAttente - a.tempsAttente;
    });
  }

  updateTempsAttente() {
    const now = new Date();
    this.patients.forEach(patient => {
      if (patient.statut === 'en-attente' || patient.statut === 'appelé') {
        const diffMs = now.getTime() - patient.heureArrivee.getTime();
        patient.tempsAttente = Math.floor(diffMs / 60000);
      }
    });
    this.trierPatients();
    this.updateStats();
    this.applyFilters();
  }

  updateStats() {
    const patientsEnAttente = this.patients.filter(p => p.statut === 'en-attente');
    const tempsMoyen = patientsEnAttente.length > 0 
      ? Math.round(patientsEnAttente.reduce((sum, p) => sum + p.tempsAttente, 0) / patientsEnAttente.length)
      : 0;
    
    const prochain = patientsEnAttente[0];

    this.stats = {
      totalEnAttente: patientsEnAttente.length,
      tempsMoyenAttente: tempsMoyen,
      prochainPatient: prochain ? prochain.prenom : 'Aucun',
      medecinsDisponibles: 3
    };
  }

  applyFilters() {
    let filtered = [...this.patients];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.nom.toLowerCase().includes(term) ||
        patient.prenom.toLowerCase().includes(term)
      );
    }

    if (this.filterUrgence) {
      filtered = filtered.filter(patient => patient.urgence === this.filterUrgence);
    }

    if (this.filterStatut) {
      filtered = filtered.filter(patient => patient.statut === this.filterStatut);
    }

    this.filteredPatients = filtered;
  }

  // Actions principales
  appelerPatient(patient: Patient) {
    if (patient.statut === 'en-attente') {
      // Remettre l'ancien patient appelé en attente
      this.patients.forEach(p => {
        if (p.statut === 'appelé') p.statut = 'en-attente';
      });
      
      patient.statut = 'appelé';
      this.patientActuel = patient;
      this.trierPatients();
      this.updateStats();
      this.applyFilters();
    }
  }

  appelerProchainPatient() {
    const prochain = this.patients.find(p => p.statut === 'en-attente');
    if (prochain) {
      this.appelerPatient(prochain);
    }
  }

  demarrerConsultation(patient: Patient) {
    if (patient.statut === 'appelé') {
      patient.statut = 'en-consultation';
      this.patientActuel = null;
      this.trierPatients();
      this.updateStats();
      this.applyFilters();
    }
  }

  envoyerWhatsApp(patient: Patient) {
    if (patient.telephone) {
      const message = encodeURIComponent(
        `Bonjour ${patient.prenom},\nLe médecin est prêt à vous recevoir.`
      );
      window.open(`https://wa.me/${patient.telephone.replace(/\D/g, '')}?text=${message}`, '_blank');
    }
  }

  rafraichirListe() {
    this.updateTempsAttente();
  }

  // Méthodes utilitaires
  getUrgenceClass(urgence: string): string {
    switch(urgence) {
      case 'critique': return 'critique';
      case 'élevée': return 'elevee';
      case 'moyenne': return 'moyenne';
      case 'faible': return 'faible';
      default: return 'faible';
    }
  }

  getStatutText(statut: string): string {
    switch(statut) {
      case 'appelé': return 'À APPELER';
      case 'en-consultation': return 'EN COURS';
      default: return 'EN ATTENTE';
    }
  }

  getProgressWidth(tempsAttente: number): number {
    const temps = Math.min(tempsAttente, 60);
    return (temps / 60) * 100;
  }
}