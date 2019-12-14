import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'searchRoom'
})
export class SearchRoomPipe implements PipeTransform {

  transform(rooms: string[], text: string): string[] {
    if (text == null || text === "")
      return rooms;

    return rooms.filter(r => r.toLowerCase().includes(text.toLowerCase()));
  }

}
