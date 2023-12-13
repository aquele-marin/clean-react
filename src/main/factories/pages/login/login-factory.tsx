import React from 'react'
import { Login } from '@/presentation/pages'
import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client'
import { RemoteAuthentication } from '@/data/usecases/authentication'
import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite'
import { FieldValidationSpy } from '@/validation/test'
import { faker } from '@faker-js/faker'

export const makeLogin: React.FC = () => {
    const url = 'http://fordevs.herokuapp.com/api/login'
    const axiosHttpClient = new AxiosHttpClient()
    const remoteAuthentication = new RemoteAuthentication(url, axiosHttpClient)
    const fieldValidationSpy = new FieldValidationSpy(faker.database.column())
    const fieldValidationSpy2 = new FieldValidationSpy(faker.database.column())
    const validationComposite = new ValidationComposite([fieldValidationSpy, fieldValidationSpy2])
    return <Login 
        authentication={remoteAuthentication}
        validation={validationComposite}
    />
}