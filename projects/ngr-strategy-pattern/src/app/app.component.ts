import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPipe } from './list.pipe';

interface Group {
  key: string;
  value: any[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ListPipe],
  template: `
    <h1>Strategy Pattern</h1>
    <section>
      <h2>Array Simple</h2>
      <!-- Calculate the size -->
      <p>{{ arraySimple | listPipe:'size' }}</p>
      <!-- Print the array -->
      <p>{{ arraySimple | listPipe:'print' }}</p>
      <!-- Check if an item exists -->
      <p>{{ arraySimple | listPipe:'contains':3 }}</p>
    </section>
    <hr />
    <br />

    <section>
      <h2>Array Objects</h2>
      <b><pre>{{ arrayObjects | json }}</pre></b>
      <!-- Calculate the size -->
      <p>Size: {{ arrayObjects| listPipe:'size' }}</p>
      <!-- Print the array -->
      <div>
        List: 
        <p *ngFor="let o of arrayObjects">{{ o | listPipe:'print' }}</p>
      </div>
      <!-- Check if an item exists -->

      <!-- Group by role -->
      <div *ngFor="let group of (arrayObjects | listPipe:'groupBy':'role')">
        <h3>{{ group.key }}</h3>
        <div *ngFor="let o of group.value">
            {{ o.name}}
        </div>
      </div>
    </section>
    <hr />
    <br />

    <section>
      <h2>Object Simple</h2>
      <!-- Calculate the size -->
      <p>{{ objectSimple | listPipe:'size' }}</p>
      <!-- Print the object -->
      <p>{{ objectSimple | listPipe:'print' }}</p>
      <!-- Check if a key exists -->
      <p>{{ objectSimple | listPipe:'contains':'three' }}</p>
    </section>
    <hr />
    <br />
  `,
  styles: [],
})
export class AppComponent {
  title = 'ngr-strategy-pattern';
  arraySimple = [1, 2, 3, 4, 5];
  arrayObjects = [
    { id: 1, name: 'John', role: 'Developer' },
    { id: 2, name: 'Jane', role: 'Designer' },
    { id: 3, name: 'Jim', role: 'Developer' },
    { id: 4, name: 'Jack', role: 'Manager' }
  ];
  objectSimple = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5
  }
}
