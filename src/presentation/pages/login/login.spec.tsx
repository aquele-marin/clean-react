import React from 'react'
import { RenderResult, cleanup, fireEvent, render } from '@testing-library/react'
import Login from './login'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
    sut: RenderResult
    validationSpy: ValidationSpy
}

class ValidationSpy implements Validation {
    errorMessage: string
    input: object

    validate (input: object): string {
        this.input = input
        return this.errorMessage
    }
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

    test('Should call Validation with correct values', () => {
        const { sut, validationSpy } = makeSut()
        const emailInput = sut.getByTestId('email')

        fireEvent.input(emailInput, {target: { value: 'any_email'}})

        expect(validationSpy.input).toEqual({
            email: 'any_email'
        })
    })
})