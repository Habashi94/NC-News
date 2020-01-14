const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when given an empty array", () => {
    const actual = formatDates([]);
    expect(actual).to.eql([]);
  });
  it("returns an array with the updated date timestamp when passed through with a unix timestamp", () => {
    const actual = formatDates([
      {
        body:
          "Ea iure voluptas. Esse vero et dignissimos blanditiis commodi rerum dicta omnis modi.",
        belongs_to: "Who are the most followed clubs and players on Instagram?",
        created_by: "cooljmessy",
        votes: -1,
        created_at: 1472375043865
      }
    ]);
    expect(actual[0].created_at).to.eql(new Date(1472375043865));
  });
  it("returns new array of mulitple item with updated dates that are not unix timestamp", () => {
    const actual = formatDates([
      {
        body:
          "Ea iure voluptas. Esse vero et dignissimos blanditiis commodi rerum dicta omnis modi.",
        belongs_to: "Who are the most followed clubs and players on Instagram?",
        created_by: "cooljmessy",
        votes: -1,
        created_at: 1472375043865
      },
      {
        body:
          "Incidunt quidem ut. Voluptatem blanditiis ipsa commodi suscipit quae et. Magni assumenda veritatis voluptatem dolor qui.",
        belongs_to: "Thanksgiving Drinks for Everyone",
        created_by: "weegembump",
        votes: 7,
        created_at: 1476619021010
      },
      {
        body:
          "Iure cum non veritatis dolore corrupti deserunt perferendis molestiae. Voluptatem ullam qui aut voluptatem. Magnam quo ut rem nobis quibusdam. Assumenda ex laboriosam ut ea explicabo.",
        belongs_to: "Sunday league football",
        created_by: "happyamy2016",
        votes: 2,
        created_at: 1501187675733
      }
    ]);
    expect(actual[0].created_at).to.eql(new Date(1472375043865));
    expect(actual[1].created_at).to.eql(new Date(1476619021010));
    expect(actual[2].created_at).to.eql(new Date(1501187675733));
  });
  it("does not mutate the array", () => {
    const data = [
      {
        body:
          "Ea iure voluptas. Esse vero et dignissimos blanditiis commodi rerum dicta omnis modi.",
        belongs_to: "Who are the most followed clubs and players on Instagram?",
        created_by: "cooljmessy",
        votes: -1,
        created_at: 1472375043865
      }
    ];
    const dataCopy = [
      {
        body:
          "Ea iure voluptas. Esse vero et dignissimos blanditiis commodi rerum dicta omnis modi.",
        belongs_to: "Who are the most followed clubs and players on Instagram?",
        created_by: "cooljmessy",
        votes: -1,
        created_at: 1472375043865
      }
    ];
    formatDates(data);
    expect(data).to.eql(dataCopy);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when given an empty array", () => {
    const actual = makeRefObj([]);
    expect(actual).to.eql({});
  });
  it("returns an new object key value pair when passed through with one item ", () => {
    const actual = [{ article_id: 1, title: "A" }];
    const actualTest = makeRefObj(actual, "title", "article_id");
    expect(actualTest).to.eql({ A: 1 });
  });
  it("returns an new object key value pairs when passed through with multiple object items", () => {
    const actual = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    const actualTest = makeRefObj(actual, "title", "article_id");
    expect(actualTest).to.eql({ A: 1, B: 2, C: 3 });
  });
  it("does not mutate the original array", () => {
    const data = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    const dataCopy = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    makeRefObj(data, "title", "article_id");
    expect(data).to.eql(dataCopy);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("returns a new array with updated comments when passed a single object array", () => {
    const actual = [
      {
        body: "Praesentium pariatur a nisi. Minima eius est saepe aut.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "grumpy19",
        votes: 11,
        created_at: 1462414995595
      }
    ];
    const expected = [
      {
        body: "Praesentium pariatur a nisi. Minima eius est saepe aut.",
        author: "grumpy19",
        article_id: 1,
        votes: 11,
        created_at: new Date(1462414995595)
      }
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const newTest = formatComments(actual, articleRef);
    expect(newTest).to.eql(expected);
  });
  it("returns multiple of updated comments when passed multiple objects in array", () => {
    const commentData = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = {
      "They're not exactly dogs, are they?": 3,
      "Living in the shadow of a great man": 7
    };
    const actual = formatComments(commentData, articleRef);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 3,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 7,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("does not mutate the original array", () => {
    const data = [
      {
        body: "Praesentium pariatur a nisi. Minima eius est saepe aut.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "grumpy19",
        votes: 11,
        created_at: 1462414995595
      }
    ];
    const dataCopy = [
      {
        body: "Praesentium pariatur a nisi. Minima eius est saepe aut.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "grumpy19",
        votes: 11,
        created_at: 1462414995595
      }
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    formatComments(data, articleRef);
    expect(data).to.eql(dataCopy);
  });
});
