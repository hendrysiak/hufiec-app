export interface Resource {
  type: 'tent' | 'bungalow' | 'old-bungalow' | 'house' | 'main';
  availablePlaces: number;
  name: string;
}

export interface Reservation {
  id?: string;
  startDate: string;
  endDate: string;
  resources: string[];
  name: string;
  color: string;
  numberOfPersons: number;
};

export interface MappedReservation extends Reservation {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
};

export interface ReservationMapElement {
  [id: string]: MappedReservation;
};

export interface ResourceMapElement {
  [resourceName: string]: {
    [date: string]: string
  }
}

// graphQl MutationObserver
// mutation {
//   createReservation(input: {
//     startDate: "26.10.2021",
//     endDate: "30.10.2021",
//     resources: ["K1", "K2"],
//     name: "Test"
//     color: "#FFFFFF"
//     numberOfPersons: 20
//   }) {
//     _id
//     startDate
//     endDate
//     resources
//     name
//     color
//     numberOfPersons
//   }
// }

// var author = 'andy';
// var content = 'hope is a good thing';
// var query = `mutation CreateMessage($input: MessageInput) {
//   createMessage(input: $input) {
//     id
//   }
// }`;

// fetch('/graphql', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
//   body: JSON.stringify({
//     query,
//     variables: {
//       input: {
//         author,
//         content,
//       }
//     }
//   })
// })
//   .then(r => r.json())
//   .then(data => console.log('data returned:', data));