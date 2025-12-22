import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderSec } from '../header-sec/header-sec';
import { DossierMedicalComponent } from '../../components/dossier-medical/dossier-medical';
import { DossierMedical } from '../../models/dossier-medical.model';

export interface Patient {
  id: number;
  cin: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  numTel: string;
  typeMutuelle: string;
  autreMutuelle?: string;
}

@Component({
  selector: 'app-patient',
  imports: [FormsModule, CommonModule, DossierMedicalComponent],
  templateUrl: './patient.html',
  styleUrl: './patient.scss',
})
export class PatientComponent implements OnInit {
  currentDate: Date = new Date();
  searchTerm: string = '';
  showAddForm: boolean = false;
  isEditing: boolean = false;
  viewMode: 'list' | 'grid' = 'list';
  
  // Calcul de la date maximale pour la date de naissance (aujourd'hui - 120 ans)
  maxBirthDate: string = new Date(new Date().getFullYear() - 120, 0, 1).toISOString().split('T')[0];

  // Nouveau patient
  newPatient: Patient = {
    id: 0,
    cin: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    numTel: '',
    typeMutuelle: ''
  };

  // Liste des patients
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  // Dossier médical
  showDossier: boolean = false;
  selectedPatientForDossier: Patient | null = null;

  ngOnInit() {
    this.loadSampleData();
    
    // Mettre à jour l'heure chaque minute
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  loadSampleData() {
    // Données d'exemple
    this.patients = [
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
      },
      {
        id: 4,
        cin: 'GH901234',
        nom: 'Davis',
        prenom: 'Sarah',
        dateNaissance: '1995-05-18',
        sexe: 'F',
        numTel: '0645678901',
        typeMutuelle: ''
      }
    ];
    this.filteredPatients = [...this.patients];
  }

  onSearch() {
    if (!this.searchTerm) {
      this.filteredPatients = [...this.patients];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredPatients = this.patients.filter(patient =>
        patient.nom.toLowerCase().includes(term) ||
        patient.prenom.toLowerCase().includes(term) ||
        patient.cin.toLowerCase().includes(term) ||
        patient.numTel.includes(term)
      );
    }
  }

  onSubmit() {
    // Si le type de mutuelle est "Autre", utiliser la valeur du champ autreMutuelle
    if (this.newPatient.typeMutuelle === 'Autre' && this.newPatient.autreMutuelle) {
      this.newPatient.typeMutuelle = this.newPatient.autreMutuelle;
    }

    if (this.isEditing) {
      // Modifier un patient existant
      const index = this.patients.findIndex(p => p.id === this.newPatient.id);
      if (index !== -1) {
        this.patients[index] = {...this.newPatient};
      }
      alert(`Patient ${this.newPatient.prenom} ${this.newPatient.nom} modifié avec succès!`);
    } else {
      // Ajouter un nouveau patient
      this.newPatient.id = this.patients.length > 0 ? Math.max(...this.patients.map(p => p.id)) + 1 : 1;
      this.patients.push({...this.newPatient});
      alert(`Patient ${this.newPatient.prenom} ${this.newPatient.nom} ajouté avec succès!`);
    }

    this.onSearch();
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
    this.newPatient = {
      id: 0,
      cin: '',
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: '',
      numTel: '',
      typeMutuelle: ''
    };
    this.isEditing = false;
  }

  editPatient(patient: Patient) {
    this.newPatient = {...patient};
    
    // Si la mutuelle n'est pas dans la liste prédéfinie, la mettre comme "Autre"
    const predefinedMutuelle = ['CNOPS', 'CNSS', 'RAMED', 'Assurance Privée', ''];
    if (patient.typeMutuelle && !predefinedMutuelle.includes(patient.typeMutuelle)) {
      this.newPatient.autreMutuelle = patient.typeMutuelle;
      this.newPatient.typeMutuelle = 'Autre';
    }
    
    this.isEditing = true;
    this.showAddForm = true;
  }

  deletePatient(patient: Patient) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le patient ${patient.prenom} ${patient.nom}? Cette action est irréversible.`)) {
      this.patients = this.patients.filter(p => p.id !== patient.id);
      this.onSearch();
      alert(`Patient ${patient.prenom} ${patient.nom} supprimé avec succès!`);
    }
  }

  viewMedicalRecord(patient: Patient) {
    // Ouvrir le formulaire du dossier médical pour le patient sélectionné
    this.selectedPatientForDossier = patient;
    this.showDossier = true;
  }

  handleDossierSubmit(dossier: DossierMedical) {
    console.log('Dossier soumis pour patient', dossier);
    // Ici on pourrait appeler un service pour sauvegarder le dossier
    this.showDossier = false;
  }

  closeDossier() {
    this.showDossier = false;
    this.selectedPatientForDossier = null;
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

  getRandomDate(): Date {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}