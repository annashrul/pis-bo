import axios from 'axios';
import {HEADERS} from'../redux/actions/_constants'
const setAuthToken = token =>{

    if(token){
        // axios.AxiosRequestConfig.method.
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
        axios.defaults.headers.common['X-Project-ID'] = `${HEADERS.ID}`;
        axios.defaults.headers.common['X-Requested-From'] = `${HEADERS.REQ}`;
        // axios.defaults.headers.common['Content-Type'] = `application/x-www-form-urlencoded`;
    }else{
        // delete auth header

        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;