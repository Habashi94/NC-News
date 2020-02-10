const endPoints = {
  "GET /api": {
    description:
      "serves up a json representation of all the available endpoints of the api"
  },
  "GET /api/topics": {
    description: "serves an array of all topics",
    queries: [],
    exampleResponse: {
      topics: [
        {
          slug: "football",
          description: "Footie!"
        }
      ]
    }
  },
  "GET /api/articles": {
    description: "serves an array of all topics",
    queries: ["author", "topic", "sort_by", "order"],
    exampleResponse: {
      articles: [
        {
          article_id: 13,
          title: "Seafood substitutions are increasing",
          topic: "cooking",
          author: "weegembump",
          created_at: "2018-05-30T15:59:13.341Z",
          comment_count: 7,
          votes: 4
        }
      ]
    }
  },
  "GET /api/users": {
    description: "serves an array of all users",
    queries: [],
    exampleResponse: {
      users: [
        {
          username: "this_is_a_username",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          name: "northcoders_shaq"
        }
      ]
    }
  },

  "GET /api/users/:username": {
    description: "serves an object for an user for the specified username",
    queries: [],
    exampleResponse: {
      user: {
        username: "grumpy19",
        avatar_url:
          "https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg",
        name: "Paul Grump"
      }
    }
  },
  "GET /api/articles/:article_id": {
    description: "serves an object for an article for the specified article_id",
    queries: ["article_id"],
    exampleResponse: {
      article: {
        article_id: 1,
        title: "Running a Node App",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        votes: 0,
        topic: "coding",
        author: "jessjelly",
        created_at: "2016-08-18T12:07:52.389Z",
        comment_count: 8
      }
    }
  },
  "PATCH /api/articles/:article_id": {
    description:
      "serves an object for an article for the specified article_id with the votes property updated",
    queries: [],
    body: {
      inc_votes: 10
    },
    exampleResponse: {
      article: {
        article_id: 2,
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance.",
        votes: 10,
        topic: "coding",
        author: "jessjelly",
        created_at: "2017-07-20T20:57:53.256Z",
        comment_count: 6
      }
    }
  },
  "POST /api/articles/:article_id/comments": {
    description:
      "serves an object of the posted comment for the specified article_id",
    queries: [],
    body: {
      username: "northcoder",
      body: "I feel ill"
    },
    exampleResponse: {
      comment: {
        comment_id: 57,
        author: "northcoders",
        article_id: 77,
        votes: 0,
        created_at: "2007-11-25T12: 36: 03.389Z",
        body: "I feel ill"
      }
    }
  },
  "GET /api/articles/:article_id/comments": {
    description: "serves an array of comments for the specified article_id",
    queries: ["sort_by", "order"],
    exampleResponse: {
      comment: [
        {
          comment_id: 44,
          votes: 4,
          created_at: "2017-11-20T08:58:48.322Z",
          author: "grumpy19",
          body:
            "Error est qui id corrupti et quod enim accusantium minus. Deleniti quae ea magni officiis et qui suscipit non."
        }
      ]
    }
  },
  "PATCH /api/comments/:comment_id": {
    description:
      "serves an object for a comment for the specified comment_id with votes value been updated",
    queries: [],
    body: {
      inc_votes: 1
    },
    exampleResponse: {
      comment: {
        comment_id: 1,
        author: "butter_bridge",
        article_id: 9,
        votes: 17,
        created_at: "2017-11-22T12: 36: 03.389Z",
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
      }
    }
  },
  "DELETE /api/comments/:comment_id": {
    description:
      "nothing served with comment deleted for the specified comment_id"
  }
};

module.exports = endPoints;
