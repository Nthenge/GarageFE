import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button'; 
import { Environment } from '../../../environment/environment'; 
import { Subject, debounceTime, Subscription } from 'rxjs'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../../core/auth/auth.service'; // <--- VERIFY THIS IMPORT PATH!

// --- Interfaces for Type Safety ---
interface Service {
  id: number;
  serviceName: string;
  description: string;
  price: number;
  avgDuration: number | null;
  garageId: number | null;
  garageName: string | null;
  categoryId: number;
  categoryName: string;
}

interface ServiceApiResponse {
    success: boolean;
    message: string;
    path: string;
    timestamp: string;
    data: Service[]; 
}

// --- Component Definition ---

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule, 
    HttpClientModule,
    MatButtonModule 
  ],
  templateUrl: './component.html', 
  styleUrl: './component.css' 
})
export class ServicesComponent implements OnInit, OnDestroy {
  
  // Stores ALL filtered services
  allServices: Service[] = []; 
  // Stores only the 8 services to display
  paginatedServices: Service[] = []; 
  
  loading: boolean = true;
  errorMessage: string = '';
  
  // Pagination properties
  pageSize: number = 8;
  currentPage: number = 1;
  totalPages: number = 0;
  
  // Properties for the search inputs
  searchTerm: string = '';
  priceFilter: number | null = null; 
  
  private searchSubject = new Subject<void>();
  private searchSubscription!: Subscription;
  
  // UPDATED: Inject Router and AuthService
  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef, 
    private router: Router, 
    private authService: AuthService // <--- INJECTED
  ) {}

  ngOnInit() { 
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300) 
      )
      .subscribe(() => {
        // Reset page to 1 on new search
        this.currentPage = 1; 
        this.fetchServices(true);
      });
      
    this.fetchServices();
  }
  
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchChange(): void {
    this.searchSubject.next();
  }

  /**
   * Handles the click event for the 'Book Now' button.
   * Checks login status using AuthService and redirects if not logged in.
   * @param service The service object being booked.
   */
  handleBookNowClick(service: Service): void {
      if (this.authService.isLoggedIn()) {
          // User is logged in: Proceed to the booking/details page
          console.log(`User is logged in. Proceeding to book: ${service.serviceName}`);
          // TODO: Implement actual navigation to your booking route here
          // Example: this.router.navigate(['/booking', service.id]);
      } else {
          // User is NOT logged in: Redirect to the login page
          console.log("User is NOT logged in. Redirecting to /login.");
          this.router.navigate(['/login']);
      }
  }

  /**
   * Slices the services array to display only the services for the current page.
   */
  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    this.paginatedServices = this.allServices.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.allServices.length / this.pageSize);
  }

  /**
   * Handles page changes.
   * @param page The new page number.
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      this.cdr.detectChanges();
    }
  }

  fetchServices(isSearch: boolean = false): void {
    const apiUrl = `${Environment.authUrl}/service/search`; 
    
    if (isSearch) {
        this.loading = true;
        this.errorMessage = '';
    }

    let params = new HttpParams();

    if (this.searchTerm) {
        params = params.set('serviceName', this.searchTerm);
    }

    if (this.priceFilter !== null && !isNaN(this.priceFilter) && this.priceFilter > 0) {
        params = params.set('price', this.priceFilter.toString());
    }

    this.http.get<ServiceApiResponse>(apiUrl, { params: params }).subscribe({
      next: (response) => {
        
        this.allServices = response.data; 
        this.updatePagination();
        this.loading = false;
        
        if (this.allServices.length === 0 && (this.searchTerm || this.priceFilter)) {
            this.errorMessage = 'No services found matching your search criteria.';
        } else {
            this.errorMessage = '';
        }

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching services:', err);
        this.errorMessage = 'Failed to load services. Please check the network connection.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}