import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { Board } from './entities/board.entity';
import { FindBoardDto } from './dto/find-board.dto';

@Injectable()
export class BoardSearchService {
  constructor(@Inject('OpenSearchClient') private readonly client: Client) {}

  async indexData(boards: Board[]): Promise<void> {
    for (const board of boards) {
      const isIndexed = await this.checkIfIndexed(board.id);
      if (isIndexed) {
        continue;
      }

      await this.client.index({
        index: 'index_board',
        id: board.id.toString(),
        body: {
          title: board.title,
          description: board.description,
          image: board.image,
          likeCount: board.likeCount,
          viewCount: board.viewCount,
          created_at: board.created_at,
          updated_at: board.updated_at,
          nickname: board.user.nickname,
        },
      });
    }
  }

  async checkIfIndexed(boardId: number): Promise<any> {
    const response = await this.client.get({
      index: 'index_board',
      id: boardId.toString(),
    });
    return response;
  }

  async searchByTitleAndDescriptionAndNickname(
    page: number,
    findBoardDto: FindBoardDto,
  ): Promise<{ data: Board[]; meta: any }> {
    const { title, description, nickname } = findBoardDto;
    const take = 20; // 한 페이지당 가져올 문서 개수
    const from = (page - 1) * take; // 시작 위치 계산

    const mustClauses = [];

    if (title || description) {
      mustClauses.push({
        multi_match: {
          query: title + ' ' + description,
          fields: ['title', 'description'],
          fuzziness: 'AUTO',
        },
      });
    }

    if (nickname) {
      // 닉네임으로 검색하는 경우
      mustClauses.push({
        match: {
          'nickname.keyword': nickname, // keyword 필드를 사용하여 정확한 검색
        },
      });
    }

    const searchBody = {
      query: {
        bool: {
          must: mustClauses, // 필수 조건을 포함하는 bool 쿼리
        },
      },
    };

    const searchResults = await this.client.search({
      index: 'index_board',
      body: searchBody,
      from, // 페이지 시작 위치
      size: take, // 한 페이지당 가져올 문서 개수
    });

    const data = searchResults.body.hits.hits.map((hit) => hit._source);
    const total = searchResults.body.hits.total.value;

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }
}
