import React from 'react'
import { RenderResult, cleanup, fireEvent, render } from '@testing-library/react'
import Login from './login'
import { ValidationSpy } from '@/presentation/test'

type SutTypes = {
    sut: RenderResult
    validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy()
    const sut = render(<Login validation={validationSpy} />)
    return {
        sut,
        validationSpy
    }
}

describe('Login Component', () => {
    afterEach(cleanup)
    test('Should hide spinner and error on start', () => {
        const { sut } = makeSut()
        const errorWrap = sut.getByTestId('error-wrap')
        expect(errorWrap.childElementCount).toBe(0)

        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(true)

        const emailStatus = sut.getByTestId('email-status')
        expect(emailStatus.title).toBe('Campo obrigatório')
        expect(emailStatus.textContent).toBe('X')

        const paswwordStatus = sut.getByTestId('password-status')
        expect(paswwordStatus.title).toBe('Campo obrigatório')
        expect(paswwordStatus.textContent).toBe('X')
    })

    test('Should call Validation with correct email', () => {
        const { sut, validationSpy } = makeSut()
        const emailInput = sut.getByTestId('email')

        fireEvent.input(emailInput, {target: { value: 'any_email'}})

        expect(validationSpy.fieldName).toEqual('email')
        expect(validationSpy.fieldValue).toEqual('any_email')
    })

    test('Should call Validation with correct password', () => {
        const { sut, validationSpy } = makeSut()
        const passwordInput = sut.getByTestId('password')

        fireEvent.input(passwordInput, {target: { value: 'any_password'}})

        expect(validationSpy.fieldName).toEqual('password')
        expect(validationSpy.fieldValue).toEqual('any_password')
    })
})