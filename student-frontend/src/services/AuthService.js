import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth";

class AuthService {
    loginStudent(regNo, dob) {
        return axios.post(`${API_URL}/login/student`, { regNo, dob });
    }

    loginStaff(name, phone) {
        return axios.post(`${API_URL}/login/staff`, { name, phone });
    }

    logout() {
        localStorage.clear();
        window.location.href = "/login";
    }
}

export default new AuthService();