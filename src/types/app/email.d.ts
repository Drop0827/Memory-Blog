export interface Email {
    /*邮件接收者 */
    to?: string;
    /*邮件标题 */
    subject: string;
}

export interface CommentEmail extends Email {
    /*评论内容 */
    content: string;
    /*发送方 */
    reviewers: string;
    /*邮件标题 */
    subject: string;
    /*评论时间 */
    time: string;
    /*文章标题 */
    title: string;
    /*文章地址 */
    url: string;
}