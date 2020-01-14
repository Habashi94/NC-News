exports.formatDates = list => {
  const arrOfDates = list.map(dates => {
    const newDates = { ...dates };
    newDates.created_at = new Date(newDates.created_at);
    return newDates;
  });
  return arrOfDates;
};

exports.makeRefObj = (list, name, id) => {
  let obj = {};
  list.forEach(data => {
    obj[data[name]] = data[id];
  });
  return obj;
};

exports.formatComments = (comments, articleRef) => {
  const arrOfComments = comments.map(data => {
    const newData = { ...data };
    newData.author = data.created_by;
    newData.article_id = articleRef[newData.belongs_to];
    newData.created_at = new Date(newData.created_at);
    delete newData.created_by;
    delete newData.belongs_to;
    return newData;
  });
  return arrOfComments;
};
