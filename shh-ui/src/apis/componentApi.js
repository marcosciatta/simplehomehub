class ComponentApi {

    static getAllComponents(){
        return fetch('http://localhost:4000/api/components').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
}

export default ComponentApi;