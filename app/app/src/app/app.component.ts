import { Component , OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService, Message } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'chatting app';
  username: string = "Ziom";
  messageContent: string = '';
  messages: Message[] = [];

  private messageSubscription: Subscription | undefined;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getMessageHistory().subscribe({
      next: (history) => {
        this.messages = history;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Error fetching message history:', err);
      }
    });

    this.messageSubscription = this.chatService.getNewMessages().subscribe({
      next: (msg: Message) => {
        this.messages.push(msg); // Add new message to the array
        this.scrollToBottom(); // Scroll to the latest message
      },
      error: (err) => {
        console.error('Error receiving new message via Socket.IO:', err);
      }
    });
  }

  sendMessage(): void {
    if (this.messageContent.trim()) {
      this.chatService.sendMessage(this.username, this.messageContent);
      this.messageContent = '';
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatMessages = document.querySelector('.messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
}
}