import { FieldValidation } from "@/validation/protocols/field-validation"
import { EmailValidation } from "./email-validation"
import { InvalidFieldError } from "@/validation/errors"





describe('EmailValidation', () => {
    test('Should return error if email is invalid', () => {
        const sut = new EmailValidation('email')
        const error = sut.validate('')
        expect(error).toEqual(new InvalidFieldError())
        // const sut = makeSut()
        // const error = sut.validate('')
        // expect(error).toEqual(new RequiredFieldError())
    })

    test('Should return falsy if email is valid', () => {
        // const sut = makeSut()
        // const error = sut.validate(faker.internet.email())
        // expect(error).toBeFalsy()
    })
})