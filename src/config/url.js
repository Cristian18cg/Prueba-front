
import axios from 'axios';
import { ColumnGroup } from 'primereact/columngroup';
const baseURL = process.env.REACT_APP_BASE_URL
const clienteAxios = axios.create({
    baseURL: baseURL
});

export default clienteAxios;  