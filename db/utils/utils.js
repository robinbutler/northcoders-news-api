exports.formatDates = list => {
  return list.map(article => {
    const articleCopy = { ...article };
    articleCopy.created_at = new Date(articleCopy["created_at"]);
    return articleCopy;
  });
};

exports.makeRefObj = list => {
  const ref = {};
  list.forEach(article => {
    const articleCopy = { ...article };
    const lookup = articleCopy["title"];
    const value = articleCopy["article_id"];
    ref[lookup] = value;
  });
  return ref;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const commentCopy = { ...comment };
    const article = commentCopy["belongs_to"];
    commentCopy.article_id = articleRef[article];
    commentCopy.author = commentCopy["created_by"];
    delete commentCopy["belongs_to"];
    delete commentCopy["created_by"];
    return commentCopy;
  });
};
