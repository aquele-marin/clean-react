import React from 'react'
import { RenderResult, cleanup, fireEvent, render } from '@testing-library/react'
import Login from './login'
import { ValidationStub } from '@/presentation/test'
import { faker } from '@faker-js/faker'

type SutTypes = {
    sut: RenderResult
    validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
    const validationStub = new ValidationStub()
    validationStub.errorMessage = ''//faker.string.sample()
    const sut = render(<Login validation={validationStub} />)
    return {
        sut,
        validationStub
    }
}

describe('Login Component', () => {
    afterEach(cleanup)
    test('Should hide spinner and error on start', () => {
        const { sut, validationStub } = makeSut()
        const errorWrap = sut.getByTestId('error-wrap')
        expect(errorWrap.childElementCount).toBe(0)

        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(true)

        const emailStatus = sut.getByTestId('email-status')
        expect(emailStatus.title).toBe(validationStub.errorMessage)
        expect(emailStatus.textContent).toBe('X')

        const paswwordStatus = sut.getByTestId('password-status')
        expect(paswwordStatus.title).toBe(validationStub.errorMessage)
        expect(paswwordStatus.textContent).toBe('X')
    })

    test('Should show email error if Validation fails', () => {
        const { sut, validationStub } = makeSut()
        

        const emailInput = sut.getByTestId('email')

        fireEvent.input(emailInput, {target: { value: faker.internet.email()}})

        const emailStatus = sut.getByTestId('email-status')
        expect(emailStatus.title).toBe(validationStub.errorMessage)
        expect(emailStatus.textContent).toBe('X')
    })

    test('Should show password error if Validation fails', () => {
        const { sut, validationStub } = makeSut()
        

        const passwordInput = sut.getByTestId('password')

        fireEvent.input(passwordInput, {target: { value: faker.internet.password()}})

        const passwordStatus = sut.getByTestId('password-status')
        expect(passwordStatus.title).toBe(validationStub.errorMessage)
        expect(passwordStatus.textContent).toBe('X')
    })
})