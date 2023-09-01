import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardSearchService {
  constructor(@Inject('OpenSearchClient') private readonly client: Client) {}

  async indexData(board: Board): Promise<void> {
    // const isIndexed = await this.checkIfIndexed(board.id);
    await this.client.index({
      index: 'my_index',
      id: board.id.toString(),
      body: {
        title: board.title,
        description: board.description,
        image: board.image,
        likeCount: board.likeCount,
        viewCount: board.viewCount,
        created_at: board.created_at,
        updated_at: board.updated_at,
      },
    });
  }

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
}
