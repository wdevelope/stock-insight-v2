import http from 'k6/http';

export const options = {
  vus: 100,
  duration: '10s',
};

export default function () {
  const baseURL = 'http://localhost:3000';

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJkbnFrcjE4QG5hdmVyLmNvbSIsImlhdCI6MTY5NDc1NjAxMCwiZXhwIjoxNjk0NzY2ODEwfQ.zmn9frTNh_x4gn1agN44m3oUz1KOHGZSCHTzZBkshE0',
    },
  };

  http.patch(`${baseURL}/quiz/answer`);

  // const data = JSON.stringify({
  //   upANDdown: 'up',
  //   updated_date: '20230913',
  //   stockId: '000020',
  // });

  // http.post(`${baseURL}/quiz/submit`, data, params);
}
