import React from 'react'
import { RenderResult, cleanup, fireEvent, render } from '@testing-library/react'
import Login from './login'
import { AuthenticationSpy, ValidationStub } from '@/presentation/test'
import { faker } from '@faker-js/faker'


type SutTypes = {
    sut: RenderResult
    authenticationSpy: AuthenticationSpy
}

type SutParams = {
    validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
    const validationStub = new ValidationStub()
    const authenticationSpy = new AuthenticationSpy()
    validationStub.errorMessage = params?.validationError
    const sut = render(<Login validation={validationStub} authentication={authenticationSpy}/>)
    return {
        sut,
        authenticationSpy
    }
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, {target: { value: email}})
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, {target: { value: password}})
}

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
    populateEmailField(sut, email)

    populatePasswordField(sut, password)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    fireEvent.click(submitButton)
    
}

const simulateStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
    const fieldStatus = sut.getByTestId(`${fieldName}-status`)
    expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
    expect(fieldStatus.textContent).toBe(validationError ? 'X':'')
}

describe('Login Component', () => {
    afterEach(cleanup)
    test('Should hide spinner and error on start', () => {
        const validationError = faker.string.sample()
        const { sut } = makeSut({ validationError })
        const errorWrap = sut.getByTestId('error-wrap')
        expect(errorWrap.childElementCount).toBe(0)

        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(true)

        simulateStatusForField(sut, 'email', validationError)

        simulateStatusForField(sut, 'password', validationError)
    })

    test('Should show email error if Validation fails', () => {
        const validationError = faker.string.sample()
        const { sut } = makeSut({ validationError })

        populateEmailField(sut)

        
    })

    test('Should show password error if Validation fails', () => {
        const validationError = faker.string.sample()
        const { sut } = makeSut({ validationError })

        populatePasswordField(sut)

        simulateStatusForField(sut, 'password', validationError)
    })

    test('Should show valid password state if Validation succeeds', () => {
        const { sut } = makeSut()

        populatePasswordField(sut)

        simulateStatusForField(sut, 'password')
    })

    test('Should show valid email state if Validation succeeds', () => {
        const { sut } = makeSut()

        populateEmailField(sut)

        simulateStatusForField(sut, 'email')
    })

    test('Should enable submit button if form is valid', () => {
        const { sut } = makeSut()

        populateEmailField(sut)

        populatePasswordField(sut)

        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(false)
    })

    test('Should show spinner on submit', () => {
        const { sut } = makeSut()

        simulateValidSubmit(sut)

        const spinner = sut.getByTestId('spinner')
        expect(spinner).toBeTruthy()
    })

    test('Should call Authentication with correct values', () => {
        const { sut, authenticationSpy } = makeSut()
        const email = faker.internet.email()
        const password = faker.internet.password()

        simulateValidSubmit(sut, email, password)
        
        expect(authenticationSpy.params).toEqual({
            email,
            password
        })
    })

    test('Should call Authentication only once', () => {
        const { sut, authenticationSpy } = makeSut()

        simulateValidSubmit(sut)
        simulateValidSubmit(sut)
        
        expect(authenticationSpy.callsCount).toBe(1)
    })



})