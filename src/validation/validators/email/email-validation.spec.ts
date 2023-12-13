import { FieldValidation } from "@/validation/protocols/field-validation"
import { EmailValidation } from "./email-validation"
import { InvalidFieldError } from "@/validation/errors"
import { faker } from "@faker-js/faker"

describe('EmailValidation', () => {
    test('Should return error if email is invalid', () => {
        const sut = new EmailValidation(faker.string.sample())
        const error = sut.validate(faker.string.sample())
        expect(error).toEqual(new InvalidFieldError())
    })

    test('Should return falsy if email is valid', () => {
        const sut = new EmailValidation(faker.string.sample())
        const error = sut.validate(faker.internet.email())
        expect(error).toBeFalsy()
        // const sut = makeSut()
        // const error = sut.validate(faker.internet.email())
        // expect(error).toBeFalsy()
    })
})