interface IEvent {
  collectionId?: string;
}
class Event {
  collectionId?: string;

  constructor(event: IEvent){
    this.collectionId = event.collectionId;
  }
}

export { Event }
