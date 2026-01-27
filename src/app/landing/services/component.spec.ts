import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesComponent } from './component'; // Import the new component name
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Environment } from '../../../environment/environment';

// Define the mock service structure for testing
const mockServices = [
    {
        id: 87,
        serviceName: "Oil and Filter Change (Synthetic)",
        description: "Full synthetic oil and filter replacement.",
        price: 2200.0,
        avgDuration: 60,
        garageId: 1,
        garageName: "Nairobi Garage",
        categoryId: 6,
        categoryName: "General Maintenance"
    },
];

const mockApiResponse = {
    success: true,
    message: "Search results",
    path: "/service/search",
    timestamp: "2025-12-10T20:40:01.925719",
    data: mockServices
};

describe('ServicesComponent', () => {
    let component: ServicesComponent;
    let fixture: ComponentFixture<ServicesComponent>;
    let httpTestingController: HttpTestingController;
    const apiUrl = `${Environment.authUrl}/service/search`;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            // Import HttpClientTestingModule to provide mock HttpClient
            imports: [ServicesComponent, HttpClientTestingModule]
        })
        .compileComponents();

        // Get the testing controller to mock HTTP requests
        httpTestingController = TestBed.inject(HttpTestingController);
        
        fixture = TestBed.createComponent(ServicesComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges() is called implicitly by the first test, 
        // but we'll call it explicitly after mocking the API call in tests.
    });

    afterEach(() => {
        // Verify that no outstanding requests are pending
        httpTestingController.verify();
    });

    it('should create', () => {
        // Trigger ngOnInit which calls fetchServices()
        fixture.detectChanges();
        
        // Mock the API request and supply the test data
        const req = httpTestingController.expectOne(apiUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(mockApiResponse); // Send the mock response

        expect(component).toBeTruthy();
    });

    it('should load services on initialization', () => {
        // Trigger ngOnInit which calls fetchServices()
        fixture.detectChanges();

        const req = httpTestingController.expectOne(apiUrl);
        req.flush(mockApiResponse); // Complete the request

        expect(component.services.length).toBe(1);
        expect(component.services[0].serviceName).toBe('Oil and Filter Change (Synthetic)');
        expect(component.loading).toBe(false);
    });

    it('should handle API error gracefully', () => {
        // Trigger ngOnInit which calls fetchServices()
        fixture.detectChanges();

        const req = httpTestingController.expectOne(apiUrl);
        
        // Simulate a network or backend error
        req.error(new ErrorEvent('Network error'), { status: 500, statusText: 'Server Error' }); 

        expect(component.services.length).toBe(0);
        expect(component.loading).toBe(false);
        expect(component.errorMessage).toContain('Failed to load services');
    });
});