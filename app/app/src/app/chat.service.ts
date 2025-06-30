import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
  _id?: string;
  username: string;
  content: string
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api';
  constructor(private socket : Socket , private http: HttpClient) { }

  sendMessage(username: string, content: string): void {
    this.socket.emit('sendMessage', { username, content });
  }

  getNewMessages(): Observable<Message> {
    return this.socket.fromEvent<Message, string>('newMessage');
  }

  getMessageHistory(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`);
  }
}
