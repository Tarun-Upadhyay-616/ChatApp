import axios, { Axios } from "axios"
import { HOST, HOST2, HOST_ } from './Constants.js';

export const apiClient = axios.create({
    baseURL: HOST,
})

export const apiClient2 = axios.create({
    baseURL: HOST2,
})
export const apiClient3 = axios.create({
    baseURL: HOST_,
})