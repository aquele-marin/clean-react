import { AxiosHttpClient } from "./axios-http-client"
import axios from 'axios'
import { faker } from "@faker-js/faker"
import { HttpPostParams } from "@/data/protocols/http"

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedAxiosResult = {
    data: faker.helpers.arrayElement([{ name: faker.person.fullName(), email: faker.internet.email() }, { name: faker.person.fullName(), email: faker.internet.email() }]),
    status: faker.number.int()
}
mockedAxios.post.mockResolvedValue(mockedAxiosResult)

const makeSut = (): AxiosHttpClient => {
    return new AxiosHttpClient()
}

const mockPostRequest = (): HttpPostParams<any> => ({
    url: faker.internet.url(),
    body: faker.helpers.arrayElement([{ name: faker.person.fullName(), email: faker.internet.email() }, { name: faker.person.fullName(), email: faker.internet.email() }])
})

describe('AxiosHttpClient', () => {
    test('Should call axios with correct values', async () => {
        const request = mockPostRequest()
        const sut = makeSut()
        await sut.post(request)
        expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
    })

    test('Should return the correct statusCode and body', async () => {
        const request = mockPostRequest()
        const sut = makeSut()
        const response = await sut.post(request)
        expect(response).toEqual({
            statusCode: mockedAxiosResult.status,
            body: mockedAxiosResult.data
        })
    })

})