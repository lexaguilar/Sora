const root = process.env.PUBLIC_URL;
const path = `${root}/api/`;
const http = url => {

    let base = (url, properties) => {
        return new Promise(resolve => {

            fetch(`${url}`, properties)
                .then(response => response.json())
                .then(response => resolve(response))
                .catch(error => console.error('Error:', error));

        })
    };

    let getParameters = function(data) {
        let queryString = '';

        if (data) {
            let parameters = '';

            if (typeof data == 'function')
                parameters = data();
            else
                parameters = data;

            for (const prop in parameters) {
                queryString += `&${prop}=${parameters[prop]}`
            }

        }

        return queryString.length > 0 ? queryString.replace('&', '?') : queryString;

    };


    const _url = `${path}${url}`;

    return {

        asGet: (data = null) => {

            let params = getParameters(data);

            return base(`${_url}${params}`, { method: 'GET' });

        },
        asPost: data => {
            return new Promise(resolve => {
                fetch(_url, {
                        method: 'POST',
                        body: data ? JSON.stringify(data) : null,
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8"
                        }
                    })
                    .then(response => response.json())
                    .then(response => resolve(response))
                    .catch(error => console.error('Error:', error));
            })
        },
        asDelete: (data = null) => {
            let params = getParameters(data);

            return base(`${_url}${params}`, { method: 'DELETE' });

        },
        asFile: (file = null) => {
            return new Promise(resolve => {
                let formData = new FormData();
                formData.append('file', file);
                fetch(_url, {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(response => resolve(response))
                    .catch(error => console.error('Error:', error));
            })
        },
    }
}

export { path };
export default http;