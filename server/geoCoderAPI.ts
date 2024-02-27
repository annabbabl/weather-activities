import NodeGeocoder from 'node-geocoder';

const options: NodeGeocoder.Options = {
    provider: 'opencage',  
    apiKey: "eaf5349fdb424daba33d32bba8d3626e", 
    formatter: null
};

const geoCoder = NodeGeocoder(options);

export default async function GeoCoderFetching(longitude: string, latitude: string){
    const geocodeResponse = await geoCoder.geocode(`${latitude}, ${longitude}`);
    const city = geocodeResponse[0].city;

    return city; 
}


