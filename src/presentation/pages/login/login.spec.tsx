import React from 'react'
import { render } from '@testing-library/react'
import Login from './login'

describe('Login Component', () => {
    test('Should hide spinner and error on start', () => {
        const { getByTestId } = render(<Login />)
        const errorWrap = getByTestId('error-wrap')
        expect(errorWrap.childElementCount).toBe(0)

        const submitButton = getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(true)

        const emailStatus = getByTestId('email-status')
        expect(emailStatus.title).toBe('Campo obrigatório')
        expect(emailStatus.textContent).toBe('X')

        const paswwordStatus = getByTestId('password-status')
        expect(paswwordStatus.title).toBe('Campo obrigatório')
        expect(paswwordStatus.textContent).toBe('X')
    })
})