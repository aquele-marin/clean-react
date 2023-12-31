import { HttpPostParams } from "../protocols/http"
import { faker } from "@faker-js/faker"

export const mockPostRequest = (): HttpPostParams<any> => ({
    url: faker.internet.url(),
    body: faker.helpers.arrayElement([{ name: faker.person.fullName(), email: faker.internet.email() }, { name: faker.person.fullName(), email: faker.internet.email() }])
})