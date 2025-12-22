import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderSec } from '../header-sec/header-sec';

// Interfaces
export interface Patient {
  id: number;
  cin: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  numTel: string;
  typeMutuelle: string;
}

export interface Medecin {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  email: string;
  numTel: string;
}

export interface RendezVous {
  id: number;
  patientId: number;
  medecinId: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  duree: number;
  typeConsultation: string;
  motif: string;
  notes: string;
  statut: 'planifie' | 'confirme' | 'annule' | 'termine';
  createdAt: string;
}

@Component({
  selector: 'app-prendre-rdv',
  imports: [FormsModule, CommonModule,],
  templateUrl: './prend-rdv.html',
  styleUrl: './prend-rdv.scss'
})
export class PrendreRDV implements OnInit {
  currentDate: Date = new Date();
  searchTerm: string = '';
  showAddForm: boolean = false;
  isEditing: boolean = false;
  viewMode: 'list' | 'calendar' | 'grid' = 'list';
  hasConflict: boolean = false;
  
  // Filtres
  filterDate: string = '';
  filterMedecin: string = '';
  filterStatut: string = '';

  // Données minimales pour la date
  minDate: string = new Date().toISOString().split('T')[0];

  // Heures disponibles
  heuresDisponibles: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Données des médecins
  medecins: Medecin[] = [
    {
      id: 1,
      nom: 'Martin',
      prenom: 'Sophie',
      specialite: 'Cardiologie',
      email: 's.martin@cabinet.com',
      numTel: '0612345678'
    },
    {
      id: 2,
      nom: 'Dubois',
      prenom: 'Pierre',
      specialite: 'Dermatologie',
      email: 'p.dubois@cabinet.com',
      numTel: '0623456789'
    },
    {
      id: 3,
      nom: 'Moreau',
      prenom: 'Alice',
      specialite: 'Pédiatrie',
      email: 'a.moreau@cabinet.com',
      numTel: '0634567890'
    },
    {
      id: 4,
      nom: 'Laurent',
      prenom: 'Jean',
      specialite: 'Médecine Générale',
      email: 'j.laurent@cabinet.com',
      numTel: '0645678901'
    }
  ];

  // Données des patients (exemple)
  patients: Patient[] = [
    {
      id: 1,
      cin: 'AB123456',
      nom: 'Smith',
      prenom: 'John',
      dateNaissance: '1985-03-15',
      sexe: 'M',
      numTel: '0612345678',
      typeMutuelle: 'CNOPS'
    },
    {
      id: 2,
      cin: 'CD789012',
      nom: 'Johnson',
      prenom: 'Emma',
      dateNaissance: '1990-07-22',
      sexe: 'F',
      numTel: '0623456789',
      typeMutuelle: 'CNSS'
    },
    {
      id: 3,
      cin: 'EF345678',
      nom: 'Brown',
      prenom: 'Michael',
      dateNaissance: '1978-11-30',
      sexe: 'M',
      numTel: '0634567890',
      typeMutuelle: 'Assurance Privée'
    }
  ];

  // Nouveau rendez-vous
  newRendezVous: RendezVous = {
    id: 0,
    patientId: 0,
    medecinId: 0,
    date: '',
    heureDebut: '',
    heureFin: '',
    duree: 30,
    typeConsultation: '',
    motif: '',
    notes: '',
    statut: 'planifie',
    createdAt: new Date().toISOString()
  };

  // Liste des rendez-vous
  rendezVous: RendezVous[] = [];
  filteredRendezVous: RendezVous[] = [];

  // Patient sélectionné
  selectedPatient: Patient | null = null;

  // Calendrier
  currentWeek: Date = new Date();
  weekDays: { name: string; date: Date }[] = [];

  ngOnInit() {
    this.loadSampleData();
    this.generateWeekDays();
    
    // Mettre à jour l'heure chaque minute
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  loadSampleData() {
    // Données d'exemple de rendez-vous
    this.rendezVous = [
      {
        id: 1,
        patientId: 1,
        medecinId: 1,
        date: this.getTomorrowDate(),
        heureDebut: '09:00',
        heureFin: '09:30',
        duree: 30,
        typeConsultation: 'Consultation générale',
        motif: 'Douleurs thoraciques',
        notes: 'Patient à jeun',
        statut: 'planifie',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        patientId: 2,
        medecinId: 2,
        date: this.getTomorrowDate(),
        heureDebut: '10:30',
        heureFin: '11:00',
        duree: 30,
        typeConsultation: 'Consultation spécialisée',
        motif: 'Examen de la peau',
        notes: 'Apporter anciens résultats',
        statut: 'confirme',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        patientId: 3,
        medecinId: 3,
        date: this.getDayAfterTomorrowDate(),
        heureDebut: '14:00',
        heureFin: '14:45',
        duree: 45,
        typeConsultation: 'Suivi',
        motif: 'Contrôle annuel',
        notes: '',
        statut: 'planifie',
        createdAt: new Date().toISOString()
      }
    ];
    this.filteredRendezVous = [...this.rendezVous];
  }

  // Méthodes utilitaires pour les dates
  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getDayAfterTomorrowDate(): string {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter.toISOString().split('T')[0];
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.rendezVous];

    // Filtre par recherche texte
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(rdv => 
        this.getPatientName(rdv.patientId).toLowerCase().includes(term) ||
        this.getMedecinName(rdv.medecinId).toLowerCase().includes(term) ||
        rdv.typeConsultation.toLowerCase().includes(term) ||
        rdv.motif.toLowerCase().includes(term)
      );
    }

    // Filtre par date
    if (this.filterDate) {
      filtered = filtered.filter(rdv => rdv.date === this.filterDate);
    }

    // Filtre par médecin
    if (this.filterMedecin) {
      filtered = filtered.filter(rdv => rdv.medecinId === parseInt(this.filterMedecin));
    }

    // Filtre par statut
    if (this.filterStatut) {
      filtered = filtered.filter(rdv => rdv.statut === this.filterStatut);
    }

    this.filteredRendezVous = filtered;
  }

  // Gestion des événements du formulaire
  onPatientChange() {
    this.selectedPatient = this.patients.find(p => p.id === this.newRendezVous.patientId) || null;
    this.checkConflict();
  }

  onDateChange() {
    this.checkConflict();
  }

  onHeureChange() {
    this.calculateHeureFin();
    this.checkConflict();
  }

  onDureeChange() {
    this.calculateHeureFin();
    this.checkConflict();
  }

  calculateHeureFin() {
    if (this.newRendezVous.heureDebut && this.newRendezVous.duree) {
      const [hours, minutes] = this.newRendezVous.heureDebut.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(hours, minutes + this.newRendezVous.duree, 0, 0);
      
      const endHours = endTime.getHours().toString().padStart(2, '0');
      const endMinutes = endTime.getMinutes().toString().padStart(2, '0');
      this.newRendezVous.heureFin = `${endHours}:${endMinutes}`;
    }
  }

  checkConflict() {
    if (!this.newRendezVous.date || !this.newRendezVous.heureDebut || !this.newRendezVous.medecinId) {
      this.hasConflict = false;
      return;
    }

    const conflict = this.rendezVous.some(rdv => 
      rdv.id !== this.newRendezVous.id &&
      rdv.medecinId === this.newRendezVous.medecinId &&
      rdv.date === this.newRendezVous.date &&
      rdv.statut !== 'annule' &&
      this.isTimeOverlap(rdv.heureDebut, rdv.heureFin, this.newRendezVous.heureDebut, this.newRendezVous.heureFin)
    );

    this.hasConflict = conflict;
  }

  isTimeOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const [start1Hour, start1Minute] = start1.split(':').map(Number);
    const [end1Hour, end1Minute] = end1.split(':').map(Number);
    const [start2Hour, start2Minute] = start2.split(':').map(Number);
    const [end2Hour, end2Minute] = end2.split(':').map(Number);

    const start1Total = start1Hour * 60 + start1Minute;
    const end1Total = end1Hour * 60 + end1Minute;
    const start2Total = start2Hour * 60 + start2Minute;
    const end2Total = end2Hour * 60 + end2Minute;

    return start1Total < end2Total && end1Total > start2Total;
  }

  // Soumission du formulaire
  onSubmit() {
    if (this.isEditing) {
      // Modification
      const index = this.rendezVous.findIndex(rdv => rdv.id === this.newRendezVous.id);
      if (index !== -1) {
        this.rendezVous[index] = { ...this.newRendezVous };
      }
      alert('Rendez-vous modifié avec succès!');
    } else {
      // Nouveau rendez-vous
      this.newRendezVous.id = this.rendezVous.length > 0 ? Math.max(...this.rendezVous.map(rdv => rdv.id)) + 1 : 1;
      this.rendezVous.push({ ...this.newRendezVous });
      alert('Rendez-vous planifié avec succès!');
    }

    this.applyFilters();
    this.resetForm();
    this.showAddForm = false;
  }

  onCancel() {
    if (confirm('Voulez-vous vraiment annuler? Toutes les données saisies seront perdues.')) {
      this.resetForm();
      this.showAddForm = false;
    }
  }

  resetForm() {
    this.newRendezVous = {
      id: 0,
      patientId: 0,
      medecinId: 0,
      date: '',
      heureDebut: '',
      heureFin: '',
      duree: 30,
      typeConsultation: '',
      motif: '',
      notes: '',
      statut: 'planifie',
      createdAt: new Date().toISOString()
    };
    this.selectedPatient = null;
    this.hasConflict = false;
    this.isEditing = false;
  }

  // Actions sur les rendez-vous
  editRendezVous(rdv: RendezVous) {
    this.newRendezVous = { ...rdv };
    this.selectedPatient = this.patients.find(p => p.id === rdv.patientId) || null;
    this.isEditing = true;
    this.showAddForm = true;
    this.checkConflict();
  }

  confirmRendezVous(rdv: RendezVous) {
    if (confirm(`Confirmer le rendez-vous de ${this.getPatientName(rdv.patientId)} avec ${this.getMedecinName(rdv.medecinId)} ?`)) {
      rdv.statut = 'confirme';
      this.applyFilters();
      alert('Rendez-vous confirmé!');
    }
  }

  cancelRendezVous(rdv: RendezVous) {
    if (confirm(`Annuler le rendez-vous de ${this.getPatientName(rdv.patientId)} avec ${this.getMedecinName(rdv.medecinId)} ?`)) {
      rdv.statut = 'annule';
      this.applyFilters();
      alert('Rendez-vous annulé!');
    }
  }

  deleteRendezVous(rdv: RendezVous) {
    if (confirm(`Supprimer définitivement le rendez-vous de ${this.getPatientName(rdv.patientId)} ? Cette action est irréversible.`)) {
      this.rendezVous = this.rendezVous.filter(r => r.id !== rdv.id);
      this.applyFilters();
      alert('Rendez-vous supprimé!');
    }
  }

  // Méthodes utilitaires
  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu';
  }

  getPatientCIN(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? patient.cin : 'N/A';
  }

  getPatientInitials(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.prenom.charAt(0)}${patient.nom.charAt(0)}` : '??';
  }

  getMedecinName(medecinId: number): string {
    const medecin = this.medecins.find(m => m.id === medecinId);
    return medecin ? `Dr. ${medecin.prenom} ${medecin.nom}` : 'Médecin inconnu';
  }

  getMedecinSpecialite(medecinId: number): string {
    const medecin = this.medecins.find(m => m.id === medecinId);
    return medecin ? medecin.specialite : 'N/A';
  }

  getStatutText(statut: string): string {
    const statuts: { [key: string]: string } = {
      'planifie': 'Planifié',
      'confirme': 'Confirmé',
      'annule': 'Annulé',
      'termine': 'Terminé'
    };
    return statuts[statut] || statut;
  }

  calculateAge(dateNaissance: string): number {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Gestion du calendrier
  generateWeekDays() {
    const startOfWeek = new Date(this.currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Lundi
    
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      this.weekDays.push({
        name: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
        date: date
      });
    }
  }

  getWeekRange(): string {
    if (this.weekDays.length === 0) return '';
    const start = this.weekDays[0].date;
    const end = this.weekDays[6].date;
    return `${start.toLocaleDateString('fr-FR')} - ${end.toLocaleDateString('fr-FR')}`;
  }

  previousWeek() {
    this.currentWeek.setDate(this.currentWeek.getDate() - 7);
    this.generateWeekDays();
  }

  nextWeek() {
    this.currentWeek.setDate(this.currentWeek.getDate() + 7);
    this.generateWeekDays();
  }

  getRendezVousForDay(date: Date): RendezVous[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.rendezVous.filter(rdv => 
      rdv.date === dateStr && 
      rdv.statut !== 'annule'
    );
  }

  // Export
  exportRendezVous() {
    alert('Fonction d\'export des rendez-vous');
    // Implémentation de l'export CSV/Excel
  }
}
