const Hapi = require("hapi");
const Boom = require("boom");
require("dotenv").config();
const launchServer = async function() {
  const dbOpts = {
    url: process.env.MONGO_DB_URL,
    settings: {
      poolSize: 10,
      useNewUrlParser: true
    },
    decorate: true
  };

  const server = Hapi.server({
    host: "0.0.0.0",
    port: +process.env.PORT
  });

  await server.register({
    plugin: require("hapi-mongodb"),
    options: dbOpts
  });

  server.route({
    method: "GET",
    path: "/api/users",
    async handler(request, reply) {
      const db = request.mongo.db;

      try {
        const result = await db
          .collection("nomadCities")
          .find()
          .toArray();
        return result;
      } catch (err) {
        console.log(err);
        throw Boom.internal("Internal MongoDB error", err);
      }
    }
  });

  await server.start();
  console.log(`Server started at ${server.info.uri}`);
};

launchServer().catch(err => {
  console.error(err);
  process.exit(1);
});
