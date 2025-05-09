import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent, BadgeType } from './status-badge.component.js';
import { By } from '@angular/platform-browser';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default badge type of Normal', () => {
    expect(component.type).toBe(BadgeType.Normal);
  });

  it('should have empty text by default', () => {
    expect(component.text).toBe('');
  });

  it('should display the provided text', () => {
    const testText = 'Test Badge';
    component.text = testText;
    fixture.detectChanges();
    
    const badgeElement = fixture.debugElement.query(By.css('.status-badge'));
    expect(badgeElement.nativeElement.textContent.trim()).toBe(testText);
  });

  it('should apply appropriate class for primary badge type', () => {
    component.type = BadgeType.Primary;
    fixture.detectChanges();
    
    const badgeElement = fixture.debugElement.query(By.css('.status-badge'));
    expect(badgeElement.nativeElement.className).toContain('primary-badge');
  });

  it('should apply appropriate class for success badge type', () => {
    component.type = BadgeType.Success;
    fixture.detectChanges();
    
    const badgeElement = fixture.debugElement.query(By.css('.status-badge'));
    expect(badgeElement.nativeElement.className).toContain('success-badge');
  });

  it('should apply appropriate class for warning badge type', () => {
    component.type = BadgeType.Warning;
    fixture.detectChanges();
    
    const badgeElement = fixture.debugElement.query(By.css('.status-badge'));
    expect(badgeElement.nativeElement.className).toContain('warning-badge');
  });

  it('should apply appropriate class for pending badge type', () => {
    component.type = BadgeType.Pending;
    fixture.detectChanges();
    
    const badgeElement = fixture.debugElement.query(By.css('.status-badge'));
    expect(badgeElement.nativeElement.className).toContain('pending-badge');
  });

  it('should apply default class for normal badge type', () => {
    component.type = BadgeType.Normal;
    fixture.detectChanges();
    
    const badgeElement = fixture.debugElement.query(By.css('.status-badge'));
    expect(badgeElement.nativeElement.className).toContain('normal-badge');
  });

  it('should have appropriate aria attributes for accessibility', () => {
    const testText = 'Pending';
    component.text = testText;
    component.type = BadgeType.Pending;
    fixture.detectChanges();
    
    const badgeElement = fixture.debugElement.query(By.css('.status-badge'));
    const element = badgeElement.nativeElement;
    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-label')).toBe(`Status: ${testText}`);
  });
}); 