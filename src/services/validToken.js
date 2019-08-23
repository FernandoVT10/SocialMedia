export default function validToken() {
    if(window.localStorage.getItem("token")) {
        fetch("/api/validToken/",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token
            }
        })
        .then(res => {
            if(!res.ok) {
                window.location = "/";
            }
        });
    } else {
        window.location = "/";
    }
}