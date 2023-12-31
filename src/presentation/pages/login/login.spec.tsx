import React from 'react'
import { RenderResult, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import Login from './login'
import { AuthenticationSpy, ValidationStub } from '@/presentation/test'
import { faker } from '@faker-js/faker'
import { InvalidCredentialsError } from '@/domain/errors'
import 'jest-localstorage-mock'
import { BrowserRouter } from 'react-router-dom'


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
    const sut = render(<BrowserRouter>
            <Login validation={validationStub} authentication={authenticationSpy}/>
        </BrowserRouter>)
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

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
    populateEmailField(sut, email)

    populatePasswordField(sut, password)

    const form = sut.getByTestId('form')
    fireEvent.submit(form)
    await waitFor(() => form)
    
}

const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
    const fieldStatus = sut.getByTestId(`${fieldName}-status`)
    expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
    expect(fieldStatus.textContent).toBe(validationError ? 'X':'')
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
    const errorWrap = sut.getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(count)

}

const testElementExists = (sut: RenderResult, fieldName: string): void => {
    const element = sut.getByTestId(fieldName)
    expect(element).toBeTruthy()
}

const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
    const element = sut.getByTestId(fieldName)
    expect(element.textContent).toBe(text)
}

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
    const button = sut.getByTestId(fieldName) as HTMLButtonElement
    expect(button.disabled).toBe(isDisabled)

}

describe('Login Component', () => {
    afterEach(cleanup)
    beforeEach(() => localStorage.clear())
    test('Should hide spinner and error on start', () => {
        const validationError = faker.string.sample()
        const { sut } = makeSut({ validationError })
        
        testErrorWrapChildCount(sut, 0)

        testButtonIsDisabled(sut, 'submit', true)

        testStatusForField(sut, 'email', validationError)

        testStatusForField(sut, 'password', validationError)
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

        testStatusForField(sut, 'password', validationError)
    })

    test('Should show valid password state if Validation succeeds', () => {
        const { sut } = makeSut()

        populatePasswordField(sut)

        testStatusForField(sut, 'password')
    })

    test('Should show valid email state if Validation succeeds', () => {
        const { sut } = makeSut()

        populateEmailField(sut)

        testStatusForField(sut, 'email')
    })

    test('Should enable submit button if form is valid', () => {
        const { sut } = makeSut()

        populateEmailField(sut)

        populatePasswordField(sut)

        testButtonIsDisabled(sut, 'submit', false)
    })

    test('Should show spinner on submit', async () => {
        const { sut } = makeSut()

        await simulateValidSubmit(sut)

        testElementExists(sut, 'spinner')        
    })

    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationSpy } = makeSut()
        const email = faker.internet.email()
        const password = faker.internet.password()

        await simulateValidSubmit(sut, email, password)
        
        expect(authenticationSpy.params).toEqual({
            email,
            password
        })
    })

    test('Should call Authentication only once', async () => {
        const { sut, authenticationSpy } = makeSut()

        await simulateValidSubmit(sut)
        await simulateValidSubmit(sut)
        
        expect(authenticationSpy.callsCount).toBe(1)
    })

    test('Should not call Authentication if form is invalid', async () => {
        const validationError = faker.string.sample()
        const { sut, authenticationSpy } = makeSut({ validationError })

        await simulateValidSubmit(sut)
        
        expect(authenticationSpy.callsCount).toBe(0)
    })

    test('Should present error if Authentication fails', async () => {
        const { sut, authenticationSpy } = makeSut()
        const error = new InvalidCredentialsError()
        jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))

        await simulateValidSubmit(sut)

        testElementText(sut, 'main-error', error.message)
        testErrorWrapChildCount(sut, 1)
    })

    test('Should add accessToken to localstorage on success', async () => {
        const { sut, authenticationSpy } = makeSut()

        await simulateValidSubmit(sut)

        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
    })

    test('Should go to signup page', async () => {
        const { sut } = makeSut()

        const register = sut.getByTestId('signup')
        fireEvent.click(register)
        expect(window.location.href).toBe('http://localhost/signup')
    })



})