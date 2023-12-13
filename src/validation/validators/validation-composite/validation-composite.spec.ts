import { faker } from "@faker-js/faker"
import { FieldValidationSpy } from "../../test/mock-field-validation"
import { ValidationComposite } from "./validation-composite"

type SutTypes = {
    sut: ValidationComposite
    fieldValidationSpy: FieldValidationSpy[]
}

const makeSut = (fieldName: string): SutTypes => {
    const fieldValidationSpy = new FieldValidationSpy(fieldName)
    const fieldValidationSpy2 = new FieldValidationSpy(fieldName)

    const sut = new ValidationComposite([fieldValidationSpy, fieldValidationSpy2])
    return {
        sut,
        fieldValidationSpy: [fieldValidationSpy, fieldValidationSpy2]
    }
}

describe('ValidationComposite', () => {
    test('Should return error if any validation fails', () => {
        // sut = system under test
        const fieldName = faker.database.column()
        const { sut, fieldValidationSpy } = makeSut(fieldName)
        const errorMessage = faker.string.sample()
        fieldValidationSpy[0].error = new Error(errorMessage)
        fieldValidationSpy[1].error = new Error(faker.string.sample())
        const error = sut.validate(fieldName, faker.string.sample())
        expect(error).toBe(error)
    })

    test('Should return falsy if any validation succeed', () => {
        // sut = system under test
        const fieldName = faker.database.column()
        const { sut } = makeSut(fieldName)
        const error = sut.validate('any_field', faker.string.sample())
        expect(error).toBeFalsy()
    })
})