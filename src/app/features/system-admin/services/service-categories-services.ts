import { Injectable } from '@angular/core';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  avgDuration: string;
  minPrice: number;
  maxPrice: number;
  garageCount: number;
}


@Injectable({
  providedIn: 'root'
})
export class ServiceCategoriesServices {
  categories: Category[] = [];

   loadCategories(): void {
    this.categories = [
      {
        id: '1',
        name: 'General Maintenance',
        description: 'Regular vehicle maintenance and servicing',
        icon: '🔧',
        services: [
          {
            id: '1-1',
            name: 'Oil Change',
            description: 'Engine oil and filter replacement',
            avgDuration: '30-45 mins',
            minPrice: 2500,
            maxPrice: 5000,
            garageCount: 45
          },
          {
            id: '1-2',
            name: 'Fluid Top-Up',
            description: 'Top up all vehicle fluids',
            avgDuration: '15-20 mins',
            minPrice: 500,
            maxPrice: 1500,
            garageCount: 38
          },
          {
            id: '1-3',
            name: 'Filter Replacement',
            description: 'Replace air, oil, and fuel filters',
            avgDuration: '20-30 mins',
            minPrice: 1500,
            maxPrice: 3500,
            garageCount: 42
          }
        ]
      },
      {
        id: '2',
        name: 'Engine & Performance',
        description: 'Engine diagnostics, repair, and tuning',
        icon: '⚙️',
        services: [
          {
            id: '2-1',
            name: 'Engine Diagnostics',
            description: 'Computer diagnostics and error code reading',
            avgDuration: '1-2 hours',
            minPrice: 2000,
            maxPrice: 5000,
            garageCount: 32
          },
          {
            id: '2-2',
            name: 'Engine Tune-up',
            description: 'Complete engine tuning and optimization',
            avgDuration: '2-3 hours',
            minPrice: 5000,
            maxPrice: 15000,
            garageCount: 28
          },
          {
            id: '2-3',
            name: 'Engine Overhaul',
            description: 'Complete engine rebuild and restoration',
            avgDuration: '1-3 days',
            minPrice: 50000,
            maxPrice: 200000,
            garageCount: 15
          }
        ]
      },
      {
        id: '3',
        name: 'Brakes',
        description: 'Brake system inspection, repair, and replacement',
        icon: '🛑',
        services: [
          {
            id: '3-1',
            name: 'Brake Pads Replacement',
            description: 'Replace worn brake pads',
            avgDuration: '1-2 hours',
            minPrice: 3000,
            maxPrice: 8000,
            garageCount: 50
          },
          {
            id: '3-2',
            name: 'Brake Fluid Change',
            description: 'Flush and replace brake fluid',
            avgDuration: '30-45 mins',
            minPrice: 1500,
            maxPrice: 3000,
            garageCount: 40
          },
          {
            id: '3-3',
            name: 'Brake System Inspection',
            description: 'Complete brake system check',
            avgDuration: '30 mins',
            minPrice: 1000,
            maxPrice: 2000,
            garageCount: 48
          }
        ]
      },
      {
        id: '4',
        name: 'Emergency & Roadside Assistance',
        description: 'Emergency services and roadside help',
        icon: '🚨',
        services: [
          {
            id: '4-1',
            name: 'Towing Service',
            description: 'Vehicle towing to nearest garage',
            avgDuration: '30-60 mins',
            minPrice: 3000,
            maxPrice: 10000,
            garageCount: 25
          },
          {
            id: '4-2',
            name: 'Flat Tire Fix',
            description: 'On-site tire repair or change',
            avgDuration: '20-30 mins',
            minPrice: 1000,
            maxPrice: 3000,
            garageCount: 35
          },
          {
            id: '4-3',
            name: 'Jump Start',
            description: 'Battery jump start service',
            avgDuration: '15-20 mins',
            minPrice: 500,
            maxPrice: 1500,
            garageCount: 30
          }
        ]
      }
    ];
  }

  // openAddDialog(type: 'category' | 'service', category?: Category): void {
  //   console.log('Opening add dialog for:', type, category);
  //   // Open modal for adding category or service
  // }

  editCategory(category: Category): void {
    console.log('Editing category:', category);
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      console.log('Deleting category:', category);
      // API call to delete category
    }
  }

  editService(service: Service): void {
    console.log('Editing service:', service);
  }

  deleteService(service: Service): void {
    if (confirm(`Are you sure you want to delete the service "${service.name}"?`)) {
      console.log('Deleting service:', service);
      // API call to delete service
    }
  }
  
}
