// import { ComponentFixture, TestBed } from '@angular/core/testing';



// import { LoginComponent } from './login.component';

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ LoginComponent ]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
//###############################################################
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { LoginComponent } from './login.component';
// import { UserService } from 'src/app/service/users/user.service';

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [LoginComponent],
//       imports: [HttpClientTestingModule, RouterTestingModule],
//       providers: [UserService],
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
//##################Me toca###############

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component"
import { UserService } from "src/app/service/users/user.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { of, throwError } from "rxjs";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;

//preparacion del coso, digamos, ambiente

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [UserService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();

  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty form initially', () => {
    expect(component.username).toBe('');
    expect(component.password).toBe('');
  });

  it('should display error message if login fails', () => {
    spyOn(userService, 'login').and.callFake(() => throwError({ error: 'Unauthorized' }));
    component.username = 'invaliduser';
    component.password = 'wrongpassword';
    component.onSubmit();

    expect(userService.login).toHaveBeenCalledWith('invaliduser', 'wrongpassword');
    expect(component.errorMessage).toBe('Usuario o contraseña incorrectos');
  });

  it('should call userService.login and navigate to home on successful login', () => {
    const mockResponse = { token: 'mockToken' };
    spyOn(userService, 'login').and.callFake(() => {
      localStorage.setItem('token', mockResponse.token);
      return of(mockResponse);
    });
    const navigateSpy = spyOn(component['router'], 'navigate');

    component.username = 'testuser';
    component.password = 'password';
    component.onSubmit();

    expect(userService.login).toHaveBeenCalledWith('testuser', 'password');
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    expect(localStorage.getItem('token')).toBe('mockToken');
  });

  it('should not call userService.login if form is invalid', () => {
    spyOn(userService, 'login');
    component.username = '';
    component.password = '';
    component.onSubmit();

    expect(userService.login).not.toHaveBeenCalled();
  });

});