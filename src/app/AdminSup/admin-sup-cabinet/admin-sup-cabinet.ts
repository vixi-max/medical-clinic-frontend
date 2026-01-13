import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

// Import des services et interfaces
import { 
  CabinetService, 
  Cabinet, 
  CabinetFormData, 
  CabinetStats, 
  CabinetFilter, 
  PaginatedResponse 
} from '../../services/cabinet';
import { TruncatePipe } from '../../pipes/truncate-pipe';

@Component({
  selector: 'app-admin-sup-cabinet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TruncatePipe
  ],
  templateUrl: './admin-sup-cabinet.html',
  styleUrls: ['./admin-sup-cabinet.scss']
})
export class AdminSupCabinet implements OnInit, OnDestroy {
  // Données courantes
  currentDateTime: string;
  cabinets: Cabinet[] = [];
  selectedCabinet: Cabinet | null = null;
  editingCabinet: Cabinet | null = null;
  paginatedResponse: PaginatedResponse<Cabinet> | null = null;
  stats: any[] = [];
  cabinetStats: CabinetStats = {
    total: 0,
    actifs: 0,
    inactifs: 0,
    suspendus: 0
  };

  // États UI
  showForm = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  logoPreview: string | null = null;
  selectedLogoFile: File | null = null;

  // Filtres
  filter: CabinetFilter = {
    searchTerm: '',
    statut: 'ALL',
    page: 1,
    itemsPerPage: 10
  };

  // Recherche avec debounce
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Formulaire
  cabinetForm: FormGroup;

  constructor(
    private cabinetService: CabinetService,
    private fb: FormBuilder
  ) {
    this.currentDateTime = this.getCurrentDateTime();
    
    // Initialisation du formulaire
    this.cabinetForm = this.fb.group({
      nomCabinet: ['', [Validators.required, Validators.minLength(3)]],
      adresseCabinet: ['', Validators.required],
      emailCabinet: ['', [Validators.required, Validators.email]],
      teleCabinet: ['', Validators.required],
      statut: ['ACTIF', Validators.required]
    });

    // Configuration du debounce pour la recherche
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnInit() {
    this.loadData();
    this.updateDateTime();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des données
  loadData() {
    this.isLoading = true;
    
    // Charger les statistiques
    this.cabinetService.getCabinetStats().subscribe({
      next: (stats) => {
        this.cabinetStats = stats;
        this.updateStatsDisplay();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.isLoading = false;
      }
    });

    // Charger les cabinets
    this.cabinetService.searchCabinets(this.filter).subscribe({
      next: (response) => {
        this.paginatedResponse = response;
        this.cabinets = response.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cabinets:', error);
        this.isLoading = false;
      }
    });
  }

  // Mise à jour de l'affichage des statistiques
  updateStatsDisplay() {
    this.stats = [
      {
        label: 'Cabinets Totaux',
        value: this.cabinetStats.total,
        icon: 'fas fa-clinic-medical',
        gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
        trend: {
          value: 12,
          icon: 'fas fa-arrow-up',
          class: 'positive'
        }
      },
      {
        label: 'Cabinets Actifs',
        value: this.cabinetStats.actifs,
        icon: 'fas fa-check-circle',
        gradient: 'linear-gradient(135deg, #10B981, #059669)',
        trend: {
          value: 8,
          icon: 'fas fa-arrow-up',
          class: 'positive'
        }
      },
      {
        label: 'Cabinets Inactifs',
        value: this.cabinetStats.inactifs,
        icon: 'fas fa-times-circle',
        gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
        trend: {
          value: -3,
          icon: 'fas fa-arrow-down',
          class: 'negative'
        }
      },
      {
        label: 'Cabinets Suspendus',
        value: this.cabinetStats.suspendus,
        icon: 'fas fa-pause-circle',
        gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
        trend: {
          value: 0,
          icon: 'fas fa-minus',
          class: 'neutral'
        }
      }
    ];
  }

  // Gestion du formulaire
  showAddForm() {
    this.editingCabinet = null;
    this.cabinetForm.reset({
      nomCabinet: '',
      adresseCabinet: '',
      emailCabinet: '',
      teleCabinet: '',
      statut: 'ACTIF'
    });
    this.logoPreview = null;
    this.selectedLogoFile = null;
    this.errorMessage = '';
    this.showForm = true;
  }

  showEditForm(cabinet: Cabinet) {
    this.editingCabinet = cabinet;
    this.cabinetForm.patchValue({
      nomCabinet: cabinet.nomCabinet,
      adresseCabinet: cabinet.adresseCabinet,
      emailCabinet: cabinet.emailCabinet,
      teleCabinet: cabinet.teleCabinet,
      statut: cabinet.statut || 'ACTIF'
    });
    
    if (cabinet.logo) {
      this.logoPreview = cabinet.logo;
    }
    
    this.selectedLogoFile = null;
    this.errorMessage = '';
    this.showForm = true;
  }

  hideForm() {
    this.showForm = false;
    this.editingCabinet = null;
    this.cabinetForm.reset();
    this.logoPreview = null;
    this.selectedLogoFile = null;
    this.errorMessage = '';
  }

  // Gestion des fichiers
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'Le fichier est trop volumineux (max 2MB)';
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.match('image.*')) {
        this.errorMessage = 'Veuillez sélectionner une image valide';
        return;
      }

      this.selectedLogoFile = file;
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    this.logoPreview = null;
    this.selectedLogoFile = null;
    
    if (this.editingCabinet?.logo) {
      // Optionnel: supprimer le logo du serveur
      this.cabinetService.deleteLogo(this.editingCabinet.id).subscribe({
        next: () => {
          if (this.editingCabinet) {
            this.editingCabinet.logo = undefined;
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du logo:', error);
        }
      });
    }
  }

  // Soumission du formulaire
  onSubmit() {
    if (this.cabinetForm.invalid) {
      Object.keys(this.cabinetForm.controls).forEach(key => {
        const control = this.cabinetForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData: CabinetFormData = {
      ...this.cabinetForm.value,
      logo: this.selectedLogoFile || undefined
    };

    if (this.editingCabinet) {
      // Mise à jour
      this.cabinetService.updateCabinet(this.editingCabinet.id, formData).subscribe({
        next: (updatedCabinet) => {
          this.handleSuccess(updatedCabinet, 'Cabinet mis à jour avec succès');
        },
        error: (error) => {
          this.handleError(error, 'Erreur lors de la mise à jour du cabinet');
        }
      });
    } else {
      // Création
      this.cabinetService.createCabinet(formData).subscribe({
        next: (newCabinet) => {
          this.handleSuccess(newCabinet, 'Cabinet créé avec succès');
        },
        error: (error) => {
          this.handleError(error, 'Erreur lors de la création du cabinet');
        }
      });
    }
  }

  private handleSuccess(cabinet: Cabinet, message: string) {
    console.log(message, cabinet);
    this.isSubmitting = false;
    this.hideForm();
    this.loadData(); // Recharger les données
    
    // Afficher un message de succès (vous pourriez ajouter un toast)
    alert(message);
  }

  private handleError(error: any, defaultMessage: string) {
    console.error(defaultMessage, error);
    this.isSubmitting = false;
    
    if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else if (error.status === 0) {
      this.errorMessage = 'Erreur de connexion au serveur';
    } else {
      this.errorMessage = defaultMessage;
    }
  }

  // Gestion des cabinets
  editCabinet(cabinet: Cabinet) {
    this.selectedCabinet = cabinet;
    this.showEditForm(cabinet);
  }

  deleteCabinet(cabinet: Cabinet) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le cabinet "${cabinet.nomCabinet}" ?`)) {
      this.isLoading = true;
      
      this.cabinetService.deleteCabinet(cabinet.id).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadData();
          alert('Cabinet supprimé avec succès');
          
          if (this.selectedCabinet?.id === cabinet.id) {
            this.selectedCabinet = null;
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du cabinet');
        }
      });
    }
  }

  // Recherche et filtres
  onSearchInput(event: any) {
    this.filter.searchTerm = event.target.value;
    this.searchSubject.next(event.target.value);
  }

  onSearch() {
    this.filter.page = 1;
    this.loadData();
  }

  onFilterChange() {
    this.filter.page = 1;
    this.loadData();
  }

  // Pagination
  nextPage() {
    if (this.paginatedResponse?.hasNext) {
      this.filter.page++;
      this.loadData();
    }
  }

  previousPage() {
    if (this.paginatedResponse?.hasPrev) {
      this.filter.page--;
      this.loadData();
    }
  }

  // Actions rapides
  refreshData() {
    this.loadData();
  }

  exportData() {
    // Exporter les données au format CSV
    const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Adresse', 'Statut', 'Date de création'];
    const data = this.cabinets.map(c => [
      c.id,
      c.nomCabinet,
      c.emailCabinet,
      c.teleCabinet,
      c.adresseCabinet,
      this.getStatusLabel(c.statut),
      c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `cabinets_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toggleStatusFilter() {
    // Basculer entre les filtres de statut
    const statuses: Array<'ALL' | 'ACTIF' | 'INACTIF' | 'SUSPENDU'> = ['ALL', 'ACTIF', 'INACTIF', 'SUSPENDU'];
    const currentIndex = statuses.indexOf(this.filter.statut || 'ALL');
    this.filter.statut = statuses[(currentIndex + 1) % statuses.length];
    this.onFilterChange();
  }

  // Utilitaires
  getCurrentDateTime(): string {
    const now = new Date();
    return now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  updateDateTime() {
    setInterval(() => {
      this.currentDateTime = this.getCurrentDateTime();
    }, 60000); // Mettre à jour toutes les minutes
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'ACTIF': return 'Actif';
      case 'INACTIF': return 'Inactif';
      case 'SUSPENDU': return 'Suspendu';
      default: return 'Inconnu';
    }
  }

  // Validation du formulaire
  get formControls() {
    return this.cabinetForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.cabinetForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
