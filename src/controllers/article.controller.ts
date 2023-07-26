import { ArticleService } from '../services/article.service'

export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  public article = async (req: any, res: any, next: any) => {
    const article = this.articleService.getArticle(req.params.slug)
    if (!article) {
      res.status(404).send()
    }
    res.send(article)
  }

  public articles = async (req: any, res: any, next: any) => {
    const articles = await this.articleService.getNewestArticles({
      page: req.query.page ?? 1,
      limit: req.query.limit ?? 10
    })
    res.send(articles)
  }
}
