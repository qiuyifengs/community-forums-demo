import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ApiException } from '../../bing/common/enums/api.exception';
// import { ApiErrorCode } from '../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { CommentsList } from '../../entitys/commentList.entity';
import { ChildrenComments } from '../../entitys/childrenComment.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(CommentsList)
    private readonly commentRepository: Repository<CommentsList>,
    @InjectRepository(ChildrenComments)
    private readonly childrenCommentRepository: Repository<ChildrenComments>,
  ) {}

  async account(data): Promise<any> {
    return '';
  }
  // get comment li(st
  async getComments(data): Promise<any> {
    let commentRes;
    const pageCount = data.pageCount ? data.pageCount * 1 : 10;
    const page = data.page ? (data.page - 1) * 1 * pageCount : 0;
    const totalRes = await this.commentRepository.find({author: data.author});
    commentRes = await this.commentRepository
                .createQueryBuilder('commentleList')
                .where('commentleList.author = :author', { author: data.author })
                .orderBy('commentleList.serialNum', 'DESC')
                .skip(page)
                .take(pageCount)
                .getMany();
    for (let item of commentRes) {
      const childrenComRes =  await this.childrenCommentRepository.find({ articleId: item.articleId, commentId: item.commentId });
      childrenComRes.forEach((chilItem, chilInd) => {
          childrenComRes[chilInd] = JSON.parse(JSON.stringify(chilItem).replace(' ChildrenComments ', ''));
      });
      item.childrenComentList = childrenComRes;
      item = JSON.parse(JSON.stringify(item).replace(' CommentsList ', ''));
    }
    const resData = {
      commentRes,
      total: totalRes.length,
    };
    return resData;
    // return commentRes;
  }
}
