export default () => {
    const sessionName = localStorage.getItem("session");

    if (!sessionName) {
        const sign = prompt("Ingresa tu nombre") || "Player";
        localStorage.setItem("session", sign);
    } else {

    }
}