import React from 'react'
import { RenderResult, render } from '@testing-library/react'
import Login from './login'

type SutTypes = {
    sut: RenderResult
}

const makeSut = (): SutTypes => {
    const sut = render(<Login />)
    return {
        sut,
    }
}

describe('Login Component', () => {
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
})