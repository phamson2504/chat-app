export default function authHeader() {
    const token = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (token) {
        return { authorization: token };
    } else {
        return {};
    }
}