import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RendezVousResponse } from '../models/rendez-vous.model'; // crée ce modèle si nécessaire

@Injectable({
  providedIn: 'root',
})
export class RendezVousService {
  private rendezVousList: RendezVousResponse[] = [
    // Exemple de données simulées
    {
      idRendezVous: 1,
      dateRdvs: new Date('2025-12-30'),
      heureDebut: new Date('2025-12-30T09:00:00'),
      heureFin: new Date('2025-12-30T09:30:00'),
      statut: 'Disponible',
      remarque: '',
      motif: 'Consultation générale',
      idSecretaire: 1,
      idMedecin: 1,
      idConsultation: null,
      idPatient: 1,
    },
    {
      idRendezVous: 2,
      dateRdvs: new Date('2025-12-30'),
      heureDebut: new Date('2025-12-30T10:00:00'),
      heureFin: new Date('2025-12-30T10:30:00'),
      statut: 'Disponible',
      remarque: '',
      motif: 'Suivi',
      idSecretaire: 2,
      idMedecin: 1,
      idConsultation: null,
      idPatient: 2,
    },
  ];

  constructor() {}

  /**
   * Retourne tous les rendez-vous disponibles
   */
  getRendezVousDisponibles(): Observable<RendezVousResponse[]> {
    const disponibles = this.rendezVousList.filter(
      (rdv) => rdv.statut === 'Disponible' && !rdv.idConsultation
    );
    return of(disponibles);
  }

  /**
   * Ajouter un rendez-vous (simulation)
   */
  addRendezVous(rdv: RendezVousResponse): Observable<RendezVousResponse> {
    rdv.idRendezVous = this.rendezVousList.length + 1;
    this.rendezVousList.push(rdv);
    return of(rdv);
  }

  /**
   * Supprimer un rendez-vous (simulation)
   */
  deleteRendezVous(id: number): Observable<boolean> {
    this.rendezVousList = this.rendezVousList.filter((rdv) => rdv.idRendezVous !== id);
    return of(true);
  }

  /**
   * Mettre à jour un rendez-vous (simulation)
   */
  updateRendezVous(rdv: RendezVousResponse): Observable<RendezVousResponse> {
    const index = this.rendezVousList.findIndex((r) => r.idRendezVous === rdv.idRendezVous);
    if (index !== -1) {
      this.rendezVousList[index] = rdv;
    }
    return of(rdv);
  }
}
