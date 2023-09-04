// import { Injectable, Inject } from '@nestjs/common';
// import { Client } from '@opensearch-project/opensearch';
// import { FindBoardDto } from 'src/boards/dto/find-board.dto';
// import { Board } from 'src/boards/entities/board.entity';

// @Injectable()
// export class BoardSearchService {
//   constructor(@Inject('OpenSearchClient') private readonly client: Client) {}

//   async indexBoard(board: Board) {
//     await this.client.index({
//       index: 'boards',
//       id: board.id.toString(),
//       body: {
//         title: board.title,
//         description: board.description,
//       },
//     });
//   }

//   async searchByTitleAndDescription(
//     page,
//     findBoardDto: FindBoardDto,
//   ): Promise<Board[]> {
//     const { title, description } = findBoardDto;
//     const searchBody = {
//       query: {
//         multi_match: {
//           query: title + ' ' + description,
//           fields: ['title', 'description'],
//           fuzziness: 'AUTO',
//         },
//       },
//       from: (page - 1) * 20, // 페이지 번호에 따른 시작 위치 계산
//       size: 20, // 한 페이지당 가져올 문서 개수
//     };

//     const searchResults = await this.client.search({
//       index: 'boards',
//       body: searchBody,
//     });

//     return searchResults.body.hits.hits.map((hit) => hit._source);
//   }
// }
