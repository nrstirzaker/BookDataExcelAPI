import getData from './parseSheet'

export default getData(urls).then(responses =>
    responses.map(JSON.parse).map(magic)
);