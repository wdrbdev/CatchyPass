// Grant user permission for result database
db.createUser({
  user: "mongo",
  pwd: "MONGO_PASSWORD",
  roles: [
    {
      role: "root",
      db: "Result",
    },
  ],
});

// Generate seed data
db.Sentence.updateOne(
  { description: "1st seed data", isSeed: true },
  {
    $set: {
      keywords: ["seed"],
      startTime: new Date("2020-07-01T08:00:00Z"),
      endTime: null,
      resultSentence: null,
      isCompleted: false,
    },
  },
  {
    upsert: true,
  }
);

db.Sentence.updateOne(
  { description: "2nd seed data", isSeed: true },
  {
    $set: {
      keywords: ["init"],
      startTime: new Date("2020-07-02T23:00:00Z"),
      endTime: null,
      resultSentence: null,
      isCompleted: true,
      status: "Invalid vocabulary. Please try again.",
    },
  },
  {
    upsert: true,
  }
);
db.Sentence.updateOne(
  { description: "3rd seed data", isSeed: true },
  {
    $set: {
      keywords: ["goat", "laugh"],
      startTime: new Date("2020-07-03T12:00:00Z"),
      endTime: new Date("2020-07-03T12:03:00Z"),
      resultSentence:
        "He gives his goat a shake, And laughs until her belly aches.",
      isCompleted: false,
      status: "Sentence generation complete",
    },
  },
  {
    upsert: true,
  }
);
