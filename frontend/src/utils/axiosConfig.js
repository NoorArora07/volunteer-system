import axios from 'axios';

// In production (deployed), set REACT_APP_API_URL to your backend's live URL
// (e.g. https://volunteer-system-u00m.onrender.com) in Vercel's environment variables.
// In local development, leave it unset — requests will use the CRA "proxy" setting
// in package.json and go to http://localhost:5000 automatically.
const API_URL = process.env.REACT_APP_API_URL || '';

axios.defaults.baseURL = API_URL;

export default axios;