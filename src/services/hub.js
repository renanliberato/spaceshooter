import { API_BASE_URL } from '../config';
import { HubConnectionBuilder } from '@microsoft/signalr';

export function getHubConnection(name) {
    return new HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/${name}`)
            //.withUrl("https://renanliberato-spaceshooterserver.azurewebsites.net/simplermatchhub")
            .withAutomaticReconnect()
            .build();
}