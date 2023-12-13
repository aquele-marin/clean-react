import { FieldValidationSpy } from "../test/mock-field-validation"
import { ValidationComposite } from "./validation-composite"

type SutTypes = {
    sut: ValidationComposite
    fieldValidationSpy: FieldValidationSpy[]
}

const makeSut = (): SutTypes => {
    const fieldValidationSpy = new FieldValidationSpy('any_field')
    const fieldValidationSpy2 = new FieldValidationSpy('any_field')

    const sut = new ValidationComposite([fieldValidationSpy, fieldValidationSpy2])
    return {
        sut,
        fieldValidationSpy: [fieldValidationSpy, fieldValidationSpy2]
    }
}

describe('ValidationComposite', () => {
    test('Should return error if any validation fails', () => {
        // sut = system under test
        const { sut, fieldValidationSpy } = makeSut()
        fieldValidationSpy[0].error = new Error('any_error')
        fieldValidationSpy[1].error = new Error('any_error')
        const error = sut.validate('any_field', 'any_value')
        expect(error).toBe('any_error')
    })
})