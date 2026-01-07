import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Secretaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateEmbauche: Date;
  status: 'actif' | 'inactif' | 'congé';
  cabinetId: number;
  cabinet: string;
  rendezVousAssignes: number;
  heuresTravail: number;
  performance: number;
  specialite: string;
  avatarColor: string;
}

interface Cabinet {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
}

interface NewSecretaire {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateEmbauche: Date;
  status: 'actif' | 'inactif' | 'congé';
  cabinetId: number;
  cabinet: string;
  rendezVousAssignes: number;
  heuresTravail: number;
  performance: number;
  specialite: string;
  avatarColor: string;
}

@Component({
  selector: 'app-admin-secritaires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-secritaires.html',
  styleUrls: ['./admin-secritaires.scss']
})
export class AdminSecritaires implements OnInit {
  // Propriétés pour gérer l'admin connecté
  adminCabinetId: number = 0;
  adminCabinetNom: string = 'Cabinet Principal';
  
  // Données des cabinets disponibles
  cabinets: Cabinet[] = [
    {
      id: 1,
      nom: 'Cabinet Principal',
      adresse: '123 Avenue des Champs-Élysées',
      ville: 'Paris'
    },
    {
      id: 2,
      nom: 'Cabinet Nord',
      adresse: '456 Rue de la République',
      ville: 'Lille'
    },
    {
      id: 3,
      nom: 'Cabinet Sud',
      adresse: '789 Boulevard de la Liberté',
      ville: 'Marseille'
    },
    {
      id: 4,
      nom: 'Cabinet Ouest',
      adresse: '321 Rue du Faubourg',
      ville: 'Lyon'
    }
  ];

  // Données des secrétaires
  secretaires: Secretaire[] = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@clinique.fr',
      telephone: '+33 6 12 34 56 78',
      dateEmbauche: new Date('2022-03-15'),
      status: 'actif',
      cabinetId: 1,
      cabinet: 'Cabinet Principal',
      rendezVousAssignes: 156,
      heuresTravail: 35,
      performance: 92,
      specialite: 'Gestion Administrative',
      avatarColor: '#3B82F6'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@clinique.fr',
      telephone: '+33 6 23 45 67 89',
      dateEmbauche: new Date('2021-08-10'),
      status: 'actif',
      cabinetId: 1,
      cabinet: 'Cabinet Principal',
      rendezVousAssignes: 189,
      heuresTravail: 40,
      performance: 95,
      specialite: 'Accueil Patients',
      avatarColor: '#8B5CF6'
    },
    {
      id: 3,
      nom: 'Bernard',
      prenom: 'Julie',
      email: 'julie.bernard@clinique.fr',
      telephone: '+33 6 34 56 78 90',
      dateEmbauche: new Date('2023-01-20'),
      status: 'congé',
      cabinetId: 1,
      cabinet: 'Cabinet Principal',
      rendezVousAssignes: 89,
      heuresTravail: 28,
      performance: 85,
      specialite: 'Planification',
      avatarColor: '#EC4899'
    },
    {
      id: 4,
      nom: 'Petit',
      prenom: 'Claire',
      email: 'claire.petit@clinique.fr',
      telephone: '+33 6 45 67 89 01',
      dateEmbauche: new Date('2020-11-05'),
      status: 'actif',
      cabinetId: 1,
      cabinet: 'Cabinet Principal',
      rendezVousAssignes: 210,
      heuresTravail: 42,
      performance: 98,
      specialite: 'Gestion Administrative',
      avatarColor: '#10B981'
    },
    {
      id: 5,
      nom: 'Robert',
      prenom: 'Laura',
      email: 'laura.robert@clinique.fr',
      telephone: '+33 6 56 78 90 12',
      dateEmbauche: new Date('2023-05-30'),
      status: 'inactif',
      cabinetId: 2,
      cabinet: 'Cabinet Nord',
      rendezVousAssignes: 45,
      heuresTravail: 20,
      performance: 78,
      specialite: 'Accueil Patients',
      avatarColor: '#F59E0B'
    },
    {
      id: 6,
      nom: 'Lemoine',
      prenom: 'Thomas',
      email: 'thomas.lemoine@clinique.fr',
      telephone: '+33 6 67 89 01 23',
      dateEmbauche: new Date('2022-09-12'),
      status: 'actif',
      cabinetId: 1,
      cabinet: 'Cabinet Principal',
      rendezVousAssignes: 175,
      heuresTravail: 38,
      performance: 88,
      specialite: 'Planification',
      avatarColor: '#0EA5E9'
    },
    {
      id: 7,
      nom: 'Girard',
      prenom: 'Isabelle',
      email: 'isabelle.girard@clinique.fr',
      telephone: '+33 6 78 90 12 34',
      dateEmbauche: new Date('2021-02-28'),
      status: 'actif',
      cabinetId: 1,
      cabinet: 'Cabinet Principal',
      rendezVousAssignes: 195,
      heuresTravail: 40,
      performance: 91,
      specialite: 'Accueil Patients',
      avatarColor: '#F43F5E'
    }
  ];

  // Formulaire d'ajout
  showAddForm: boolean = false;
  newSecretaire: NewSecretaire = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateEmbauche: new Date(),
    status: 'actif',
    cabinetId: 0,
    cabinet: '',
    rendezVousAssignes: 0,
    heuresTravail: 35,
    performance: 85,
    specialite: '',
    avatarColor: '#3B82F6'
  };

  // Statistiques
  stats = {
    total: 0,
    actifs: 0,
    performanceMoyenne: 0,
    totalRendezVous: 0,
    totalHeures: 0
  };

  // Filtres
  searchTerm: string = '';
  statusFilter: string = 'all';
  cabinetFilter: string = 'all';
  specialiteFilter: string = 'all';

  // Tri
  sortColumn: string = 'nom';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Données pour les filtres
  specialites: string[] = [];

  // Données calculées pour la répartition des spécialités
  specialiteRepartition: { nom: string; count: number; percentage: number }[] = [];

  ngOnInit() {
    // Récupérer l'admin connecté et son cabinet
    this.getAdminCabinetInfo();
    this.calculerStatistiques();
    this.extraireFiltres();
    this.calculerRepartitionSpecialites();
  }

  // Méthode pour obtenir les infos du cabinet de l'admin
  getAdminCabinetInfo() {
    // Simulation - normalement vous récupérez ces infos depuis un service d'authentification
    // Pour la démo, supposons que l'admin est connecté au cabinet 1 (Cabinet Principal)
    
    const currentUserCabinetId = 1; // ID du cabinet de l'admin connecté
    
    this.adminCabinetId = currentUserCabinetId;
    
    // Trouver le nom du cabinet
    const cabinet = this.cabinets.find(c => c.id === this.adminCabinetId);
    if (cabinet) {
      this.adminCabinetNom = cabinet.nom;
    }
    
    // Initialiser le formulaire avec le cabinet de l'admin
    this.newSecretaire.cabinetId = this.adminCabinetId;
    this.newSecretaire.cabinet = this.adminCabinetNom;
  }

  // Méthode pour ajouter une nouvelle secrétaire
  ajouterSecretaire() {
    if (this.validerFormulaire()) {
      // Forcer l'ajout dans le cabinet de l'admin
      this.newSecretaire.cabinetId = this.adminCabinetId;
      this.newSecretaire.cabinet = this.adminCabinetNom;
      
      // Générer un ID unique
      const maxId = Math.max(...this.secretaires.map(s => s.id), 0);
      const nouvelleSecretaire: Secretaire = {
        id: maxId + 1,
        ...this.newSecretaire
      };

      // Ajouter la secrétaire
      this.secretaires.push(nouvelleSecretaire);
      
      // Réinitialiser le formulaire
      this.resetForm();
      this.showAddForm = false;
      
      // Recalculer les statistiques et filtres
      this.calculerStatistiques();
      this.extraireFiltres();
      this.calculerRepartitionSpecialites();
      
      // Réinitialiser la pagination
      this.currentPage = 1;
      
      // Afficher une notification
      alert(`Secrétaire ${this.newSecretaire.prenom} ${this.newSecretaire.nom} ajoutée avec succès !`);
    }
  }

  // Méthode pour valider le formulaire
  validerFormulaire(): boolean {
    return !!(this.newSecretaire.nom && 
      this.newSecretaire.prenom && 
      this.newSecretaire.specialite && 
      this.newSecretaire.email && 
      this.newSecretaire.telephone);
  }

  // Méthode pour réinitialiser le formulaire
  resetForm() {
    this.newSecretaire = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      dateEmbauche: new Date(),
      status: 'actif',
      cabinetId: this.adminCabinetId,
      cabinet: this.adminCabinetNom,
      rendezVousAssignes: 0,
      heuresTravail: 35,
      performance: 85,
      specialite: '',
      avatarColor: '#3B82F6'
    };
  }

  // Méthode pour obtenir les secrétaires filtrés (uniquement ceux du cabinet de l'admin)
  get filteredSecretaires(): Secretaire[] {
    // Filtre d'abord par le cabinet de l'admin
    let filtered = this.secretaires.filter(secretaire => 
      secretaire.cabinetId === this.adminCabinetId
    );

    // Applique les autres filtres
    filtered = filtered.filter(secretaire => {
      const matchesSearch = !this.searchTerm || 
        secretaire.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        secretaire.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        secretaire.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        secretaire.telephone.includes(this.searchTerm);

      const matchesStatus = this.statusFilter === 'all' || 
        secretaire.status === this.statusFilter;
      
      const matchesSpecialite = this.specialiteFilter === 'all' || 
        secretaire.specialite === this.specialiteFilter;

      return matchesSearch && matchesStatus && matchesSpecialite;
    });

    // Appliquer le tri
    return this.sortSecretaires(filtered);
  }

  // Méthode pour trier les secrétaires
  sortSecretaires(secretaires: Secretaire[]): Secretaire[] {
    return [...secretaires].sort((a, b) => {
      const aValue = a[this.sortColumn as keyof Secretaire];
      const bValue = b[this.sortColumn as keyof Secretaire];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return this.sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    });
  }

  // Méthode pour calculer les statistiques (uniquement pour le cabinet de l'admin)
  calculerStatistiques() {
    const secretairesCabinet = this.secretaires.filter(s => s.cabinetId === this.adminCabinetId);
    const secretairesActifs = secretairesCabinet.filter(s => s.status === 'actif');
    
    this.stats = {
      total: secretairesCabinet.length,
      actifs: secretairesActifs.length,
      performanceMoyenne: secretairesCabinet.length > 0 
        ? Math.round(secretairesCabinet.reduce((sum, s) => sum + s.performance, 0) / secretairesCabinet.length)
        : 0,
      totalRendezVous: secretairesCabinet.reduce((sum, s) => sum + s.rendezVousAssignes, 0),
      totalHeures: secretairesCabinet.reduce((sum, s) => sum + s.heuresTravail, 0)
    };
  }

  extraireFiltres() {
    this.specialites = [...new Set(this.secretaires
      .filter(s => s.cabinetId === this.adminCabinetId)
      .map(s => s.specialite))].sort();
  }

  calculerRepartitionSpecialites() {
    const secretairesCabinet = this.secretaires.filter(s => s.cabinetId === this.adminCabinetId);
    this.specialiteRepartition = this.specialites.map(specialite => {
      const count = secretairesCabinet.filter(s => s.specialite === specialite).length;
      const percentage = secretairesCabinet.length > 0 ? (count / secretairesCabinet.length) * 100 : 0;
      return { nom: specialite, count, percentage };
    }).filter(specialite => specialite.count > 0);
  }

  get paginatedSecretaires(): Secretaire[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSecretaires.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSecretaires.length / this.itemsPerPage);
  }

  // Méthodes utilitaires pour le template
  getMin(currentPage: number, itemsPerPage: number, filteredSecretaires: Secretaire[]): number {
    return Math.min(currentPage * itemsPerPage, filteredSecretaires.length);
  }

  // Méthodes pour le tri
  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  // Méthodes pour la pagination
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Méthodes d'actions
  toggleStatus(secretaire: Secretaire) {
    secretaire.status = secretaire.status === 'actif' ? 'inactif' : 'actif';
    this.calculerStatistiques();
  }

  editSecretaire(secretaire: Secretaire) {
    // Pour l'instant, on affiche juste une alerte
    // Dans une vraie application, vous pré-rempliriez le formulaire avec les données
    this.newSecretaire = {
      nom: secretaire.nom,
      prenom: secretaire.prenom,
      email: secretaire.email,
      telephone: secretaire.telephone,
      dateEmbauche: new Date(secretaire.dateEmbauche),
      status: secretaire.status,
      cabinetId: secretaire.cabinetId,
      cabinet: secretaire.cabinet,
      rendezVousAssignes: secretaire.rendezVousAssignes,
      heuresTravail: secretaire.heuresTravail,
      performance: secretaire.performance,
      specialite: secretaire.specialite,
      avatarColor: secretaire.avatarColor
    };
    
    this.showAddForm = true;
    alert(`Modification du secrétaire: ${secretaire.prenom} ${secretaire.nom} - Remplissez le formulaire pour modifier`);
  }

  deleteSecretaire(secretaire: Secretaire) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${secretaire.prenom} ${secretaire.nom} ?`)) {
      this.secretaires = this.secretaires.filter(s => s.id !== secretaire.id);
      this.calculerStatistiques();
      this.extraireFiltres();
      this.calculerRepartitionSpecialites();
    }
  }

  // Méthodes utilitaires
  getInitiales(nom: string, prenom: string): string {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  }

  getDateFormatee(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getAnciennete(dateEmbauche: Date): number {
    const aujourdhui = new Date();
    const embauche = new Date(dateEmbauche);
    return Math.floor((aujourdhui.getTime() - embauche.getTime()) / (1000 * 3600 * 24 * 365));
  }

  // Réinitialiser les filtres
  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.specialiteFilter = 'all';
    this.currentPage = 1;
  }

  // Générer un rapport
  genererRapport() {
    const secretairesCabinet = this.filteredSecretaires;
    if (secretairesCabinet.length === 0) {
      alert('Aucun secrétaire à exporter dans votre cabinet !');
      return;
    }
    
    // Formatage des données pour le rapport
    const rapportData = {
      cabinet: this.adminCabinetNom,
      date: new Date().toLocaleDateString('fr-FR'),
      totalSecretaires: this.stats.total,
      secretairesActifs: this.stats.actifs,
      performanceMoyenne: this.stats.performanceMoyenne + '%',
      totalRendezVous: this.stats.totalRendezVous,
      totalHeures: this.stats.totalHeures,
      listeSecretaires: secretairesCabinet.map(s => ({
        nom: s.nom,
        prenom: s.prenom,
        specialite: s.specialite,
        performance: s.performance + '%',
        statut: s.status,
        email: s.email,
        telephone: s.telephone
      }))
    };
    
    console.log('Rapport généré :', rapportData);
    alert(`Rapport généré avec succès ! ${secretairesCabinet.length} secrétaire(s) dans le rapport.`);
  }
}