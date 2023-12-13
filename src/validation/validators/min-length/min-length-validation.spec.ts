import { InvalidFieldError } from "@/validation/errors"
import { FieldValidation } from "@/validation/protocols/field-validation"
import { MinLengthValidation } from "./min-length-validation"



const makeSut = (): any => new MinLengthValidation('field', 5)

describe('MinLengthValidation', () => {
    test('Should return error if value is invalid', () => {
        const sut = makeSut()
        const error = sut.validate('123')
        expect(error).toEqual(new InvalidFieldError())
    })

    test('Should return falsy if value is valid', () => {
        const sut = makeSut()
        const error = sut.validate('12353')
        expect(error).toBeFalsy()
    })
})