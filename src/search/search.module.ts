import { Module } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { BoardSearchService } from 'src/boards/boards.search.service';

@Module({
  providers: [
    BoardSearchService,
    {
      provide: 'OpenSearchClient',
      useValue: new Client({
        node: process.env.ELASTICSEARCH_NODE,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
      }),
    },
  ],
  exports: ['OpenSearchClient', BoardSearchService],
})
export class SearchModule {}
